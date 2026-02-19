import { motion, type Variants } from 'motion/react';
import React, { type ElementType, type ReactNode } from 'react';

type PresetType = 'fade' | 'slide' | 'scale' | 'blur-sm' | 'blur-slide';

const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  fade: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0 },
    },
  },
  scale: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  'blur-sm': {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0, filter: 'blur(4px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
  'blur-slide': {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
  },
};

interface AnimatedGroupProps {
  children: ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
  preset?: PresetType;
  as?: ElementType;
  asChild?: ElementType;
}

export function AnimatedGroup({
  children,
  className,
  variants,
  preset = 'fade',
  as: Tag = 'div',
  asChild: ChildTag = 'div',
}: AnimatedGroupProps) {
  const selectedPreset = presetVariants[preset];
  const containerVariants = variants?.container ?? selectedPreset.container;
  const itemVariants = variants?.item ?? selectedPreset.item;

  const MotionTag = motion.create(Tag as 'div');
  const MotionChildTag = motion.create(ChildTag as 'div');

  return (
    <MotionTag
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, i) => (
        <MotionChildTag
          key={i}
          variants={itemVariants}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {child}
        </MotionChildTag>
      ))}
    </MotionTag>
  );
}
