import authService from '@/services/auth';
import { LoginRequestBody } from '@/services/types/request';
import { UserBasicInfo } from '@/services/types/schema';
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

function useProviderController() {
  const getPayload = (token: string) => {
    const payload = accessTokenDecode(token);
    if (payload) {
      return payload as AccessTokenPayload;
    }
  };
  const localAccessToken = getAccessToken();
  const payload = getPayload(localAccessToken);
  const localUserBasicInfo = payload?.user;

  const [accessToken, setAccessToken] = useState<string | undefined>(
    localAccessToken,
  );
  const [userInformation, setUserInformation] = useState(localUserBasicInfo);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    Boolean(localUserBasicInfo?.id),
  );

  const verify = () => {
    getMe()
      .then(({ data }) => {
        if (data) {
          setUserInformationState(data);
        } else {
          logout();
        }
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
        setUserInformationState(payload.user as UserBasicInfo);
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
