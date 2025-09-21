"use client";

import { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

export function GradientIcon({
  Icon,
  size = 24,
  className,
}: {
  Icon: ComponentType<LucideProps>;
  size?: number;
  className?: string;
}) {
  return <Icon size={size} className={cn("ysh-text-gradient", className)} />;
}