import type { TodoRecord } from "../../lib/types";

type TodoListProps = {
  todos: TodoRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  onToggleStatus: (todo: TodoRecord) => Promise<void>;
  onEdit: (todo: TodoRecord) => void;
  onDelete: (todo: TodoRecord) => void;
};

export default function TodoList({
  todos,
  selectedId,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="empty-panel">
        <strong>No tasks yet.</strong>
        <span>Create one or seed demo todos when you want test data.</span>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos && todos?.reverse().map((todo) => {
        const isSelected = todo.id === selectedId;
        const isDone = todo.status === "done";

        return (
          <article
            key={todo.id}
            className={`todo-card${isSelected ? " is-selected" : ""}`}
            onClick={() => onSelect(todo.id)}
          >
            <div className="todo-card__top">
              <button
                className={`todo-check${isDone ? " is-done" : ""}`}
                type="button"
                aria-label={isDone ? "Mark as not done" : "Mark as done"}
                onClick={(event) => {
                  event.stopPropagation();
                  void onToggleStatus(todo);
                }}
              >
                {isDone ? "✓" : ""}
              </button>

              <div className="todo-card__content">
                <div className="todo-card__title-row">
                  <h3>{todo.title}</h3>
                  <span className={`tag tag--${todo.priority}`}>{todo.priority}</span>
                </div>

                {todo.notes ? <p>{todo.notes}</p> : null}

                <div className="todo-card__meta">
                  <span className="tag tag--neutral">{todo.status}</span>
                  <span>{todo.dueDate ? `Due ${todo.dueDate}` : "No due date"}</span>
                </div>

                <div className="todo-card__actions">
                  <button
                    className="button button--ghost todo-action-button"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(todo);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="button button--danger todo-action-button"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(todo);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
