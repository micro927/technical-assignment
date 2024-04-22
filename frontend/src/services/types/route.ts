export enum MAIN_ROUTE {
  ROOT = '',
  AUTH = '/auth',
  CHAT = '/chat',
  USER = '/user',
  WEBSOCKET = '/websocket',
}

export enum AUTH_ROUTE {
  LOGIN = '/login',
  REFRESH_TOKEN = 'refresh-token',
  ME = '/me',
}

export enum USER_ROUTE {
  INFO = '/info',
  USERS = '/users',
  FRIEND = '/friend',
  FRIENDS = '/friends',
}

export enum CHAT_ROUTE {
  CHATS = '/chats',
  CHAT = '/:id',
  SEND_MESSAGE = '/send-message',
}
