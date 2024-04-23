import userService from '@/services/api/user';
import type { AddFriendsRequestBody } from '@/services/types/request';
import type { UserBasicInfo } from '@/services/types/data';
import type { SearchFriendFormValues } from '@/types/chat';
import { createZodObjectSchema } from '@/utils/formValidators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function useAddFriendModalController({
  onClose,
  onAddFriendSuccess,
}: {
  onClose: () => void;
  onAddFriendSuccess?: (count?: number) => void;
}) {
  const [friendsSearchResult, setFriendsSearchResult] = useState<
    UserBasicInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchFriendSchema = createZodObjectSchema('search');
  const addFriendsSchema = createZodObjectSchema('friendIDs');

  const searchForm = useForm<SearchFriendFormValues>({
    mode: 'onChange',
    defaultValues: { search: '' },
    resolver: zodResolver(searchFriendSchema),
  });

  const addFriendsForm = useForm<AddFriendsRequestBody>({
    mode: 'onChange',
    defaultValues: { friendIDs: [] },
    resolver: zodResolver(addFriendsSchema),
  });

  const onSubmitSearch = searchForm.handleSubmit(
    ({ search }: SearchFriendFormValues) => {
      setIsLoading(true);
      userService
        .getUsers({
          search,
          limit: 20,
        })
        .then(({ data }) => {
          setFriendsSearchResult(
            data.map(({ id, name, email }) => ({ id, name, email })),
          );
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          searchForm.setError('root', {
            type: 'validate',
            message: 'Not found this User, please try again.',
          });
        });
    },
  );

  const onSubmitAddFriends = addFriendsForm.handleSubmit(
    ({ friendIDs }: AddFriendsRequestBody) => {
      console.log(friendIDs);

      setIsLoading(true);

      userService
        .postAddFriends({ friendIDs })
        .then(() => {
          setIsLoading(false);
          onAddFriendSuccess?.(friendIDs.length);
          onClickClose();
        })
        .catch(() => {
          setIsLoading(false);
          addFriendsForm.setError('root', {
            type: 'validate',
            message: 'Error, please try again.',
          });
        });
    },
  );

  const onClickClose = () => {
    searchForm.reset();
    addFriendsForm.reset();
    setFriendsSearchResult([]);
    onClose();
  };

  return {
    searchForm,
    onSubmitSearch,
    addFriendsForm,
    onSubmitAddFriends,
    isLoading,
    onClickClose,
    friendsSearchResult,
  };
}

export default useAddFriendModalController;
