import { useEffect, useState } from "react";
import apiClient from "../api/axios.js";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const ITEMS_PER_PAGE = 8; // you can change later
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCourses();
  }, []);

  const resolveThumb = (thumb) => {
    if (!thumb) return null;
    if (thumb.startsWith("http")) return thumb;
    if (thumb.startsWith("/")) return `${API_BASE_URL}${thumb}`;
    return `${API_BASE_URL}/${thumb}`;
  };

  const loadCourses = async () => {
    try {
      const res = await apiClient.get("/courses/instructor/my-courses");
      setCourses(res.data || []);
    } catch (err) {
      console.log("Instructor load error:", err);
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await apiClient.delete(`/courses/${id}/delete`);

      alert("Course deleted");
      loadCourses();
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete course");
    }
  };

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = courses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div style={page}>
      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <div>
            <h1 style={title}>Instructor Dashboard</h1>
            <p style={subtitle}>
              Manage your courses and track student enrollments
            </p>
          </div>

          <a href="/create-course" style={createBtn}>
            + Create New Course
          </a>
        </div>

        {/* EMPTY STATE */}
        {courses.length === 0 && (
          <p style={emptyText}>
            You haven’t created any courses yet.
          </p>
        )}

        {/* COURSE GRID */}
        <div style={grid}>
          {paginatedCourses.map((course) => {
            const thumb = resolveThumb(course.thumbnail);

            return (
              <div
                key={course._id}
                style={card}
                className="instructor-course-card"
              >

                {/* THUMBNAIL */}
                {thumb ? (
                  <img
                    src={thumb}
                    alt="thumbnail"
                    style={image}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div style={noImage}>No Image</div>
                )}

                {/* CONTENT */}
                <div style={cardBody}>
                  <h3 style={courseTitle}>{course.title}</h3>

                  <p style={students}>
                    👥 {course.students?.length || 0} students enrolled
                  </p>

                  {/* ACTIONS */}
                  <div style={actions}>
                    <button
                      onClick={() =>
                        (window.location.href = `/course/${course._id}/edit`)
                      }
                      style={editBtn} className="instructor-action-btn"
                    >
                      Edit Course
                    </button>

                    <button
                      onClick={() =>
                        (window.location.href = `/course/${course._id}/add-module`)
                      }
                      style={modulesBtn} className="instructor-action-btn"
                    >
                      Manage Modules
                    </button>

                    <button
                      onClick={() => deleteCourse(course._id)}
                      style={deleteBtn} className="instructor-action-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div style={pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={pageBtn}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  ...pageBtn,
                  background: currentPage === i + 1 ? "#2563eb" : "white",
                  color: currentPage === i + 1 ? "white" : "#1f2937",
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
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  background: "#f8fafc",
  minHeight: "100vh",
  padding: "60px 20px",
};

const container = {
  maxWidth: 1200,
  margin: "0 auto",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 40,
  gap: 20,
  flexWrap: "wrap",
};

const title = {
  color: "#111827",
  fontSize: 42,
  marginBottom: 4,
};

const subtitle = {
  color: "#475569",
  fontSize: 16,
};

const createBtn = {
  padding: "14px 22px",
  background: "#22c55e",
  color: "white",
  fontWeight: 700,
  borderRadius: 12,
  textDecoration: "none",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
};

const emptyText = {
  color: "#64748b",
  fontSize: 18,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 24,
};

const card = {
  background: "white",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
};

const image = {
  width: "100%",
  height: 160,
  objectFit: "cover",
};

const noImage = {
  height: 160,
  background: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
};

const cardBody = {
  padding: 18,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
};

const courseTitle = {
  color: "#111827",
  fontSize: 20,
  marginBottom: 6,
};

const students = {
  fontSize: 14,
  color: "#475569",
  marginBottom: 16,
};

const actions = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: "auto",
};

const editBtn = {
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const modulesBtn = {
  padding: "10px",
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginTop: 40,
};

const pageBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  cursor: "pointer",
  fontWeight: 600,
  background: "white",
};

export default InstructorDashboard;
