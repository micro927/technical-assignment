import { User } from '@prisma/client';

export type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'> & {
  friends?: UserBasicInfo[];
};

export type AccessTokenJWTPayload = { user: UserBasicInfo };

export type RefreshTokenJWTPayload = { id: string };
