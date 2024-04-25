import LogoutButton from './components/LogoutButton';
import ThemeSwitcher from './components/ThemeSwitcher';
import { HiMenu } from 'react-icons/hi';

function Navbar({
  isLoggedIn,
  toggleMenuBar,
}: {
  isLoggedIn: boolean;
  toggleMenuBar: () => void;
}) {
  return (
    <>
      <nav className="mb-navbar height-navbar fixed z-30 w-full border-b border-b-neutral-300 bg-slate-200 px-8 py-4 dark:border-b-gray-600 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <button onClick={toggleMenuBar}>
            <HiMenu size={20} />
          </button>
          <div className="flex gap-2">
            {isLoggedIn && <LogoutButton />}
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
      <div className="height-navbar bg-transparent" />
    </>
  );
}

export default Navbar;
