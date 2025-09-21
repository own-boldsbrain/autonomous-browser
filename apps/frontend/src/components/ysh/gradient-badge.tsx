"use client";

import { cn } from "@/lib/utils";

export function GradientBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        "bg-[var(--geist-bg-soft)] text-[var(--geist-fg)] ysh-gradient-border",
        className
      )}
    >
      {children}
    </span>
  );
}