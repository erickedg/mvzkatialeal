import * as React from "react";
import { motion, type MotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const shineAnimation: MotionProps = {
  initial: { "--x": "100%", scale: 0.9 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.96 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
};

interface ShinyButtonProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<HTMLAnchorElement, ShinyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.a
        ref={ref}
        {...shineAnimation}
        {...props}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full bg-olive px-7 py-4 text-sm font-medium text-primary-foreground transition-shadow duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/25",
          className,
        )}
      >
        <span
          className="relative z-10 inline-flex items-center gap-2"
          style={{
            maskImage:
              "linear-gradient(-75deg, var(--olive) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), var(--olive) calc(var(--x) + 100%))",
            WebkitMaskImage:
              "linear-gradient(-75deg, var(--olive) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), var(--olive) calc(var(--x) + 100%))",
          }}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 block rounded-[inherit] p-[1.5px]"
          style={{
            background:
              "linear-gradient(-75deg, color-mix(in oklch, var(--gold) 15%, transparent) calc(var(--x) + 20%), var(--gold) calc(var(--x) + 30%), color-mix(in oklch, var(--gold) 15%, transparent) calc(var(--x) + 100%))",
            mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            WebkitMask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />
      </motion.a>
    );
  },
);
ShinyButton.displayName = "ShinyButton";
