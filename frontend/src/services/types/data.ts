import type { Message, User } from './schema';

export type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'> & {
  friends?: UserBasicInfo[];
};

export type ChatInfo = {
  id: string;
  members: Partial<UserBasicInfo>[];
  lastMessages: Partial<Message>[];
};
