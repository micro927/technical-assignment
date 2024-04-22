import { SOCKET_EVENT, SOCKET_ROOM } from '@/constants/websocket.js'; //.js
import type { WebSocketListenerController } from '@/types/app.js';
import { RegisterActiveUserData } from '@/types/socketData.js';
import { Socket, type Server } from 'socket.io';

const registerActiveUserController: WebSocketListenerController = (
  socket,
  io,
) => {
  socket.on(
    SOCKET_EVENT.REGISTER_ACTIVE_USER,
    async (data?: RegisterActiveUserData) => {
      socket.join(SOCKET_ROOM.ACTIVE_USER);
      socket.data = data;

      if (io) {
        const activeClients = await io.sockets
          .in(SOCKET_ROOM.ACTIVE_USER)
          .fetchSockets();

        activeClients.map((client) => {
          if ((data?.friendIDs ?? []).includes(client.data.userID)) {
            io.sockets
              .to(client.id)
              .emit(SOCKET_EVENT.FRIENDS_ACTIVITY_UPDATED, {
                userID: data?.userID,
              });
          }
        });
      }
    },
  );
};

const unRegisterActiveUserController: WebSocketListenerController = (io) => {
  io.on(SOCKET_EVENT.UNREGISTER_ACTIVE_USER, () => {
    io.leave(SOCKET_ROOM.ACTIVE_USER);
  });
};

export function webSocketListener(socket: Socket, io: Server) {
  registerActiveUserController(socket, io);
  unRegisterActiveUserController(socket, io);
  //TODO: register user (add Id)
  //TODO: unregister user
  //TODO: join chatroom(ID) room
  //TODO: leave chatroom(ID) room
  //TODO: join active user room
  //TODO: leave active user room
}
