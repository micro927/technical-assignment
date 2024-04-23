import type { AddFriendsRequestBody } from '@/services/types/request';
import { createZodObjectSchema } from '@/utils/formValidators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import chatService from '@/services/api/chat';

function useCreateChatModalController({
  onClose,
  onCreateChatSuccess,
}: {
  onClose: () => void;
  onCreateChatSuccess?: (chatRoomID?: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const createChatSchema = createZodObjectSchema('friendIDs');

  const createChatForm = useForm<{ friendIDs: string[] }>({
    mode: 'onChange',
    defaultValues: { friendIDs: [] },
    resolver: zodResolver(createChatSchema),
  });

  const onSubmitCreateChat = createChatForm.handleSubmit(
    ({ friendIDs }: AddFriendsRequestBody) => {
      console.log(friendIDs);

      setIsLoading(true);

      chatService
        .postCreateChat({ memberIDs: friendIDs })
        .then(({ data }) => {
          setIsLoading(false);
          onCreateChatSuccess?.(data.chatRoomID);
          onClickClose();
        })
        .catch(() => {
          setIsLoading(false);
          createChatForm.setError('root', {
            type: 'validate',
            message: 'Error, please try again.',
          });
        });
    },
  );

  const onClickClose = () => {
    createChatForm.reset();
    onClose();
  };

  return {
    createChatForm,
    onSubmitCreateChat,
    isLoading,
    onClickClose,
  };
}

export default useCreateChatModalController;
