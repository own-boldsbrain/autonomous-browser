import * as React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendEvent } from "@/app/actions/sendEvent";
import Image from "next/image";
export type TodoType = {
  title: string;
  description: string;
  type: "hn" | "normal";
  completed: boolean;
  timestamp: string;
  irrelevant: boolean;
  sources: string[];
};

export function Todo({
  todo,
  level,
  workflowId,
  runId,
}: {
  todo: TodoType;
  level: number;
  workflowId?: string;
  runId?: string;
}) {
  const [isComplete, setIsComplete] = React.useState(todo.completed);

  React.useEffect(() => {
    setIsComplete(todo.completed);
  }, [todo.completed]);

  const handleCheckboxChange = () => {
    setIsComplete(!isComplete);
  };

  return (
    <Card className="w-full" role="article" aria-labelledby={`todo-title-${todo.title.replace(/\s+/g, '-').toLowerCase()}`}>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle
            id={`todo-title-${todo.title.replace(/\s+/g, '-').toLowerCase()}`}
            className={isComplete ? "line-through" : ""}
          >
            <input
              type="checkbox"
              id={`complete-${todo.title.replace(/\s+/g, '-').toLowerCase()}`}
              name="complete"
              className="mr-2 focus:ring-2 focus:ring-primary"
              checked={isComplete}
              onChange={handleCheckboxChange}
              aria-describedby={`todo-desc-${todo.title.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <label
              htmlFor={`complete-${todo.title.replace(/\s+/g, '-').toLowerCase()}`}
              className="cursor-pointer"
            >
              {todo.title}
            </label>
          </CardTitle>
          <div>
            {todo.type === "hn" && (
              <Image
                src="/yc-logo.svg"
                alt="Y Combinator"
                width={22}
                height={22}
              />
            )}
          </div>
        </div>
        <CardDescription
          id={`todo-desc-${todo.title.replace(/\s+/g, '-').toLowerCase()}`}
          className="flex flex-col gap-2"
        >
          <time dateTime={new Date(todo.timestamp).toISOString()}>{todo.timestamp}</time>
          <p>{todo.description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap" role="list" aria-label="Fontes relacionadas">
          {todo.sources.map((source, index) => (
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              key={source}
              role="listitem"
              className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
              aria-label={`Fonte ${index + 1}: ${source}`}
            >
              Fonte {index + 1}
            </a>
          ))}
        </div>
      </CardContent>
      {level > 1 && workflowId && runId && (
        <CardFooter className="flex gap-2" role="group" aria-label="Feedback da tarefa">
          <Button
            size="icon"
            variant="destructive"
            onClick={() =>
              sendEvent({
                workflowId,
                runId,
                event: { name: "feedback", input: { todo, positive: false } },
              })
            }
            aria-label="Feedback negativo para esta tarefa"
            title="Não gostei desta tarefa"
          >
            <ThumbsDown className="h-[1rem] w-[1rem]" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            onClick={() =>
              sendEvent({
                workflowId,
                runId,
                event: { name: "feedback", input: { todo, positive: true } },
              })
            }
            aria-label="Feedback positivo para esta tarefa"
            title="Gostei desta tarefa"
          >
            <ThumbsUp className="h-[1rem] w-[1rem]" aria-hidden="true" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
