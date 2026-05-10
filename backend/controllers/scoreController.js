const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_POSSIBLE_SCORE = 1000;
const MIN_TIME_SECONDS = 5;
const MAX_TIME_SECONDS = 600;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Server-side sanity check for score + timeTaken values.
 * Returns an error string or null when the values are valid.
 */
function validateScoreSubmission(score, timeTaken) {
  if (typeof score !== 'number' || score < 0 || score > MAX_POSSIBLE_SCORE) {
    return 'Invalid score value';
  }
  if (typeof timeTaken !== 'number' || timeTaken < MIN_TIME_SECONDS || timeTaken > MAX_TIME_SECONDS) {
    return 'Invalid time value';
  }
  if (score === MAX_POSSIBLE_SCORE && timeTaken < 10) {
    return 'Impossible score detected';
  }
  return null;
}

/**
 * Compute the new streak count based on the user's last-played date.
 */
function computeStreak(user, today) {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!user.lastPlayed) return 1;

  const lastPlayedDate = new Date(user.lastPlayed);
  lastPlayedDate.setHours(0, 0, 0, 0);

  if (lastPlayedDate.getTime() === yesterday.getTime()) {
    return user.streakCount + 1;
  }
  if (lastPlayedDate.getTime() === today.getTime()) {
    return user.streakCount;            // already played today
  }
  return 1;                             // streak broken
}

// ─── Controller Actions ─────────────────────────────────────────────────────

/**
 * POST /score/submit
 * Validate and persist a daily puzzle score.
 * Updates streak, totalPoints, and rolling avg solve-time inside a
 * Prisma interactive transaction.
 */
async function submitScore(req, res) {
  try {
    const { puzzleId, score, timeTaken, hintsUsed } = req.body;
    const userId = req.user.id;

    // --- Field presence ---
    if (!puzzleId || score === undefined || timeTaken === undefined) {
      return res.status(400).json({ error: 'Missing required fields: puzzleId, score, timeTaken' });
    }

    // --- Value validation ---
    const validationError = validateScoreSubmission(score, timeTaken);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // --- Date boundaries ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Duplicate check ---
    const existingScore = await prisma.dailyScore.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (existingScore) {
      return res.status(409).json({
        error: 'Already submitted a score for today',
        existingScore: {
          score: existingScore.score,
          timeTaken: existingScore.timeTaken,
        },
      });
    }

    // --- Streak calculation ---
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newStreak = computeStreak(user, today);

    // --- Atomic write: score + user totals ---
    const [dailyScore, updatedUser] = await prisma.$transaction([
      prisma.dailyScore.create({
        data: {
          userId,
          date: today,
          puzzleId,
          score,
          timeTaken,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          streakCount: newStreak,
          lastPlayed: new Date(),
          totalPoints: { increment: score },
        },
      }),
    ]);

    // --- Rolling average solve-time ---
    const stats = await prisma.userStats.findUnique({ where: { userId } });

    if (stats) {
      const newPuzzlesSolved = stats.puzzlesSolved + 1;
      const newAvgTime =
        (stats.avgSolveTime * stats.puzzlesSolved + timeTaken) / newPuzzlesSolved;

      await prisma.userStats.update({
        where: { userId },
        data: {
          puzzlesSolved: newPuzzlesSolved,
          avgSolveTime: Math.round(newAvgTime * 10) / 10,
        },
      });
    } else {
      await prisma.userStats.create({
        data: {
          userId,
          puzzlesSolved: 1,
          avgSolveTime: timeTaken,
        },
      });
    }

    // --- Response ---
    res.json({
      success: true,
      score: dailyScore.score,
      streak: updatedUser.streakCount,
      totalPoints: updatedUser.totalPoints,
    });
  } catch (err) {
    console.error('Score submit error:', err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
}

module.exports = { submitScore };
