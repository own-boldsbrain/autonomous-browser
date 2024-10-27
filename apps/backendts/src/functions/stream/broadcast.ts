import { log } from "@restackio/ai/function";
import { stream } from "./stream";

export async function streamEvent({
  workflow,
  event,
}: {
  workflow: {
    workflowId: string;
    runId: string;
  };
  event: unknown;
}) {
  try {
    const broadcastedEvent = stream.broadcast(workflow, event);
    return broadcastedEvent;
  } catch (error) {
    log.error("Error broadcasting event", { error });
    throw error;
  }
}
