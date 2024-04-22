import Button from '@/components/Button';
import Modal from '@/components/Modal';
import type { BaseModalProps } from '@/types/userInterface';
import useAddFriendModalController from './controller';
import Input from '@/components/Input';
import type { SearchFriendFormValues } from '@/types/userFriend';

function AddFriendsModal(
  props: BaseModalProps & {
    onAddFriendSuccess?: (friendId?: string) => void;
  },
) {
  const { isOpen, onClose, onAddFriendSuccess } = props;
  const {
    control,
    onSubmit,
    formState,
    addFriend,
    friendSearchResult,
    isLoading,
    onClickClose,
  } = useAddFriendModalController({ onClose });

  const { isValid } = formState;

  return (
    <Modal isOpen={isOpen} onClose={onClickClose}>
      <div>
        <form
          name="loginForm"
          noValidate
          className="flex w-full max-w-[240px] flex-col justify-center md:max-w-[360px]"
          onSubmit={onSubmit}
        >
          <div className="flex w-full flex-col">
            <Input<SearchFriendFormValues>
              control={control}
              placeholder="Please enter your search data"
              name="search"
              rules={{
                required: true,
              }}
              className="w-full"
              autoFocus
            />
          </div>
          {!isLoading && <div>{friendSearchResult?.id}</div>}
          {!isLoading && <div>{friendSearchResult?.name}</div>}
          <Button onClick={onSubmit}>Search</Button>
        </form>
        {isValid && (
          <Button onClick={() => addFriend(onAddFriendSuccess)}>
            Add friend
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default AddFriendsModal;
