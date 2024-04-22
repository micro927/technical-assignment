import { SOCKET_EVENT, SOCKET_ROOM } from '@/constants/websocket.js'; //.js
import { UpdateUserActivityData } from '@/types/socketData.js';
import { Socket } from 'socket.io';

const userActivityController = (io: Socket) => {
  io.on(SOCKET_EVENT.UPDATE_USER_ACTIVITY, (data: UpdateUserActivityData) => {
    if (data.online) {
      console.log(data);
      io.emit(SOCKET_EVENT.FRIENDS_ACTIVITY_UPDATED);
    }
  });
};

const registerActiveUserController = (io: Socket) => {
  io.on(SOCKET_EVENT.REGISTER_ACTIVE_USER, () => {
    io.join(SOCKET_ROOM.ACTIVE_USER);
  });
};

export function webSocketListener(io: Socket) {
  userActivityController(io);
  registerActiveUserController(io);
  //TODO: register user (add Id)
  //TODO: unregister user
  //TODO: join chatroom(ID) room
  //TODO: leave chatroom(ID) room
  //TODO: join active user room
  //TODO: leave active user room
}
