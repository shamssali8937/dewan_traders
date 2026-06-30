import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { config } from '../config/config';
import { ApiError } from '../utils/ApiError';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: 'individual' | 'company';
  companyName?: string;
  companyReg?: string;
  taxNumber?: string;
  address?: string;
  city?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const generateTokens = (userId: string, email: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, email, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expires as any }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpires as any }
  );
  return { accessToken, refreshToken };
};

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw ApiError.conflict('Email already in use');

    const hashed = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashed,
        phone: input.phone,
        userType: input.userType,
        role: 'individual',
        companyName: input.companyName,
        companyReg: input.companyReg,
        taxNumber: input.taxNumber,
        address: input.address,
        city: input.city,
      },
      select: {
        id: true, name: true, email: true, role: true,
        userType: true, phone: true, companyName: true,
        createdAt: true,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    return { user, accessToken, refreshToken };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.isActive) throw ApiError.unauthorized('Invalid credentials');

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw ApiError.unauthorized('Invalid credentials');

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  },

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user || user.refreshToken !== token) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
      await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

      return { accessToken, refreshToken };
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  },

  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  },

  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userType: true,
        phone: true,
        companyName: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return null; // silent fail (prevent email enumeration)

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store hashed token in refreshToken field (reusing column to avoid schema change)
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: `reset:${hashedToken}:${resetExpiry.toISOString()}` },
    });

    return { email: user.email, name: user.name, resetToken };
  },

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const searchToken = `reset:${hashedToken}:`;

    const user = await prisma.user.findFirst({
      where: { refreshToken: { startsWith: searchToken } },
    });

    if (!user || !user.refreshToken) throw ApiError.badRequest('Invalid or expired reset token');

    const parts = user.refreshToken.split(':');
    const expiry = new Date(parts[2]);
    if (expiry < new Date()) throw ApiError.badRequest('Reset token has expired. Please request a new one.');

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, refreshToken: null },
    });
  },
};
