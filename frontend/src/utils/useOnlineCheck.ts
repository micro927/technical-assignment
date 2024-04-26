import { useCallback, useEffect, useState } from 'react';

function useOnlineCheck({ onBackToOnline }: { onBackToOnline?: () => void }) {
  const [isOnline, setIsOnline] = useState(true);

  const onOnline = useCallback(() => {
    if (isOnline === false) {
      setIsOnline(() => {
        return true;
      });
      setTimeout(() => onBackToOnline?.());
    }
  }, [isOnline, onBackToOnline]);

  const onOffline = () => {
    setIsOnline(false);
  };

  useEffect(() => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return { isOnline };
}

export default useOnlineCheck;
