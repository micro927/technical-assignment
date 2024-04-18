import type { Server } from 'socket.io';
import { UserBasicInfo } from './data.js';
import { ChatRoom, Message } from '@prisma/client';

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

//NOTE: type for locals object, no need to use in Frontend

export type VerifyTokenLocalsObj = { id: string };

export type WebSocketLocalsObj = {
  io: Server;
};
