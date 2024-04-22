import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useContext } from 'react';
import { AuthenticationContext } from '@/core/authentication/Context';

function Layout() {
  const { isLoggedIn } = useContext(AuthenticationContext);

  return (
    <div
      id="app-layout"
      className=" min-w-screen flex min-h-screen flex-col bg-gray-100 text-gray-900 transition-colors duration-100 dark:bg-gray-800 dark:text-white"
    >
      <div>
        <Navbar isLoggedIn={isLoggedIn} />
      </div>
      <div className="flex h-full w-full flex-1">
        {isLoggedIn && (
          <div className=" w-full bg-green-300 md:w-[420px]">sidebar</div>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
