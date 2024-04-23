import { USER_ROUTE } from '@/constants/route.js';
import express from 'express';
import userController from '../controllers/user.js';

const userRouter = express.Router();
const { getFriends, getInfo, getUsers, postAddFriends } = userController;

userRouter.get(USER_ROUTE.INFO, getInfo);
userRouter.get(USER_ROUTE.FRIENDS, getFriends);
userRouter.get(USER_ROUTE.USERS, getUsers);
userRouter.post(USER_ROUTE.FRIENDS, postAddFriends);

export default userRouter;
