"use server";
import { client } from "./client";

export async function sendEvent({
  workflowId,
  runId,
  event,
}: {
  workflowId: string;
  runId: string;
  event: {
    name: string;
    input: any;
  };
}) {
  console.log("sending event workflowId", workflowId);
  console.log("sending event runId", runId);

  const sentEvent = await client.sendWorkflowEvent({
    event,
    workflow: {
      workflowId,
      runId,
    },
  });

  console.log("sentEvent", sentEvent);

  return {
    workflowId,
    runId,
    sentEvent,
  };
}
