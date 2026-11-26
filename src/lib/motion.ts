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
