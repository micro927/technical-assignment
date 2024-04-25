import type { ChatInfo, UserBasicInfo } from '@/types/data.js';
import type { Message } from '@prisma/client';

export function transformSelectedChatToChatInfo(selectedChat: {
  id: string;
  members: Partial<UserBasicInfo>[];
  messages: Message[];
  createdAt: Date;
}): ChatInfo {
  const { id, members, messages, createdAt } = selectedChat;

  return {
    id,
    members,
    lastMessage: messages[0] ?? null,
    createdAt,
  };
}
