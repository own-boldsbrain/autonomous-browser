from dataclasses import dataclass
from pydantic import BaseModel

class TokensCount(BaseModel):
    input: int
    output: int

class Price(BaseModel):
    input: float
    output: float

def openai_cost(tokens_count: TokensCount, price: Price) -> float:
    cost = (tokens_count.input * price.input) + (tokens_count.output * price.output)
    return cost