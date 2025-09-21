"use client";

import { Button } from "@/components/ui/button";

export type Version = { 
  id: string; 
  label: string; 
  createdAt: string;
};

export function VersionHistoryTimeline({ 
  versions, 
  onRestore 
}: {
  versions: Version[];
  onRestore: (id: string) => void;
}) {
  return (
    <ol className="space-y-2">
      {versions.map((v) => (
        <li key={v.id} className="flex items-center justify-between rounded-md border p-2">
          <div>
            <div className="text-sm font-medium">{v.label}</div>
            <div className="text-xs opacity-60">
              {new Date(v.createdAt).toLocaleString()}
            </div>
          </div>
          <Button size="sm" onClick={() => onRestore(v.id)}>
            Restaurar
          </Button>
        </li>
      ))}
    </ol>
  );
}