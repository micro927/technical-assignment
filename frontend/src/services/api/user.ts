import { createAxiosFetcher, getAuthorizationHeader } from '@/utils/fetcher';
import * as SERVICE from '@/services/types/route';
import { UserBasicInfo } from '../types/data';
import {
  UserInfoResponse,
  type AddFriendsResponse,
  type UsersResponse,
} from '../types/response';
import type { AddFriendsRequestBody, UsersRequestBody } from '../types/request';

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

const postAddFriends = async (params: AddFriendsRequestBody) => {
  return await userAPI
    .post<AddFriendsResponse>(
      SERVICE.USER_ROUTE.FRIENDS,
      params,
      getAuthorizationHeader(),
    )
    .then((res) => res.data);
};

const userService = {
  getInfo,
  getFriends,
  getUsers,
  postAddFriends,
};

export default userService;
