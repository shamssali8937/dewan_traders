import { prisma } from '../config/database';

export const paymentAccountService = {
  async create(data: any) {
    return prisma.paymentAccount.create({
      data: {
        type: data.type,
        bankName: data.bankName || null,
        accountTitle: data.accountTitle,
        accountNumber: data.accountNumber,
        iban: data.iban || null,
        branch: data.branch || null,
        qrCodeUrl: data.qrCodeUrl || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
  },

  async getAll() {
    return prisma.paymentAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async getActive() {
    return prisma.paymentAccount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.paymentAccount.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: any) {
    return prisma.paymentAccount.update({
      where: { id },
      data: {
        type: data.type,
        bankName: data.bankName || null,
        accountTitle: data.accountTitle,
        accountNumber: data.accountNumber,
        iban: data.iban || null,
        branch: data.branch || null,
        qrCodeUrl: data.qrCodeUrl || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
  },

  async delete(id: string) {
    return prisma.paymentAccount.delete({
      where: { id },
    });
  },
};
