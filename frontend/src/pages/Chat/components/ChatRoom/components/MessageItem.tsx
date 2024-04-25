import Avatar from '@/components/Avatar';
import clsx from 'clsx';
import { formatDistance } from 'date-fns';

function MessageItem({
  id,
  senderName = '',
  content,
  createdAt = '',
  isMyMessage = true,
}: {
  id: string;
  senderName?: string;
  content: string;
  createdAt?: Date | string;
  isMyMessage: boolean;
}) {
  return (
    <div key={id} className="w-full">
      <div
        className={clsx(
          'flex w-full items-center gap-1',
          isMyMessage ? 'flex-row-reverse self-end' : 'self-start',
        )}
      >
        <Avatar name={senderName} size={32} />
        <div className="flex max-w-[60%] flex-col gap-1  sm:max-w-[40%]">
          <div
            className={clsx(
              isMyMessage ? 'bg-blue-600' : 'bg-blue-800',
              'rounded-2xl px-2 py-2 text-xs font-semibold text-gray-100 md:text-sm ',
            )}
          >
            <p>{content}</p>
          </div>
        </div>
      </div>
      <p
        className={clsx(
          'text-xxs pt-0.5 text-gray-300',
          isMyMessage ? 'text-right' : 'text-left',
        )}
      >
        {createdAt === ''
          ? ''
          : formatDistance(createdAt, new Date(), {
              addSuffix: true,
            })}{' '}
      </p>
    </div>
  );
}

export default MessageItem;
