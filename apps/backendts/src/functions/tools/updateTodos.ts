import { z } from "zod";

export const updateTodoInput = z.object({
  prompt: z.string().describe("The prompt used to update the todos"),
});

export type UpdateTodoInput = z.infer<typeof updateTodoInput>;

export async function toolUpdateTodos({ prompt }: UpdateTodoInput) {
  return prompt;
}
