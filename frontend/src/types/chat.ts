import type { ChatInfo, UserBasicInfo } from '@/services/types/data';
import type { Socket } from 'socket.io-client';

export type SearchFriendFormValues = {
  search: string;
};

export type ChatFormValues = {
  content: string;
};

export type UserBasicInfoWithActivity = UserBasicInfo & {
  online: boolean;
};

export type ChatInfoWithUnread = ChatInfo & {
  unread: boolean;
};

export type ChatContextType = {
  friendList: UserBasicInfoWithActivity[];
  chatList: ChatInfoWithUnread[];
  openAddFriendModal: () => void;
  openCreateChatModal: () => void;
  onFriendAdded: (friend: UserBasicInfoWithActivity) => void;
  onChatAdded: (chat: ChatInfoWithUnread) => void;
  isMainPageLoading: boolean;
  socket: Socket | undefined;
};

export type ChatRoomMessageItem = {
  id: string;
  senderName?: string;
  content: string;
  createdAt?: Date | string;
  isMyMessage: boolean;
};
