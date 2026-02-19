import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { type ElementType } from 'react';

interface TextShimmerProps {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Tag = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionTag = motion.create(Tag as 'p');
  const dynamicSpread = children.length * spread;

  return (
    <MotionTag
      className={cn(
        'relative inline-block bg-clip-text text-transparent',
        '[--base-color:#a1a1aa] [--base-gradient-color:#ffffff]',
        '[background-size:250%_100%,auto]',
        'bg-[linear-gradient(110deg,var(--base-color)_0%,var(--base-color)_40%,var(--base-gradient-color)_50%,var(--base-color)_60%,var(--base-color)_100%)]',
        className
      )}
      initial={{ backgroundPosition: `${dynamicSpread}% center` }}
      animate={{ backgroundPosition: `-${dynamicSpread}% center` }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
    >
      {children}
    </MotionTag>
  );
}
