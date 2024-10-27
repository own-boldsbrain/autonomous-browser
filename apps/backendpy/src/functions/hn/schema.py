from pydantic import BaseModel, Field

class HnSearchInput(BaseModel):
    query: str = Field(default=None, description="The query for search")