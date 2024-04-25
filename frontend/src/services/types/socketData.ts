import type { Message } from './schema.js';

export type SocketUserData = {
  userID: string;
  friendIDs: string[];
};

export type RegisterActiveUserData = SocketUserData;

export type FriendsActivityUpdatedData = {
  userID: string;
  online: boolean;
};

export type NewChatMessageData = Message;

export type ChatRoomUpdatedData = {
  chatRoomID: string;
  updatedAt: Date;
};
