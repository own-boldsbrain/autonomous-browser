import { AgentEnvelope } from "./types";

export type FIPAPerformative =
  | "accept-proposal"
  | "agree"
  | "cancel"
  | "cfp"
  | "confirm"
  | "disconfirm"
  | "failure"
  | "inform"
  | "inform-if"
  | "inform-ref"
  | "not-understood"
  | "propose"
  | "proxy"
  | "query-if"
  | "query-ref"
  | "refuse"
  | "reject-proposal"
  | "request"
  | "request-when"
  | "request-whenever"
  | "subscribe";

export interface FIPAMessage<TContent = unknown>
  extends AgentEnvelope<TContent> {
  performative: FIPAPerformative;
  language?: string;
  ontology?: string;
  protocol?: string;
  conversationId?: string;
  replyWith?: string;
  replyBy?: string;
  inReplyTo?: string;
  receiver: string | string[];
}

export interface CreateFIPAMessageOptions<TContent = unknown> {
  performative: FIPAPerformative;
  sender: string;
  receiver: string | string[];
  content: TContent;
  language?: string;
  ontology?: string;
  protocol?: string;
  conversationId?: string;
  replyWith?: string;
  replyBy?: string;
  inReplyTo?: string;
}

export function createFIPAMessage<TContent = unknown>(
  options: CreateFIPAMessageOptions<TContent>
): FIPAMessage<TContent> {
  if (!options.sender) {
    throw new Error("FIPA message requires a sender");
  }

  if (!options.receiver) {
    throw new Error("FIPA message requires at least one receiver");
  }

  if (!options.performative) {
    throw new Error("FIPA message requires a performative");
  }

  return {
    performative: options.performative,
    sender: options.sender,
    receiver: options.receiver,
    language: options.language ?? "json",
    ontology: options.ontology ?? "default",
    protocol: options.protocol ?? "fipa-acl",
    conversationId: options.conversationId,
    replyWith: options.replyWith,
    replyBy: options.replyBy,
    inReplyTo: options.inReplyTo,
    timestamp: new Date().toISOString(),
    content: options.content,
  };
}

export function toFIPAEnvelope<TContent = unknown>(
  message: FIPAMessage<TContent>
): AgentEnvelope<TContent> {
  return {
    performative: message.performative,
    sender: message.sender,
    receiver:
      Array.isArray(message.receiver) && message.receiver.length === 1
        ? message.receiver[0]
        : Array.isArray(message.receiver)
        ? message.receiver.join(",")
        : message.receiver,
    language: message.language,
    ontology: message.ontology,
    protocol: message.protocol,
    conversationId: message.conversationId,
    replyWith: message.replyWith,
    inReplyTo: message.inReplyTo,
    timestamp: message.timestamp,
    content: message.content,
  };
}

export function assertFIPAMessage(message: Partial<FIPAMessage>): asserts message is FIPAMessage {
  if (!message.performative) {
    throw new Error("Invalid FIPA message: missing performative");
  }
  if (!message.sender) {
    throw new Error("Invalid FIPA message: missing sender");
  }
  if (!message.receiver) {
    throw new Error("Invalid FIPA message: missing receiver");
  }
  if (typeof message.content === "undefined") {
    throw new Error("Invalid FIPA message: missing content");
  }
}

export function serializeFIPAMessage(message: FIPAMessage): string {
  return JSON.stringify(message);
}

export function parseFIPAMessage<TContent = unknown>(
  payload: string
): FIPAMessage<TContent> {
  const parsed = JSON.parse(payload) as FIPAMessage<TContent>;
  assertFIPAMessage(parsed);
  return parsed;
}
