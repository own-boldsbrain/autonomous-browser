"use client";

import { motion } from "framer-motion";
import { Wand2, Text, BookOpenCheck, Type, Sparkles, Bug, FileCode2, Languages, AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ToolId =
  | "suggest-edits" | "adjust-length-shorter" | "adjust-length-longer"
  | "reading-level" | "final-polish" | "add-emojis"
  | "review-code" | "add-logs" | "add-comments" | "fix-bugs" | "port-language";

export type Tool = { 
  id: ToolId; 
  label: string; 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  onClick: () => void;
};

const ICONS: Record<ToolId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "suggest-edits": Wand2,
  "adjust-length-shorter": AlignLeft,
  "adjust-length-longer": AlignLeft,
  "reading-level": BookOpenCheck,
  "final-polish": Sparkles,
  "add-emojis": Type,
  "review-code": FileCode2,
  "add-logs": Text,
  "add-comments": Text,
  "fix-bugs": Bug,
  "port-language": Languages
};

export function VerticalToolbar({ tools, active }: { tools: Tool[]; active?: ToolId }) {
  return (
    <TooltipProvider delayDuration={100}>
      <ul className="flex flex-col gap-1">
        {tools.map((t) => {
          const Icon = ICONS[t.id];
          return (
            <li key={t.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={t.onClick}
                    className={cn(
                      "h-10 w-10 grid place-items-center rounded-lg",
                      active === t.id ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"
                    )}
                    aria-label={t.label}
                    title={t.label}
                  >
                    <Icon className="size-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {t.label}
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
}