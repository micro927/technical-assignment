import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import { AppHandler } from '../types/app.js';
import { verifyAccessToken } from '../utils/authToken.js';

const createWebSocketMiddleware = (server: Server, path: string) => {
  const io = new SocketServer(server, { path });
  io.setMaxListeners(1000);

  io.once('connect', (a) => {
    console.log('socket: user connected ', a.id);
    io.on('disconnect', () => {
      console.log('socket: user disconnected');
    });
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const { success } = verifyAccessToken(token);
    if (success) {
      next();
    }
    // not executed, since the previous middleware has returned an error
  });

  const middleware: AppHandler = (_req, res, next) => {
    res.locals.io = io;
    next();
  };

  return middleware;
};

export default createWebSocketMiddleware;
