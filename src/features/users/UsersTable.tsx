import type { UserRecord } from "../../lib/types";

type UsersTableProps = {
  users: UserRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function UsersTable({ users, selectedId, onSelect }: UsersTableProps) {
  if (users.length === 0) {
    return <div className="empty-state">No users found. Create or seed users to begin.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelected = user.id === selectedId;

            return (
              <tr className={isSelected ? "is-selected" : undefined} key={user.id}>
                <td>
                  <input
                    checked={isSelected}
                    name="selected-user"
                    type="radio"
                    onChange={() => onSelect(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td className="truncate-cell" title={user.id}>
                  {user.id}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}