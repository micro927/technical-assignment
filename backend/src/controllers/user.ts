import { userSelectedFields } from '@/constants/dataQueryFields.js';
import { HTTP_STATUS } from '@/constants/httpStatus.js';
import { AppHandler } from '@/types/app.js';
import { UserBasicInfo } from '@/types/data.js';
import {
  UserInfoRequestParams,
  type AddFriendsRequestBody,
  type UsersRequestBody,
} from '@/types/request.js';
import {
  UserInfoResponse,
  type AddFriendsResponse,
  type UsersResponse,
} from '@/types/response.js';
import type { BasicObject } from '@/types/utils.js';
import prisma from '@/utils/db.js';
import getUserBasicInfoFromDatabase from '@/utils/getUserBasicInfoFromDatabase.js';
import { parseBoolean, parseNumber } from '@/utils/queryParser.js';

const getInfo: AppHandler<
  UserInfoResponse,
  BasicObject,
  BasicObject,
  UserInfoRequestParams
> = async (req, res) => {
  try {
    const id = res.locals?.id ?? '';
    const withFriends = parseBoolean(req.query.withFriends ?? 'false');
    getUserBasicInfoFromDatabase(id, withFriends)
      .then((userBasicInfo) =>
        res.status(HTTP_STATUS.OK_200).send(userBasicInfo),
      )
      .catch(() => res.sendStatus(HTTP_STATUS.NOT_FOUND_404));
  } catch (error) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const getFriends: AppHandler<UserBasicInfo[]> = async (_req, res) => {
  try {
    const id = res.locals?.id ?? '';
    prisma.user
      .findMany(
        Object.assign(userSelectedFields, {
          where: { friendIDs: { has: id } },
        }),
      )
      .then((data) => {
        if (data === null)
          return res.status(HTTP_STATUS.NOT_FOUND_404).send([]);
        return res.status(HTTP_STATUS.OK_200).send(data);
      })
      .catch(() => res.status(HTTP_STATUS.NOT_FOUND_404));
  } catch (error) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const getUsers: AppHandler<
  UsersResponse,
  BasicObject,
  BasicObject,
  UsersRequestBody
> = async (req, res) => {
  try {
    const { id } = res.locals;
    const search = (req.query?.search ?? '').trim();
    const limit = parseNumber(req.query?.limit);
    if (search === '') return res.status(HTTP_STATUS.NO_CONTENT_204).send([]);
    if (search.length < 3) return res.status(HTTP_STATUS.BAD_REQUEST_400);
    prisma.user
      .findMany({
        select: userSelectedFields.select,
        where: {
          OR: [
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
          id: { not: id },
          NOT: { friendIDs: { has: id } },
        },
        take: limit,
      })
      .then((users) => res.status(HTTP_STATUS.OK_200).send(users))
      .catch(() => res.sendStatus(HTTP_STATUS.NO_CONTENT_204).send([]));
  } catch (error) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const postAddFriends: AppHandler<AddFriendsResponse, AddFriendsRequestBody> = (
  req,
  res,
) => {
  try {
    const { id } = res.locals;
    const { friendIDs } = req.body;

    const addFriend = (id: string, friendID: string) => [
      prisma.user.update({
        where: {
          id,
          NOT: { friends: { some: { id: friendID } } },
        },
        data: {
          friendIDs: { push: friendID },
        },
        select: userSelectedFields.select,
      }),
      prisma.user.update({
        where: {
          id: friendID,
          NOT: { friends: { some: { id } } },
        },
        data: {
          friendIDs: {
            push: id,
          },
        },
        select: userSelectedFields.select,
      }),
    ];

    prisma
      .$transaction(friendIDs.map((friendID) => addFriend(id, friendID)).flat())
      .then((result) => {
        const friends = result.filter((data) => data.id !== id);
        return res.status(HTTP_STATUS.CREATED_201).send(friends);
      })
      .catch(() => {
        return res.status(HTTP_STATUS.BAD_REQUEST_400).send([]);
      });
  } catch (e) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const userController = {
  getInfo,
  getFriends,
  postAddFriends,
  getUsers,
};

export default userController;
