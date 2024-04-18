import express from 'express';
import { AUTH_ROUTE } from '../constants/routePath.js';
import authController from '../controllers/auth.js';
import verifyToken from '../middleware/verifyToken.js';

const authRouter = express.Router();
const { login, refreshToken, me } = authController;

authRouter.get(AUTH_ROUTE.ME, verifyToken, me);
authRouter.post(AUTH_ROUTE.LOGIN, login);
authRouter.post(AUTH_ROUTE.REFRESH_TOKEN, refreshToken);

export default authRouter;
