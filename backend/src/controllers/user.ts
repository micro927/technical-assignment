import { HTTP_STATUS } from '../constants/httpStatus.js';
import { userSelectedFields } from '../constants/dataQueryFields.js';
import { AppHandler, BasicObject } from '../types/app.js';
import { UserBasicInfo } from '../types/data.js';
import { UserInfoRequestParams } from '../types/request.js';
import { UserInfoResponse } from '../types/response.js';
import db from '../utils/db.js';
import getUserBasicInfoFromDatabase from '../utils/getUserBasicInfoFromDatabase.js';
import { parseBoolean } from '../utils/parseBoolean.js';

const getInfo: AppHandler<
  UserInfoResponse,
  BasicObject,
  BasicObject,
  UserInfoRequestParams
> = async (req, res) => {
  try {
    const id = res.locals?.id ?? '';
    const withFriends = parseBoolean(req.query.withFriends ?? 'false');
    getUserBasicInfoFromDatabase(id, withFriends)
      .then((userBasicInfo) =>
        res.status(HTTP_STATUS.OK_200).send(userBasicInfo),
      )
      .catch(() => res.sendStatus(HTTP_STATUS.NOT_FOUND_404));
  } catch (error) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const getFriends: AppHandler<UserBasicInfo[]> = async (_req, res) => {
  try {
    const id = res.locals?.id ?? '';
    db.user
      .findFirstOrThrow({
        select: { friends: userSelectedFields },
        where: { id },
      })
      .then(({ friends }) => res.status(HTTP_STATUS.OK_200).send(friends))
      .catch(() => res.sendStatus(HTTP_STATUS.NOT_FOUND_404));
  } catch (error) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const userController = {
  getInfo,
  getFriends,
};

export default userController;
