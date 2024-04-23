import { Prisma } from '@prisma/client';

export const userSelectedFields = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

export const userWithFriendSelectedFields =
  Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
      ...userSelectedFields.select,
      friends: userSelectedFields,
    },
  });

export const chatRoomsSelectedFields =
  Prisma.validator<Prisma.ChatRoomDefaultArgs>()({
    select: {
      id: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      members: { select: { name: true } },
    },
  });

export const chatRoomSelectedFields =
  Prisma.validator<Prisma.ChatRoomDefaultArgs>()({
    include: {
      messages: true,
      members: true,
    },
  });
