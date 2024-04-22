//NOTE: this file should sync with FRONTEND

import { User } from './schema.js';
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

export type UsersRequestBody = {
  search: string;
  limit?: number;
};

export type AddFriendRequestBody = {
  id: string;
};
