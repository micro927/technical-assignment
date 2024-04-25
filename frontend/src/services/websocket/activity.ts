import {
  FriendsActivityUpdatedData,
  RegisterActiveUserData,
} from '@/services/types/socketData';
import { SOCKET_EVENT } from '@/services/types/websocket';
import { SocketEventEmitter, SocketEventListener } from '@/types/utils';

const emitRegisterActiveUser: SocketEventEmitter<RegisterActiveUserData> = (
  socket,
  data,
) => {
  socket.emit(SOCKET_EVENT.REGISTER_ACTIVE_USER, data);
};

const emitUnRegisterActiveUser: SocketEventEmitter = (socket) => {
  socket.emit(SOCKET_EVENT.UNREGISTER_ACTIVE_USER);
};

const listenFriendsActivityUpdated: SocketEventListener<
  FriendsActivityUpdatedData
> = (socket, listener) => {
  socket.on(SOCKET_EVENT.FRIENDS_ACTIVITY_UPDATED, listener);
};

const listenActiveUser: SocketEventListener<string[]> = (socket, listener) => {
  socket.on(SOCKET_EVENT.ACTIVE_USER, listener);
};

export {
  emitRegisterActiveUser,
  emitUnRegisterActiveUser,
  listenFriendsActivityUpdated,
  listenActiveUser,
};
