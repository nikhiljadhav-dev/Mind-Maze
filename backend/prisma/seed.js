const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@logiclooper.com' },
    update: {},
    create: {
      email: 'demo@logiclooper.com',
      name: 'Demo User',
      streakCount: 5,
      totalPoints: 2400,
      lastPlayed: new Date(),
    },
  });

  await prisma.userStats.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      puzzlesSolved: 12,
      avgSolveTime: 45.3,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyScore.upsert({
    where: { userId_date: { userId: demoUser.id, date: today } },
    update: {},
    create: {
      userId: demoUser.id,
      date: today,
      puzzleId: 'seed-puzzle-001',
      score: 850,
      timeTaken: 38,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
