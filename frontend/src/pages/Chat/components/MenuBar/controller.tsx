import { LayoutOutletContext } from '@/types/userInterface';
import type { SetState } from '@/types/utils';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function useMenuBarController({
  setIsOpenMenuBar,
}: {
  setIsOpenMenuBar: SetState<boolean>;
}) {
  const { isMobile } = useOutletContext<LayoutOutletContext>();

  useEffect(() => {
    setIsOpenMenuBar(!isMobile);
  }, [isMobile, setIsOpenMenuBar]);

  return { isMobile };
}

export default useMenuBarController;
