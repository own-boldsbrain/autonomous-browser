"use client";

import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History } from "lucide-react";
import { motion } from "framer-motion";

type Props = PropsWithChildren<{
  title?: string;
  onBack?: () => void;
  onOpenVersions?: () => void;
  left?: React.ReactNode;   // Toolbar vertical
  right?: React.ReactNode;  // Painel lateral (opcional)
}>;

export function CanvasShell({ title, onBack, onOpenVersions, left, right, children }: Props) {
  return (
    <div className="grid grid-cols-[56px_1fr_320px] grid-rows-[56px_1fr] h-dvh">
      {/* Topbar */}
      <header className="col-span-3 border-b flex items-center gap-2 px-3">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-sm font-medium grow truncate">{title ?? "Canvas"}</h1>
        <Button variant="ghost" size="sm" onClick={onOpenVersions}>
          <History className="size-4 mr-2" /> Versões
        </Button>
      </header>

      {/* Toolbar vertical */}
      <aside className="row-span-1 border-r">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full p-2"
        >
          {left}
        </motion.div>
      </aside>

      {/* Editor */}
      <main className="p-4 overflow-auto">{children}</main>

      {/* Painel direito */}
      <aside className="border-l p-2 hidden md:block">{right}</aside>
    </div>
  );
}