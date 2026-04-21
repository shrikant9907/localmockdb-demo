import { db } from "../../lib/db";
import type { ApiResponse, JsonRecord, TodoRecord } from "../../lib/types";

export type TodoPayload = Omit<TodoRecord, "id" | "createdAt" | "updatedAt">;

export async function createTodo(payload: TodoPayload) {
  return db.post("/todos", payload) as Promise<ApiResponse<TodoRecord>>;
}

export async function listTodos(page: number, limit: number) {
  return db.get(`/todos?page=${page}&limit=${limit}`) as Promise<ApiResponse<TodoRecord[]>>;
}

export async function getTodoById(id: string) {
  return db.get(`/todos/${id}`) as Promise<ApiResponse<TodoRecord | null>>;
}

export async function replaceTodo(id: string, payload: TodoPayload) {
  return db.put(`/todos/${id}`, payload) as Promise<ApiResponse<TodoRecord | null>>;
}

export async function patchTodo(id: string, payload: Partial<JsonRecord>) {
  return db.patch(`/todos/${id}`, payload) as Promise<ApiResponse<TodoRecord | null>>;
}

export async function removeTodo(id: string) {
  return db.delete(`/todos/${id}`) as Promise<ApiResponse<null>>;
}

export async function clearTodosCollection() {
  return db.clearCollection("todos") as Promise<ApiResponse<null>>;
}

export async function resetDatabase() {
  return db.reset() as Promise<ApiResponse<null>>;
}

export async function listCollections() {
  return db.collections() as Promise<ApiResponse<string[]>>;
}
