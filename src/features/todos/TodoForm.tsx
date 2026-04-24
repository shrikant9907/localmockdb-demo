import { useState } from 'react';
import type { TodoPriority, TodoStatus } from '../../lib/types';
import type { TodoPayload } from './todoApi';

type Props = {
  submitLabel: string;
  initialValues?: TodoPayload;
  onSubmit: (values: TodoPayload) => Promise<void>;
};

const defaultValues: TodoPayload = { title: '', notes: '', priority: 'medium', status: 'todo', dueDate: '' };

export default function TodoForm({ submitLabel, initialValues = defaultValues, onSubmit }: Props) {
  const [values, setValues] = useState<TodoPayload>(initialValues);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof TodoPayload>(k: K, v: TodoPayload[K]) {
    setValues(cur => ({ ...cur, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({ ...values, title: values.title.trim(), notes: values.notes.trim() });
      if (!initialValues.title) setValues(defaultValues);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label className="field-label" htmlFor="tf-title">Task title</label>
        <input id="tf-title" className="input" required maxLength={80} placeholder="What needs to be done?"
          value={values.title} onChange={e => set('title', e.target.value)} />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="tf-notes">Notes</label>
        <textarea id="tf-notes" className="input" rows={3} placeholder="Optional details…"
          value={values.notes} onChange={e => set('notes', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="tf-priority">Priority</label>
          <select id="tf-priority" className="input"
            value={values.priority} onChange={e => set('priority', e.target.value as TodoPriority)}>
            {(['low', 'medium', 'high'] as TodoPriority[]).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="tf-status">Status</label>
          <select id="tf-status" className="input"
            value={values.status} onChange={e => set('status', e.target.value as TodoStatus)}>
            {(['todo', 'in-progress', 'done'] as TodoStatus[]).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="tf-due">Due date</label>
        <input id="tf-due" className="input" type="date"
          value={values.dueDate} onChange={e => set('dueDate', e.target.value)} />
      </div>

      <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy} type="submit">
        {busy ? <><span className="spinner" /> Saving…</> : submitLabel}
      </button>
    </form>
  );
}
