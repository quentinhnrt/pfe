"use client";

import { motion } from "motion/react";
import { forwardRef, type ComponentProps, type ReactNode } from "react";

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const slideInLeft = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export const slideInRight = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export const popUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

export const MotionDiv = motion.div;
export const MotionButton = motion.button;
export const MotionSpan = motion.span;
export const MotionUl = motion.ul;
export const MotionLi = motion.li;
export const MotionImg = motion.img;

interface MotionCardProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
  delay?: number;
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ children, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={slideUp}
        transition={{ duration: 0.3, delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionCard.displayName = "MotionCard";

interface MotionListProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
}

export const MotionList = forwardRef<HTMLDivElement, MotionListProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={staggerContainer}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MotionList.displayName = "MotionList";

interface MotionFloatingButtonProps
  extends ComponentProps<typeof motion.button> {
  children: ReactNode;
}

export const MotionFloatingButton = forwardRef<
  HTMLButtonElement,
  MotionFloatingButtonProps
>(({ children, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});
MotionFloatingButton.displayName = "MotionFloatingButton";
