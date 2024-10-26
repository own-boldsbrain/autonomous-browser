import {
  streamEvent,
  openaiChatCompletionsStream,
  assistantGetTools,
  todosUpdate,
  toolHnSearch,
  toolUpdateTodos,
} from "./functions";
import { client } from "./client";
import { openaiService } from "@restackio/integrations-openai";

export async function services() {
  const workflowsPath = require.resolve("./workflows");
  try {
    await Promise.all([
      // Start service with current workflows and functions
      client.startService({
        workflowsPath,
        functions: {
          streamEvent,
          openaiChatCompletionsStream,
          assistantGetTools,
          todosUpdate,
          toolHnSearch,
          toolUpdateTodos,
        },
      }),
      openaiService({ client }),
    ]);

    console.log("Services running successfully.");
  } catch (e) {
    console.error("Failed to run services", e);
  }
}

services().catch((err) => {
  console.error("Error running services:", err);
});
