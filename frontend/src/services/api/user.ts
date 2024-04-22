import { createAxiosFetcher, getAuthorizationHeader } from '@/utils/fetcher';
import * as SERVICE from '@/services/types/route';
import { UserBasicInfo } from '../types/schema';
import {
  UserInfoResponse,
  type CommonResponse,
  type UsersResponse,
} from '../types/response';
import type { AddFriendRequestBody, UsersRequestBody } from '../types/request';

const userAPI = createAxiosFetcher(SERVICE.MAIN_ROUTE.USER);

const getInfo = async () => {
  return await userAPI.get<UserInfoResponse>(SERVICE.USER_ROUTE.INFO, {
    ...getAuthorizationHeader(),
  });
};

const getFriends = async () => {
  return await userAPI.get<UserBasicInfo[]>(SERVICE.USER_ROUTE.FRIENDS, {
    ...getAuthorizationHeader(),
  });
};

const getUsers = async (params: UsersRequestBody) => {
  return await userAPI.get<UsersResponse>(SERVICE.USER_ROUTE.USERS, {
    params,
    ...getAuthorizationHeader(),
  });
};

const postAddFriend = async (params: AddFriendRequestBody) => {
  return await userAPI
    .post<CommonResponse>(
      SERVICE.USER_ROUTE.FRIEND,
      params,
      getAuthorizationHeader(),
    )
    .then((res) => res.data);
};

const userService = {
  getInfo,
  getFriends,
  getUsers,
  postAddFriend,
};

export default userService;
