import { log, step } from "@restackio/ai/workflow";
import * as functions from "../functions";
import { Todo, todoSchema } from "../functions/todos/types";
import zodToJsonSchema from "zod-to-json-schema";
import * as openaiFunctions from "@restackio/integrations-openai/functions";
import { openaiTaskQueue } from "@restackio/integrations-openai/taskQueue";
import { feedbacksMemory, todosMemory } from "./assistant";

export async function autonomousWorkflow({
  workflow,
}: {
  workflow: { workflowId: string; runId: string };
}) {
  const memoryTodos = await step<typeof functions>({}).getWorkflowMemory({
    memoryName: todosMemory.name,
    workflow,
  });

  const memoryFeedback = await step<typeof functions>({}).getWorkflowMemory({
    memoryName: feedbacksMemory.name,
    workflow,
  });

  const hnData = await step<typeof functions>({}).toolHnSearch({
    query: "ai",
  });

  const todosJsonSchema = {
    name: "todos",
    schema: zodToJsonSchema(todoSchema),
  };

  const todoOutput = await step<typeof openaiFunctions>({
    taskQueue: openaiTaskQueue,
  }).openaiChatCompletionsBase({
    model: "gpt-4o-mini",
    userContent: `
      You are a personal assistant.
      Here is the latest hacker news data:
      ${JSON.stringify(hnData)}
      Filter results according to the feedback you received: ${JSON.stringify(memoryFeedback)}.
      The current todos are: ${JSON.stringify(memoryTodos)}.
      Update the todos with new results, avoid duplicates.`,
    jsonSchema: todosJsonSchema,
  });

  const todoResponse = todoOutput.result.choices[0].message.content;

  if (!todoResponse) {
    throw new Error("No todo response");
  }

  const updatedTodos = JSON.parse(todoResponse) as Todo[];

  return updatedTodos;
}
