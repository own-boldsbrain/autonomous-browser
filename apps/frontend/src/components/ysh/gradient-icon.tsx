"use client";

import { cn } from "@/lib/utils";

export function GradientIcon({
  iconName,
  size = 24,
  className,
}: {
  iconName: string;
  size?: number;
  className?: string;
}) {
  // Mapeamento de ícones para evitar problemas de serialização no Next.js 15
  const iconSvgPaths: Record<string, string> = {
    sparkles:
      "m9 12 2 2 4-4M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3M3 5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2ZM5 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2ZM12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z",
    rocket:
      "M4.5 16.5c-1.5 1.5-3 3-3 3s1.5-1.5 3-3M10.5 10.5 21 0l-10.5 10.5M13.5 13.5 24 3l-10.5 10.5M4.5 16.5 16.5 4.5",
    zap: "m13 2-3 6h9l-3 6",
    sun: "M12 2v10m0 0L8 8m4 4 4-4M4 12H2m20 0h-2M4 20l1.5-1.5M20 4l-1.5 1.5M4 4l1.5 1.5M20 20l-1.5-1.5",
  };

  const path = iconSvgPaths[iconName.toLowerCase()] || iconSvgPaths.sparkles;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("ysh-text-gradient", className)}
    >
      <path d={path} />
    </svg>
  );
}