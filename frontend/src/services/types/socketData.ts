export type UpdateUserActivityData = {
  userId: string;
  online: boolean;
};

export type FriendsActivityUpdatedData = {
  userId: string;
  online: boolean;
};

export type NewChatMessageData = {
  content: string;
  chatRoomID: string;
  senderID: string;
  createdAt: Date;
};

export type ChatRoomUpdatedData = Partial<NewChatMessageData>;
