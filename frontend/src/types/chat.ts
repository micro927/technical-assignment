import type { ChatInfo, UserBasicInfo } from '@/services/types/data';

export type SearchFriendFormValues = {
  search: string;
};

export type ChatContextType = {
  friendList: UserBasicInfo[];
  chatList: ChatInfo[];
  openAddFriendModal: () => void;
  openCreateChatModal: () => void;
  // closeAddFriendModal: () => void;
  // closeCreateChatModal: () => void;
};
