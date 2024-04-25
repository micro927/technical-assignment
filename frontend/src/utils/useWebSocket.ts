import * as SERVICE from '@/services/types/route';
import { getAccessToken } from '@/utils/authToken';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const host = import.meta.env.VITE_API_BASE_URL;

const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const connectionOption = {
      transports: ['websocket'],
      path: SERVICE.MAIN_ROUTE.WEBSOCKET,
      auth: {
        token: `${getAccessToken()}`,
      },
    };

    const socket = io(host, connectionOption);
    socket.on('connect', () => console.log(`connected with id: ${socket.id}`));

    setSocket(socket);

    return () => {
      console.log(`disconnected ! (id: ${socket.id})`);
      socket.disconnect();
    };
  }, []);

  return { socket };
};

export default useWebSocket;
