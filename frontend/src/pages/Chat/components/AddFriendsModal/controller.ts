import userService from '@/services/api/user';
import type { AddFriendsRequestBody } from '@/services/types/request';
import type { UserBasicInfo } from '@/services/types/data';
import type { SearchFriendFormValues } from '@/types/chat';
import { createZodObjectSchema } from '@/utils/formValidators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import chatService from '@/services/api/chat';
import { useNavigate } from 'react-router-dom';

function useAddFriendModalController({
  onClose,
  onAddFriendSuccess,
}: {
  onClose: () => void;
  onAddFriendSuccess: (friends: UserBasicInfo[]) => void;
}) {
  const navigate = useNavigate();
  const [friendsSearchResult, setFriendsSearchResult] = useState<
    UserBasicInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedSuccessIDs, setAddedSuccessIDs] = useState<string[]>([]);
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
          limit: 30,
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
      setIsLoading(true);
      userService
        .postAddFriends({ friendIDs })
        .then((data) => {
          setIsLoading(false);
          onAddFriendSuccess(data);
          setAddedSuccessIDs(friendIDs);
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

  const startChatWithFriend = (friendIDs: string[]) => {
    setIsLoading(true);
    chatService
      .postCreateChat({ memberIDs: friendIDs })
      .then(({ data }) => {
        setIsLoading(false);
        navigate(data.id);
        onClickClose();
      })
      .catch(() => {
        setIsLoading(false);
        onClickClose();
      });
  };

  const onClickClose = () => {
    onClose();
    searchForm.reset();
    addFriendsForm.reset();
    setFriendsSearchResult([]);
    setAddedSuccessIDs([]);
  };

  return {
    searchForm,
    onSubmitSearch,
    addFriendsForm,
    onSubmitAddFriends,
    isLoading,
    onClickClose,
    friendsSearchResult,
    addedSuccessIDs,
    startChatWithFriend,
  };
}

export default useAddFriendModalController;
