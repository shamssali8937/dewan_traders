import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/config';
import fs from 'fs';
import { logger } from './logger';

const isCloudinaryConfigured =
  !!config.cloudinary.cloudName &&
  !!config.cloudinary.apiKey &&
  !!config.cloudinary.apiSecret;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  logger.info('☁️ Cloudinary configured successfully.');
} else {
  logger.warn('⚠️ Cloudinary credentials are not fully configured. API will fallback to local storage.');
}

export const uploadToCloudinary = async (
  filePath: string,
  folder: string,
  localUrlFallback: string
): Promise<string> => {
  if (!isCloudinaryConfigured) {
    logger.warn(`Cloudinary not configured. Keeping local file and returning fallback: ${localUrlFallback}`);
    return localUrlFallback;
  }

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `dewan_traders/${folder}`,
      resource_type: 'auto',
    });

    // Delete temporary local file from disk after successful upload
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      logger.error(`Failed to delete local temp file after Cloudinary upload: ${filePath}`, err);
    }

    return result.secure_url;
  } catch (error) {
    // Clean up temporary local file even on error
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      logger.error(`Failed to clean up local temp file on upload error: ${filePath}`, err);
    }
    logger.error(`Failed to upload file to Cloudinary: ${filePath}`, error);
    throw error;
  }
};
