import Button from '@/components/Button';
import { AuthenticationContext } from '@/core/authentication/Context';
import { LayoutOutletContext } from '@/types/userInterface';
import { useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChatContext } from '..';
import { HiUsers } from 'react-icons/hi';

function Welcome() {
  const { userInformation } = useContext(AuthenticationContext);
  const { openCreateChatModal, openAddFriendModal, friendList } =
    useContext(ChatContext);
  const { isMobile, setIsOpenMenuBar } =
    useOutletContext<LayoutOutletContext>();
  return (
    <div className="h-full w-full  pt-0 sm:pt-[62px] dark:bg-slate-700">
      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div>
          <h1 className="app-title text-center text-5xl font-bold md:text-6xl">
            Welcome
          </h1>
          <p className="text-center text-base font-bold  sm:text-lg">
            {userInformation?.name}
          </p>
        </div>
        <div className="mt-8 flex w-full flex-col justify-center gap-2 px-16">
          <div className="flex w-3/4 flex-row gap-4 self-center sm:flex-col lg:flex-row">
            {!isMobile ? (
              <>
                <Button
                  onClick={openAddFriendModal}
                  className="!h-full w-full shadow-lg"
                >
                  <div className="flex flex-col items-center justify-center">
                    <HiUsers size={30} />
                    Find new friend
                  </div>
                </Button>

                <Button
                  disabled={friendList.length < 1}
                  onClick={openCreateChatModal}
                  className="!h-full w-full shadow-lg"
                >
                  <div className="flex flex-col items-center justify-center">
                    <HiUsers size={30} />
                    New Chat
                  </div>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsOpenMenuBar(true)}
                className="!h-full w-full shadow-lg"
              >
                <div className="flex flex-col items-center justify-center">
                  <HiUsers size={30} />
                  Start Chat
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
