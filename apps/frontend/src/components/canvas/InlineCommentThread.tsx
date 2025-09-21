"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

type Comment = { 
  id: string; 
  author: string; 
  text: string; 
  createdAt: string;
};

export function InlineCommentThread({
  comments, 
  onReply,
}: {
  comments: Comment[];
  onReply: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  
  return (
    <div className="rounded-lg border">
      <ScrollArea className="max-h-64 p-3">
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar className="size-8">
                <AvatarFallback>{c.author[0]}</AvatarFallback>
              </Avatar>
              <div className="grow">
                <div className="text-xs opacity-60">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div className="text-sm">{c.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <form
        className="flex gap-2 p-3 border-t"
        onSubmit={(e) => { 
          e.preventDefault(); 
          if (draft.trim()) { 
            onReply(draft.trim()); 
            setDraft(""); 
          } 
        }}
      >
        <Textarea 
          value={draft} 
          onChange={(e) => setDraft(e.target.value)} 
          placeholder="Responder…" 
        />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}