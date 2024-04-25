import useMenuBarController from './controller';
import Button from '@/components/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { SetState } from '@/types/utils';
import Avatar from '@/components/Avatar';
import { useContext } from 'react';
import { AuthenticationContext } from '@/core/authentication/Context';
import { VARIANTS } from '@/constants/variants';
import { HiUsers } from 'react-icons/hi';
import { ChatContext } from '../..';
import ChatItem from './components/ChatItem';
import FriendItem from './components/FriendItem';
import Loading from '@/components/Loading';

function MenuBar({
  isOpen,
  setIsOpenMenuBar,
}: {
  isOpen: boolean;
  setIsOpenMenuBar: SetState<boolean>;
}) {
  useMenuBarController({
    setIsOpenMenuBar,
  });
  const { userInformation } = useContext(AuthenticationContext);
  const {
    openAddFriendModal,
    openCreateChatModal,
    friendList,
    chatList,
    isMainPageLoading,
  } = useContext(ChatContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0.7, x: -80 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.2,
            },
            x: 0,
          }}
          exit={{
            opacity: 0.7,
            transition: { duration: 0.1 },
            x: -120,
          }}
          className={clsx(
            'absolute left-0 z-[25] w-screen bg-slate-200  shadow sm:relative sm:w-[340px] sm:pt-[62px] md:w-[340px] dark:bg-slate-800',
            'h-[calc(100svh)] overflow-scroll sm:h-[calc(100dvh)]',
          )}
        >
          <div className="flex h-full w-full flex-col gap-6 px-3 py-8">
            {userInformation && (
              <div className="flex flex-col items-center gap-2 px-2">
                <Avatar size={80} name={userInformation?.name} />
                <div className="text-center">
                  <p className="font-semibold">{userInformation.name}</p>
                  <p className="text-sm">{userInformation.email}</p>
                </div>
              </div>
            )}
            <hr className="w-full" />
            <div className="flex gap-4">
              <Button
                variant={VARIANTS.SECONDARY}
                outline
                onClick={openAddFriendModal}
                className="!h-24 w-full"
              >
                <div className="flex flex-col items-center text-sm">
                  <HiUsers size={22} />
                  Find new friend
                </div>
              </Button>
              <Button
                variant={VARIANTS.SECONDARY}
                outline
                onClick={openCreateChatModal}
                className="!h-24 w-full"
                disabled={friendList.length < 1}
              >
                <div className="flex flex-col items-center text-sm">
                  <HiUsers size={22} />
                  New Chat
                </div>
              </Button>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">Chats</p>
              {isMainPageLoading ? (
                <>
                  <Loading />
                  <Loading />
                  <Loading />
                  <Loading />
                </>
              ) : chatList.length ? (
                chatList.map((chatInfo, key) => (
                  <ChatItem key={key} chatInfo={chatInfo} />
                ))
              ) : (
                <p className="ml-4 mt-1 text-xs text-slate-700 dark:text-slate-100">
                  You have no chat, Click new chat button to start.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">Friends</p>

              {isMainPageLoading ? (
                <>
                  <Loading />
                  <Loading />
                  <Loading />
                  <Loading />
                </>
              ) : (
                friendList.map((info, key) => (
                  <FriendItem friend={info} key={key} />
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MenuBar;
