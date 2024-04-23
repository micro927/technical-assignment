import type { SetState } from '@/types/utils';
import { useMediaSize } from '@/utils/useMediaSize';
import { useEffect } from 'react';

function useMenuBarController({
  setIsOpenMenuBar,
}: {
  setIsOpenMenuBar: SetState<boolean>;
}) {
  const { isMobile } = useMediaSize();

  useEffect(() => {
    setIsOpenMenuBar(false);
  }, [isMobile, setIsOpenMenuBar]);

  return { isMobile };
}

export default useMenuBarController;
