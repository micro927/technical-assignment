import {
  chatRoomSelectedFields,
  chatSelectedFields,
} from '@/constants/dataQueryFields.js';
import { HTTP_STATUS } from '@/constants/httpStatus.js';
import { SOCKET_EVENT } from '@/constants/websocket.js';
import { AppHandler } from '@/types/app.js';
import type { ChatInfo } from '@/types/data.js';
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
import type { ChatRoomUpdatedData } from '@/types/socketData.js';
import type { BasicObject } from '@/types/utils.js';
import prisma from '@/utils/db.js';
import { transformSelectedChatToChatInfo } from '@/utils/transformSelectedChatToChatInfo.js';
import type { Message } from '@prisma/client';

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
        include: {
          chatroom: { select: { memberIDs: true } },
        },
      })
      .then(async (data) => {
        const { chatRoomID, createdAt, chatroom, content, senderID, id } = data;

        const message: Message = {
          id,
          content,
          chatRoomID,
          senderID,
          createdAt,
        };

        const chatRoomUpdatedData: ChatRoomUpdatedData = {
          chatRoomID,
          updatedAt: message.createdAt,
        };

        res.locals.io
          .to(chatRoomID)
          .emit(SOCKET_EVENT.NEW_CHATROOM_MESSAGE, message);

        const allClients = await res.locals.io.sockets.fetchSockets();

        const memberSocketIDs = allClients
          .filter((client) => chatroom.memberIDs.includes(client.data.userID))
          .map((member) => member.id);

        res.locals.io.sockets
          .to(memberSocketIDs)
          .emit(SOCKET_EVENT.CHATROOM_UPDATED, chatRoomUpdatedData);

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
    const { id: userID } = res.locals;
    const memberIDsIncludeSelf = [...memberIDs, userID].sort();
    if (memberIDs.length === 0)
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);

    prisma.chatRoom
      .findFirstOrThrow({
        select: chatSelectedFields.select,
        where: { memberIDs: { equals: memberIDsIncludeSelf } },
      })
      .then((data) => {
        const chatInfo = transformSelectedChatToChatInfo(data);
        return res.status(HTTP_STATUS.OK_200).send(chatInfo);
      })
      .catch(() => {
        prisma.chatRoom
          .create({
            select: chatSelectedFields.select,
            data: {
              memberIDs: memberIDsIncludeSelf,
            },
          })
          .then(async (data) => {
            const chatInfo = transformSelectedChatToChatInfo(data);

            const allClients = await res.locals.io.sockets.fetchSockets();

            const memberSocketIDs = allClients
              .filter((client) => memberIDs.includes(client.data.userID))
              .map((member) => member.id);

            res.locals.io.sockets
              .to(memberSocketIDs)
              .emit(SOCKET_EVENT.CHATROOM_CREATED, chatInfo);

            return res.status(HTTP_STATUS.CREATED_201).send(chatInfo);
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
      .findUniqueOrThrow({
        include: chatRoomSelectedFields.include,
        where: {
          id: chatRoomID,
          memberIDs: { has: userID },
        },
      })
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
      .findMany({
        select: chatSelectedFields.select,
        where: {
          memberIDs: { has: userID },
        },
      })
      .then((dataList) => {
        const chatsInfo: ChatInfo[] = dataList.map((data) => {
          return transformSelectedChatToChatInfo(data);
        });
        return res.status(HTTP_STATUS.OK_200).send(chatsInfo);
      })
      .catch(() => res.status(HTTP_STATUS.NO_CONTENT_204).send([]));
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
