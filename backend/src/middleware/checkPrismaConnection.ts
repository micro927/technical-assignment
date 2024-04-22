import { AppHandler } from '@/types/app.js';
import prisma from '@/utils/db.js';

export const checkPrismaConnection: AppHandler = async (_req, res, next) => {
  try {
    await prisma.$connect();
    next();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
