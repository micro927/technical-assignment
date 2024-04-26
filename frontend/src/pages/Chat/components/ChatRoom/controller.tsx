import chatService from '@/services/api/chat';
import { Message } from '@/services/types/schema';
import {
  emitJoinChatRoom,
  emitLeaveChatRoom,
  listenChatRoomNewMessage,
} from '@/services/websocket/chat';
import type { ChatFormValues, ChatRoomMessageItem } from '@/types/chat';
import { createZodObjectSchema } from '@/utils/formValidators';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ChatContext } from '../..';
import { AuthenticationContext } from '@/core/authentication/Context';
import { scrollToBottom } from '@/utils/useScrollToBottom';
import type { UserBasicInfo } from '@/services/types/data';
import type { LayoutOutletContext } from '@/types/userInterface';
import { CHAT_ROUTE } from '@/constants/route';

function useChatRoomController() {
  const { socket } = useContext(ChatContext);
  const { userInformation } = useContext(AuthenticationContext);
  const { chatRoomID } = useParams();
  const navigate = useNavigate();
  const { isOpenMenuBar, isMobile } = useOutletContext<LayoutOutletContext>();

  const [isLoading, setIsLoading] = useState(false);
  const [messageItems, setMessageItems] = useState<ChatRoomMessageItem[]>([]);
  const [memberList, setMemberList] = useState<UserBasicInfo[]>([]);
  const [tempLastMessage, setTempLastMessage] = useState<string | null>();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const chatSchema = createZodObjectSchema('content');
  const chatForm = useForm<ChatFormValues>({
    mode: 'onChange',
    defaultValues: { content: '' },
    resolver: zodResolver(chatSchema),
  });
  const { handleSubmit, setError, control, formState, reset } = chatForm;

  const createMemberIDNameMapping = (members: UserBasicInfo[]) => {
    const mappingObject = {} as Record<string, string>;

    const objectList = members.map((member) => {
      return {
        [member.id]: member.name,
      };
    });
    return Object.assign(mappingObject, ...objectList) as Record<
      string,
      string
    >;
  };

  const transformMessageToChatRoomMessageItem = useCallback(
    (message: Message, mapper: Record<string, string>): ChatRoomMessageItem => {
      const { id, createdAt, content, senderID } = message;
      const isMyMessage = userInformation?.id === senderID;
      const senderName = isMyMessage
        ? userInformation?.name ?? ''
        : mapper?.[senderID] ?? 'err';
      return {
        id,
        senderName,
        content,
        createdAt,
        isMyMessage,
      };
    },
    [userInformation],
  );

  const getChat = () => {
    if (chatRoomID) {
      setIsLoading(true);
      chatService
        .getChat({
          chatRoomID,
        })
        .then(({ data }) => {
          const memberIDNameMapping = createMemberIDNameMapping(data.members);
          setIsLoading(false);
          setMessageItems(() => {
            if (data?.messages) {
              return data.messages?.map((message) =>
                transformMessageToChatRoomMessageItem(
                  message,
                  memberIDNameMapping,
                ),
              );
            }
            return [];
          });

          setMemberList(data.members);

          setTimeout(scrollChatToBottom);
          setTimeout(() => setIsLoading(false));
        })
        .catch(() => {
          navigate(`${CHAT_ROUTE.HOME}`);
          setIsLoading(false);
          setMessageItems([]);
        });
    }
  };

  const onSubmitChat = handleSubmit((formData: ChatFormValues) => {
    if (chatRoomID) {
      reset();
      const { content } = formData;
      setTempLastMessage(content);
      setTimeout(scrollChatToBottom);
      chatService
        .postSendMessage({
          chatRoomID,
          content,
        })
        .then(() => ({}))
        .catch(() => {
          setIsLoading(false);
          setError('root', {
            type: 'validate',
            message: 'Send message failed, please try again',
          });
        });
    }
  });

  const memberIDStateNameMapping = useMemo(
    () => createMemberIDNameMapping(memberList),
    [memberList],
  );

  const onGetNewMessage = (message: Message) => {
    setTempLastMessage(null);
    setMessageItems((prevMessageList) => [
      ...prevMessageList,
      transformMessageToChatRoomMessageItem(message, memberIDStateNameMapping),
    ]);
    setTimeout(scrollChatToBottom);
  };

  const isGroupChat = useMemo(() => !(memberList.length === 2), [memberList]);

  const chatTitle = useMemo(() => {
    const friendNames = memberList
      .filter((member) => member.id !== userInformation?.id)
      .map((member) => member.name);
    return isGroupChat
      ? `${friendNames.join(', ')}, me`
      : friendNames?.[0] ?? 'err-title';
  }, [isGroupChat, memberList, userInformation]);

  const scrollChatToBottom = useCallback(
    () => scrollToBottom(chatBoxRef),
    [chatBoxRef],
  );

  useEffect(() => {
    if (socket) {
      emitJoinChatRoom(socket, chatRoomID);

      listenChatRoomNewMessage(socket, (message) => {
        if (message) {
          onGetNewMessage(message);
        }
      });
    }
    return () => {
      if (socket) {
        emitLeaveChatRoom(socket, chatRoomID);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chatRoomID]);

  useEffect(() => {
    if (chatRoomID) getChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chatBoxMargin = useMemo(
    () => isMobile || isOpenMenuBar,
    [isMobile, isOpenMenuBar],
  );

  return {
    onSubmitChat,
    control,
    formState,
    isLoading,
    messageItems,
    tempLastMessage,
    userInformation,
    chatRoomID,
    chatBoxRef,
    memberList,
    isGroupChat,
    chatTitle,
    chatBoxMargin,
  };
}

export default useChatRoomController;
