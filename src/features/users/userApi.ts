import { db } from "../../lib/db";
import type { ApiResponse, JsonRecord, UserRecord } from "../../lib/types";

export async function createUser(payload: Omit<UserRecord, "id" | "createdAt" | "updatedAt">) {
  return db.post("/users", payload) as Promise<ApiResponse<UserRecord>>;
}

export async function listUsers(page: number, limit: number) {
  return db.get(`/users?page=${page}&limit=${limit}`) as Promise<ApiResponse<UserRecord[]>>;
}

export async function getUserById(id: string) {
  return db.get(`/users/${id}`) as Promise<ApiResponse<UserRecord | null>>;
}

export async function replaceUser(
  id: string,
  payload: Omit<UserRecord, "id" | "createdAt" | "updatedAt">,
) {
  return db.put(`/users/${id}`, payload) as Promise<ApiResponse<UserRecord | null>>;
}

export async function patchUser(id: string, payload: Partial<JsonRecord>) {
  return db.patch(`/users/${id}`, payload) as Promise<ApiResponse<UserRecord | null>>;
}

export async function removeUser(id: string) {
  return db.delete(`/users/${id}`) as Promise<ApiResponse<null>>;
}

export async function clearUsersCollection() {
  return db.clearCollection("users") as Promise<ApiResponse<null>>;
}

export async function resetDatabase() {
  return db.reset() as Promise<ApiResponse<null>>;
}

export async function listCollections() {
  return db.collections() as Promise<ApiResponse<string[]>>;
}