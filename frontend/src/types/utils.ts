import { UserBasicInfo } from '@/services/types/schema';
import { JwtPayload } from 'jwt-decode';
import { Socket } from 'socket.io-client';

export type BasicObject<value = unknown> = Record<string, value>;

export type SetState<T> = (callback: ((prev: T) => T) | T) => void;

export type UserJWTPayload = { user: UserBasicInfo };

export type AccessTokenPayload = JwtPayload & UserJWTPayload;

export type SocketEventListener<Data> = (
  socket: Socket,
  listener: (data: Data) => void,
) => void;

export type SocketEventEmitter<Data> = (socket: Socket, data: Data) => void;
