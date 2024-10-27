from dotenv import load_dotenv
from restack_ai.function import function, log
from pydantic import BaseModel
from src.functions.openai.client import openai_client
from src.functions.todos.schema import TodoSchema

import os
load_dotenv()

class FunctionInputParams(BaseModel):
    user_content: str

@function.defn(name="OpenaiTodos")
async def openai_todos(input: FunctionInputParams):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key is not set. Please set the OPENAI_API_KEY environment variable.")

    client = openai_client(api_key)

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": input.user_content},
        ],
        response_format=TodoSchema,
    )

    message = completion.choices[0].message
    if message.parsed:
        return message.parsed
    else:
        log.error("parsed error", message.refusal)