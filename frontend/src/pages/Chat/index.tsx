import { AuthenticationContext } from '@/core/authentication/Context';
import {
  emitUpdateUserActivity,
  onFriendsActivityUpdated,
} from '@/services/websocket/activity';
import { useUserActivity } from '@/utils/useUserActivity';
import useWebSocket from '@/utils/useWebSocket';
import { useContext, useEffect } from 'react';

function Chat() {
  const { userInformation } = useContext(AuthenticationContext);
  const { socket } = useWebSocket();
  const { isActive } = useUserActivity();

  useEffect(() => {
    console.log('here');

    if (socket)
      onFriendsActivityUpdated(socket, (data) => {
        console.log('found online friends', data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket)
      emitUpdateUserActivity(socket, {
        userId: userInformation?.id ?? '',
        online: isActive,
      });
  }, [socket, isActive, userInformation]);

  return (
    <div className="h-screen w-full bg-red-500">
      {isActive && 'isActive'}
      sds
    </div>
  );
}

export default Chat;
