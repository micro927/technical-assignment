import { User, type Message } from './schema.js';

export type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'> & {
  friends?: UserBasicInfo[];
};

export type ChatInfo = {
  id: string;
  members: Partial<UserBasicInfo>[];
  lastMessage: Partial<Message> | null;
  createdAt: Date;
};

export type AccessTokenJWTPayload = { user: UserBasicInfo };

export type RefreshTokenJWTPayload = { id: string };
