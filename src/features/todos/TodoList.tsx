import { Check, Pencil, Trash2, Calendar, ClipboardList } from 'lucide-react';
import type { TodoRecord } from '../../lib/types';

type Props = {
  todos: TodoRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  onToggleStatus: (todo: TodoRecord) => Promise<void>;
  onEdit: (todo: TodoRecord) => void;
  onDelete: (todo: TodoRecord) => void;
};

const priorityClass: Record<string, string> = {
  high: 'badge-error',
  medium: 'badge-warning',
  low: 'badge-neutral',
};

const statusClass: Record<string, string> = {
  done: 'badge-success',
  'in-progress': 'badge-info',
  todo: 'badge-neutral',
};

export default function TodoList({ todos, selectedId, onSelect, onToggleStatus, onEdit, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon"><ClipboardList /></div>
        <div className="empty-state__title">No tasks yet</div>
        <div className="empty-state__desc">Create a task or seed demo data to get started.</div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {[...todos].reverse().map(todo => {
        const isDone = todo.status === 'done';
        const isSelected = todo.id === selectedId;
        return (
          <article
            key={todo.id}
            className={`todo-card${isSelected ? ' selected' : ''}`}
            onClick={() => onSelect(todo.id)}
          >
            <div className="todo-card__top">
              <button
                className={`todo-check${isDone ? ' done' : ''}`}
                type="button"
                aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
                onClick={e => { e.stopPropagation(); void onToggleStatus(todo); }}
              >
                {isDone && <Check strokeWidth={3} />}
              </button>

              <div className="todo-card__content">
                <div className="todo-card__title-row">
                  <span className={`todo-card__title${isDone ? ' done-text' : ''}`}>{todo.title}</span>
                  <span className={`badge ${priorityClass[todo.priority] ?? 'badge-neutral'}`}>{todo.priority}</span>
                </div>
                {todo.notes && <p className="todo-card__notes">{todo.notes}</p>}
                <div className="todo-card__meta">
                  <span className={`badge ${statusClass[todo.status] ?? 'badge-neutral'}`}>{todo.status}</span>
                  {todo.dueDate && (
                    <span className="meta-tag"><Calendar />{todo.dueDate}</span>
                  )}
                </div>
              </div>

              <div className="todo-card__actions" onClick={e => e.stopPropagation()}>
                <button className="btn-icon" aria-label="Edit" onClick={() => onEdit(todo)}><Pencil /></button>
                <button className="btn-icon" aria-label="Delete" onClick={() => onDelete(todo)}><Trash2 /></button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
