import { cn } from '@/lib/utils';
import { motion, type Transition } from 'motion/react';
import { type CSSProperties } from 'react';

interface BorderTrailProps {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  style?: CSSProperties;
  onAnimationComplete?: () => void;
}

export function BorderTrail({
  className,
  size = 80,
  transition,
  delay = 0,
  style,
  onAnimationComplete,
}: BorderTrailProps) {
  return (
    <div className='pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent overflow-hidden'>
      <motion.div
        className={cn('absolute aspect-square bg-white/60', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round 8px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 4,
          ease: 'linear',
          repeat: Infinity,
          delay,
          ...transition,
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
