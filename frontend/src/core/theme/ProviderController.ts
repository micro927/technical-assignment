import { Theme } from '@/types/userInterface';
import { useEffect, useState } from 'react';

function useThemeProviderController() {
  const themeLocalStorage: Theme =
    (window.localStorage.getItem('theme') as Theme) ?? 'light';
  const [userTheme, setUserTheme] = useState<Theme>(themeLocalStorage);

  const addDarkClass = () => document.documentElement.classList.add('dark');

  const removeDarkClass = () =>
    document.documentElement.classList.remove('dark');

  useEffect(() => {
    if (userTheme == 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        addDarkClass();
      }
    } else {
      if (userTheme === 'dark') {
        addDarkClass();
      } else if (userTheme === 'light') {
        removeDarkClass();
      } else {
        setUserTheme('light');
        removeDarkClass();
      }
    }
  }, [userTheme]);

  const setTheme = (themeValue: Theme) => {
    setUserTheme(themeValue);
    window.localStorage.setItem('theme', themeValue);
  };

  return { userTheme, setTheme };
}

export default useThemeProviderController;
