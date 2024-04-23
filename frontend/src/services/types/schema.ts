//NOTE: data schema, it's should be always synced with BACKEND data model

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  chatRoomIDs: string[];
  friendIDs: string[];
  friendOfIDs: string[];
};

export type Message = {
  id: string;
  content: string;
  chatRoomID: string;
  senderID: string;
  createdAt: Date;
};

export type ChatRoom = {
  id: string;
  memberIDs: string[];
  createdAt: Date;
};
