import { useContext } from 'react';
import ThemeSwitcher from './components/ThemeSwitcher';
import { HiHome, HiMenu, HiOutlineLogout } from 'react-icons/hi';
import { AuthenticationContext } from '@/core/authentication/Context';
import { useNavigate } from 'react-router-dom';
import { CHAT_ROUTE } from '@/constants/route';
import { RiWifiOffLine } from 'react-icons/ri';

function Navbar({
  isLoggedIn,
  isOnline,
  toggleMenuBar,
}: {
  isLoggedIn: boolean;
  isOnline: boolean;
  toggleMenuBar: () => void;
}) {
  function LogoutButton() {
    const { logout } = useContext(AuthenticationContext);
    return (
      <button onClick={logout} className="p-1">
        <HiOutlineLogout size={20} />
      </button>
    );
  }

  function HomeButton() {
    const navigate = useNavigate();
    return (
      <button onClick={() => navigate(CHAT_ROUTE.HOME)} className="p-1">
        <HiHome size={20} />
      </button>
    );
  }

  function ToggleButton() {
    return (
      <button onClick={toggleMenuBar}>
        <HiMenu size={20} />
      </button>
    );
  }

  function OfflineIcon() {
    return (
      <div className="p-1">
        {!isOnline ? (
          <RiWifiOffLine className="animate-pulse text-red-500" size={20} />
        ) : (
          <></>
        )}
      </div>
    );
  }

  return (
    <>
      <nav className="mb-navbar height-navbar fixed z-30 w-full border-b border-b-neutral-300 bg-slate-200 px-8 py-4 dark:border-b-gray-600 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <ToggleButton />
          <div className="flex gap-2 md:gap-3">
            <OfflineIcon />
            <HomeButton />
            <ThemeSwitcher />
            {isLoggedIn && <LogoutButton />}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
