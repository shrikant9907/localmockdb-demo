import { useMemo, useState } from "react";
import type { UserRecord } from "../../lib/types";

export type UserFormValues = Omit<UserRecord, "id" | "createdAt" | "updatedAt">;

type UserFormProps = {
  mode: "create" | "replace";
  initialValues?: UserFormValues;
  submitLabel: string;
  onSubmit: (values: UserFormValues) => Promise<void>;
};

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  role: "Viewer",
  status: "Active",
};

export default function UserForm({
  mode,
  initialValues,
  submitLabel,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>(initialValues ?? defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(() => {
    return mode === "create" ? "Create user" : "Replace user";
  }, [mode]);

  function updateField<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(values);

      if (mode === "create") {
        setValues(defaultValues);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-grid__title">{title}</div>

      <label>
        <span>Name</span>
        <input
          required
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Enter name"
        />
      </label>

      <label>
        <span>Email</span>
        <input
          required
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Enter email"
        />
      </label>

      <label>
        <span>Role</span>
        <select
          value={values.role}
          onChange={(event) => updateField("role", event.target.value)}
        >
          <option>Admin</option>
          <option>Editor</option>
          <option>Viewer</option>
          <option>Support</option>
        </select>
      </label>

      <label>
        <span>Status</span>
        <select
          value={values.status}
          onChange={(event) => updateField("status", event.target.value)}
        >
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
        </select>
      </label>

      <button className="button button--primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}