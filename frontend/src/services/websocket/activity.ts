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

const emitUnRegisterActiveUser: SocketEventEmitter<RegisterActiveUserData> = (
  socket,
) => {
  socket.emit(SOCKET_EVENT.UNREGISTER_ACTIVE_USER);
};

const onFriendsActivityUpdated: SocketEventListener<
  FriendsActivityUpdatedData
> = (socket, listener) => {
  socket.on(SOCKET_EVENT.FRIENDS_ACTIVITY_UPDATED, listener);
};

export {
  emitRegisterActiveUser,
  emitUnRegisterActiveUser,
  onFriendsActivityUpdated,
};
