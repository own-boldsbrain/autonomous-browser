import { ServerResponse } from "http";

type Client = {
  workflowId: string;
  runId: string;
  res: ServerResponse;
};

export class Stream {
  private clients: Map<string, Client> = new Map();

  addClient(client: Client) {
    this.clients.set(client.runId, client);
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
  }

  broadcast(workflow: { workflowId: string; runId: string }, event: unknown) {
    this.clients.forEach((client) => {
      if (
        client.workflowId === workflow.workflowId &&
        client.runId === workflow.runId
      ) {
        client.res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    });
  }
}

export const stream = new Stream();
