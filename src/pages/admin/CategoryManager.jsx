import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = "http://localhost:5000";

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line
  }, []);

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log("Load category error:", err);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!name.trim()) return alert("Enter category name");

    try {
      await axios.post(
        `${BACKEND}/api/categories`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      loadCategories();
    } catch (err) {
      alert("Failed to add category");
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return alert("Name required");

    try {
      await axios.put(
        `${BACKEND}/api/categories/${editingId}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingId(null);
      setName("");
      loadCategories();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`${BACKEND}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      loadCategories();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>Manage Categories</h1>
        <p style={subtitle}>Create, edit and organize course categories</p>
      </div>

      {/* ADD / EDIT FORM */}
      <div style={card}>
        <h3 style={{ marginBottom: 12 }}>
          {editingId ? "Edit Category" : "Add New Category"}
        </h3>

        <div style={formRow}>
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />

          {editingId ? (
            <button onClick={handleUpdate} style={updateBtn}>
              Update
            </button>
          ) : (
            <button onClick={handleAdd} style={addBtn}>
              Add
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY TABLE */}
      <div style={card}>
        <h3 style={{ marginBottom: 12 }}>Existing Categories</h3>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Category Name</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr key={c._id} style={row}>
                <td style={td}>{c.name}</td>
                <td style={td}>
                  <button
                    onClick={() => {
                      setEditingId(c._id);
                      setName(c.name);
                    }}
                    style={editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c._id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <p style={{ color: "#64748b" }}>No categories found.</p>
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
  color: "#1f2937",
  padding: 24,
  borderRadius: 18,
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const formRow = {
  display: "flex",
  gap: 12,
  alignItems: "center",
};

const input = {
  flex: 1,
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 15,
};

const addBtn = {
  padding: "12px 18px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const updateBtn = {
  padding: "12px 18px",
  background: "#f59e0b",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
  color: "#475569",
};

const row = {
  borderBottom: "1px solid #f1f5f9",
};

const td = {
  padding: "12px",
};

const editBtn = {
  background: "#3b82f6",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: 8,
  marginRight: 8,
  cursor: "pointer",
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

export default CategoryManager;
