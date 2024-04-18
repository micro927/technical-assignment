import { RequestHandler } from 'express';
import { WebSocketLocalsObj, VerifyTokenLocalsObj } from './response.js';

// NOTE: duplicate from express
interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

export type BasicObject<value = unknown> = Record<string, value>;

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

export type BooleanString = 'true' | 'false';
