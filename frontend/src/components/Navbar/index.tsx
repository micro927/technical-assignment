import LogoutButton from './components/LogoutButton';
import ThemeSwitcher from './components/ThemeSwitcher';

function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <nav className="w-full px-8 py-4">
      <div className="flex items-center justify-end gap-2">
        {isLoggedIn && <LogoutButton />}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}

export default Navbar;
