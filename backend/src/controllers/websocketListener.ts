import { SOCKET_EVENT, SOCKET_ROOM } from '@/constants/websocket.js';
import type { WebSocketListenerController } from '@/types/app.js';
import {
  RegisterActiveUserData,
  type SocketUserData,
} from '@/types/socketData.js';
import { Socket, type Server } from 'socket.io';

const registerActiveUserController: WebSocketListenerController = ({
  socket,
}) => {
  socket.on(
    SOCKET_EVENT.REGISTER_ACTIVE_USER,
    async (data?: RegisterActiveUserData) => {
      socket.join(SOCKET_ROOM.ACTIVE_USER);
      socket.data = data;

      socket
        .to(SOCKET_ROOM.ACTIVE_USER)
        .emit(SOCKET_EVENT.FRIENDS_ACTIVITY_UPDATED, {
          userID: data?.userID,
          online: true,
        });

      socket
        .in(SOCKET_ROOM.ACTIVE_USER)
        .fetchSockets()
        .then((sockets) => {
          const activeFriends = sockets
            .map((socket) => (socket.data as SocketUserData).userID)
            .filter((userID) => socket.data?.friendIDs.includes(userID));

          socket.emit(SOCKET_EVENT.ACTIVE_USER, activeFriends);
        });
    },
  );
};

const unRegisterActiveUserController: WebSocketListenerController = ({
  socket,
}) => {
  socket.on(SOCKET_EVENT.UNREGISTER_ACTIVE_USER, () => {
    socket.leave(SOCKET_ROOM.ACTIVE_USER);
    socket
      .to(SOCKET_ROOM.ACTIVE_USER)
      .emit(SOCKET_EVENT.FRIENDS_ACTIVITY_UPDATED, {
        userID: socket.data?.userID,
        online: false,
      });
  });
};

const joinChatRoomController: WebSocketListenerController = ({
  socket,
  io,
}) => {
  socket.on(SOCKET_EVENT.JOIN_CHATROOM, async (chatRoomID?: string) => {
    if (chatRoomID && io) socket.join(chatRoomID);
  });
};

const leaveChatRoomController: WebSocketListenerController = ({ socket }) => {
  socket.on(SOCKET_EVENT.LEAVE_CHATROOM, (chatRoomID?: string) => {
    if (chatRoomID) socket.leave(chatRoomID);
  });
};

export function webSocketListener(socket: Socket, io: Server) {
  registerActiveUserController({ socket, io });
  unRegisterActiveUserController({ socket, io });
  joinChatRoomController({ socket, io });
  leaveChatRoomController({ socket, io });
}
