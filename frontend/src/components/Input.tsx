import clsx from 'clsx';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

function Input<FormValues extends FieldValues>(
  props: UseControllerProps<FormValues> &
    React.ComponentProps<'input'> & {
      label?: string;
      type?: React.HTMLInputTypeAttribute;
      className?: string;
      hideErrorMessage?: boolean;
      key?: string | number;
    },
) {
  const { field, fieldState } = useController(props);
  const { invalid, error } = fieldState;
  const { label, type, className } = props;
  return (
    <div className="flex flex-col gap-0 md:gap-1">
      {label && (
        <label className="text-xxs text-gray-600 md:text-xs dark:text-white">
          {label}
        </label>
      )}
      <input
        key={props.key}
        type={type ?? 'text'}
        {...field}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        autoComplete={props.autoComplete}
        className={clsx(
          'h-9 rounded-lg border px-2 py-1 text-xs text-gray-900 shadow-sm outline-orange-900 disabled:bg-gray-200 md:h-10 md:text-sm',
          invalid
            ? 'outline-red-400 dark:outline-rose-400'
            : '!outline-blue-500 dark:!outline-blue-400',
          className,
        )}
      />
      {!props?.hideErrorMessage && (
        <p className="text-xxs m-1  text-right  text-rose-600 md:text-xs dark:text-rose-400">
          {invalid && error?.message}
        </p>
      )}
    </div>
  );
}

export default Input;
