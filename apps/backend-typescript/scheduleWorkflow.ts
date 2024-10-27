import { client } from "./src/client";

async function scheduleWorkflow() {
  try {
    const workflowId = `${Date.now()}-assistantWorkflow`;
    const runId = await client.scheduleWorkflow({
      taskQueue: "tavus",
      workflowName: "assistantWorkflow",
      workflowId,
    });

    const result = await client.getWorkflowResult({ workflowId, runId });

    console.log("Workflow result:", result);

    process.exit(0); // Exit the process successfully
  } catch (error) {
    console.error("Error scheduling workflow:", error);
    process.exit(1); // Exit the process with an error code
  }
}

scheduleWorkflow();
