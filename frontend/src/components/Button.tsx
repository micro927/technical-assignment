import { VARIANTS } from '@/constants/variants';
import clsx from 'clsx';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: VARIANTS;
  className?: string;
  isLoading?: boolean;
  outline?: boolean;
};

function Button(props: ButtonProps) {
  const {
    variant,
    outline,
    className,
    isLoading,
    onClick,
    disabled,
    type,
    children,
  } = props;
  return (
    <button
      onClick={onClick}
      className={clsx(
        'h-9 rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition duration-100 md:h-10 md:text-base',
        'button',
        variant || [VARIANTS.PRIMARY],
        outline && 'outline',
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      children={children}
    />
  );
}

export default Button;
