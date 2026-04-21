import { useEffect, useMemo, useState } from "react";
import ResponseViewer from "./components/ResponseViewer";
import TodoForm from "./features/todos/TodoForm";
import TodoList from "./features/todos/TodoList";
import {
  clearTodosCollection,
  createTodo,
  getTodoById,
  listCollections,
  listTodos,
  patchTodo,
  removeTodo,
  replaceTodo,
  resetDatabase,
} from "./features/todos/todoApi";
import { seedTodosCollection } from "./lib/seed";
import type { ApiResponse, JsonValue, TodoRecord, TodoStatus } from "./lib/types";

const pageSize = 8;

type FilterValue = "all" | TodoStatus;
type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; todo: TodoRecord }
  | { type: "delete"; todo: TodoRecord }
  | { type: "reset" }
  | { type: "clear" };

function getEmptyTodoPayload() {
  return {
    title: "",
    notes: "",
    priority: "medium" as const,
    status: "todo" as const,
    dueDate: "",
  };
}

export default function App() {
  const [todos, setTodos] = useState<TodoRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [collections, setCollections] = useState<string[]>([]);
  const [latestResponse, setLatestResponse] = useState<JsonValue | null>(null);
  const [singleTodoResponse, setSingleTodoResponse] = useState<JsonValue | null>(null);
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [meta, setMeta] = useState<ApiResponse<TodoRecord[]>["meta"] | undefined>();
  const [modal, setModal] = useState<ModalState>({ type: "closed" });

  const selectedTodo = useMemo(() => {
    return todos.find((todo) => todo.id === selectedId) ?? null;
  }, [selectedId, todos]);

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    await refreshCollections();
    await refreshTodos(1);
  }

  function closeModal() {
    setModal({ type: "closed" });
  }

  async function refreshCollections() {
    const response = await listCollections();

    if (response.success && Array.isArray(response.data)) {
      setCollections(response.data);
      return;
    }

    setCollections([]);
  }

  async function refreshTodos(nextPage = page) {
    const response = await listTodos(nextPage, pageSize);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);

    if (!response.success || !Array.isArray(response.data)) {
      setTodos([]);
      setMeta(response.meta);
      setSelectedId("");
      return;
    }

    setTodos(response.data);
    setMeta(response.meta);
    setPage(nextPage);

    if (response.data.length === 0) {
      setSelectedId("");
      return;
    }

    const hasSelection = response.data.some((todo) => todo.id === selectedId);

    if (!hasSelection) {
      setSelectedId(response.data[0].id);
    }
  }

  async function handleCreate(values: ReturnType<typeof getEmptyTodoPayload>) {
    const response = await createTodo(values);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    await refreshCollections();
    await refreshTodos(1);
    closeModal();
  }

  async function handleReplace(values: ReturnType<typeof getEmptyTodoPayload>) {
    if (modal.type !== "edit") {
      setStatusMessage("Choose a task to edit.");
      return;
    }

    const response = await replaceTodo(modal.todo.id, values);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    setSelectedId(modal.todo.id);
    await refreshTodos(page);
    await handleFetchSingle(modal.todo.id);
    closeModal();
  }

  async function handleFetchSingle(id = selectedId) {
    if (!id) {
      setStatusMessage("Select a task first.");
      return;
    }

    const response = await getTodoById(id);
    setSingleTodoResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
  }

  async function handleToggleStatus(todo: TodoRecord) {
    const nextStatus: TodoStatus = todo.status === "done" ? "todo" : "done";
    const response = await patchTodo(todo.id, { status: nextStatus });
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    setSelectedId(todo.id);
    await refreshTodos(page);

    if (selectedId === todo.id) {
      await handleFetchSingle(todo.id);
    }
  }

  async function handleDelete(todoId?: string) {
    const id = todoId ?? selectedId;

    if (!id) {
      setStatusMessage("Select a task first.");
      return;
    }

    const response = await removeTodo(id);
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    setSingleTodoResponse(null);
    await refreshCollections();

    const isLastVisibleTask = todos.length === 1;
    const nextPage = page > 1 && isLastVisibleTask ? page - 1 : page;

    closeModal();
    await refreshTodos(nextPage);
  }

  async function handleClearCollection() {
    const response = await clearTodosCollection();
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    setSingleTodoResponse(null);
    setSelectedId("");
    closeModal();
    await refreshCollections();
    await refreshTodos(1);
  }

  async function handleResetDatabase() {
    const response = await resetDatabase();
    setLatestResponse(response as unknown as JsonValue);
    setStatusMessage(response.message);
    setSingleTodoResponse(null);
    setSelectedId("");
    closeModal();
    await initialize();
  }

  async function handleSeedDemo() {
    await seedTodosCollection();
    await refreshCollections();
    await refreshTodos(1);
    setStatusMessage("Demo tasks added.");
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") {
      return true;
    }

    return todo.status === filter;
  });

  const totalPages = meta?.totalPages ?? 1;
  const totalCount = meta?.total ?? 0;

  return (
    <main className="tool-shell">
      <section className="tool-panel tool-panel--hero">
        <div className="app-kicker">localmockdb todo tool</div>
        <div className="hero-row">
          <div>
            <h1>Todo tester</h1>
            <p>
              Mobile-first task tool built to test localmockdb with simple CRUD actions and
              localStorage persistence.
            </p>
          </div>
          <div className="hero-actions">
            <button className="button button--primary" onClick={() => setModal({ type: "create" })}>
              Add task
            </button>
            <button className="button button--ghost" onClick={() => void handleSeedDemo()}>
              Seed demo
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-chip">
            <span>Total</span>
            <strong>{totalCount}</strong>
          </div>
          <div className="stat-chip">
            <span>Collections</span>
            <strong>{collections.length}</strong>
          </div>
          <div className="stat-chip stat-chip--wide">
            <span>Status</span>
            <strong>{statusMessage}</strong>
          </div>
        </div>
      </section>

      <section className="tool-panel">
        <div className="section-heading">
          <div>
            <div className="section-title">Tasks</div>
            <div className="section-subtitle">Starts empty. Seed data only when needed.</div>
          </div>
          <button className="button button--ghost" onClick={() => void refreshTodos(page)}>
            Refresh
          </button>
        </div>

        <div className="filter-row">
          {(["all", "todo", "in-progress", "done"] as const).map((value) => (
            <button
              key={value}
              className={`chip-button${filter === value ? " is-active" : ""}`}
              type="button"
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <TodoList
          todos={filteredTodos}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onToggleStatus={handleToggleStatus}
          onEdit={(todo) => setModal({ type: "edit", todo })}
          onDelete={(todo) => setModal({ type: "delete", todo })}
        />

        <div className="pager-row">
          <button
            className="button button--ghost"
            disabled={page <= 1}
            onClick={() => void refreshTodos(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="button button--ghost"
            disabled={page >= totalPages}
            onClick={() => void refreshTodos(page + 1)}
          >
            Next
          </button>
        </div>
      </section>

      <section className="tool-panel">
        <div className="section-title">Tool actions</div>
        <div className="action-grid">
          <button className="button button--secondary" onClick={() => void handleFetchSingle()}>
            GET selected
          </button>
          <button
            className="button button--secondary"
            disabled={!selectedTodo}
            onClick={() => selectedTodo && void handleToggleStatus(selectedTodo)}
          >
            PATCH toggle done
          </button>
          <button className="button button--warning" onClick={() => setModal({ type: "clear" })}>
            Clear todos
          </button>
          <button className="button button--ghost" onClick={() => setModal({ type: "reset" })}>
            Reset database
          </button>
        </div>
      </section>

      <section className="tool-panel">
        <ResponseViewer title="Latest API response" value={latestResponse} />
      </section>

      <section className="tool-panel">
        <ResponseViewer title="GET selected response" value={singleTodoResponse} />
      </section>

      {modal.type === "create" ? (
        <ModalShell title="Add task" onClose={closeModal}>
          <TodoForm submitLabel="Create task" onSubmit={handleCreate} />
        </ModalShell>
      ) : null}

      {modal.type === "edit" ? (
        <ModalShell title="Edit task" onClose={closeModal}>
          <TodoForm
            key={modal.todo.id}
            submitLabel="Save changes"
            initialValues={{
              title: modal.todo.title,
              notes: modal.todo.notes,
              priority: modal.todo.priority,
              status: modal.todo.status,
              dueDate: modal.todo.dueDate,
            }}
            onSubmit={handleReplace}
          />
        </ModalShell>
      ) : null}

      {modal.type === "delete" ? (
        <ConfirmModal
          title="Delete task?"
          description={`This will permanently remove \"${modal.todo.title}\".`}
          confirmLabel="Delete task"
          confirmClassName="button button--danger"
          onClose={closeModal}
          onConfirm={() => handleDelete(modal.todo.id)}
        />
      ) : null}

      {modal.type === "clear" ? (
        <ConfirmModal
          title="Clear all todos?"
          description="This removes every task from the todos collection."
          confirmLabel="Clear todos"
          confirmClassName="button button--warning"
          onClose={closeModal}
          onConfirm={handleClearCollection}
        />
      ) : null}

      {modal.type === "reset" ? (
        <ConfirmModal
          title="Reset local database?"
          description="This resets the full localmockdb storage for this demo."
          confirmLabel="Reset database"
          confirmClassName="button button--ghost modal-confirm-reset"
          onClose={closeModal}
          onConfirm={handleResetDatabase}
        />
      ) : null}
    </main>
  );
}

type ModalShellProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function ModalShell({ title, children, onClose }: ModalShellProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <div className="section-title">{title}</div>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClassName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function ConfirmModal({
  title,
  description,
  confirmLabel,
  confirmClassName,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setIsSubmitting(true);

    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="confirm-copy">{description}</div>
      <div className="modal-actions">
        <button className="button button--ghost" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className={confirmClassName} type="button" disabled={isSubmitting} onClick={() => void handleConfirm()}>
          {isSubmitting ? "Working..." : confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
}
