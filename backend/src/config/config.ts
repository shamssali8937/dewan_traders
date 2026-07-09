import dotenv from 'dotenv';
dotenv.config();

// ─── Guard: fail hard on missing critical secrets ─────────────────────
const requireEnv = (key: string): string => {
  const val = process.env[key];
  if (!val || val.trim() === '') {
    throw new Error(`[STARTUP ERROR] Missing required environment variable: ${key}. Server cannot start without it.`);
  }
  return val.trim();
};

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:3001').split(',').map(u => u.trim()),
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expires: process.env.JWT_EXPIRES || '15m',
    refreshSecret: requireEnv('REFRESH_SECRET'),
    refreshExpires: process.env.REFRESH_EXPIRES || '7d',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  },
  cloudinary: {
    cloudName: (process.env.CLOUDINARY_CLOUD_NAME || '').replace(/^["']|["']$/g, ''),
    apiKey: (process.env.CLOUDINARY_API_KEY || '').replace(/^["']|["']$/g, ''),
    apiSecret: (process.env.CLOUDINARY_API_SECRET || '').replace(/^["']|["']$/g, ''),
  }
};
