import { zodFunction } from "openai/helpers/zod";
import { hnSearchInput } from "./hnSearch";
import { updateTodoInput } from "./updateTodos";
import { a2aDispatchInput, mcpInvokeInput } from "../agents";
import { z } from "zod";

export async function assistantGetTools() {
  return [
    zodFunction({
      name: "updateTodos",
      description: "Update the todos for the user.",
      parameters: updateTodoInput,
    }),
    zodFunction({
      name: "hackernewsSearch",
      description: "Search hacker news",
      parameters: hnSearchInput,
    }),
    zodFunction({
      name: "delegateToAgent",
      description:
        "Delegar subtarefa a outro agente via protocolo A2A com mensagem FIPA-ACL",
      parameters: a2aDispatchInput,
    }),
    zodFunction({
      name: "invokeMcpTool",
      description: "Invocar ferramenta exposta por um servidor MCP",
      parameters: mcpInvokeInput,
    }),
    zodFunction({
      name: "listMcpTools",
      description: "Listar ferramentas MCP disponíveis para delegação",
      parameters: z.object({}).describe("Sem parâmetros"),
    }),
  ];
}
