import { createAxiosFetcher, getAuthorizationHeader } from '@/utils/fetcher';
import * as SERVICE from '@/services/types/route';
import { UserBasicInfo } from '../types/schema';
import { UserInfoResponse } from '../types/response';

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

const userService = {
  getInfo,
  getFriends,
};

export default userService;
