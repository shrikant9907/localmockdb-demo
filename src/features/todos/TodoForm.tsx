import { useState } from "react";
import type { TodoPriority, TodoStatus } from "../../lib/types";
import type { TodoPayload } from "./todoApi";

type TodoFormProps = {
  title: string;
  submitLabel: string;
  initialValues?: TodoPayload;
  onSubmit: (values: any) => Promise<void>;
};

const defaultValues: TodoPayload = {
  title: "",
  notes: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};

const priorityOptions: TodoPriority[] = ["low", "medium", "high"];
const statusOptions: TodoStatus[] = ["todo", "in-progress", "done"];

export default function TodoForm({
  title,
  submitLabel,
  initialValues = defaultValues,
  onSubmit,
}: TodoFormProps) {
  const [values, setValues] = useState<TodoPayload>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof TodoPayload>(field: K, value: TodoPayload[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        notes: values.notes.trim(),
      });

      if (!initialValues.title) {
        setValues(defaultValues);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="tool-form" onSubmit={handleSubmit}>
      <div className="section-title">{title}</div>

      <label className="field">
        <span>Task title</span>
        <input
          required
          maxLength={80}
          placeholder="Add a task"
          value={values.title}
          onChange={(event) => updateField("title", event.target.value)}
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          rows={3}
          placeholder="Optional details"
          value={values.notes}
          onChange={(event) => updateField("notes", event.target.value)}
        />
      </label>

      <div className="field-grid">
        <label className="field">
          <span>Priority</span>
          <select
            value={values.priority}
            onChange={(event) => updateField("priority", event.target.value as TodoPriority)}
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select
            value={values.status}
            onChange={(event) => updateField("status", event.target.value as TodoStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Due date</span>
        <input
          type="date"
          value={values.dueDate}
          onChange={(event) => updateField("dueDate", event.target.value)}
        />
      </label>

      <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
