import { log } from "@restackio/ai/function";
import { z } from "zod";
import {
  createFIPAMessage,
  FIPAPerformative,
  parseFIPAMessage,
  toFIPAEnvelope,
} from "../../protocols";
import { getA2AClient, getMCPClient } from "../../config/agents";

export const a2aDispatchInput = z.object({
  targetAgentId: z.string().min(1, "targetAgentId é obrigatório"),
  performative: z
    .enum([
      "accept-proposal",
      "agree",
      "cancel",
      "cfp",
      "confirm",
      "disconfirm",
      "failure",
      "inform",
      "inform-if",
      "inform-ref",
      "not-understood",
      "propose",
      "proxy",
      "query-if",
      "query-ref",
      "refuse",
      "reject-proposal",
      "request",
      "request-when",
      "request-whenever",
      "subscribe",
    ])
    .optional()
    .default("request"),
  content: z.any(),
  language: z.string().optional(),
  ontology: z.string().optional(),
  protocol: z.string().optional(),
  conversationId: z.string().optional(),
  replyWith: z.string().optional(),
  replyBy: z.string().optional(),
  inReplyTo: z.string().optional(),
});

export type A2ADispatchInput = z.infer<typeof a2aDispatchInput>;

export async function a2aDispatch(input: A2ADispatchInput) {
  const valid = a2aDispatchInput.parse(input);
  const client = getA2AClient();

  const message = createFIPAMessage({
    performative: valid.performative as FIPAPerformative,
    sender: client.getAgentId(),
    receiver: valid.targetAgentId,
    content: valid.content,
    language: valid.language,
    ontology: valid.ontology,
    protocol: valid.protocol,
    conversationId: valid.conversationId,
    replyWith: valid.replyWith,
    replyBy: valid.replyBy,
    inReplyTo: valid.inReplyTo,
  });

  try {
    const response = await client.request({
      targetAgentId: valid.targetAgentId,
      performative: message.performative,
      payload: toFIPAEnvelope(message),
      language: message.language,
      ontology: message.ontology,
      protocol: message.protocol,
      conversationId: message.conversationId,
    });

    if (typeof response === "string") {
      try {
        return parseFIPAMessage(response);
      } catch {
        return response;
      }
    }

    return response;
  } catch (error) {
    log.error("Falha ao despachar mensagem A2A", { error, input: valid });
    throw error;
  }
}

export const mcpInvokeInput = z.object({
  toolName: z.string().min(1, "toolName é obrigatório"),
  input: z.any().optional(),
  traceId: z.string().optional(),
});

export type MCPInvokeInput = z.infer<typeof mcpInvokeInput>;

export async function mcpInvokeTool({ toolName, input, traceId }: MCPInvokeInput) {
  const client = getMCPClient();

  if (!client) {
    throw new Error("Nenhum servidor MCP configurado");
  }

  try {
    const result = await client.invoke({ toolName, input, traceId });
    return result;
  } catch (error) {
    log.error("Falha ao invocar ferramenta MCP", { toolName, error });
    throw error;
  }
}

export async function listMcpTools() {
  const client = getMCPClient();

  if (!client) {
    return [];
  }

  return client.listTools();
}
