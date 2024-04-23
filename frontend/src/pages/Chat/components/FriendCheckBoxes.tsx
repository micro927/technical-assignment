import Avatar from '@/components/Avatar';
import type { UserBasicInfo } from '@/services/types/data';
import clsx from 'clsx';
import { useState } from 'react';
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

function FriendCheckboxes<FormValues extends FieldValues>({
  friendList,
  control,
  name,
  className = '',
}: {
  friendList: UserBasicInfo[];
  control: Control<FormValues>;
  name: Path<FormValues>;
  className?: string;
}) {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = useState<(string | null)[]>([]);

  return (
    <>
      {friendList.map(({ id, name: userName }, index) => (
        <label
          key={index}
          className={clsx(
            'flex w-full cursor-pointer items-center gap-4 rounded-lg border border-gray-300 p-2 transition duration-100 hover:bg-gray-200  has-[:checked]:bg-gray-300 has-[:checked]:font-semibold dark:border-gray-600 dark:hover:bg-gray-700 dark:has-[:checked]:bg-gray-500',
            className,
          )}
        >
          <Avatar name={userName} size={24} />
          <p className="text-sm">{userName}</p>
          <input
            onChange={(e) => {
              const valueCopy = [...value];

              // update checkbox value
              valueCopy[index] = e.target.checked ? e.target.value : null;

              // send data to react hook form
              field.onChange(
                valueCopy.filter((value) => typeof value === 'string'),
              );

              // update local state
              setValue(valueCopy);
            }}
            key={id}
            checked={value.includes(id)}
            type="checkbox"
            value={id}
            className="appearance-none"
          />
        </label>
      ))}
    </>
  );
}

export default FriendCheckboxes;
