import clsx from 'clsx';

const Loading = ({ className }: { className?: string }) => {
  return <div className={clsx(className, 'skeleton-loader-box my-0.5 h-7')} />;
};

export default Loading;
