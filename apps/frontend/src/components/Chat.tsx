"use client";

import { Message } from "@/lib/types";

export function Chat({ messages }: { messages: Map<string, Message> }) {
  return (
    <div className="p-4">
      <ul className="space-y-2">
        {[...messages.values()].map((message) => (
          <li
            className={`p-2 rounded-lg text-sm ${
              message.role === "user"
                ? "bg-gray-500 dark:bg-gray-600 text-white"
                : ""
            }`}
            key={message.input.chunkId}
          >
            <pre className="whitespace-pre-wrap">{message.input.response}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
