export enum SOCKET_EVENT {
  REGISTER_ACTIVE_USER = 'register-active-user',
  UNREGISTER_ACTIVE_USER = 'unregister-active-user',
  NEW_CHAT_MESSAGE = 'new-chat-message',
  UPDATE_USER_ACTIVITY = 'update-user-activity',
  FRIENDS_ACTIVITY_UPDATED = 'friends-activity-updated',
  CHATROOM_UPDATED = 'chatroom-updated',
}

export enum SOCKET_ROOM {
  ACTIVE_USER = 'active-user',
}
