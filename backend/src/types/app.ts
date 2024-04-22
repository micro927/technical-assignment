import { RequestHandler } from 'express';
import { WebSocketLocalsObj, VerifyTokenLocalsObj } from './response.js';
import type { BasicObject } from '@/types/utils.js';
import type { Server, Socket } from 'socket.io';

// NOTE: duplicate from express
interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

export type AppHandler<
  ResBody = BasicObject,
  ReqBody = BasicObject,
  Params = BasicObject,
  ReqQuery = ParsedQs,
  LocalsObj extends BasicObject = BasicObject,
> = RequestHandler<
  Params,
  ResBody,
  ReqBody,
  ReqQuery,
  LocalsObj & WebSocketLocalsObj & VerifyTokenLocalsObj
>;

export type WebSocketListenerController = (socket: Socket, io?: Server) => void;

export type BooleanString = 'true' | 'false';
