//NOTE: service (API) route, it's should be always synced with BACKEND route path

enum MAIN_ROUTE {
  ROOT = '',
  AUTH = '/auth',
  CHAT = '/chat',
  USER = '/user',
  WEBSOCKET = '/websocket',
}

enum AUTH_ROUTE {
  LOGIN = '/login',
  REFRESH_TOKEN = 'refresh-token',
  ME = '/me',
}

enum USER_ROUTE {
  INFO = '/info',
  FRIENDS = '/friend',
}

enum CHAT_ROUTE {
  CHATS = '/chats',
  CHAT = '/:id',
  SEND_MESSAGE = '/send-message',
}

const SERVICE = {
  MAIN_ROUTE,
  AUTH_ROUTE,
  USER_ROUTE,
  CHAT_ROUTE,
};

export default SERVICE;
