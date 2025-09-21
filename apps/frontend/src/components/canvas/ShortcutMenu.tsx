"use client";

import { 
  Command, 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";

type Id =
  | "suggest-edits" | "adjust-length-shorter" | "adjust-length-longer"
  | "reading-level" | "final-polish" | "add-emojis"
  | "review-code" | "add-logs" | "add-comments" | "fix-bugs" | "port-language";

export function ShortcutMenu({ 
  open, 
  onOpenChange, 
  onAction 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (id: Id) => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Busque um atalho…" />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          <CommandGroup heading="Escrita">
            <CommandItem onSelect={() => onAction("suggest-edits")}>
              Sugerir edições
            </CommandItem>
            <CommandItem onSelect={() => onAction("adjust-length-shorter")}>
              Encurtar texto
            </CommandItem>
            <CommandItem onSelect={() => onAction("adjust-length-longer")}>
              Alongar texto
            </CommandItem>
            <CommandItem onSelect={() => onAction("reading-level")}>
              Alterar nível de leitura
            </CommandItem>
            <CommandItem onSelect={() => onAction("final-polish")}>
              Ajustes finais
            </CommandItem>
            <CommandItem onSelect={() => onAction("add-emojis")}>
              Adicionar emojis
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Código">
            <CommandItem onSelect={() => onAction("review-code")}>
              Revisar código
            </CommandItem>
            <CommandItem onSelect={() => onAction("add-logs")}>
              Adicionar logs
            </CommandItem>
            <CommandItem onSelect={() => onAction("add-comments")}>
              Adicionar comentários
            </CommandItem>
            <CommandItem onSelect={() => onAction("fix-bugs")}>
              Corrigir bugs
            </CommandItem>
            <CommandItem onSelect={() => onAction("port-language")}>
              Portar linguagem
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}