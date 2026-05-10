const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Build the public user response object (used by every auth endpoint).
 */
function formatUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    streakCount: user.streakCount,
    totalPoints: user.totalPoints,
  };
}

/**
 * Find-or-create a user + their stats row, then return a signed JWT + user.
 */
async function findOrCreateUser({ email, name, avatar }) {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { email, name, avatar: avatar || null },
    });

    await prisma.userStats.create({
      data: {
        userId: user.id,
        puzzlesSolved: 0,
        avgSolveTime: 0,
      },
    });
  }

  const token = generateToken(user);
  return { token, user: formatUserResponse(user) };
}

// ─── Controller Actions ─────────────────────────────────────────────────────

/**
 * POST /auth/google
 * Verify a Google ID-token, upsert the user, return JWT.
 */
async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential' });
    }

    let payload;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      return res.status(401).json({ error: 'Invalid Google credential' });
    }

    const { email, name, picture } = payload;

    const result = await findOrCreateUser({
      email,
      name: name || email.split('@')[0],
      avatar: picture,
    });

    res.json(result);
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * POST /auth/truecaller
 * Accept a Truecaller access-token + profile, upsert the user, return JWT.
 */
async function truecallerLogin(req, res) {
  try {
    const { accessToken, profile } = req.body;

    if (!accessToken || !profile || !profile.phoneNumber) {
      return res.status(400).json({ error: 'Missing Truecaller data' });
    }

    const email = profile.email || `${profile.phoneNumber}@truecaller.local`;
    const name = profile.firstName
      ? `${profile.firstName} ${profile.lastName || ''}`.trim()
      : profile.phoneNumber;

    const result = await findOrCreateUser({
      email,
      name,
      avatar: profile.avatarUrl,
    });

    res.json(result);
  } catch (err) {
    console.error('Truecaller auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * POST /auth/guest
 * Create (or retrieve) a guest user by a client-generated UUID, return JWT.
 */
async function guestLogin(req, res) {
  try {
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ error: 'Missing guest ID' });
    }

    const email = `guest_${guestId}@logiclooper.local`;

    const result = await findOrCreateUser({
      email,
      name: `Guest_${guestId.slice(0, 8)}`,
      avatar: null,
    });

    res.json(result);
  } catch (err) {
    console.error('Guest auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * GET /auth/profile
 * Return the authenticated user's full profile (including stats).
 */
async function getProfile(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { stats: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        streakCount: user.streakCount,
        totalPoints: user.totalPoints,
        lastPlayed: user.lastPlayed,
        stats: user.stats
          ? {
              puzzlesSolved: user.stats.puzzlesSolved,
              avgSolveTime: user.stats.avgSolveTime,
            }
          : null,
      },
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

module.exports = {
  googleLogin,
  truecallerLogin,
  guestLogin,
  getProfile,
};
