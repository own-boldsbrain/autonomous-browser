"use server";
import { client } from "./client";

export async function triggerWorkflow({
  workflowName,
  input,
  taskQueue,
  getResult,
}: {
  workflowName: string;
  input: Record<string, unknown>;
  taskQueue?: string;
  getResult?: boolean;
}) {
  if (!workflowName || !input) {
    throw new Error("Workflow name and input are required");
  }

  const workflowId = `${Date.now()}-${workflowName.toString()}`;

  const runId = await client.scheduleWorkflow({
    taskQueue,
    workflowName: workflowName as string,
    workflowId,
    input,
  });

  if (getResult) {
    const { result } = await client.getWorkflowResult({
      workflowId,
      runId,
    });
    return {
      workflowId,
      runId,
      result,
    };
  }

  return {
    workflowId,
    runId,
  };
}
