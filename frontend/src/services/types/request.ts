//NOTE: this file should sync with FRONTEND

import { User } from './schema.js';

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

export type UsersRequestBody = {
  search: string;
  limit?: number;
};

export type AddFriendsRequestBody = {
  friendIDs: string[];
};
