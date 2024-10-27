"use client";
import { Todo, TodoType } from "./Todo";

export function Todos({
  todos,
  level,
  workflowId,
  runId,
}: {
  todos: TodoType[];
  level: number;
  workflowId?: string;
  runId?: string;
}) {
  return (
    <div>
      <ul className="flex flex-col gap-4 py-4 pr-4">
        {todos &&
          todos.map((todo) => (
            <li key={todo.title}>
              <Todo
                todo={todo}
                level={level}
                workflowId={workflowId}
                runId={runId}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
