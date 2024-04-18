import { fakeAvatarUrl } from '@/constants/dev';
import authService from '@/services/auth';
import { LoginRequestBody } from '@/services/types/request';
import type { UserBasicInfo } from '@/services/types/schema';
import { UserBasicInfo } from '@/types/authentication';
import { AccessTokenPayload } from '@/types/utils';
import {
  accessTokenDecode,
  clearToken,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/utils/authToken';
import { AxiosError, HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';

function transformUserBasicInfoToUserBasicInfo(
  userBasicInfo?: UserBasicInfo | null,
): UserBasicInfo | undefined {
  if (userBasicInfo) {
    return {
      ...userBasicInfo,
      displayName: `${userBasicInfo?.first_name} ${userBasicInfo?.last_name}`,
      avatarURL: userBasicInfo.avatarURL ?? fakeAvatarUrl, // TODO: use real avatarURL instead
      role: 'admin',
    };
  }
  return undefined;
}

function useProviderController() {
  const getPayload = (token: string) => {
    const payload = accessTokenDecode(token);
    if (payload) {
      return payload as AccessTokenPayload;
    }
  };
  const localAccessToken = getAccessToken();
  const payload = getPayload(localAccessToken);
  const localProfile = payload?.user;

  const [accessToken, setAccessToken] = useState<string | undefined>(
    localAccessToken,
  );
  const [userInformation, setUserInformation] = useState(
    transformUserBasicInfoToUserBasicInfo(localProfile),
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    Boolean(localProfile?.id),
  );

  const verify = () => {
    getMe()
      .then(({ data }) => {
        setUserInformationState(transformUserBasicInfoToUserBasicInfo(data));
      })
      .catch((error: AxiosError) => {
        if (error?.response?.status === HttpStatusCode.Unauthorized) {
          refreshToken()
            .then((data) => {
              if (data.accessToken && data.refreshToken) {
                const { accessToken, refreshToken } = data;
                saveUserInformationFromToken(accessToken);
                saveAccessToken(accessToken);
                saveRefreshToken(refreshToken);
              } else {
                logout();
              }
            })
            .catch(() => {
              logout();
            });
        } else {
          logout();
        }
      });
  };

  const login = async (params: LoginRequestBody) => {
    return authService.login(params).then(({ accessToken, refreshToken }) => {
      if (accessToken && refreshToken) {
        saveUserInformationFromToken(accessToken);
        saveAccessToken(accessToken);
        saveRefreshToken(refreshToken);
        setIsLoggedIn(true);
      }
    });
  };

  const logout = () => {
    clearToken();
    setIsLoggedIn(false);
    setAccessToken(undefined);
    setUserInformationState(undefined);
  };

  const getMe = () => {
    return authService.me();
  };

  const refreshToken = async () => {
    const params = {
      refreshToken: getRefreshToken(),
      accessToken: getAccessToken(),
    };

    return authService.refreshToken(params).then((data) => {
      if (data.accessToken && data.refreshToken) {
        const { accessToken, refreshToken } = data;
        saveAccessToken(accessToken);
        saveRefreshToken(refreshToken);
        window.location.reload();
      }
      return data;
    });
  };

  const setUserInformationState = (user: UserBasicInfo | undefined) => {
    if (JSON.stringify(userInformation) !== JSON.stringify(user)) {
      setUserInformation(user);
    }
  };

  const saveUserInformationFromToken = (accessToken?: string) => {
    try {
      const payload = accessTokenDecode(accessToken ?? '');
      if (payload?.user) {
        setUserInformationState(
          transformUserBasicInfoToUserBasicInfo(payload.user as UserBasicInfo),
        );
      }
    } catch {
      setUserInformationState(undefined);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoggedIn,
    accessToken,
    userInformation,
    login,
    logout,
    verify,
    getMe,
  };
}

export default useProviderController;
