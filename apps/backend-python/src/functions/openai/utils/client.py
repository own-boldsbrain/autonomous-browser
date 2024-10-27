import os
from openai import OpenAI

def openai_client(api_key: str | None = os.getenv("OPENAI_API_KEY")) -> OpenAI:
    if not api_key:
        raise ValueError("API key is required to create OpenAI client")
    return OpenAI(api_key=api_key)