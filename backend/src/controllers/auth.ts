import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { LoginRequestBody, RefreshTokenRequestBody } from '../types/request.js';
import {
  LoginResponse,
  UserInfoResponse,
  RefreshTokenResponse,
} from '../types/response.js';

import {
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenSecret,
  getRefreshTokenSecret,
} from '../utils/authToken.js';
import prisma from '../utils/db.js';
import getUserBasicInfoFromDatabase from '../utils/getUserBasicInfoFromDatabase.js';
import { AppHandler } from '../types/app.js';

const login: AppHandler<LoginResponse, LoginRequestBody> = async (req, res) => {
  if (!(req.body?.email || req.body?.password))
    return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    try {
      const userBasicInfo = await getUserBasicInfoFromDatabase(user.id);
      const accessToken = generateAccessToken(userBasicInfo);
      const refreshToken = generateRefreshToken(userBasicInfo);
      res.send({ accessToken, refreshToken });
    } catch {
      res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
    }
  } else {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
  }
};

const refreshToken: AppHandler<
  RefreshTokenResponse,
  RefreshTokenRequestBody
> = async (req, res) => {
  const refreshTokenSecret = getRefreshTokenSecret() ?? '';
  const accessTokenSecret = getAccessTokenSecret() ?? '';
  const { refreshToken, accessToken } = req.body;
  if (refreshTokenSecret === '' || accessTokenSecret === '')
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);

  if (!(accessToken && refreshToken))
    return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
  try {
    const decodedAccessToken = jwt.decode(accessToken);
    const decodedRefreshToken = jwt.verify(refreshToken, refreshTokenSecret);

    if (
      !decodedRefreshToken ||
      !decodedAccessToken ||
      decodedRefreshToken.sub !== decodedAccessToken.sub
    )
      return res.sendStatus(HTTP_STATUS.FORBIDDEN_403);
    try {
      const userBasicInfo = await getUserBasicInfoFromDatabase(
        (decodedRefreshToken as JwtPayload).sub ?? '',
      );
      const newAccessToken = generateAccessToken(userBasicInfo);
      const newRefreshToken = generateRefreshToken(userBasicInfo);
      return res.send({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch {
      return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
    }
  } catch {
    return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
  }
};

const me: AppHandler<UserInfoResponse> = async (_req, res) => {
  const id = res.locals?.id ?? '';
  getUserBasicInfoFromDatabase(id)
    .then((userBasicInfo) => res.status(HTTP_STATUS.OK_200).send(userBasicInfo))
    .catch(() => res.sendStatus(HTTP_STATUS.NOT_FOUND_404));
};

const authController = {
  login,
  refreshToken,
  me,
};

export default authController;
