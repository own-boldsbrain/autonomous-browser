from openai import OpenAI

def openai_client(api_key: str) -> OpenAI:
    if not api_key:
        raise ValueError("api_key is required")

    return OpenAI(api_key=api_key)
