import { UserBasicInfo } from './authentication';
import { SetState } from './utils';

export type MessengerContextType = {
  setIsMainSidebarOpen: SetState<boolean>;
  setIsContactSidebarOpen: SetState<boolean>;
  setIsUserSidebarOpen: SetState<boolean>;
  myChats: ChatItem[];
  teamChats: ChatItem[];
  setMyChats: SetState<ChatItem[]>;
  setTeamChats: SetState<ChatItem[]>;
  createNewChat: () => Promise<void>;
  openDeleteDialog: () => void;
  openUpdateTitleDialog: () => void;
};

export type UserStatusType = {
  title: string;
  value: string;
  color: string;
};

export type UserContactStatusType =
  | 'online'
  | 'do-not-disturb'
  | 'away'
  | 'offline';

export type UserContact = Omit<UserBasicInfo, 'role'> & {
  about: string;
  details: {
    emails: {
      email: string;
      label: string;
    }[];
    phoneNumbers: {
      country: string;
      phoneNumber: string;
      label: string;
    }[];
    title?: string;
    company: string;
    birthday: string;
    address: string;
  };
  attachments: {
    media: string[];
    docs: string[];
    links: string[];
  };
  status: UserContactStatusType;
};

export type ChatItem = Pick<UserBasicInfo, 'displayName' | 'avatarURL'> & {
  id: string;
  userId: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: Date | string;
  unreadCount?: number;
  muted?: boolean;
};
