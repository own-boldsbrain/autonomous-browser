"use client";

import { cn } from "@/lib/utils";

export function GradientCard({
  title,
  children,
  className,
}: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl ysh-gradient-border bg-elev", className)}>
      <div className="p-4">
        <h3 className="text-lg font-semibold ysh-text-gradient">{title}</h3>
        <div className="mt-2 text-[var(--geist-fg-muted)]">{children}</div>
      </div>
    </section>
  );
}