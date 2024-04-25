import { SocketEventListener, type SocketEventEmitter } from '@/types/utils';
import { SOCKET_EVENT } from '@/services/types/websocket';
import { Message } from '../types/schema';
import type { ChatRoomUpdatedData } from '../types/socketData';

const listenChatRoomUpdated: SocketEventListener<ChatRoomUpdatedData> = (
  socket,
  listener,
) => {
  socket.on(SOCKET_EVENT.CHATROOM_UPDATED, listener);
};

const emitJoinChatRoom: SocketEventEmitter<string> = (socket, data) => {
  socket.emit(SOCKET_EVENT.JOIN_CHATROOM, data);
};

const emitLeaveChatRoom: SocketEventEmitter<string> = (socket, data) => {
  socket.emit(SOCKET_EVENT.LEAVE_CHATROOM, data);
};

const listenChatRoomNewMessage: SocketEventListener<Message> = (
  socket,
  listener,
) => {
  socket.on(SOCKET_EVENT.NEW_CHATROOM_MESSAGE, listener);
};

export {
  emitJoinChatRoom,
  emitLeaveChatRoom,
  listenChatRoomNewMessage,
  listenChatRoomUpdated,
};
