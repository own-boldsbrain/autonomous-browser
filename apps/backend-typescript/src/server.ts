import express from "express";
import { Server } from "http";
import { stream } from "./functions/stream/stream";
import { services } from "./services";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));

app.get("/stream", (req: express.Request, res: express.Response) => {
  console.log("stream", req.query);

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const workflowId = req.query.workflowId || "default";
  const runId = req.query.runId || "default";

  stream.addClient({
    workflowId: `local-${workflowId}`,
    runId: `${runId}`,
    res,
  });

  req.on("close", () => stream.removeClient(runId as string));
});

const server = new Server(app);
server.listen(3334, () => {
  console.log("Server listening on http://localhost:3334");
});

// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start the services
services().catch((err) => {
  console.error("Error running services:", err);
});
