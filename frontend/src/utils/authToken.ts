import { LOCAL_STORAGE } from '@/constants/localStorageKey';
import { AccessTokenPayload, BasicObject } from '@/types/utils';
import { jwtDecode } from 'jwt-decode';

export const getAccessToken = () =>
  localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ?? '';

export const getRefreshToken = () =>
  localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN) ?? '';

export const saveAccessToken = (token: string) =>
  localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, token);

export const saveRefreshToken = (token: string) =>
  localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, token);

export const removeAccessToken = () =>
  localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);

export const removeRefreshToken = () =>
  localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);

export const clearToken = () => {
  removeAccessToken();
  removeRefreshToken();
};

export const accessTokenDecode = (
  token: string,
): AccessTokenPayload | BasicObject => {
  try {
    return jwtDecode<AccessTokenPayload>(token);
  } catch {
    return {};
  }
};
