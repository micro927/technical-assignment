import express from 'express';
import { USER_ROUTE } from '../constants/routePath.js';
import userController from '../controllers/user.js';

const userRouter = express.Router();
const { getFriends, getInfo } = userController;

userRouter.get(USER_ROUTE.INFO, getInfo);
userRouter.get(USER_ROUTE.FRIENDS, getFriends);

export default userRouter;
