/**
 * Centralized animation variants for consistent motion across the app.
 * Uses the Motion library for declarative animations.
 */

export const pageTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30,
};

// Slide from right - for navigating forward/deeper
export const slideRightVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -20,
  },
};

// Scale + fade - for selection/option screens
export const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
  },
};

// Stagger container for option grids
export const optionGridVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
  },
};

// Individual option card entrance
export const optionItemVariants = {
  initial: {
    opacity: 0,
    y: 15,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
};

// Staggered list animations
export const listContainerVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
  },
};

export const listItemVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};

// Icon swap animation (for copy button)
export const iconSwapVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.5,
  },
};

export const iconSwapTransition = {
  duration: 0.15,
};

// Card hover effects for option cards
export const cardVariants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 20,
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
  },
};

// Fade in animation for simple reveals
export const fadeInVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const fadeTransition = {
  duration: 0.2,
};

// Back button animation
export const backButtonVariants = {
  initial: { x: 0 },
  hover: { x: -2 },
  tap: { x: -4 },
};

export const backButtonTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 20,
};
