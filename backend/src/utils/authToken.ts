import { HTTP_STATUS } from '@/constants/httpStatus.js';
import {
  AccessTokenJWTPayload,
  RefreshTokenJWTPayload,
  UserBasicInfo,
} from '@/types/data.js';
import { configDotenv } from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

configDotenv({ path: `../.env` });
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_TIMEOUT,
  REFRESH_TOKEN_TIMEOUT,
} = process.env;

const generateAccessToken = (userBasicInfo: UserBasicInfo) => {
  if (!(ACCESS_TOKEN_SECRET && ACCESS_TOKEN_TIMEOUT)) return undefined;
  return jwt.sign({ user: userBasicInfo }, ACCESS_TOKEN_SECRET, {
    subject: userBasicInfo.id,
    expiresIn: Number(ACCESS_TOKEN_TIMEOUT),
  });
};

const generateRefreshToken = (userBasicInfo: UserBasicInfo) => {
  const payload: RefreshTokenJWTPayload = { id: userBasicInfo.id };
  if (!(REFRESH_TOKEN_SECRET && REFRESH_TOKEN_TIMEOUT)) return undefined;
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    subject: userBasicInfo.id,
    expiresIn: Number(REFRESH_TOKEN_TIMEOUT),
  });
};

const getAccessTokenSecret = () => ACCESS_TOKEN_SECRET ?? undefined;
const getRefreshTokenSecret = () => REFRESH_TOKEN_SECRET ?? undefined;

const verifyAccessToken = (
  accessToken?: string,
): {
  success: boolean;
  status: number;
  id?: string;
} => {
  const result = {
    success: false,
    status: 0,
  };
  const accessTokenSecret = getAccessTokenSecret() ?? '';

  if (accessTokenSecret === '') {
    result.status = HTTP_STATUS.INTERNAL_SERVER_ERROR_500;
    return result;
  }
  if (accessToken === undefined) {
    result.status = HTTP_STATUS.UNAUTHORIZED_401;
    return result;
  }
  try {
    const decodedAccessToken = jwt.verify(accessToken, accessTokenSecret);
    const userPayload = (
      decodedAccessToken as JwtPayload & AccessTokenJWTPayload
    )?.user;
    if (userPayload === undefined) {
      result.status = HTTP_STATUS.FORBIDDEN_403;
      return result;
    } else {
      result.success = true;
      return {
        ...result,
        id: userPayload.id,
      };
    }
  } catch {
    result.status = HTTP_STATUS.UNAUTHORIZED_401;
    return result;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenSecret,
  getRefreshTokenSecret,
  verifyAccessToken,
};
