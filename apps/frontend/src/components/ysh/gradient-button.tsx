"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { glow?: boolean };

export const GradientButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, glow, children, ...rest }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-xl ysh-gradient-border px-4 py-2",
        "bg-[var(--geist-bg)] text-[var(--geist-fg)]",
        glow && "shadow-[0_0_0_3px_rgba(250,35,72,.08)]",
        className
      )}
      {...rest}
    >
      <span className="font-medium">{children}</span>
    </motion.button>
  )
);
GradientButton.displayName = "GradientButton";