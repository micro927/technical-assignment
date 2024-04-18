//NOTE: service response, it's should be always synced with BACKEND response

import { ChatRoom, Message, UserBasicInfo } from './schema';

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
