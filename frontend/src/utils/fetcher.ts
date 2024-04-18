import axios from 'axios';
import { getAccessToken } from './authToken';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export const baseHeaders = {
  'Content-Type': 'application/json',
  Authorization: '',
};

export const getAuthorizationHeader = () => {
  const accessToken = getAccessToken();
  return {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
};

export const createAxiosFetcher = (servicePath: string) => {
  const baseURL = `${apiBaseURL}/${servicePath}/`;
  return axios.create({
    baseURL: baseURL,
    headers: baseHeaders,
  });
};
