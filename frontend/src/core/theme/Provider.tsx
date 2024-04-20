import { AuthenticationProviderType } from '@/types/authentication';

import { ThemeContext } from './Context';
import useThemeProviderController from './ProviderController';

export const ThemeProvider: AuthenticationProviderType = ({ children }) => {
  const { userTheme, setTheme } = useThemeProviderController();

  return (
    <ThemeContext.Provider
      value={{
        userTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
