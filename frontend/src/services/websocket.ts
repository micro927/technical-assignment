import { getAccessToken } from '@/utils/authToken';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export enum EventTitleEnum {
  HELLO = 'hello',
}

type SocketListenerProps = {
  listenEvent: EventTitleEnum;
  id?: string;
};

const host = import.meta.env.VITE_API_BASE_URL;

const useWebSocket = <EventData>({ listenEvent, id }: SocketListenerProps) => {
  const [eventLogs, setEventLogs] = useState<EventData[]>([]);
  const [latestEventData, setLatestEventData] = useState<EventData>();

  useEffect(() => {
    const connectionOption = {
      transports: ['websocket'],
      path: '/websocket',
      auth: {
        token: `Bearer ${getAccessToken()}`,
      },
    };

    const socket = io(host, connectionOption);

    setLatestEventData(undefined);
    setEventLogs([]);

    socket.on('connect', () => console.log(`connected with id: ${socket.id}`));

    const eventName = listenEvent + id ? `-${id}` : '';

    socket.on(eventName, (data: EventData) => {
      if (data) {
        setEventLogs((prev) => [...prev, data]);
        setLatestEventData(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [listenEvent, id]);

  return { eventLogs, latestEventData };
};

export default useWebSocket;
