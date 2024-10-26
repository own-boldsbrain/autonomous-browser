import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";
import { workflowInfo } from "@restackio/ai/workflow";
import { Todo } from "../functions/todos/types";
import { streamEvent, FeedbackEvent } from "./assistant";

export async function updateTodosWorkflow({
  prompt,
  todos,
  memoryFeedback,
}: {
  prompt: string;
  todos: Todo[];
  memoryFeedback?: FeedbackEvent[];
}) {
  const { workflowId, runId } = workflowInfo().parent!;

  const updatedTodos = await step<typeof functions>({}).todosUpdate({
    prompt,
    todos,
  });

  await step<typeof functions>({}).streamEvent({
    workflow: { workflowId, runId },
    event: { type: "todos", data: updatedTodos },
  });

  const streamResponse = await step<typeof functions>(
    {}
  ).openaiChatCompletionsStream({
    newMessage: `
        You are a personal assistant.
        You just updated todos from ${JSON.stringify(todos)} to: ${JSON.stringify(updatedTodos)}.
        In a short sentence, describe the changes you made.
        ${memoryFeedback ? `Take into account the feedback you received: ${JSON.stringify(memoryFeedback)}` : ""}
        `,
    model: "gpt-4o",
    streamEvent: {
      workflowEventName: streamEvent.name,
    },
  });

  const assistantMessage =
    streamResponse?.result.messages[streamResponse.result.messages.length - 1]
      .content;

  return {
    todos: updatedTodos,
    assistantMessage: assistantMessage,
  };
}
