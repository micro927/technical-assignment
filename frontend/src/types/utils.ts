import { UserBasicInfo } from '@/services/types/schema';
import { JwtPayload } from 'jwt-decode';

export type BasicObject<value = unknown> = Record<string, value>;

export type SetState<T> = (callback: ((prev: T) => T) | T) => void;

export type UserJWTPayload = { user: UserBasicInfo };

export type AccessTokenPayload = JwtPayload & UserJWTPayload;
