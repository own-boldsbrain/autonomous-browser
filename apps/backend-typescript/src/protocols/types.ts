export type TransportProtocol = "http" | "https" | "sse" | "json-rpc";

export interface AgentEnvelope<TContent = unknown> {
  performative: string;
  sender: string;
  receiver: string | string[];
  language?: string;
  ontology?: string;
  conversationId?: string;
  replyWith?: string;
  inReplyTo?: string;
  protocol?: string;
  timestamp?: string;
  content: TContent;
}

export interface AuthConfig {
  apiKey?: string;
  bearerToken?: string;
  basic?: {
    username: string;
    password: string;
  };
}

export interface A2AEndpoint {
  url: string;
  protocol?: TransportProtocol;
  description?: string;
}

export interface MCPToolDescriptor {
  name: string;
  description: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
}

export interface MCPServerInfo {
  name: string;
  version: string;
  capabilities: string[];
}
