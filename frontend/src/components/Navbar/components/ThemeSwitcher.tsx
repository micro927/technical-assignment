import { ThemeContext } from '@/core/theme/Context';
import { Theme } from '@/types/userInterface';
import { useContext, useMemo } from 'react';
import { HiMoon, HiSun, HiDeviceMobile } from 'react-icons/hi';

function ThemeSwitcher() {
  const themeOptions: Theme[] = ['light', 'dark', 'system'];
  const { userTheme, setTheme } = useContext(ThemeContext);

  const changeTheme = () =>
    setTheme(
      themeOptions?.[themeOptions.indexOf(userTheme) + 1] ?? themeOptions[0],
    );

  const ThemeIcon = useMemo(() => {
    return userTheme === 'system'
      ? HiDeviceMobile
      : userTheme === 'dark'
        ? HiMoon
        : HiSun;
  }, [userTheme]);

  return (
    <div>
      <button onClick={changeTheme} className="p-1">
        <ThemeIcon size={20} />
      </button>
    </div>
  );
}

export default ThemeSwitcher;
