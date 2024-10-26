import { z } from "zod";

export const todoSchema = z.object({
  todos: z.array(
    z.object({
      type: z
        .enum(["hn", "normal", "high"])
        .describe("Is the todo from Hacker News or just a normal todo."),
      title: z.string().describe("The title of the todo."),
      description: z
        .string()
        .describe("The description of the todo in a few sentences."),
      timestamp: z.string().describe("The timestamp of the todo."),
      completed: z.boolean().describe("Whether the todo has been completed."),
      irrelevant: z.boolean().describe("Whether the todo is irrelevant."),
      sources: z
        .array(z.string())
        .describe("The urls associated with the todo."),
    })
  ),
});

export type Todo = z.infer<typeof todoSchema>;
