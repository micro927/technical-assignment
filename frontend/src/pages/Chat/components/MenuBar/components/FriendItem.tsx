import Avatar from '@/components/Avatar';
import type { UserBasicInfoWithActivity } from '@/types/chat';
import clsx from 'clsx';

function FriendItem({ friend }: { friend: UserBasicInfoWithActivity }) {
  const { name, online } = friend;

  return (
    <div className="flex w-full items-center justify-between rounded-lg p-2 transition duration-100">
      <div className="flex w-fit flex-auto items-center gap-2 overflow-hidden">
        <div>
          <Avatar name={name} />
        </div>
        <p className="truncate text-sm text-slate-700 dark:text-slate-100">
          {name}
        </p>
      </div>

      <div className="min-w-fit">
        <div
          className={clsx(
            'h-2 w-2 rounded-full shadow',
            online ? 'bg-green-600' : 'bg-gray-300',
          )}
        />
      </div>
    </div>
  );
}

export default FriendItem;
