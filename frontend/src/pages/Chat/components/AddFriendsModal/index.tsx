import Button from '@/components/Button';
import Modal from '@/components/Modal';
import type { BaseModalProps } from '@/types/userInterface';
import useAddFriendModalController from './controller';
import Input from '@/components/Input';
import type { SearchFriendFormValues } from '@/types/chat';
import { HiSearch, HiX } from 'react-icons/hi';
import FriendCheckboxes from '@/pages/Chat/components/FriendCheckBoxes';
import type { AddFriendsRequestBody } from '@/services/types/request';
import type { UserBasicInfo } from '@/services/types/data';

function AddFriendsModal(
  props: BaseModalProps & {
    onAddFriendSuccess: (friends: UserBasicInfo[]) => void;
  },
) {
  const { isOpen, onClose, onAddFriendSuccess } = props;
  const {
    searchForm,
    onSubmitSearch,
    addFriendsForm,
    onSubmitAddFriends,
    friendsSearchResult,
    isLoading,
    onClickClose,
  } = useAddFriendModalController({ onClose, onAddFriendSuccess });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClickClose}
      className="w-[320px] rounded-xl p-4 sm:w-[480px]"
    >
      <div className="flex flex-col items-center justify-center gap-2 p-2">
        <div className="w-full">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold md:text-xl">Add friend</h3>
            <button onClick={onClickClose} className="p-1">
              <HiX size={18} />
            </button>
          </div>
          <hr className="my-4 " />
        </div>
        <div className="w-full">
          <p className="text-left text-xs text-gray-600 md:text-xs dark:text-gray-200">
            Search user by email or name{' '}
            <span className="block sm:inline">(at lease 3 letters)</span>
          </p>
        </div>
        <form
          name="searchForm"
          noValidate
          className="flex w-full gap-2"
          onSubmit={onSubmitSearch}
        >
          <div className="flex-1">
            <Input<SearchFriendFormValues>
              control={searchForm.control}
              placeholder="Please enter email or name"
              name="search"
              rules={{
                required: true,
              }}
              hideErrorMessage
              className="w-full"
              autoComplete="off"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-fit"
            disabled={!searchForm.formState.isValid || isLoading}
          >
            <HiSearch size={18} />
          </Button>
        </form>
        {friendsSearchResult.length > 0 && (
          <form
            name="searchForm"
            noValidate
            className="w-full"
            onSubmit={onSubmitAddFriends}
          >
            <div className="py-6">
              <div className="max-h-[280px] overflow-scroll">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                  <div className="flex w-full flex-col gap-2">
                    <FriendCheckboxes<AddFriendsRequestBody>
                      friendList={friendsSearchResult}
                      control={addFriendsForm.control}
                      name="friendIDs"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!addFriendsForm.formState.isValid || isLoading}
            >
              Add {addFriendsForm.watch('friendIDs').length} friend (s)
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default AddFriendsModal;
