import {
  FriendsActivityUpdatedData,
  UpdateUserActivityData,
} from '@/services/types/socketData';
import { SOCKET_EVENT } from '@/services/types/websocket';
import { SocketEventEmitter, SocketEventListener } from '@/types/utils';

const emitUpdateUserActivity: SocketEventEmitter<UpdateUserActivityData> = (
  socket,
  data,
) => {
  socket.emit(SOCKET_EVENT.UPDATE_USER_ACTIVITY, data);
};

const onFriendsActivityUpdated: SocketEventListener<
  FriendsActivityUpdatedData
> = (socket, listener) => {
  socket.on(SOCKET_EVENT.FRIENDS_ACTIVITY_UPDATED, listener);
};

export { emitUpdateUserActivity, onFriendsActivityUpdated };
