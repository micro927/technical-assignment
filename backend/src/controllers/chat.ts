import {
  chatRoomSelectedFields,
  chatRoomsSelectedFields,
} from '@/constants/dataQueryFields.js';
import { HTTP_STATUS } from '@/constants/httpStatus.js';
import { AppHandler } from '@/types/app.js';
import {
  ChatCreateRequestBody,
  ChatRequestParams,
  SendMessageRequestBody,
} from '@/types/request.js';
import {
  ChatCreateResponse,
  ChatResponse,
  ChatsResponse,
  CommonResponse,
} from '@/types/response.js';
import prisma from '@/utils/db.js';
import { SOCKET_EVENT, SOCKET_ROOM } from '@/constants/websocket.js';
import { ChatRoomUpdatedData } from '@/types/socketData.js';
import type { BasicObject } from '@/types/utils.js';

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
      (await prisma.chatRoom.findFirstOrThrow({
        where: { memberIDs: { has: senderID } },
      })) ?? false;
    if (!isAuthorizedChat) return res.sendStatus(HTTP_STATUS.FORBIDDEN_403);

    prisma.message
      .create({
        data: {
          content,
          senderID,
          chatRoomID,
        },
      })
      .then((message) => {
        const { chatRoomID, createdAt } = message;

        res.locals.io
          .to(chatRoomID)
          .emit(SOCKET_EVENT.NEW_CHAT_MESSAGE, message);

        const roomMemberClientIDs =
          res.locals.io.sockets.adapter.rooms.get(chatRoomID);
        const activeUserClientIDs = res.locals.io.sockets.adapter.rooms.get(
          SOCKET_ROOM.ACTIVE_USER,
        );

        if (roomMemberClientIDs && activeUserClientIDs) {
          for (const clientID of roomMemberClientIDs) {
            if (clientID in activeUserClientIDs) {
              const chatRoomUpdatedData: ChatRoomUpdatedData = {
                chatRoomID,
                createdAt,
              };

              res.locals.io.emit(
                SOCKET_EVENT.CHATROOM_UPDATED,
                chatRoomUpdatedData,
              );
            }
          }
        }
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

    prisma.chatRoom
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

    prisma.chatRoom
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
    prisma.chatRoom
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
