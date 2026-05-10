const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// ─── Route imports ──────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/score');
const leaderboardRoutes = require('./routes/leaderboard');

// ─── Prisma singleton ──────────────────────────────────────────────────────
const prisma = new PrismaClient();

// ─── Express app ────────────────────────────────────────────────────────────
const app = express();

// ─── Global middleware ──────────────────────────────────────────────────────

// CORS – allow the Vite dev-server (or whatever CORS_ORIGIN is set to)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON bodies (limit prevents oversized payloads)
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// ─── Request logger (lightweight, no extra dependency) ──────────────────────
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Health / readiness probe ───────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    // Quick DB ping to confirm Prisma connection is alive
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (err) {
    console.error('Health-check DB ping failed:', err.message);
    res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// ─── API routes ─────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/score', scoreRoutes);
app.use('/leaderboard', leaderboardRoutes);

// ─── 404 catch-all ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ───────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  // Hide internal details in production
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProd ? 'Internal server error' : err.message || 'Internal server error',
    ...(isProd ? {} : { stack: err.stack }),
  });
});

// ─── Graceful shutdown helper ───────────────────────────────────────────────
async function shutdown() {
  console.log('\nShutting down gracefully…');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);   // Ctrl+C
process.on('SIGTERM', shutdown);  // Docker / process-manager stop

// ─── Exports ────────────────────────────────────────────────────────────────
module.exports = { app, prisma };
