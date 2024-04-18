import { User } from '@prisma/client';
import { BooleanString } from './app.js';

export type LoginRequestBody = Pick<User, 'email' | 'password'>;

export type UserInfoRequestParams = {
  withFriends: BooleanString;
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
