import authController from '@/controllers/auth.js';
import verifyToken from '@/middleware/verifyToken.js';
import { AUTH_ROUTE } from '@/constants/route.js';
import express from 'express';

const authRouter = express.Router();
const { login, refreshToken, me } = authController;

authRouter.get(AUTH_ROUTE.ME, verifyToken, me);
authRouter.post(AUTH_ROUTE.LOGIN, login);
authRouter.post(AUTH_ROUTE.REFRESH_TOKEN, refreshToken);

export default authRouter;
