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
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={isComplete ? "line-through" : ""}>
            <input
              type="checkbox"
              id={`complete-${todo.title}`}
              name="complete"
              className="mr-2"
              checked={isComplete}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={`complete-${todo.title}`}>{todo.title}</label>
          </CardTitle>
          <div>
            {todo.type === "hn" && (
              <Image
                src="/yc-logo.svg"
                alt={todo.type}
                width={22}
                height={22}
              />
            )}
          </div>
        </div>
        <CardDescription className="flex flex-col gap-2">
          <p>{todo.timestamp}</p>
          <p>{todo.description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {todo.sources.map((source) => (
            <a href={source} target="_blank" rel="noreferrer">
              {source}
            </a>
          ))}
        </div>
      </CardContent>
      {level > 1 && workflowId && runId && (
        <CardFooter className="flex gap-2">
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
          >
            <ThumbsDown className="h-[1rem] w-[1rem]" />
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
          >
            <ThumbsUp className="h-[1rem] w-[1rem]" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
