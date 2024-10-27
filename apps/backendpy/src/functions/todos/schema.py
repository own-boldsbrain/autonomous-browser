from pydantic import BaseModel, Field
from typing import List, Literal

class TodoSchema(BaseModel):
    
    class TodoItem(BaseModel):
      type: Literal['hn', 'normal', 'high'] = Field(..., description="Is the todo from Hacker News or just a normal todo.")
      title: str = Field(..., description="The title of the todo.")
      description: str = Field(..., description="The description of the todo in a few sentences.")
      timestamp: str = Field(..., description="The timestamp of the todo.")
      completed: bool = Field(..., description="Whether the todo has been completed.")
      irrelevant: bool = Field(..., description="Whether the todo is irrelevant.")
      sources: List[str] = Field(..., description="The urls associated with the todo.")
      
    todos: List[TodoItem]