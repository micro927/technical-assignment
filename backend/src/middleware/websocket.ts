import { webSocketListener } from '@/controllers/websocketListener.js';
import { AppHandler } from '@/types/app.js';
import { verifyAccessToken } from '@/utils/authToken.js';
import { SOCKET_ROOM } from '@/constants/websocket.js';
import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

const createWebSocketMiddleware = (server: Server, path: string) => {
  const io = new SocketServer(server, { path });
  io.setMaxListeners(1000);

  io.on('connect', (socket) => {
    console.log('socket: user connected ', socket.id);
    io.socketsJoin(SOCKET_ROOM.ACTIVE_USER);
    webSocketListener(socket);

    io.on('disconnect', () => {
      io.socketsLeave(SOCKET_ROOM.ACTIVE_USER);
      console.log('socket: user disconnected');
    });
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const { success } = verifyAccessToken(token);
    if (success) {
      next();
    }
  });

  const middleware: AppHandler = (_req, res, next) => {
    res.locals.io = io;
    next();
  };

  return middleware;
};

export default createWebSocketMiddleware;
