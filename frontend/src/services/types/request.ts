//NOTE: service request, it's should be always synced with BACKEND request

import { User } from './schema';

export type LoginRequestBody = Pick<User, 'email' | 'password'>;

export type UserInfoRequestParams = {
  withFriends: boolean;
};

export type RefreshTokenRequestBody = {
  accessToken?: string | null;
  refreshToken?: string | null;
};

export type SendMessageRequestBody = {
  chatRoomID: string;
  content: string;
};

export type ChatCreateRequestBody = {
  memberIDs: string[];
};

export type ChatRequestParams = {
  chatRoomID: string;
};
