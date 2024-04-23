import chatController from '@/controllers/chat.js';
import { CHAT_ROUTE } from '@/constants/route.js';
import express from 'express';

const chatRouter = express.Router();
const { getChat, getChats, postCreateChat, postSendMessage } = chatController;

chatRouter.get(CHAT_ROUTE.CHAT, getChat);
chatRouter.get(CHAT_ROUTE.CHATS, getChats);
chatRouter.post(CHAT_ROUTE.CHAT, postCreateChat);
chatRouter.post(CHAT_ROUTE.SEND_MESSAGE, postSendMessage);

export default chatRouter;
