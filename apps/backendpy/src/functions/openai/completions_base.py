from openai.types.chat import ChatCompletion
from pydantic import BaseModel
from .utils.cost import Price, TokensCount, openai_cost
from .utils.client import openai_client


class OpenAIChatInput(BaseModel):
    user_content: str
    system_content: str | None = None
    model: str | None = None
    json_schema: dict = {
        "name": str,
        "description": str
    }
    price: Price | None = None
    api_key: str = ""
    max_tokens: int | None = None
    temperature: float | None = None
    top_p: float | None = None
    n: int | None = None
    stop: list[str] | None = None
    presence_penalty: float | None = None
    frequency_penalty: float | None = None

class OpenAIChatOutput(BaseModel):
    result: ChatCompletion
    cost: float


def openai_chat_completion_base(input: OpenAIChatInput) -> OpenAIChatOutput:
    if not input.api_key:
        raise ValueError("api_key is required")

    client = openai_client(api_key=input.api_key)

    messages = []

    if input.system_content:
        messages.append({"role": "system", "content": input.system_content})

    messages.append({"role": "user", "content": input.user_content})

    chat_params = {
        "model": input.model or "gpt-4o-mini",
        "messages": messages,
    }

    for param in ["max_tokens", "temperature", "top_p", "n", "stop", "presence_penalty", "frequency_penalty"]:
        if getattr(input, param) is not None:
            chat_params[param] = getattr(input, param)

    result = client.chat.completions.create(**chat_params)

    tokens_count = TokensCount(
        input=result.usage.prompt_tokens,
        output=result.usage.completion_tokens
    )
    cost = openai_cost(tokens_count, input.price) if input.price else 0

    return OpenAIChatOutput(result=result, cost=cost)