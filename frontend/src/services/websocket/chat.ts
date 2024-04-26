import {
  SocketEventListener,
  type SocketEventEmitter,
  type SocketEventListenerStop,
} from '@/types/utils';
import { SOCKET_EVENT } from '@/services/types/websocket';
import { Message } from '../types/schema';
import type { ChatRoomUpdatedData } from '../types/socketData';
import type { ChatInfo } from '../types/data';

const listenChatRoomUpdated: SocketEventListener<ChatRoomUpdatedData> = (
  socket,
  listener,
) => {
  socket.on(SOCKET_EVENT.CHATROOM_UPDATED, listener);
};

const stopListenChatRoomUpdated: SocketEventListenerStop = (socket) =>
  socket.off(SOCKET_EVENT.CHATROOM_UPDATED);

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

const listenChatRoomCreated: SocketEventListener<ChatInfo> = (
  socket,
  listener,
) => {
  socket.on(SOCKET_EVENT.CHATROOM_CREATED, listener);
};

const stopListenChatRoomCreated: SocketEventListenerStop = (socket) => {
  socket.off(SOCKET_EVENT.CHATROOM_CREATED);
};

export {
  emitJoinChatRoom,
  emitLeaveChatRoom,
  listenChatRoomNewMessage,
  listenChatRoomUpdated,
  stopListenChatRoomUpdated,
  listenChatRoomCreated,
  stopListenChatRoomCreated,
};
