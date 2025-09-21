"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function InlineSuggestion({
  text, 
  suggestion, 
  onAccept, 
  onReject,
}: {
  text: string;
  suggestion: string;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-lg border p-3 bg-amber-50 dark:bg-amber-950/20">
      <div className="text-sm opacity-70 mb-2">
        <Badge variant="outline">Sugestão</Badge>
      </div>
      <p className="mb-2 line-through decoration-red-500/60">{text}</p>
      <p className="mb-3 font-medium">{suggestion}</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={onAccept}>Aceitar</Button>
        <Button size="sm" variant="secondary" onClick={onReject}>Rejeitar</Button>
      </div>
    </div>
  );
}