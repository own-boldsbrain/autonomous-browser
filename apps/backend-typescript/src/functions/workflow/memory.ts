import Restack from "@restackio/ai";

export async function getWorkflowMemory({
  memoryName,
  workflow,
}: {
  memoryName: string;
  workflow: { workflowId: string; runId: string };
}) {
  const { workflowId, runId } = workflow;
  const restack = new Restack();
  const workflowMemory = await restack.getWorkflowMemory({
    workflowId,
    runId,
    memoryName,
  });
  return workflowMemory;
}
