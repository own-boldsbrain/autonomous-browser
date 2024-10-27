import { zodFunction } from "openai/helpers/zod";
import { hnSearchInput } from "./hnSearch";
import { updateTodoInput } from "./updateTodos";

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
  ];
}
