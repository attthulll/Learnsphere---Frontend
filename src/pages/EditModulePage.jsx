// src/pages/EditModulePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditModulePage() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadModule = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const course = res.data.course;
        if (!course) {
          alert("Course not found");
          navigate(`/course/${courseId}/add-module`);
          return;
        }

        const mod = (course.modules || []).find(
          (m) => m._id === moduleId
        );

        if (!mod) {
          alert("Module not found");
          navigate(`/course/${courseId}/add-module`);
          return;
        }

        setTitle(mod.title || "");
        setVideoUrl(mod.videoUrl || "");
        setPdfUrl(mod.pdfUrl || "");
        setLoading(false);
      } catch (err) {
        console.error("Error loading module:", err);
        alert("Failed to load module.");
        navigate(`/course/${courseId}/add-module`);
      }
    };

    loadModule();
    // eslint-disable-next-line
  }, [courseId, moduleId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/courses/${courseId}/module/${moduleId}`,
        { title, videoUrl, pdfUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Module updated");
      navigate(`/course/${courseId}/add-module`);
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update module");
    }
  };

  if (loading) {
    return <h2 style={{ padding: 40 }}>Loading module...</h2>;
  }

  return (
    <div style={page}>
      <div style={overlay}>
        <form onSubmit={handleUpdate} style={card}>
          <h1 style={titleStyle}>Edit Module</h1>
          <p style={subtitle}>
            Update module details and save changes
          </p>

          {/* MODULE TITLE */}
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

          {/* VIDEO URL */}
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

          {/* PDF URL */}
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

          {/* ACTIONS */}
          <div style={actions}>
            <button type="submit" style={saveBtn}>
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => navigate(`/course/${courseId}/add-module`)}
              style={cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e0ecff, #f8fafc)",
};

const overlay = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
};

const card = {
  background: "rgba(255,255,255,0.97)",
  padding: "40px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: 480,
  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const titleStyle = {
  color: "#111827",
  fontSize: 32,
  marginBottom: 6,
};

const subtitle = {
  marginBottom: 20,
  color: "#475569",
  fontSize: 14,
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

const actions = {
  display: "flex",
  gap: 12,
  marginTop: 10,
};

const saveBtn = {
  padding: "12px 20px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const cancelBtn = {
  padding: "12px 20px",
  background: "#64748b",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontWeight: 600,
  cursor: "pointer",
};

export default EditModulePage;
