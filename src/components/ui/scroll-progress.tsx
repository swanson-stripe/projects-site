import { cn } from '@/lib/utils';
import { motion, useScroll, useSpring } from 'motion/react';

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 right-0 h-px origin-left z-50',
        className
      )}
      style={{
        scaleX,
        background: '#f0468c',
      }}
    />
  );
}
