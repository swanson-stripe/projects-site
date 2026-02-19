import {
  AnimatePresence,
  motion,
  type AnimatePresenceProps,
  type Transition,
  type Variants,
} from 'motion/react';
import { Children, useEffect, useState } from 'react';

interface TextLoopProps {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  trigger?: boolean;
  mode?: AnimatePresenceProps['mode'];
}

const DEFAULT_VARIANTS: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
};

const DEFAULT_TRANSITION: Transition = {
  duration: 0.35,
  ease: 'easeInOut',
};

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = DEFAULT_TRANSITION,
  variants = DEFAULT_VARIANTS,
  onIndexChange,
  trigger = true,
}: TextLoopProps) {
  const items = Children.toArray(children);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!trigger || items.length < 2) return;
    const id = setInterval(() => {
      setIndex(i => {
        const next = (i + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, interval * 1000);
    return () => clearInterval(id);
  }, [trigger, interval, items.length, onIndexChange]);

  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={index}
          variants={variants}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={transition}
          className='inline-block'
          style={{ whiteSpace: 'nowrap' }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
