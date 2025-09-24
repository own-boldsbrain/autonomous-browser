import { log, step } from "@restackio/ai/workflow";
import * as functions from "../functions";

export interface MissionControlInput {
  phase: string;
  intent: string;
  targetAgentId: string;
  payload?: Record<string, unknown>;
  mcpTool?: string;
  mcpInput?: unknown;
}

export interface MissionControlOutput {
  delegated?: unknown;
  mcpResult?: unknown;
  telemetry: {
    phase: string;
    intent: string;
    tools?: unknown;
  };
}

export async function missionControlWorkflow(
  input: MissionControlInput
): Promise<MissionControlOutput> {
  const telemetry: MissionControlOutput["telemetry"] = {
    phase: input.phase,
    intent: input.intent,
  };

  log.info("missionControl:start", { input });

  const delegated = await step<typeof functions>({}).a2aDispatch({
    targetAgentId: input.targetAgentId,
    performative: "request",
    ontology: `ysh.phase.${input.phase}`,
    content: {
      intent: input.intent,
      payload: input.payload ?? {},
    },
  });

  log.info("missionControl:delegated", { delegated });

  let mcpResult: unknown = undefined;

  if (input.mcpTool) {
    if (input.mcpTool === "discover") {
      const tools = await step<typeof functions>({}).listMcpTools();
      telemetry.tools = tools;
    } else {
      mcpResult = await step<typeof functions>({}).mcpInvokeTool({
        toolName: input.mcpTool,
        input: input.mcpInput,
      });
    }
  }

  return {
    delegated,
    mcpResult,
    telemetry,
  };
}
