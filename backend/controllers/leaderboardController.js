const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ─── Controller Actions ─────────────────────────────────────────────────────

/**
 * GET /leaderboard/daily
 * Return today's top-100 scores, ranked by score descending.
 */
async function getDailyLeaderboard(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scores = await prisma.dailyScore.findMany({
      where: { date: today },
      orderBy: { score: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            streakCount: true,
          },
        },
      },
    });

    const leaderboard = scores.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      name: entry.user.name,
      avatar: entry.user.avatar,
      score: entry.score,
      timeTaken: entry.timeTaken,
      streak: entry.user.streakCount,
    }));

    res.json({ date: today.toISOString(), leaderboard });
  } catch (err) {
    console.error('Daily leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

/**
 * GET /leaderboard/alltime
 * Return the all-time top-100 users by total accumulated points.
 */
async function getAllTimeLeaderboard(req, res) {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { totalPoints: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        avatar: true,
        totalPoints: true,
        streakCount: true,
      },
    });

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      totalPoints: user.totalPoints,
      streak: user.streakCount,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error('All-time leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

module.exports = {
  getDailyLeaderboard,
  getAllTimeLeaderboard,
};
