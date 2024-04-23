import { User, type Message } from './schema.js';

export type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'> & {
  friends?: UserBasicInfo[];
};

export type ChatInfo = {
  id: string;
  members: Partial<UserBasicInfo>[];
  lastMessages: Partial<Message>[];
};

export type AccessTokenJWTPayload = { user: UserBasicInfo };

export type RefreshTokenJWTPayload = { id: string };
