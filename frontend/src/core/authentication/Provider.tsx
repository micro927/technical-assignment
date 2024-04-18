import { AuthenticationProviderType } from '@/types/authentication';

import useController from './ProviderController';
import { AuthenticationContext } from './Context';

export const AuthenticationProvider: AuthenticationProviderType = ({
  children,
}) => {
  const { isLoggedIn, accessToken, userInformation, login, logout } =
    useController();

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn,
        accessToken,
        userInformation,
        login,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
