import type { AddFriendsRequestBody } from '@/services/types/request';
import { createZodObjectSchema } from '@/utils/formValidators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import chatService from '@/services/api/chat';
import type { ChatInfo } from '@/services/types/data';

function useCreateChatModalController({
  onClose,
  onCreateChatSuccess,
}: {
  onClose: () => void;
  onCreateChatSuccess: (chatInfo: ChatInfo, isExisted: boolean) => void;
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
      setIsLoading(true);
      chatService
        .postCreateChat({ memberIDs: friendIDs })
        .then(({ data, status }) => {
          const isExisted = status !== 201;
          setIsLoading(false);
          onCreateChatSuccess(data, isExisted);
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
