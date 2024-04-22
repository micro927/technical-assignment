import { SocketEventListener } from '@/types/utils';
import { SOCKET_EVENT } from '@/services/types/websocket';
import { Message } from '../types/schema';

const onNewChatEvent: SocketEventListener<Message> = (socket, listener) => {
  socket.on(SOCKET_EVENT.NEW_CHAT_MESSAGE, listener);
};

export { onNewChatEvent };
