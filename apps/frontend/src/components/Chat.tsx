"use client";

import { Message } from "@/lib/types";

export function Chat({ messages }: { messages: Map<string, Message> }) {
  const messageArray = [...messages.values()];

  return (
    <section className="p-4" aria-label="Histórico de mensagens do chat">
      <h2 className="sr-only">Mensagens do Chat</h2>
      <div role="log" aria-live="polite" aria-atomic="false" className="space-y-2">
        {messageArray.map((message, index) => (
          <article
            className={`p-2 rounded-lg text-sm ${
              message.role === "user"
                ? "bg-gray-500 dark:bg-gray-600 text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
            key={message.input.chunkId || index}
            role="article"
            aria-label={`Mensagem ${index + 1} de ${message.role === "user" ? "usuário" : "sistema"}`}
          >
            <div className="sr-only">
              {message.role === "user" ? "Você disse:" : "Sistema respondeu:"}
            </div>
            <pre className="whitespace-pre-wrap" aria-label="Conteúdo da mensagem">
              {message.input.response}
            </pre>
          </article>
        ))}
        {messageArray.length === 0 && (
          <div role="status" aria-live="polite" className="text-center text-muted-foreground py-4">
            Nenhuma mensagem ainda. Comece uma conversa!
          </div>
        )}
      </div>
    </section>
  );
}
