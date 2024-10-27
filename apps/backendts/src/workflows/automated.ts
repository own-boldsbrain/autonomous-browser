import { step } from "@restackio/ai/workflow";
import * as openaiFunctions from "@restackio/integrations-openai/functions";
import { openaiTaskQueue } from "@restackio/integrations-openai/taskQueue";
import * as functions from "../functions";
import zodToJsonSchema from "zod-to-json-schema";
import { todoSchema } from "../functions/todos/types";

export async function automatedWorkflow() {
  const hnData = await step<typeof functions>({}).toolHnSearch({
    query: "ai",
  });

  const todosJsonSchema = {
    name: "todos",
    schema: zodToJsonSchema(todoSchema),
  };

  const result = await step<typeof openaiFunctions>({
    taskQueue: openaiTaskQueue,
  }).openaiChatCompletionsBase({
    model: "gpt-4o-mini",
    userContent: `
      You are a personal assistant.
      Here is the latest hacker news data:
      ${JSON.stringify(hnData)}
      Create a todo for me to contact the founder with a one sentence summary of their product.`,
    jsonSchema: todosJsonSchema,
  });

  return result;
}
