import type { Variants } from 'framer-motion';

export const EMIL_EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EMIL_EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 32,
};

export const SPRING_MODAL = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 28,
};

export const CARD_VIEWPORT = {
  once: true,
  margin: '-32px',
} as const;

export const HERO_STAGGER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.04,
    },
  },
};

export const HERO_ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EMIL_EASE_OUT },
  },
};
