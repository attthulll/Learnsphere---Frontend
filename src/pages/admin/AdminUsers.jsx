import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = "http://localhost:5000";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${BACKEND}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <h2>Loading users...</h2>;
  }

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>All Users</h1>
        <p style={subtitle}>View and manage platform users</p>
      </div>

      {/* TABLE CARD */}
      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>Joined</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={row}>
                <td style={td}>{u.name}</td>
                <td style={td}>{u.email}</td>

                <td style={td}>
                  <span style={roleBadge(u.role)}>
                    {u.role}
                  </span>
                </td>

                <td style={td}>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                <td style={td}>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p style={{ color: "#64748b" }}>No users found.</p>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  display: "flex",
  flexDirection: "column",
  gap: 30,
};

const header = {
  marginBottom: 10,
};

const title = {
  color: "#111827",
  fontSize: 36,
  marginBottom: 4,
};

const subtitle = {
  color: "#475569",
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 18,
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px",
  color: "#475569",
  borderBottom: "1px solid #e2e8f0",
};

const row = {
  borderBottom: "1px solid #f1f5f9",
};

const td = {
  padding: "12px",
  color: "#1e293b",
};

const roleBadge = (role) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  textTransform: "capitalize",
  color: "white",
  background:
    role === "admin"
      ? "#6366f1"
      : role === "instructor"
      ? "#f59e0b"
      : "#22c55e",
});

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

export default AdminUsers;
