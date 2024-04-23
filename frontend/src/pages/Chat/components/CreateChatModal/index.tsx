import Button from '@/components/Button';
import Modal from '@/components/Modal';
import type { BaseModalProps } from '@/types/userInterface';
import { HiX } from 'react-icons/hi';
import FriendCheckboxes from '@/pages/Chat/components/FriendCheckBoxes';
import type { AddFriendsRequestBody } from '@/services/types/request';
import { useContext } from 'react';
import { ChatContext } from '../..';
import useCreateChatModalController from './controller';

function CreateChatModal(
  props: BaseModalProps & {
    onCreateChatSuccess?: (chatRoomID?: string) => void;
  },
) {
  const { isOpen, onClose, onCreateChatSuccess } = props;
  const { createChatForm, onSubmitCreateChat, isLoading, onClickClose } =
    useCreateChatModalController({ onClose, onCreateChatSuccess });
  const { friendList } = useContext(ChatContext);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClickClose}
      className="w-[320px] rounded-xl p-4 sm:w-[480px]"
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 p-2">
        <div className="w-full">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold md:text-xl">
              Create new chat
            </h3>
            <button onClick={onClickClose} className="p-1">
              <HiX size={18} />
            </button>
          </div>
          <div className="w-full">
            <p className="mt-1 text-left text-xs text-gray-600 md:text-xs dark:text-gray-200">
              Select your friends to chat with
            </p>
          </div>
          <hr className="mt-4" />
        </div>

        {friendList.length > 0 && (
          <form
            name="createChat"
            noValidate
            className="w-full"
            onSubmit={onSubmitCreateChat}
          >
            <div className="py-5">
              <div className="max-h-[280px] overflow-scroll">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                  <div className="flex w-full flex-col gap-2">
                    <FriendCheckboxes<AddFriendsRequestBody>
                      friendList={friendList}
                      control={createChatForm.control}
                      name="friendIDs"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!createChatForm.formState.isValid || isLoading}
            >
              Create with {createChatForm.watch('friendIDs').length} member (s)
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default CreateChatModal;
