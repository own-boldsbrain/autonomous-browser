"use client";

export function Chat({
  messages,
  level,
}: {
  messages: Map<string, any>;
  level: number;
}) {
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
