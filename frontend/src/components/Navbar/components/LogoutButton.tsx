import { AuthenticationContext } from '@/core/authentication/Context';
import { useContext } from 'react';
import { HiLockClosed } from 'react-icons/hi';

function LogoutButton() {
  const { logout } = useContext(AuthenticationContext);

  return (
    <button onClick={logout} className="p-1">
      <HiLockClosed size={20} />
    </button>
  );
}

export default LogoutButton;
