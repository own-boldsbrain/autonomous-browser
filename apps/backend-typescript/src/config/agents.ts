import { A2AClient, A2AClientOptions, MCPClient, MCPClientOptions } from "../protocols";

let a2aClient: A2AClient | null = null;
let mcpClient: MCPClient | null = null;

function parseA2AEndpoint(raw: string) {
  const [url, protocol] = raw.split("|");

  return {
    url: url.trim(),
    protocol: (protocol?.trim() as A2AClientOptions["endpoints"][number]["protocol"]) ?? "http",
  };
}

function a2aClientOptionsFromEnv(): A2AClientOptions {
  const agentId = process.env.A2A_AGENT_ID || "ysh-hub";
  const agentLabel = process.env.A2A_AGENT_LABEL || "YSH Agent Hub";
  const rawEndpoints = process.env.A2A_ENDPOINTS || "http://localhost:8081";

  const endpoints = rawEndpoints
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map(parseA2AEndpoint);

  return {
    agentId,
    agentLabel,
    endpoints,
    auth: process.env.A2A_API_KEY
      ? {
          apiKey: process.env.A2A_API_KEY,
        }
      : undefined,
  };
}

function mcpClientOptionsFromEnv(): MCPClientOptions | null {
  const baseUrl = process.env.MCP_BASE_URL;

  if (!baseUrl) {
    return null;
  }

  return {
    baseUrl,
    auth: process.env.MCP_API_KEY
      ? {
          apiKey: process.env.MCP_API_KEY,
        }
      : undefined,
  };
}

export function getA2AClient() {
  if (!a2aClient) {
    a2aClient = new A2AClient(a2aClientOptionsFromEnv());
  }

  return a2aClient;
}

export function getMCPClient() {
  const options = mcpClientOptionsFromEnv();

  if (!options) {
    return null;
  }

  if (!mcpClient) {
    mcpClient = new MCPClient(options);
  }

  return mcpClient;
}

export async function initializeAgentTransport() {
  const client = getA2AClient();

  try {
    await client.handshake({
      capabilities: (process.env.A2A_AGENT_CAPABILITIES || "").split(",").filter(Boolean),
      metadata: {
        project: "ysh-erp",
        environment: process.env.NODE_ENV ?? "development",
      },
    });
  } catch (error) {
    console.warn("A2A handshake failed", error);
  }

  const mcp = getMCPClient();

  if (mcp) {
    try {
      await mcp.serverInfo();
    } catch (error) {
      console.warn("MCP server health check failed", error);
    }
  }
}
