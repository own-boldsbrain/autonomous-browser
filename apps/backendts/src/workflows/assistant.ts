import { log, step } from "@restackio/ai/workflow";
import * as functions from "../functions";
import { condition, executeChild } from "@restackio/ai/workflow";
import { defineEvent, onEvent } from "@restackio/ai/event";
import { StreamEvent } from "@restackio/integrations-openai/types";
import { ToolCallEvent } from "@restackio/integrations-openai/types";
import { Todo } from "../functions/todos/types";
import { updateTodosWorkflow } from "./updateTodos";

export type TodoEventInput = {
  message: string;
};

export type FeedbackEvent = {
  todo: Todo;
  positive: boolean;
};

export const todoEvent = defineEvent<TodoEventInput>("todoEvent");
export const toolCallEvent = defineEvent<ToolCallEvent>("toolCall");
export const streamEvent = defineEvent<StreamEvent>("stream");

export const todoEndEvent = defineEvent("todoEndEvent");

export const feedbackEvent = defineEvent<FeedbackEvent>("feedback");

export async function assistantWorkflow() {
  let todos: Todo[] = [];
  let memoryFeedback: FeedbackEvent[] = [];

  let todoEnded = false;

  let openaiChatMessages: any[] = [
    {
      role: "system",
      content: `You are a personal assistant.
        Only if user explicitely ask you to search hacker news, search it.
        After you answer, another assistant will use your answer to update the todos based on your response.
        Never mention the todos, as the user will see the created todos on a separate panel.`,
    },
  ];

  const tools = await step<typeof functions>({}).assistantGetTools();

  onEvent(todoEvent, async ({ message }: TodoEventInput) => {
    const result = await step<typeof functions>({}).openaiChatCompletionsStream(
      {
        messages: openaiChatMessages,
        newMessage: `${message}. Take into account the feedback you received: ${JSON.stringify(memoryFeedback)}`,
        model: "gpt-4o",
        streamEvent: {
          workflowEventName: streamEvent.name,
        },
        tools,
        toolEvent: {
          workflowEventName: toolCallEvent.name,
        },
      }
    );

    const messages = result?.result?.messages;

    if (messages) {
      openaiChatMessages = messages;

      if (
        messages[messages.length - 1]?.role === "assistant" &&
        messages[messages.length - 1]?.content
      ) {
        const lastAssistantMessage = messages[messages.length - 1].content;

        const { todos: updatedTodos } = await executeChild(
          updateTodosWorkflow,
          {
            workflowId: `${new Date().getTime()}}-updateTodosWorkflow`,
            args: [
              {
                prompt: lastAssistantMessage as string,
                todos,
                memoryFeedback,
              },
            ],
          }
        );

        todos = updatedTodos;
      }
    }

    return {
      message,
    };
  });

  onEvent(toolCallEvent, async ({ function: toolFunction }: ToolCallEvent) => {
    log.info("toolCallEvent", { toolFunction });

    async function callFunction(toolFunction: ToolCallEvent["function"]) {
      const moderatorStep = step<typeof functions>({});

      switch (toolFunction.name) {
        case "hackernewsSearch":
          const hnData = await moderatorStep.toolHnSearch(
            toolFunction.input as unknown as functions.HnSearchInput
          );

          log.info("hackernewsSearch", { hnData });

          return hnData;

        case "updateTodos":
          const prompt = await moderatorStep.toolUpdateTodos(
            toolFunction.input as unknown as functions.UpdateTodoInput
          );

          const { todos: updatedTodos } = await executeChild(
            updateTodosWorkflow,
            {
              workflowId: `${new Date().getTime()}-updateTodosWorkflow`,
              args: [
                {
                  prompt,
                  todos,
                  memoryFeedback,
                },
              ],
            }
          );

          todos = updatedTodos;

          return todos;
        default:
          throw new Error(`Unknown function name: ${toolFunction.name}`);
      }
    }

    const toolResult = await callFunction(toolFunction);

    log.info("toolResult", { toolResult });

    openaiChatMessages.push({
      content: JSON.stringify(toolResult),
      role: "function",
      name: toolFunction.name,
    });

    await step<typeof functions>({}).openaiChatCompletionsStream({
      model: "gpt-4o",
      messages: openaiChatMessages,
      tools,
      toolEvent: {
        workflowEventName: toolCallEvent.name,
      },
      streamAtCharacter: "",
      streamEvent: {
        workflowEventName: streamEvent.name,
      },
    });

    return { function: toolFunction };
  });

  onEvent(feedbackEvent, async ({ todo, positive }: FeedbackEvent) => {
    log.info("feedbackEvent", { todo, positive });
    memoryFeedback.push({ todo, positive });
    return { todo, positive };
  });

  onEvent(todoEndEvent, async () => {
    todoEnded = true;
  });

  await condition(() => todoEnded);

  return;
}
