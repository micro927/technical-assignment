export enum SOCKET_EVENT {
  REGISTER_ACTIVE_USER = 'register-active-user',
  UNREGISTER_ACTIVE_USER = 'unregister-active-user',
  ACTIVE_USER = 'active-user',
  NEW_CHATROOM_MESSAGE = 'new-chatroom-message',
  JOIN_CHATROOM = 'join-chatroom',
  LEAVE_CHATROOM = 'leave-chatroom',
  UPDATE_USER_ACTIVITY = 'update-user-activity',
  FRIENDS_ACTIVITY_UPDATED = 'friends-activity-updated',
  CHATROOM_UPDATED = 'chatroom-updated',
}

export enum SOCKET_ROOM {
  ACTIVE_USER = 'active-user',
}
