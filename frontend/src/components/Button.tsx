import { VARIANTS } from '@/constants/variants';
import clsx from 'clsx';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: VARIANTS;
  className?: string;
  isLoading?: boolean;
};

function Button(props: ButtonProps) {
  const { variant, className, isLoading, onClick, disabled, type, children } =
    props;
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition duration-100 md:text-base',
        'button',
        variant || [VARIANTS.PRIMARY],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      children={children}
    />
  );
}

export default Button;
