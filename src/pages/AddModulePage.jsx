// src/pages/AddModulePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function AddModulePage() {
  const { id } = useParams(); // Course ID
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [modules, setModules] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadModules();
    // eslint-disable-next-line
  }, []);

  /* ---------------- LOAD MODULES ---------------- */
  const loadModules = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(res.data.course.modules || []);
    } catch (err) {
      console.error("Error loading modules:", err);
    }
  };

  /* ---------------- ADD MODULE ---------------- */
  const handleAddModule = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/courses/${id}/modules`,
        { title, videoUrl, pdfUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Module added!");
      setTitle("");
      setVideoUrl("");
      setPdfUrl("");
      loadModules();
    } catch (err) {
      console.error(err);
      alert("Failed to add module");
    }
  };

  /* ---------------- DELETE MODULE ---------------- */
  const deleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/courses/${id}/module/${moduleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Module deleted");
      loadModules();
    } catch (err) {
      console.error(err);
      alert("Failed to delete module");
    }
  };

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={titleStyle}>Manage Modules</h1>
        <p style={subtitle}>
          Add new modules and manage existing course content
        </p>

        <div style={layout}>
          {/* ---------------- ADD MODULE FORM ---------------- */}
          <form onSubmit={handleAddModule} style={card}>
            <h2 style={cardTitle}>Add New Module</h2>

            <div style={field}>
              <label style={label}>Module Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={input}
                required
              />
            </div>

            <div style={field}>
              <label style={label}>Video URL</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={input}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div style={field}>
              <label style={label}>PDF URL</label>
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                style={input}
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <button type="submit" style={addBtn}>
              + Add Module
            </button>
          </form>

          {/* ---------------- MODULE LIST ---------------- */}
          <div style={card}>
            <h2 style={cardTitle}>Existing Modules</h2>

            {modules.length === 0 && (
              <p style={{ color: "#64748b" }}>
                No modules added yet.
              </p>
            )}

            {modules.map((m, i) => (
              <div key={m._id} style={moduleRow}>
                <div>
                  <strong>Module {i + 1}:</strong> {m.title}
                </div>

                <div style={actions}>
                  <Link
                    to={`/course/${id}/edit-module/${m._id}`}
                    style={editBtn}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteModule(m._id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e0ecff, #f8fafc)",
  padding: "60px 20px",
};

const container = {
  maxWidth: 1100,
  margin: "0 auto",
};

const titleStyle = {
  color: "#111827",
  fontSize: 36,
  marginBottom: 4,
};

const subtitle = {
  marginBottom: 30,
  color: "#475569",
};

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 30,
};

const card = {
  background: "rgba(255,255,255,0.97)",
  color: "#1f2937",
  padding: 24,
  borderRadius: 18,
  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const cardTitle = {
  fontSize: 22,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const label = {
  fontSize: 14,
  fontWeight: 600,
  color: "#334155",
};

const input = {
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 15,
};

const addBtn = {
  marginTop: 10,
  padding: "14px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const moduleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#f1f5f9",
  padding: "12px 14px",
  borderRadius: 10,
};

const actions = {
  display: "flex",
  gap: 10,
};

const editBtn = {
  background: "#f59e0b",
  padding: "6px 12px",
  borderRadius: 8,
  color: "white",
  textDecoration: "none",
  fontWeight: 600,
};

const deleteBtn = {
  background: "#ef4444",
  padding: "6px 12px",
  border: "none",
  borderRadius: 8,
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

export default AddModulePage;
