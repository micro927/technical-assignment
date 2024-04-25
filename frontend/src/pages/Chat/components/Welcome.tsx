import { AuthenticationContext } from '@/core/authentication/Context';
import { useContext } from 'react';

function Welcome() {
  const { userInformation } = useContext(AuthenticationContext);
  return (
    <div>
      <p>Welcome, {userInformation?.name}</p>
    </div>
  );
}

export default Welcome;
