import 'dotenv/config';
import app from './app';
import { config } from './config/config';
import { prisma } from './config/database';

const PORT = config.port;

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.warn('⚠️ Database connection failed. Server running in offline/fallback mode.');
  }

  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║      DEWAN TRADERS API SERVER               
║      Sargodha, Pakistan                      ║
╠══════════════════════════════════════════════╣
║  Status  : Running                           ║
║  Port    : ${PORT}                           
║  Env     : ${config.nodeEnv.padEnd(36)}
╚══════════════════════════════════════════════╝
    `);

    // ─── Optional Self-Ping Keepalive ───────────────────────
    // Automatically prevents free-tier hosts (e.g. Render, Railway) from going to sleep
    const keepAliveUrl = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
    if (keepAliveUrl) {
      const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
      const pingEndpoint = keepAliveUrl.replace(/\/+$/, '') + '/health';
      setInterval(async () => {
        try {
          const res = await fetch(pingEndpoint);
          console.log(`[KeepAlive] Pinged ${pingEndpoint} — status: ${res.status}`);
        } catch (err: any) {
          console.warn(`[KeepAlive] Ping error: ${err?.message || err}`);
        }
      }, PING_INTERVAL_MS);
      console.log(`🔄 [KeepAlive] Auto-pinger enabled for: ${pingEndpoint} (interval: 10m)`);
    }
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
