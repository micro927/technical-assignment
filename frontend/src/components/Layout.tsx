import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '@/core/authentication/Context';
import type { LayoutOutletContext } from '@/types/userInterface';
import { useMediaSize } from '@/utils/useMediaSize';

function Layout() {
  const { isMobile } = useMediaSize();
  const { isLoggedIn } = useContext(AuthenticationContext);
  const [isOpenMenuBar, setIsOpenMenuBar] = useState(true);
  const toggleMenuBar = () => setIsOpenMenuBar((prev) => !prev);
  const outletContext: LayoutOutletContext = {
    isOpenMenuBar,
    setIsOpenMenuBar,
    isMobile,
  };

  return (
    <div
      id="app-layout"
      className=" min-w-screen flex h-[100svh] flex-col bg-gray-100 text-gray-900 transition-colors duration-100 sm:h-[100vh] dark:bg-gray-800 dark:text-white"
    >
      <Navbar isLoggedIn={isLoggedIn} toggleMenuBar={toggleMenuBar} />
      <div className="mt-[62px] flex h-[100svh] sm:mt-0 sm:h-[100vh]">
        <Outlet context={outletContext} />
      </div>
    </div>
  );
}

export default Layout;
