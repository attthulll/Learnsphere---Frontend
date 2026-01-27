import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = "http://localhost:5000";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
const COURSES_PER_PAGE = 8;


  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line
  }, []);

  const loadCourses = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;

    try {
      await axios.delete(`${BACKEND}/api/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadCourses();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return <h2>Loading courses...</h2>;
  }
  
const indexOfLast = currentPage * COURSES_PER_PAGE;
const indexOfFirst = indexOfLast - COURSES_PER_PAGE;
const paginatedCourses = courses.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);


  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>Manage Courses</h1>
        <p style={subtitle}>Moderate and review all courses on the platform</p>
      </div>

      {/* TABLE CARD */}
      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Title</th>
              <th style={th}>Instructor</th>
              <th style={th}>Category</th>
              <th style={th}>Price</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCourses.map((c) => (
              <tr key={c._id} style={row}>
                <td style={td}>{c.title}</td>
                <td style={td}>{c.instructor?.name || "—"}</td>
                <td style={td}>{c.category?.name || "—"}</td>
                <td style={td}>₹{c.price}</td>
                <td style={td}>
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

        {courses.length === 0 && (
          <p style={{ color: "#64748b" }}>No courses found.</p>
        )}
      </div>
      {/* PAGINATION */}
      {totalPages > 1 && (
  <div style={pagination}>
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      style={pageBtn}
    >
      Prev
    </button>

    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        style={{
          ...pageBtn,
          background: currentPage === i + 1 ? "#2563eb" : "white",
          color: currentPage === i + 1 ? "white" : "#111",
        }}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      style={pageBtn}
    >
      Next
    </button>
  </div>
)}

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

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  gap: 8,
  marginTop: 30,
};

const pageBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  cursor: "pointer",
};

export default AdminCourses;
