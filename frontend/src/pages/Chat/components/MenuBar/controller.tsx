import { useState } from 'react';

function useMenuBarController() {
  const [isOpenAddFriendModal, setIsOpenAddFriendModal] = useState(false);

  const openAddFriendModal = () => setIsOpenAddFriendModal(true);
  const closeAddFriendModal = () => setIsOpenAddFriendModal(false);

  const onAddFriendSuccess = (friendID?: string) => {
    console.log(friendID);
  };

  return {
    onAddFriendSuccess,
    isOpenAddFriendModal,
    openAddFriendModal,
    closeAddFriendModal,
  };
}

export default useMenuBarController;
