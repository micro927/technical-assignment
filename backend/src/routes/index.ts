import express from 'express';
import { MAIN_ROUTE } from '@/constants/route.js';
import verifyToken from '../middleware/verifyToken.js';
import authRouter from './auth.js';
import chatRouter from './chat.js';
import userRouter from './user.js';

const router = express.Router();

router.use(MAIN_ROUTE.AUTH, authRouter);
router.use(MAIN_ROUTE.USER, verifyToken, userRouter);
router.use(MAIN_ROUTE.CHAT, verifyToken, chatRouter);

export default router;
