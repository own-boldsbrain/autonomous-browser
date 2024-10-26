import Restack from "@restackio/ai";
import { FunctionFailure } from "@restackio/ai/function";

export async function scheduleWorkflow({
  parentWorkflow,
}: {
  parentWorkflow: { workflowId: string; runId: string };
}) {
  try {
    const restack = new Restack();
    restack.scheduleWorkflow({
      workflowName: "autonomousWorkflow",
      workflowId: `${parentWorkflow.runId}-schedule`,
      schedule: {
        intervals: [
          {
            every: "10 seconds",
          },
        ],
      },
      input: {
        workflow: parentWorkflow,
      },
    });
  } catch (error) {
    throw FunctionFailure.nonRetryable("Error scheduling workflow");
  }
}
