import userService from '@/services/api/user';
import type { UserBasicInfo } from '@/services/types/schema';
import type { SearchFriendFormValues } from '@/types/userFriend';
import { createZodObjectSchema } from '@/utils/formValidators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function useAddFriendModalController({ onClose }: { onClose: () => void }) {
  const [friendSearchResult, setFriendSearchResult] = useState<UserBasicInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const searchFriendSchema = createZodObjectSchema('search');

  const { control, handleSubmit, setError, formState, reset } =
    useForm<SearchFriendFormValues>({
      mode: 'onChange',
      defaultValues: { search: '' },
      resolver: zodResolver(searchFriendSchema),
    });

  const onSubmit = handleSubmit((formData: SearchFriendFormValues) => {
    setIsLoading(true);
    const { search } = formData;
    userService
      .getUsers({
        search,
        limit: 1,
      })
      .then(({ data }) => {
        setFriendSearchResult(data[0]);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError('root', {
          type: 'validate',
          message: 'Not found this User, please try again.',
        });
      });
  });

  const addFriend = (onAddFriendSuccess?: (friendID?: string) => void) => {
    if (friendSearchResult) {
      userService.postAddFriend({ id: friendSearchResult?.id }).then(() => {
        onAddFriendSuccess?.(friendSearchResult?.id);
        onClose();
      });
    }
  };

  const onClickClose = () => {
    reset();
    setFriendSearchResult(undefined);
    onClose();
  };

  return {
    control,
    onSubmit,
    formState,
    addFriend,
    friendSearchResult,
    isLoading,
    onClickClose,
  };
}

export default useAddFriendModalController;
