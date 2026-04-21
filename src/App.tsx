import { useEffect, useMemo, useState } from "react";
import SectionCard from "./components/SectionCard";
import ResponseViewer from "./components/ResponseViewer";
import PatchUserForm from "./features/users/PatchUserForm";
import UserForm, { type UserFormValues } from "./features/users/UserForm";
import UsersTable from "./features/users/UsersTable";
import {
  clearUsersCollection,
  createUser,
  getUserById,
  listCollections,
  listUsers,
  patchUser,
  removeUser,
  replaceUser,
  resetDatabase,
} from "./features/users/userApi";
import { seedUsersCollection } from "./lib/seed";
import type { ApiResponse, JsonValue, UserRecord } from "./lib/types";

const pageSize = 5;

export default function App() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [page, setPage] = useState(1);
  const [collections, setCollections] = useState<string[]>([]);
  const [latestResponse, setLatestResponse] = useState<JsonValue | null>(null);
  const [singleUserResponse, setSingleUserResponse] = useState<JsonValue | null>(null);
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [meta, setMeta] = useState<ApiResponse<UserRecord[]>["meta"] | undefined>();

  const selectedUser = useMemo(() => {
    return users.find((user) => user.id === selectedId) ?? null;
  }, [selectedId, users]);

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    await seedUsersCollection();
    await refreshCollections();
    await refreshUsers(1);
  }

  async function refreshCollections() {
    const response = await listCollections();

    if (response.success && Array.isArray(response.data)) {
      setCollections(response.data);
    }
  }

  async function refreshUsers(nextPage = page) {
    const response = await listUsers(nextPage, pageSize);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);

    if (!response.success || !Array.isArray(response.data)) {
      setUsers([]);
      setMeta(response.meta);
      setSelectedId("");
      return;
    }

    setUsers(response.data);
    setMeta(response.meta);
    setPage(nextPage);

    if (response.data.length === 0) {
      setSelectedId("");
      return;
    }

    const hasSelectedUser = response.data.some((user) => user.id === selectedId);

    if (!hasSelectedUser) {
      setSelectedId(response.data[0].id);
    }
  }

  async function handleCreate(values: UserFormValues) {
    const response = await createUser(values);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    await refreshCollections();
    await refreshUsers(1);
  }

  async function handleReplace(values: UserFormValues) {
    if (!selectedId) {
      setStatusMessage("Select a user first.");
      return;
    }

    const response = await replaceUser(selectedId, values);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    await refreshUsers(page);
  }

  async function handlePatch(payload: { role?: string; status?: string }) {
    if (!selectedId) {
      setStatusMessage("Select a user first.");
      return;
    }

    const response = await patchUser(selectedId, payload);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    await refreshUsers(page);
  }

  async function handleFetchSingle() {
    if (!selectedId) {
      setStatusMessage("Select a user first.");
      return;
    }

    const response = await getUserById(selectedId);
    setSingleUserResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
  }

  async function handleDelete() {
    if (!selectedId) {
      setStatusMessage("Select a user first.");
      return;
    }

    const response = await removeUser(selectedId);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    await refreshCollections();

    const nextPage = page > 1 && users.length === 1 ? page - 1 : page;
    await refreshUsers(nextPage);
    setSingleUserResponse(null);
  }

  async function handleClearCollection() {
    const response = await clearUsersCollection();
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    setSingleUserResponse(null);
    await refreshCollections();
    await refreshUsers(1);
  }

  async function handleResetDatabase() {
    const response = await resetDatabase();
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    setSingleUserResponse(null);
    setCollections([]);
    await initialize();
  }

  async function handleSeedDemo() {
    await seedUsersCollection();
    await refreshCollections();
    await refreshUsers(1);
    setStatusMessage("Demo users ready.");
  }

  const totalPages = meta?.totalPages ?? 1;

  return (
    <main className="app-shell">
      <header className="hero">
        <span className="badge">React + localmockdb</span>
        <h1>localmockdb Complete Demo</h1>
        <p className="hero__text">
          Test create, list, single read, replace, patch, delete, pagination, clear
          collection, reset database, and localStorage persistence in one React app.
        </p>

        <div className="hero__actions">
          <button className="button button--primary" onClick={() => void handleSeedDemo()}>
            Seed demo users
          </button>
          <button className="button button--ghost" onClick={() => void refreshUsers(page)}>
            Refresh list
          </button>
        </div>
      </header>

      <section className="status-bar">
        <div>
          <strong>Status:</strong> {statusMessage}
        </div>
        <div>
          <strong>Collections:</strong> {collections.length > 0 ? collections.join(", ") : "None"}
        </div>
      </section>

      <div className="layout-grid">
        <SectionCard
          title="Users collection"
          description="This table is loaded from localmockdb. Data stays after refresh because the package uses localStorage."
          actions={
            <div className="inline-actions">
              <button className="button button--ghost" onClick={() => void handleFetchSingle()}>
                GET selected
              </button>
              <button className="button button--danger" onClick={() => void handleDelete()}>
                DELETE selected
              </button>
            </div>
          }
        >
          <UsersTable users={users} selectedId={selectedId} onSelect={setSelectedId} />

          <div className="pagination">
            <button
              className="button button--ghost"
              disabled={page <= 1}
              onClick={() => void refreshUsers(page - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="button button--ghost"
              disabled={page >= totalPages}
              onClick={() => void refreshUsers(page + 1)}
            >
              Next
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title="POST /users"
          description="Create new records with auto-generated ID and timestamps."
        >
          <UserForm mode="create" submitLabel="Create user" onSubmit={handleCreate} />
        </SectionCard>

        <SectionCard
          title="PUT /users/:id"
          description="Replace the selected user with a full new payload."
        >
          <UserForm
            key={selectedUser?.id ?? "replace-form"}
            mode="replace"
            submitLabel="Replace selected user"
            initialValues={
              selectedUser
                ? {
                    name: selectedUser.name,
                    email: selectedUser.email,
                    role: selectedUser.role,
                    status: selectedUser.status,
                  }
                : undefined
            }
            onSubmit={handleReplace}
          />
        </SectionCard>

        <SectionCard
          title="PATCH /users/:id"
          description="Update only a few fields on the selected user."
        >
          <PatchUserForm onSubmit={handlePatch} />
        </SectionCard>

        <SectionCard
          title="Collection tools"
          description="Useful actions to test the package quickly."
        >
          <div className="tools-grid">
            <button className="button button--ghost" onClick={() => void handleFetchSingle()}>
              Fetch selected user
            </button>
            <button className="button button--ghost" onClick={() => void refreshCollections()}>
              List collections
            </button>
            <button className="button button--warning" onClick={() => void handleClearCollection()}>
              Clear users collection
            </button>
            <button className="button button--danger" onClick={() => void handleResetDatabase()}>
              Reset whole database
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title="Latest API response"
          description="Useful for beginners to understand how each action responds."
        >
          <ResponseViewer title="Response" value={latestResponse} />
        </SectionCard>

        <SectionCard
          title="Selected user response"
          description="Shows the raw GET /users/:id response."
        >
          <ResponseViewer title="Single record" value={singleUserResponse} />
        </SectionCard>
      </div>
    </main>
  );
}