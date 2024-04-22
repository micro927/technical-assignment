import {
  userSelectedFields,
  userWithFriendSelectedFields,
} from '@/constants/dataQueryFields.js';
import { UserBasicInfo } from '@/types/data.js';
import prisma from './db.js';

export const getUserBasicInfoFromDatabase = async (
  id: string,
  withFriends = false,
) => {
  const selectedFields = withFriends
    ? userWithFriendSelectedFields
    : userSelectedFields;

  const userBasicInfo: UserBasicInfo = await prisma.user.findUniqueOrThrow(
    Object.assign(selectedFields, {
      where: { id },
    }),
  );
  return userBasicInfo;
};

export default getUserBasicInfoFromDatabase;
