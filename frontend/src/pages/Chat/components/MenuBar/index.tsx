import useMenuBarController from './controller';
import AddFriendsModal from '../AddFriendsModal';
import Button from '@/components/Button';

function MenuBar() {
  const {
    isOpenAddFriendModal,
    onAddFriendSuccess,
    openAddFriendModal,
    closeAddFriendModal,
  } = useMenuBarController();
  return (
    <div>
      menu bar
      <AddFriendsModal
        isOpen={isOpenAddFriendModal}
        onClose={closeAddFriendModal}
        onAddFriendSuccess={onAddFriendSuccess}
      />
      <Button onClick={openAddFriendModal}> add new friend </Button>
    </div>
  );
}

export default MenuBar;
