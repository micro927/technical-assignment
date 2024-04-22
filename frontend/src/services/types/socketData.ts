export type RegisterActiveUserData = {
  userID: string;
  friendIDs: string[];
};

export type FriendsActivityUpdatedData = {
  userID: string;
  online: boolean;
};

export type NewChatMessageData = {
  content: string;
  chatRoomID: string;
  senderID: string;
  createdAt: Date;
};

export type ChatRoomUpdatedData = Partial<NewChatMessageData>;
