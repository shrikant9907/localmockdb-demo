import { useState } from "react";

type PatchUserFormProps = {
  onSubmit: (payload: { role?: string; status?: string }) => Promise<void>;
};

export default function PatchUserForm({ onSubmit }: PatchUserFormProps) {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: { role?: string; status?: string } = {};

    if (role.trim()) {
      payload.role = role.trim();
    }

    if (status.trim()) {
      payload.status = status.trim();
    }

    setIsSubmitting(true);

    try {
      await onSubmit(payload);
      setRole("");
      setStatus("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-grid__title">Patch user</div>

      <label>
        <span>Role</span>
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="">No change</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
          <option value="Support">Support</option>
        </select>
      </label>

      <label>
        <span>Status</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">No change</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </label>

      <button className="button button--secondary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Updating..." : "Patch selected user"}
      </button>
    </form>
  );
}