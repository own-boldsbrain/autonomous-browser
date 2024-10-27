import asyncio
from src.functions.openai.chat import openai_greet
from src.client import client
from src.workflows.test import OpenaiGreetWorkflow

async def main():

    await client.start_service({
        "workflows": [OpenaiGreetWorkflow],
        "functions": [openai_greet]
    })

def run_services():
    asyncio.run(main())

if __name__ == "__main__":
    run_services()