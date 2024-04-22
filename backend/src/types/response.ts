// NOTE: this file should sync with FRONTEND

import type { Server } from 'socket.io';
import { UserBasicInfo } from './data.js';
import { ChatRoom, Message } from './schema.js';

export type CommonResponse = { success: boolean };

export type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
};

export type RefreshTokenResponse = LoginResponse;

export type ChatCreateResponse = {
  chatRoomID: string;
};

export type ChatResponse = ChatRoom & {
  messages?: Partial<Message>[];
};

export type ChatsResponse = {
  id: string;
  members: Partial<UserBasicInfo>[];
  messages: Partial<Message>[];
}[];

export type UserInfoResponse = UserBasicInfo | null;

export type VerifyTokenLocalsObj = { id: string };

export type WebSocketLocalsObj = {
  io: Server;
};

export type UsersResponse = Partial<UserBasicInfo>[];
