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
  const { openAddFriendModal, openCreateChatModal, friendList, chatList } =
    useContext(ChatContext);

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
            'absolute w-screen bg-slate-200 shadow sm:relative sm:w-[320px] md:w-[340px] dark:bg-slate-800',
            'h-[calc(100vh-62px)] overflow-scroll',
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
              >
                <div className="flex flex-col items-center text-sm">
                  <HiUsers size={22} />
                  New Chat
                </div>
              </Button>
            </div>
            <div>
              <p className="font-semibold">Chats</p>

              {chatList.map((chat) => (
                <div>
                  <p className="truncate">
                    ({chat.members.length}) {chat.members.join(', ')}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold">Friends</p>

              {friendList.map((friend) => (
                <div>
                  <p className="truncate">{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MenuBar;
