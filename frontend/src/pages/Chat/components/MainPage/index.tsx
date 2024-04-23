import MenuBar from '../MenuBar';
import { Outlet, useOutletContext } from 'react-router-dom';
import { LayoutOutletContext } from '@/types/userInterface';
import useChatController from './controller';
import AddFriendsModal from '../AddFriendsModal';
import MainPageChatContext from './Context';
import CreateChatModal from '../CreateChatModal';

function ChatMainPage() {
  const { isOpenMenuBar, setIsOpenMenuBar } =
    useOutletContext<LayoutOutletContext>();
  const {
    userInformation,
    isActive,
    chatContext,
    isOpenAddFriendModal,
    closeAddFriendModal,
    isOpenCreateChatModal,
    closeCreateChatModal,
    onAddFriendSuccess,
    onCreateChatSuccess,
  } = useChatController();

  return (
    <MainPageChatContext.Provider value={chatContext}>
      <AddFriendsModal
        isOpen={isOpenAddFriendModal}
        onClose={closeAddFriendModal}
        onAddFriendSuccess={onAddFriendSuccess}
      />
      <CreateChatModal
        isOpen={isOpenCreateChatModal}
        onClose={closeCreateChatModal}
        onCreateChatSuccess={onCreateChatSuccess}
      />
      <div className="flex h-full w-full">
        <MenuBar setIsOpenMenuBar={setIsOpenMenuBar} isOpen={isOpenMenuBar} />
        <div>
          <Outlet />
          {isActive && 'isActive'}
          <p>{userInformation?.id}</p>
        </div>
      </div>
    </MainPageChatContext.Provider>
  );
}

export default ChatMainPage;
