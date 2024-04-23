import { useMedia } from 'react-use';

export const useMediaSize = () => {
  const isMobile = useMedia('(max-width: 639px)', false);
  const isTablet = useMedia(
    '(min-width: 640px) and (max-width: 1279px)',
    false,
  );
  const isDesktop = useMedia('(min-width: 1280px)', false);

  return { isMobile, isTablet, isDesktop };
};

export const useMediaHeightSize = () => {
  const isShortMobile = useMedia(
    '(max-width: 639px) and (max-height: 600px)',
    false,
  );
  const isTallMobile = useMedia(
    '(max-width: 639px) and (min-height: 900px)',
    false,
  );
  const isLandscapedMobile = useMedia(
    '(max-height: 480px) and (orientation: landscape)',
    false,
  );

  return { isShortMobile, isTallMobile, isLandscapedMobile };
};
