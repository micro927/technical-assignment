import {
  LoginRequestBody,
  RefreshTokenRequestBody,
} from '@/services/types/request';
import {
  LoginResponse,
  UserInfoResponse,
  RefreshTokenResponse,
} from '@/services/types/response';
import { getAuthorizationHeader, createAxiosFetcher } from '@/utils/fetcher';
import SERVICE from './types/route';

const authAPI = createAxiosFetcher(SERVICE.MAIN_ROUTE.AUTH);

const login = async (params: LoginRequestBody) => {
  return await authAPI
    .post<LoginResponse>(SERVICE.AUTH_ROUTE.LOGIN, params, {})
    .then((res) => res.data);
};

const refreshToken = async (params: RefreshTokenRequestBody) => {
  return await authAPI
    .post<RefreshTokenResponse>(
      SERVICE.AUTH_ROUTE.REFRESH_TOKEN,
      params,
      getAuthorizationHeader(),
    )
    .then((res) => res.data);
};

const me = async () => {
  return authAPI.get<UserInfoResponse>(
    SERVICE.AUTH_ROUTE.ME,
    getAuthorizationHeader(),
  );
};

const authService = {
  login,
  refreshToken,
  me,
};

export default authService;
