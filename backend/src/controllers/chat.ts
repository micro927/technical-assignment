import {
  chatRoomSelectedFields,
  chatRoomsSelectedFields,
} from '@/constants/dataQueryFields.js';
import { HTTP_STATUS } from '@/constants/httpStatus.js';
import { SOCKET_EVENT, SOCKET_ROOM } from '@/constants/websocket.js';
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
import type { BasicObject } from '@/types/utils.js';
import prisma from '@/utils/db.js';

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

        res.locals.io.to(chatRoomID).emit(SOCKET_EVENT.NEW_CHAT_MESSAGE, {
          id,
          content,
          chatRoomID,
          senderID,
          createdAt,
        });

        const activeClients = await res.locals.io.sockets
          .in(SOCKET_ROOM.ACTIVE_USER)
          .fetchSockets();

        activeClients.map((client) => {
          if (chatroom.memberIDs.includes(client.data.userID)) {
            res.locals.io.sockets
              .to(client.id)
              .emit(SOCKET_EVENT.CHATROOM_UPDATED, { createdAt });
          }
        });

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
    const memberIDsIncludeSelf = [...memberIDs, userID];
    if (memberIDs.length === 0)
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    prisma.chatRoom
      .create({
        data: {
          memberIDs: memberIDsIncludeSelf,
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

    console.log(userID);

    prisma.chatRoom
      .findMany({
        select: chatRoomsSelectedFields.select,
        where: {
          memberIDs: { has: userID },
        },
      })
      .then((data) => {
        console.log(data);
        const chatsInfo: ChatInfo[] = data.map(({ id, members, messages }) => {
          return {
            id,
            members,
            lastMessages: messages,
          };
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
