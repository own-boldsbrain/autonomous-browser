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
    <section aria-label="Lista de tarefas" className="todos-container">
      <h2 className="sr-only">Tarefas</h2>
      {todos && todos.length > 0 ? (
        <ul
          className="flex flex-col gap-4 py-4 pr-4"
          role="list"
          aria-label={`${todos.length} tarefa${todos.length !== 1 ? 's' : ''} disponível${todos.length !== 1 ? 'is' : ''}`}
        >
          {todos.map((todo) => (
            <li key={todo.title} role="listitem">
              <Todo
                todo={todo}
                level={level}
                workflowId={workflowId}
                runId={runId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className="text-center text-muted-foreground py-8"
        >
          Nenhuma tarefa disponível no momento.
        </div>
      )}
    </section>
  );
}
