import axios, { AxiosInstance } from "axios";
import { randomUUID } from "crypto";
import { AgentEnvelope, A2AEndpoint, AuthConfig } from "./types";

export interface A2AClientOptions {
  agentId: string;
  agentLabel?: string;
  endpoints: A2AEndpoint[];
  auth?: AuthConfig;
  timeoutMs?: number;
}

export interface A2AHandshakePayload {
  agentId: string;
  label?: string;
  capabilities: string[];
  transports: string[];
  metadata?: Record<string, unknown>;
}

export interface A2AInvokeOptions<TPayload = unknown> {
  targetAgentId: string;
  performative?: string;
  payload: TPayload;
  language?: string;
  ontology?: string;
  protocol?: string;
  conversationId?: string;
}

export type SSEHandler<T = unknown> = (payload: T) => void | Promise<void>;

const DEFAULT_TIMEOUT = 1000 * 30;

export class A2AClient {
  private readonly httpClients: AxiosInstance[];

  constructor(private readonly options: A2AClientOptions) {
    if (!options.agentId) {
      throw new Error("A2A client requires an agentId");
    }

    if (!options.endpoints?.length) {
      throw new Error("A2A client requires at least one endpoint");
    }

    this.httpClients = options.endpoints
      .filter((endpoint) => endpoint.protocol === "http" || !endpoint.protocol)
      .map((endpoint) =>
        axios.create({
          baseURL: endpoint.url,
          timeout: options.timeoutMs ?? DEFAULT_TIMEOUT,
          headers: this.composeAuthHeaders(options.auth),
        })
      );
  }

  getAgentId() {
    return this.options.agentId;
  }

  private composeAuthHeaders(auth?: AuthConfig) {
    const headers: Record<string, string> = {};

    if (!auth) {
      return headers;
    }

    if (auth.apiKey) {
      headers["x-api-key"] = auth.apiKey;
    }

    if (auth.bearerToken) {
      headers.Authorization = `Bearer ${auth.bearerToken}`;
    }

    if (auth.basic) {
      const credentials = Buffer.from(
        `${auth.basic.username}:${auth.basic.password}`
      ).toString("base64");
      headers.Authorization = `Basic ${credentials}`;
    }

    return headers;
  }

  async handshake(payload: Partial<A2AHandshakePayload> = {}) {
    const basePayload: A2AHandshakePayload = {
      agentId: this.options.agentId,
      label: this.options.agentLabel,
      capabilities: payload.capabilities ?? [],
      transports:
        payload.transports ??
        this.options.endpoints.map((endpoint) => endpoint.protocol ?? "http"),
      metadata: payload.metadata,
    };

    const responses = await Promise.allSettled(
      this.httpClients.map((client) => client.post("/a2a/handshake", basePayload))
    );

    const success = responses.filter((response) => response.status === "fulfilled");

    if (!success.length) {
      throw new Error("A2A handshake failed for every configured endpoint");
    }

    return success.map((res) => (res as PromiseFulfilledResult<any>).value?.data);
  }

  async send<TContent = unknown>(
    options: A2AInvokeOptions<TContent>
  ): Promise<AgentEnvelope | undefined> {
    const envelope: AgentEnvelope = {
      performative: options.performative ?? "inform",
      sender: this.options.agentId,
      receiver: options.targetAgentId,
      language: options.language ?? "json",
      ontology: options.ontology ?? "default",
      protocol: options.protocol ?? "a2a",
      conversationId: options.conversationId ?? randomUUID(),
      timestamp: new Date().toISOString(),
      content: options.payload,
    };

    const responses = await Promise.allSettled(
      this.httpClients.map((client) => client.post("/a2a/send", envelope))
    );

    const success = responses.find((response) => response.status === "fulfilled");

    if (!success) {
      throw new Error("A2A send failed");
    }

    return (success as PromiseFulfilledResult<any>).value?.data as AgentEnvelope;
  }

  async request<TRequest, TResponse = unknown>(
    options: A2AInvokeOptions<TRequest>
  ): Promise<TResponse> {
    const response = await this.send<TRequest>(options);

    if (!response) {
      throw new Error("A2A request did not receive a response envelope");
    }

    return response.content as TResponse;
  }

  async subscribe<TPayload = unknown>(
    targetAgentId: string,
    handler: SSEHandler<TPayload>,
    abortSignal?: AbortSignal
  ) {
    const sseEndpoints = this.options.endpoints.filter(
      (endpoint) => endpoint.protocol === "sse"
    );

    if (!sseEndpoints.length) {
      throw new Error("No SSE endpoint configured for subscription");
    }

    const endpoint = sseEndpoints[0];
    const response = await fetch(`${endpoint.url}/a2a/stream/${targetAgentId}`, {
      headers: this.composeAuthHeaders(this.options.auth),
      signal: abortSignal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Failed to subscribe to A2A stream: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");

      while (boundary !== -1) {
        const chunk = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 2);

        if (chunk.startsWith("data:")) {
          const data = chunk.replace("data:", "").trim();

          if (data) {
            const parsed = JSON.parse(data) as AgentEnvelope<TPayload>;
            await handler(parsed.content);
          }
        }

        boundary = buffer.indexOf("\n\n");
      }
    }
  }
}
