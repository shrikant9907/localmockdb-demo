import { db } from "./db";

const demoTodos = [
  {
    title: "Plan homepage sections",
    notes: "Finalize hero, features, and CTA blocks.",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-04-25",
  },
  {
    title: "Record package demo video",
    notes: "Keep it under 90 seconds and show CRUD flow.",
    priority: "medium",
    status: "todo",
    dueDate: "2026-04-28",
  },
  {
    title: "Ship npm README update",
    notes: "Add live demo link and quick start examples.",
    priority: "low",
    status: "done",
    dueDate: "2026-04-20",
  },
] as const;

export async function seedTodosCollection(): Promise<void> {
  const response = await db.get("/todos");

  if (!response.success) {
    return;
  }

  const todos = Array.isArray(response.data) ? response.data : [];

  if (todos.length > 0) {
    return;
  }

  for (const todo of demoTodos) {
    await db.post("/todos", todo);
  }
}
