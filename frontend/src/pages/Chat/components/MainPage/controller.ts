import useWebSocket from '@/utils/useWebSocket';
import { useContext, useEffect, useState } from 'react';
import {
  emitRegisterActiveUser,
  emitUnRegisterActiveUser,
  onFriendsActivityUpdated,
} from '@/services/websocket/activity';
import { AuthenticationContext } from '@/core/authentication/Context';
import { useUserActivity } from '@/utils/useUserActivity';
import userService from '@/services/api/user';
import type { ChatInfo, UserBasicInfo } from '@/services/types/data';
import chatService from '@/services/api/chat';
import type { ChatsResponse } from '@/services/types/response';
import type { ChatContextType } from '@/types/chat';

function useChatController() {
  const { socket } = useWebSocket();
  const { userInformation } = useContext(AuthenticationContext);
  const { isActive } = useUserActivity();

  const [isOpenAddFriendModal, setIsOpenAddFriendModal] = useState(false);

  const openAddFriendModal = () => setIsOpenAddFriendModal(true);
  const closeAddFriendModal = () => setIsOpenAddFriendModal(false);

  const [isOpenCreateChatModal, setIsOpenCreateChatModal] = useState(false);

  const openCreateChatModal = () => setIsOpenCreateChatModal(true);
  const closeCreateChatModal = () => setIsOpenCreateChatModal(false);

  const [chatList, setChatList] = useState<ChatsResponse>([]);
  const [friendList, setFriendList] = useState<UserBasicInfo[]>([]);

  const getFriendList = () => {
    userService
      .getFriends()
      .then(({ data }) => {
        setFriendList(data);
      })
      .catch(() => setFriendList([]));
  };

  const getChatList = () => {
    chatService
      .getChats()
      .then(({ data }) => {
        setChatList(data);
      })
      .catch(() => setChatList([]));
  };

  useEffect(() => {
    getChatList();
    getFriendList();
  }, []);

  const onFriendsUpdated = (friend: UserBasicInfo) => {
    setFriendList((prevFriendList) => ({
      friend,
      ...prevFriendList,
    }));
  };
  const onChatsUpdated = (chat: ChatInfo) => {
    setChatList((prevChatList) => ({
      chat,
      ...prevChatList,
    }));
  };

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
          friendIDs: userInformation?.friends?.map(({ id }) => id) ?? [],
        });
      } else {
        emitUnRegisterActiveUser(socket);
      }
    }

    return () => {
      if (socket) emitUnRegisterActiveUser(socket);
    };
  }, [socket, isActive, userInformation]);

  const chatContext: ChatContextType = {
    friendList,
    chatList,
    openAddFriendModal,
    openCreateChatModal,
  };

  const onAddFriendSuccess = () => {};
  const onCreateChatSuccess = () => {};
  return {
    userInformation,
    isActive,
    chatList,
    friendList,
    onChatsUpdated,
    onFriendsUpdated,
    isOpenCreateChatModal,
    isOpenAddFriendModal,
    closeCreateChatModal,
    closeAddFriendModal,
    chatContext,
    onAddFriendSuccess,
    onCreateChatSuccess,
  };
}

export default useChatController;
