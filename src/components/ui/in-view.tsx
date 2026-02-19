import { motion, useInView, type Variants, type Transition, type UseInViewOptions } from 'motion/react';
import { type ElementType, type ReactNode, useRef } from 'react';

interface InViewProps {
  children: ReactNode;
  variants?: {
    hidden: Variants['hidden'];
    visible: Variants['visible'];
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: ElementType;
  once?: boolean;
  className?: string;
}

export function InView({
  children,
  variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  viewOptions,
  as: Tag = 'div',
  once = true,
  className,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, ...viewOptions });

  const MotionTag = motion.create(Tag as 'div');

  return (
    <MotionTag
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants as Variants}
      transition={transition}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
