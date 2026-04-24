import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Zap, Trash2, RotateCcw, Menu, X } from "lucide-react";
import ResponseViewer from "./components/ResponseViewer";
import TodoForm from "./features/todos/TodoForm";
import TodoList from "./features/todos/TodoList";
import Sidebar from "./components/layout/Sidebar";
import DocsSection from "./components/DocsSection";
import ToastPortal from "./components/ui/ToastPortal";
import { useTheme } from "./hooks/useTheme";
import { useToast } from "./hooks/useToast";
import {
  clearTodosCollection, createTodo, getTodoById,
  listCollections, listTodos, patchTodo, removeTodo,
  replaceTodo, resetDatabase,
} from "./features/todos/todoApi";
import { seedTodosCollection } from "./lib/seed";
import type { ApiResponse, JsonValue, TodoRecord, TodoStatus } from "./lib/types";

const PAGE_SIZE = 8;
type Filter = "all" | TodoStatus;
type Section = "tasks" | "query" | "settings" | "docs";
type Modal =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; todo: TodoRecord }
  | { type: "delete"; todo: TodoRecord }
  | { type: "reset" }
  | { type: "clear" };

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { toasts, addToast, removeToast } = useToast();

  const [todos, setTodos] = useState<TodoRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("all");
  const [collections, setCollections] = useState<string[]>([]);
  const [latestResponse, setLatestResponse] = useState<JsonValue | null>(null);
  const [singleResponse, setSingleResponse] = useState<JsonValue | null>(null);
  const [meta, setMeta] = useState<ApiResponse<TodoRecord[]>["meta"]>();
  const [modal, setModal] = useState<Modal>({ type: "closed" });
  const [section, setSection] = useState<Section>("tasks");
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedTodo = useMemo(() => todos.find(t => t.id === selectedId) ?? null, [selectedId, todos]);
  const totalPages = meta?.totalPages ?? 1;
  const totalCount = meta?.total ?? 0;
  const filteredTodos = todos.filter(t => filter === "all" || t.status === filter);

  useEffect(() => { void init(); }, []);

  async function init() {
    await refreshCollections();
    await refreshTodos(1);
  }

  async function refreshCollections() {
    const r = await listCollections();
    setCollections(r.success && Array.isArray(r.data) ? r.data : []);
  }

  async function refreshTodos(nextPage = page) {
    const r = await listTodos(nextPage, PAGE_SIZE);
    setLatestResponse(r as unknown as JsonValue);
    if (!r.success || !Array.isArray(r.data)) { setTodos([]); setMeta(r.meta); setSelectedId(""); return; }
    setTodos(r.data);
    setMeta(r.meta);
    setPage(nextPage);
    if (r.data.length > 0 && !r.data.some(t => t.id === selectedId)) setSelectedId(r.data[0].id);
  }

  async function handleCreate(values: any) {
    const r = await createTodo(values);
    setLatestResponse(r as unknown as JsonValue);
    addToast(r.message, r.success ? "success" : "error");
    await refreshCollections();
    await refreshTodos(1);
    setModal({ type: "closed" });
  }

  async function handleReplace(values: any) {
    if (modal.type !== "edit") return;
    const r = await replaceTodo(modal.todo.id, values);
    setLatestResponse(r as unknown as JsonValue);
    addToast(r.message, r.success ? "success" : "error");
    setSelectedId(modal.todo.id);
    await refreshTodos(page);
    await handleFetchSingle(modal.todo.id);
    setModal({ type: "closed" });
  }

  async function handleFetchSingle(id = selectedId) {
    if (!id) { addToast("Select a task first.", "info"); return; }
    const r = await getTodoById(id);
    setSingleResponse(r as unknown as JsonValue);
    addToast(r.message, r.success ? "success" : "error");
  }

  async function handleToggleStatus(todo: TodoRecord) {
    const next: TodoStatus = todo.status === "done" ? "todo" : "done";
    const r = await patchTodo(todo.id, { status: next });
    setLatestResponse(r as unknown as JsonValue);
    addToast(r.message, r.success ? "success" : "error");
    setSelectedId(todo.id);
    await refreshTodos(page);
    if (selectedId === todo.id) await handleFetchSingle(todo.id);
  }

  async function handleDelete(todoId?: string) {
    const id = todoId ?? selectedId;
    if (!id) { addToast("Select a task first.", "info"); return; }
    const r = await removeTodo(id);
    setLatestResponse(r as unknown as JsonValue);
    addToast(r.message, r.success ? "success" : "error");
    setSingleResponse(null);
    await refreshCollections();
    const nextPage = page > 1 && todos.length === 1 ? page - 1 : page;
    setModal({ type: "closed" });
    await refreshTodos(nextPage);
  }

  async function handleClear() {
    const r = await clearTodosCollection();
    setLatestResponse(r as unknown as JsonValue);
    addToast(r.message, r.success ? "success" : "error");
    setSingleResponse(null); setSelectedId("");
    setModal({ type: "closed" });
    await refreshCollections();
    await refreshTodos(1);
  }

  async function handleReset() {
    const r = await resetDatabase();
    setLatestResponse(r as unknown as JsonValue);
    addToast(r.message, r.success ? "success" : "error");
    setSingleResponse(null); setSelectedId("");
    setModal({ type: "closed" });
    await init();
  }

  async function handleSeed() {
    await seedTodosCollection();
    await refreshCollections();
    await refreshTodos(1);
    addToast("Demo tasks added.", "success");
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar
        activeSection={section}
        onSectionChange={setSection}
        collections={collections}
        theme={theme}
        onToggleTheme={toggleTheme}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main */}
      <main className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-header">
          <button className="btn-icon" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            <Menu size={18} />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>LocalMockDB</span>
        </div>

        {/* ── TASKS SECTION ── */}
        {section === "tasks" && (
          <>
            <div className="content-header">
              <div>
                <div className="content-title">Tasks</div>
                <div className="content-subtitle">Manage your todo collection · {totalCount} total</div>
              </div>
              <div className="content-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => void handleSeed()}>
                  <Zap size={14} /> Seed demo
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: "create" })}>
                  <Plus size={14} /> New task <kbd>⌘N</kbd>
                </button>
              </div>
            </div>

            <div className="content-body">
              {/* Stats */}
              <div className="stats-row">
                <div className="stat-chip">
                  <div className="stat-chip__label">Total</div>
                  <div className="stat-chip__value">{totalCount}</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-chip__label">Collections</div>
                  <div className="stat-chip__value">{collections.length}</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-chip__label">Page</div>
                  <div className="stat-chip__value">{page}/{totalPages}</div>
                </div>
              </div>

              {/* Filters */}
              <div className="filter-row">
                {(["all", "todo", "in-progress", "done"] as const).map(v => (
                  <button key={v} className={`chip-btn${filter === v ? " active" : ""}`} onClick={() => setFilter(v)}>
                    {v}
                  </button>
                ))}
                <button className="btn-icon" style={{ marginLeft: "auto" }} onClick={() => void refreshTodos(page)} aria-label="Refresh">
                  <RefreshCw size={13} />
                </button>
              </div>

              {/* List */}
              <TodoList
                todos={filteredTodos}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onToggleStatus={handleToggleStatus}
                onEdit={todo => setModal({ type: "edit", todo })}
                onDelete={todo => setModal({ type: "delete", todo })}
              />

              {/* Pagination */}
              <div className="pager-row">
                <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => void refreshTodos(page - 1)}>← Prev</button>
                <span className="pager-info">Page {page} of {totalPages}</span>
                <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => void refreshTodos(page + 1)}>Next →</button>
              </div>

              {/* Tool actions */}
              <div className="divider" style={{ margin: "24px 0 16px" }} />
              <div className="section-header">
                <div>
                  <div className="section-title">Tool actions</div>
                  <div className="section-subtitle">Test API operations against the selected task</div>
                </div>
              </div>
              <div className="action-grid">
                <button className="btn btn-secondary btn-sm" onClick={() => void handleFetchSingle()}>GET selected</button>
                <button className="btn btn-secondary btn-sm" disabled={!selectedTodo} onClick={() => selectedTodo && void handleToggleStatus(selectedTodo)}>PATCH toggle done</button>
                <button className="btn btn-warning btn-sm" onClick={() => setModal({ type: "clear" })}>
                  <Trash2 size={13} /> Clear todos
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "reset" })}>
                  <RotateCcw size={13} /> Reset DB
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── QUERY / RESPONSES SECTION ── */}
        {section === "query" && (
          <>
            <div className="content-header">
              <div>
                <div className="content-title">API Responses</div>
                <div className="content-subtitle">Raw JSON from the last localmockdb operations</div>
              </div>
            </div>
            <div className="content-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <ResponseViewer title="Latest API response" value={latestResponse} />
              <ResponseViewer title="GET selected response" value={singleResponse} />
            </div>
          </>
        )}

        {/* ── DOCS SECTION ── */}
        {section === "docs" && (
          <>
            <div className="content-header">
              <div>
                <div className="content-title">Docs &amp; Use Cases</div>
                <div className="content-subtitle">How LocalMockDB helps your real projects move faster</div>
              </div>
            </div>
            <div className="content-body">
              <DocsSection />
            </div>
          </>
        )}

        {/* ── SETTINGS SECTION ── */}
        {section === "settings" && (
          <>
            <div className="content-header">
              <div>
                <div className="content-title">Settings</div>
                <div className="content-subtitle">Preferences and database configuration</div>
              </div>
            </div>
            <div className="content-body">
              <div className="card">
                <div className="card-header">
                  <span className="section-title">Appearance</span>
                </div>
                <div className="card-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Color theme</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Currently: {theme} mode</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
                    Switch to {theme === "dark" ? "light" : "dark"} mode
                  </button>
                </div>
              </div>

              <div className="card" style={{ marginTop: 12 }}>
                <div className="card-header">
                  <span className="section-title">Database</span>
                </div>
                <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    Namespace: <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>localmockdb-react-demo</code>
                    <br />Storage: <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>localStorage</code>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-warning btn-sm" onClick={() => setModal({ type: "clear" })}>
                      <Trash2 size={13} /> Clear todos
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setModal({ type: "reset" })}>
                      <RotateCcw size={13} /> Reset database
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── MODALS ── */}
      {modal.type === "create" && (
        <Modal title="New task" onClose={() => setModal({ type: "closed" })}>
          <TodoForm submitLabel="Create task" onSubmit={handleCreate} />
        </Modal>
      )}

      {modal.type === "edit" && (
        <Modal title="Edit task" onClose={() => setModal({ type: "closed" })}>
          <TodoForm
            key={modal.todo.id}
            submitLabel="Save changes"
            initialValues={{ title: modal.todo.title, notes: modal.todo.notes, priority: modal.todo.priority, status: modal.todo.status, dueDate: modal.todo.dueDate }}
            onSubmit={handleReplace}
          />
        </Modal>
      )}

      {modal.type === "delete" && (
        <ConfirmModal
          title="Delete task?"
          description={`This will permanently remove "${modal.todo.title}".`}
          confirmLabel="Delete"
          confirmClass="btn btn-danger"
          onClose={() => setModal({ type: "closed" })}
          onConfirm={() => handleDelete(modal.todo.id)}
        />
      )}

      {modal.type === "clear" && (
        <ConfirmModal
          title="Clear all todos?"
          description="This removes every task from the todos collection."
          confirmLabel="Clear todos"
          confirmClass="btn btn-warning"
          onClose={() => setModal({ type: "closed" })}
          onConfirm={handleClear}
        />
      )}

      {modal.type === "reset" && (
        <ConfirmModal
          title="Reset database?"
          description="This resets the full localmockdb storage for this demo."
          confirmLabel="Reset"
          confirmClass="btn btn-danger"
          onClose={() => setModal({ type: "closed" })}
          onConfirm={handleReset}
        />
      )}

      <ToastPortal toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

/* ── Shared Modal Components ── */
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn-icon" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, description, confirmLabel, confirmClass, onClose, onConfirm }: {
  title: string; description: string; confirmLabel: string;
  confirmClass: string; onClose: () => void; onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  async function handle() {
    setBusy(true);
    try { await onConfirm(); } finally { setBusy(false); }
  }
  return (
    <Modal title={title} onClose={onClose}>
      <p className="confirm-desc">{description}</p>
      <div className="modal-footer" style={{ padding: "16px 0 0" }}>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        <button className={`${confirmClass} btn-sm`} disabled={busy} onClick={() => void handle()}>
          {busy ? <><span className="spinner" /> Working…</> : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
