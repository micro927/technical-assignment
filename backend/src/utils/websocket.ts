import { SOCKET_EVENT } from '../constants/socketEvent.js';

export const newChatMessageEventName = (chatRoomID: string) =>
  `${SOCKET_EVENT.NEW_CHAT_MESSAGE}-${chatRoomID}`;
