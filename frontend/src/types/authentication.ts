import { LoginRequestBody } from '@/services/types/request';
import { UserBasicInfo } from '../services/types/data';

export type AuthenticationContextType = {
  isLoggedIn: boolean;
  accessToken?: string;
  userInformation?: UserBasicInfo;
  login: (params: LoginRequestBody) => Promise<void>;
  logout: () => void;
};

export type AuthenticationProviderType = ({
  children,
}: {
  children: JSX.Element;
}) => JSX.Element;
