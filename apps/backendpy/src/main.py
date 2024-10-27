from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import signal
import sys
from .services import run_services

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients = {}
active_connections = set()

@app.get("/stream")
async def stream(request: Request, workflowId: str = "default", runId: str = "default"):
    print("stream", workflowId, runId)

    client_id = f"{workflowId}-{runId}"
    clients[client_id] = asyncio.Queue()

    async def event_generator():
        try:
            while True:
                # Wait for new messages from the service
                message = await clients[client_id].get()
                yield f"data: {message}\n\n"
        except asyncio.CancelledError:
            print(f"Client {client_id} disconnected")
            del clients[client_id]

    headers = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
    }

    return StreamingResponse(event_generator(), headers=headers, media_type="text/event-stream")

# Graceful shutdown
def shutdown():
    print("Server closed")
    sys.exit(0)

signal.signal(signal.SIGTERM, lambda signum, frame: shutdown())
signal.signal(signal.SIGINT, lambda signum, frame: shutdown())

# Start the services
async def start_services():
    try:
        await run_services()
    except Exception as err:
        print("Error running services:", err)

# Run the services
asyncio.run(start_services())
