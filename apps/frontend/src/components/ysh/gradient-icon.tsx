"use client";

import { ComponentType } from "react";
import { cn } from "@/lib/utils";

export function GradientIcon({
  Icon,
  id = "ysh-stroke",
  size = 24,
  className,
}: {
  Icon: ComponentType<React.SVGProps<SVGElement>>;
  id?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn(className)}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="var(--ysh-pink)" />
          <stop offset="35%" stopColor="var(--ysh-orange)" />
          <stop offset="65%" stopColor="var(--ysh-amber)" />
          <stop offset="85%" stopColor="var(--ysh-gold)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <Icon size={size} />
      </g>
    </svg>
  );
}