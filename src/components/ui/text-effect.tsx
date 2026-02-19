import { cn } from '@/lib/utils';
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'motion/react';
import React, { type ElementType } from 'react';

type PresetType = 'blur-sm' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';
type PerType = 'word' | 'char' | 'line';

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  'blur-sm': {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: {
      hidden: { opacity: 0, filter: 'blur(6px)', y: 4 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
    },
  },
  'fade-in-blur': {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
  },
  scale: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  fade: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
};

interface TextEffectProps {
  children: string;
  per?: PerType;
  as?: ElementType;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  style?: React.CSSProperties;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  speedReveal?: number;
  speedSegment?: number;
}

function splitText(text: string, per: PerType): string[] {
  if (per === 'char') return text.split('');
  if (per === 'line') return text.split('\n');
  return text.split(/(\s+)/);
}

export function TextEffect({
  children,
  per = 'word',
  as: Tag = 'p',
  variants,
  className,
  preset = 'fade-in-blur',
  delay = 0,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  style,
  containerTransition,
  segmentTransition,
  speedReveal = 1,
  speedSegment = 1,
}: TextEffectProps) {
  const segments = splitText(children, per);
  const selectedVariants = presetVariants[preset] ?? presetVariants['fade-in-blur'];
  const containerVariants = variants?.container ?? selectedVariants.container;
  const itemVariants = variants?.item ?? selectedVariants.item;

  const defaultContainerTransition: Transition = {
    staggerChildren: 0.03 / speedReveal,
    delayChildren: delay,
    ...containerTransition,
  };

  const defaultItemTransition: Transition = {
    duration: 0.3 / speedSegment,
    ...segmentTransition,
  };

  const MotionTag = motion.create(Tag as 'p');

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={containerVariants}
          transition={defaultContainerTransition}
          className={className}
          style={style}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
        >
          {segments.map((segment, i) => (
            <motion.span
              key={`${segment}-${i}`}
              variants={itemVariants}
              transition={defaultItemTransition}
              className={cn(
                per === 'line' ? 'block' : 'inline-block',
                segmentWrapperClassName
              )}
            >
              {segment === ' ' ? '\u00A0' : segment}
            </motion.span>
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
