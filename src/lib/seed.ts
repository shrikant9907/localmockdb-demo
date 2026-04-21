import { db } from "./db";

const initialUsers = [
  {
    name: "Shrikant",
    email: "shrikant@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Aman",
    email: "aman@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    name: "Priya",
    email: "priya@example.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    name: "Neha",
    email: "neha@example.com",
    role: "Support",
    status: "Active",
  },
  {
    name: "Rohit",
    email: "rohit@example.com",
    role: "Editor",
    status: "Pending",
  },
  {
    name: "Kiran",
    email: "kiran@example.com",
    role: "Viewer",
    status: "Active",
  },
];

export async function seedUsersCollection(): Promise<void> {
  const response = await db.get("/users");

  if (!response.success) {
    return;
  }

  const users = Array.isArray(response.data) ? response.data : [];

  if (users.length > 0) {
    return;
  }

  for (const user of initialUsers) {
    await db.post("/users", user);
  }
}