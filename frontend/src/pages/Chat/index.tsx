import { AuthenticationContext } from '@/core/authentication/Context';
import {
  emitRegisterActiveUser,
  emitUnRegisterActiveUser,
  onFriendsActivityUpdated,
} from '@/services/websocket/activity';
import { useUserActivity } from '@/utils/useUserActivity';
import useWebSocket from '@/utils/useWebSocket';
import { useContext, useEffect } from 'react';
import MenuBar from './components/MenuBar';

function Chat() {
  const { userInformation } = useContext(AuthenticationContext);
  const { socket } = useWebSocket();
  const { isActive } = useUserActivity();

  useEffect(() => {
    if (socket)
      onFriendsActivityUpdated(socket, (data) => {
        if (userInformation?.id !== data?.userID)
          alert(`found online friends', ${data?.userID}`);
      });
  }, [socket, userInformation]);

  useEffect(() => {
    if (socket) {
      if (isActive) {
        emitRegisterActiveUser(socket, {
          userID: userInformation?.id ?? '',
          friendIDs: ['6624f8c89d75f14793a332b9', '66239835a7139eb903c245ab'],
        });
      } else {
        emitUnRegisterActiveUser(socket);
      }
    }

    return () => {
      if (socket) emitUnRegisterActiveUser(socket);
    };
  }, [socket, isActive, userInformation]);

  return (
    <div className="h-screen w-full bg-red-500">
      <MenuBar />
      {isActive && 'isActive'}
      <p>{userInformation?.id}</p>
    </div>
  );
}

export default Chat;
