import { m, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  type?: 'fade';
  duration?: number;
  delay?: number;
  show?: boolean;
};

export function Transition({
  children,
  className = '',
  type = 'fade',
  duration = 0.12,
  delay = 0,
  show = true,
}: Props) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  };

  const selectedVariant = variants[type];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <m.div
          className={className}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={selectedVariant}
          transition={{ duration, delay, ease: 'easeIn' }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}
