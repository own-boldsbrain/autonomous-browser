from dotenv import load_dotenv
from restack_ai.function import function
from pydantic import BaseModel
from .completions_base import openai_chat_completion_base, OpenAIChatInput
import os
load_dotenv()

class FunctionInputParams(BaseModel):
    user_content: str
    message_schema: dict

@function.defn(name="OpenaiGreet")
async def openai_greet(input: FunctionInputParams) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key is not set. Please set the OPENAI_API_KEY environment variable.")

    response = openai_chat_completion_base(
        OpenAIChatInput(
            user_content=input.user_content,
            model="gpt-4o-mini",
            json_schema=input.message_schema,
            api_key=api_key,
        )
    )
    return response.result.choices[0].message.content
