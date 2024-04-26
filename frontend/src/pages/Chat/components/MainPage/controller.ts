import useWebSocket from '@/utils/useWebSocket';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  emitRegisterActiveUser,
  emitUnRegisterActiveUser,
  listenActiveUser,
  listenFriendsActivityUpdated,
} from '@/services/websocket/activity';
import { AuthenticationContext } from '@/core/authentication/Context';
import { useUserActivity } from '@/utils/useUserActivity';
import userService from '@/services/api/user';
import type { ChatInfo, UserBasicInfo } from '@/services/types/data';
import type {
  ChatInfoWithUnread,
  UserBasicInfoWithActivity,
} from '@/types/chat';
import chatService from '@/services/api/chat';
import type { ChatContextType } from '@/types/chat';
import {
  listenChatRoomCreated,
  listenChatRoomUpdated,
  stopListenChatRoomCreated,
  stopListenChatRoomUpdated,
} from '@/services/websocket/chat';
import { useNavigate, useParams } from 'react-router-dom';

function useChatController() {
  const navigate = useNavigate();
  const { chatRoomID } = useParams();
  const { socket } = useWebSocket();
  const { userInformation } = useContext(AuthenticationContext);
  const { isActive } = useUserActivity();

  const [isMainPageLoading, setIsMainPageLoading] = useState(false);
  const [isOpenAddFriendModal, setIsOpenAddFriendModal] = useState(false);

  const openAddFriendModal = () => setIsOpenAddFriendModal(true);
  const closeAddFriendModal = () => setIsOpenAddFriendModal(false);

  const [isOpenCreateChatModal, setIsOpenCreateChatModal] = useState(false);

  const openCreateChatModal = () => setIsOpenCreateChatModal(true);
  const closeCreateChatModal = () => setIsOpenCreateChatModal(false);

  const [chatList, setChatList] = useState<ChatInfoWithUnread[]>([]);
  const [friendList, setFriendList] = useState<UserBasicInfoWithActivity[]>([]);

  const getFriendList = () => {
    setIsMainPageLoading(true);
    userService
      .getFriends()
      .then(({ data }) => {
        setIsMainPageLoading(false);
        setFriendList(data.map((friend) => ({ ...friend, online: false })));
      })
      .catch(() => {
        setIsMainPageLoading(false);
        setFriendList([]);
      });
  };

  const getChatList = () => {
    setIsMainPageLoading(true);
    chatService
      .getChats()
      .then(({ data }) => {
        setIsMainPageLoading(false);
        setChatList(
          data
            .map((chat) => ({ ...chat, unread: false }))
            .sort((a, b) => a.members.length - b.members.length),
        );
      })
      .catch(() => {
        setIsMainPageLoading(false);
        setChatList([]);
      });
  };

  const onFriendAdded = (friend: UserBasicInfoWithActivity) => {
    setFriendList((prevFriendList) => ({
      friend,
      ...prevFriendList,
    }));
  };

  const onChatAdded = (chat: ChatInfoWithUnread) => {
    setChatList((prevChatList) => ({
      chat,
      ...prevChatList,
    }));
  };

  const onFriendListActivityUpdated = (friendID: string, online: boolean) => {
    setFriendList((prevFriendList) =>
      prevFriendList.map((prevFriend) => {
        if (prevFriend.id !== friendID) return prevFriend;
        if (prevFriend.online === online) return prevFriend;
        return {
          ...prevFriend,
          online,
        };
      }),
    );
  };

  const onGetActiveFriends = (activeFriendIDs: string[]) => {
    setFriendList((prevFriendList) =>
      prevFriendList.map((prevFriend) => {
        const friendActivity = activeFriendIDs.includes(prevFriend.id);
        return {
          ...prevFriend,
          online: friendActivity,
        };
      }),
    );
  };

  const onChatListUpdated = (chatRoomID: string, unreadValue: boolean) => {
    setChatList((prevChatList) =>
      prevChatList.map((prevChat) => {
        if (prevChat.id !== chatRoomID) return prevChat;

        return {
          ...prevChat,
          unread: unreadValue,
        };
      }),
    );
  };

  const onAddFriendSuccess = (friends: UserBasicInfo[]) => {
    const friendsWithActivity = friends.map((friend) => ({
      ...friend,
      online: false,
    }));
    setFriendList((prevFriendList) =>
      [...friendsWithActivity, ...prevFriendList].sort((a, b) =>
        a.name < b.name ? -1 : 1,
      ),
    );
  };
  const onCreateChatSuccess = (chatInfo: ChatInfo, isExisted: boolean) => {
    if (!isExisted) {
      setChatList((prevChatList) =>
        [{ ...chatInfo, unread: false }, ...prevChatList].sort(
          (a, b) => a.members.length - b.members.length,
        ),
      );
    }
    navigate(chatInfo.id);
  };

  const setCurrentChatRoomRead = useCallback(() => {
    if (chatRoomID) onChatListUpdated(chatRoomID, false);
  }, [chatRoomID]);

  useEffect(() => {
    getChatList();
    getFriendList();
  }, []);

  useEffect(() => {
    if (socket) {
      listenFriendsActivityUpdated(socket, (data) => {
        if (data?.userID) {
          if (userInformation?.id !== data.userID) {
            onFriendListActivityUpdated(data.userID, data.online);
          }
        }
      });
    }
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (socket) {
      listenChatRoomUpdated(socket, (data) => {
        if (data) {
          if (!(isActive && chatRoomID === data.chatRoomID))
            onChatListUpdated(data.chatRoomID, true);
        }
      });
    }
    return () => {
      if (socket) stopListenChatRoomUpdated(socket);
    };
  }, [socket, isActive, chatRoomID]);

  useEffect(() => {
    if (socket) {
      listenChatRoomCreated(socket, (chatInfo) => {
        if (chatInfo) {
          setChatList((prevChatList) => {
            return [
              {
                ...chatInfo,
                unread: true,
              },
              ...prevChatList,
            ];
          });
        }
      });
    }
    return () => {
      if (socket) stopListenChatRoomCreated(socket);
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      if (isActive) {
        emitRegisterActiveUser(socket, {
          userID: userInformation?.id ?? '',
          friendIDs: friendList.map(({ id }) => id),
        });
      } else {
        emitUnRegisterActiveUser(socket);
      }
    }
    return () => {
      if (socket) emitUnRegisterActiveUser(socket);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isActive]);

  useEffect(() => {
    if (socket) {
      listenActiveUser(socket, (friendIDs) => {
        if (friendIDs !== null && friendIDs !== undefined)
          onGetActiveFriends(friendIDs);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (isActive) setCurrentChatRoomRead();
  }, [isActive, setCurrentChatRoomRead]);

  const chatContext: ChatContextType = {
    friendList,
    chatList,
    openAddFriendModal,
    openCreateChatModal,
    onChatAdded,
    onFriendAdded,
    isMainPageLoading,
    socket,
    onChatListUpdated,
  };

  return {
    userInformation,
    isActive,
    chatList,
    friendList,
    isOpenCreateChatModal,
    isOpenAddFriendModal,
    closeCreateChatModal,
    closeAddFriendModal,
    chatContext,
    onAddFriendSuccess,
    onCreateChatSuccess,
    chatRoomID,
  };
}

export default useChatController;
