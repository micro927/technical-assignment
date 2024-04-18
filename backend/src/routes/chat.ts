import express from 'express';
import { CHAT_ROUTE } from '../constants/routePath.js';
import chatController from '../controllers/chat.js';

const chatRouter = express.Router();
const { getChat, getChats, postCreateChat, postSendMessage } = chatController;

chatRouter.get(CHAT_ROUTE.CHAT, getChat);
chatRouter.post(CHAT_ROUTE.CHAT, postCreateChat);
chatRouter.get(CHAT_ROUTE.CHATS, getChats);
chatRouter.post(CHAT_ROUTE.SEND_MESSAGE, postSendMessage);

export default chatRouter;
