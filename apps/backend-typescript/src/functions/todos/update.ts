import { openaiChatCompletionsBase } from "@restackio/integrations-openai/functions";
import zodToJsonSchema from "zod-to-json-schema";
import { Todo, todoSchema } from "./types";

export async function todosUpdate({
  prompt,
  todos,
}: {
  prompt: string;
  todos: Todo[];
}) {
  const todosJsonSchema = {
    name: "todos",
    schema: zodToJsonSchema(todoSchema),
  };

  const todoOutput = await openaiChatCompletionsBase({
    userContent: `Update or create todos based on the prompt: ${prompt} and the current todos: ${JSON.stringify(todos)}`,
    jsonSchema: todosJsonSchema,
  });

  const todoResponse = todoOutput.result.choices[0].message.content;

  if (!todoResponse) {
    throw new Error("No todo response");
  }

  const updatedTodos = JSON.parse(todoResponse) as Todo[];

  return updatedTodos;
}
