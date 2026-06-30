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
║      DEWAN TRADERS API SERVER               ║
║      Sargodha, Pakistan                     ║
╠══════════════════════════════════════════════╣
║  Status  : Running                          ║
║  Port    : ${PORT}                               ║
║  Env     : ${config.nodeEnv.padEnd(36)}║
╚══════════════════════════════════════════════╝
    `);
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
