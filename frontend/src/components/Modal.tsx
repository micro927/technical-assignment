import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { BaseModalProps } from '@/types/userInterface';

function Modal({ children, isOpen, onClose, className }: BaseModalProps) {
  useEffect(() => {
    if (document) {
      document.onkeydown = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
          onClose();
        }
      };

      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="fixed inset-0 z-40 h-screen w-screen overflow-hidden bg-gray-600 bg-opacity-50 backdrop-blur-sm"
              onClick={onClose}
            ></motion.div>
            <motion.dialog
              style={{ maxWidth: '720px' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  type: 'spring',
                  duration: 0.4,
                },
              }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
              className={clsx(
                className,
                'fixed z-50 overflow-scroll bg-gray-100 text-gray-900 shadow-xl dark:bg-gray-800 dark:text-white',
              )}
              open
            >
              {children}
            </motion.dialog>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Modal;
