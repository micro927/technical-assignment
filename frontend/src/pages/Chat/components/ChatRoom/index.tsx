import Input from '@/components/Input';
import type { ChatFormValues } from '@/types/chat';
import useChatRoomController from './controller';
import Button from '@/components/Button';
import { HiOutlineChevronRight, HiViewGrid } from 'react-icons/hi';
import MessageItem from './components/MessageItem';
import Avatar from '@/components/Avatar';
import Loading from '@/components/Loading';
import clsx from 'clsx';

function ChatRoom() {
  const {
    control,
    formState,
    isLoading,
    messageItems,
    onSubmitChat,
    tempLastMessage,
    isGroupChat,
    chatTitle,
    chatBoxRef,
    memberList,
    userInformation,
  } = useChatRoomController();

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-100 dark:bg-slate-700">
      <div className="fixed top-[62px] z-20 flex w-full items-center gap-3 bg-blue-500 px-7 py-3 font-semibold text-gray-50 dark:bg-gray-600">
        {isLoading ? (
          <TitleLoadings />
        ) : (
          <>
            {isGroupChat ? (
              <HiViewGrid size={24} />
            ) : (
              <Avatar size={24} name={chatTitle} />
            )}
            <div className="flex items-center gap-1 text-sm">
              <p className="max-w-[250px] truncate md:max-w-[300px]">
                {chatTitle}
              </p>
              {isGroupChat && `(${memberList.length})`}
            </div>
          </>
        )}
      </div>
      <div
        id="chatBox"
        ref={chatBoxRef}
        className="mb-6 mt-10 flex h-full items-start overflow-scroll px-6 py-8 pt-8 sm:pt-24"
      >
        <div className=" flex w-full flex-col gap-1">
          {isLoading ? (
            <ChatItemLoadings />
          ) : (
            messageItems.map((messageItem, key) => {
              return <MessageItem key={key} {...messageItem} />;
            })
          )}
          {tempLastMessage && (
            <MessageItem
              id="temp"
              content={tempLastMessage ?? ''}
              isMyMessage
              key={'temp-message'}
              senderName={userInformation?.name}
            />
          )}
        </div>
      </div>
      <div className="sticky bottom-0 z-0 w-full bg-blue-200 p-3 dark:bg-gray-600">
        <div>
          <form
            name="chatForm"
            noValidate
            className="flex w-full gap-2 "
            onSubmit={onSubmitChat}
          >
            <div className="w-full">
              <Input<ChatFormValues>
                control={control}
                placeholder="Please enter message"
                name="content"
                rules={{
                  required: true,
                }}
                hideErrorMessage
                className="w-full !outline-none dark:!outline-none"
                autoComplete="off"
              />
            </div>
            <Button disabled={!formState.isValid} isLoading={isLoading}>
              <HiOutlineChevronRight size={20} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

const ChatItemLoadings = () => {
  const order = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
  return (
    <>
      {order.map((self, key) => (
        <Loading
          key={key}
          className={clsx('h-10 w-2/5', self ? 'self-end' : 'self-start')}
        />
      ))}
    </>
  );
};

const TitleLoadings = () => (
  <>
    <Loading className="!h-5 w-5 rounded-full" />
    <Loading className="!h-5 w-32" />
  </>
);

export default ChatRoom;
