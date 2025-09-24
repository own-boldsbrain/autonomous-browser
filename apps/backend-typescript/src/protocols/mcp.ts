import axios, { AxiosInstance } from "axios";
import { AuthConfig, MCPServerInfo, MCPToolDescriptor } from "./types";

export interface MCPClientOptions {
  baseUrl: string;
  auth?: AuthConfig;
  timeoutMs?: number;
}

export interface MCPInvokeOptions {
  toolName: string;
  input: unknown;
  traceId?: string;
}

const DEFAULT_TIMEOUT = 1000 * 20;

export class MCPClient {
  private readonly http: AxiosInstance;

  constructor(private readonly options: MCPClientOptions) {
    if (!options.baseUrl) {
      throw new Error("MCP client requires a baseUrl");
    }

    this.http = axios.create({
      baseURL: options.baseUrl,
      timeout: options.timeoutMs ?? DEFAULT_TIMEOUT,
      headers: this.composeAuthHeaders(options.auth),
    });
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

  async serverInfo(): Promise<MCPServerInfo> {
    const { data } = await this.http.get("/mcp/info");
    return data;
  }

  async listTools(): Promise<MCPToolDescriptor[]> {
    const { data } = await this.http.get("/mcp/tools");
    return data;
  }

  async getTool(toolName: string): Promise<MCPToolDescriptor> {
    const { data } = await this.http.get(`/mcp/tools/${toolName}`);
    return data;
  }

  async invoke<TOutput = unknown>({ toolName, input, traceId }: MCPInvokeOptions) {
    const { data } = await this.http.post(`/mcp/tools/${toolName}/invoke`, {
      input,
      traceId,
    });

    return data as TOutput;
  }

  async listResources<T = unknown>(namespace?: string): Promise<T[]> {
    const { data } = await this.http.get("/mcp/resources", {
      params: { namespace },
    });

    return data;
  }

  async fetchResource<T = unknown>(resourceId: string): Promise<T> {
    const { data } = await this.http.get(`/mcp/resources/${resourceId}`);
    return data;
  }
}
