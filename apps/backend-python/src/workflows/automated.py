from src.restack_ai.workflow import workflow, workflow_import
from datetime import timedelta
from pydantic import BaseModel
from src.functions.hn.schema import HnSearchInput

with workflow_import():
    from src.functions.openai.chat import openai_todos, FunctionInputParams
    from src.functions.hn.search import tool_hn_search
class WorkflowInputParams(BaseModel):
    pass

@workflow.defn(name="automatedWorkflow")
class AutomatedWorkflow:
    @workflow.run
    async def run(self, input: WorkflowInputParams):

        hn_results = await workflow.step(tool_hn_search, HnSearchInput(query="ai"), start_to_close_timeout=timedelta(seconds=10))

        user_content = f"You are a personal assistant. Here is the latest hacker news data: {str(hn_results)} Create a todo for me to contact the founder with a one sentence summary of their product"

        result = await workflow.step(openai_todos, FunctionInputParams(user_content=user_content), start_to_close_timeout=timedelta(seconds=10))

        return {"result": result}