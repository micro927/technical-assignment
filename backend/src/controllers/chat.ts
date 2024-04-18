import {
  chatRoomSelectedFields,
  chatRoomsSelectedFields,
} from '../constants/dataQueryFields.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { AppHandler, BasicObject } from '../types/app.js';
import {
  ChatCreateRequestBody,
  ChatRequestParams,
  SendMessageRequestBody,
} from '../types/request.js';
import {
  ChatCreateResponse,
  ChatResponse,
  ChatsResponse,
  CommonResponse,
} from '../types/response.js';
import db from '../utils/db.js';
import { newChatMessageEventName } from '../utils/websocket.js';

const postSendMessage: AppHandler<
  CommonResponse,
  SendMessageRequestBody
> = async (req, res) => {
  try {
    const { content, chatRoomID } = req.body;
    if (!content || !chatRoomID)
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    const { id: senderID } = res.locals;

    const isAuthorizedChat =
      (await db.chatRoom.findFirstOrThrow({
        where: { memberIDs: { has: senderID } },
      })) ?? false;
    if (!isAuthorizedChat) return res.sendStatus(HTTP_STATUS.FORBIDDEN_403);

    db.message
      .create({
        data: {
          content,
          senderID,
          chatRoomID,
        },
      })
      .then((message) => {
        res.locals.io.emit(
          newChatMessageEventName(message.chatRoomID),
          message,
        );
        res.send({ success: true });
      })
      .catch(() => {
        return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
      });
  } catch (e) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const postCreateChat: AppHandler<ChatCreateResponse, ChatCreateRequestBody> = (
  req,
  res,
) => {
  try {
    const { memberIDs } = req.body;

    db.chatRoom
      .create({
        data: {
          memberIDs,
        },
      })
      .then(({ id: chatRoomID }) => {
        return res.status(HTTP_STATUS.CREATED_201).send({
          chatRoomID,
        });
      });
  } catch (e) {
    console.log(e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const getChat: AppHandler<
  ChatResponse,
  BasicObject,
  BasicObject,
  ChatRequestParams
> = (req, res) => {
  try {
    const { id: userID } = res.locals;
    const { chatRoomID } = req.query;

    db.chatRoom
      .findUniqueOrThrow(
        Object.assign(chatRoomSelectedFields, {
          where: {
            id: chatRoomID,
            memberIDs: { has: userID },
          },
        }),
      )
      .then((data) => {
        return res.status(HTTP_STATUS.OK_200).send(data);
      })
      .catch(() => {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      });
  } catch (e) {
    console.log(e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const getChats: AppHandler<ChatsResponse> = (_req, res) => {
  try {
    const { id: userID } = res.locals;
    db.chatRoom
      .findMany(
        Object.assign(chatRoomsSelectedFields, {
          where: {
            memberIDs: { has: userID },
          },
        }),
      )
      .then((data) => {
        return res.status(HTTP_STATUS.OK_200).send(data);
      })
      .catch(() => {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
      });
  } catch (e) {
    console.log(e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
};

const chatController = {
  postSendMessage,
  postCreateChat,
  getChat,
  getChats,
};

export default chatController;
