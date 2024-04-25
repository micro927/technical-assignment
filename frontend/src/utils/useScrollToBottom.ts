import type { RefObject } from 'react';

export const scrollToBottom = <Element extends HTMLElement>(
  ref: RefObject<Element>,
) => {
  if (!ref.current) {
    return;
  }

  ref.current.scrollTo({
    top: ref.current.scrollHeight,
    behavior: 'smooth',
  });
};
