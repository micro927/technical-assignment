import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '@/core/authentication/Context';
import type { LayoutOutletContext } from '@/types/userInterface';
import { useMediaSize } from '@/utils/useMediaSize';
import useOnlineCheck from '@/utils/useOnlineCheck';

function Layout() {
  const { isMobile } = useMediaSize();
  const { isOnline } = useOnlineCheck({});
  const { isLoggedIn } = useContext(AuthenticationContext);
  const [isOpenMenuBar, setIsOpenMenuBar] = useState(true);
  const toggleMenuBar = () => setIsOpenMenuBar((prev) => !prev);
  const outletContext: LayoutOutletContext = {
    isOpenMenuBar,
    setIsOpenMenuBar,
    isMobile,
    isOnline,
  };

  return (
    <div
      id="app-layout"
      className=" min-w-screen flex h-[100svh] flex-col bg-gray-100 text-gray-900 transition-colors duration-100 sm:h-[100vh] dark:bg-gray-800 dark:text-white"
    >
      <Navbar
        isLoggedIn={isLoggedIn}
        isOnline={isOnline}
        toggleMenuBar={toggleMenuBar}
      />
      <div className="mt-[62px] flex h-[100svh] sm:mt-0 sm:h-[100vh]">
        {!isOnline && (
          <div className=" absolute left-0 top-0 z-[24] h-screen w-screen bg-gray-100 opacity-50 dark:bg-gray-600"></div>
        )}
        <Outlet context={outletContext} />
      </div>
    </div>
  );
}

export default Layout;
