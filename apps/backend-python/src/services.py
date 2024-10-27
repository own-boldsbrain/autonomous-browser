import asyncio
from src.functions.openai.chat import openai_todos
from src.functions.hn.search import tool_hn_search
from src.client import client
from src.workflows.automated import AutomatedWorkflow

async def main():

    await client.start_service({
        "workflows": [AutomatedWorkflow],
        "functions": [openai_todos, tool_hn_search]
    })

def run_services():
    asyncio.run(main())

if __name__ == "__main__":
    run_services()