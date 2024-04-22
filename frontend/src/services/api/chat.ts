import { createAxiosFetcher, getAuthorizationHeader } from '@/utils/fetcher';
import {
  ChatCreateRequestBody,
  ChatRequestParams,
  SendMessageRequestBody,
} from '../types/request';
import {
  ChatCreateResponse,
  ChatResponse,
  ChatsResponse,
  CommonResponse,
} from '../types/response';
import * as SERVICE from '@/services/types/route';

const chatAPI = createAxiosFetcher(SERVICE.MAIN_ROUTE.CHAT);

const postSendMessage = async (params: SendMessageRequestBody) => {
  return chatAPI.post<CommonResponse>(
    SERVICE.CHAT_ROUTE.CHAT,
    { params },
    getAuthorizationHeader(),
  );
};

const postCreateChat = async (params: ChatCreateRequestBody) => {
  return chatAPI.post<ChatCreateResponse>(
    SERVICE.CHAT_ROUTE.CHAT,
    { params },
    getAuthorizationHeader(),
  );
};

const getChat = async (params: ChatRequestParams) => {
  return chatAPI.get<ChatResponse>(SERVICE.CHAT_ROUTE.CHAT, {
    params,
    ...getAuthorizationHeader(),
  });
};

const getChats = async () => {
  return chatAPI.get<ChatsResponse>(SERVICE.CHAT_ROUTE.CHATS, {
    ...getAuthorizationHeader(),
  });
};

export const marketingService = {
  postSendMessage,
  postCreateChat,
  getChat,
  getChats,
};

export default marketingService;
