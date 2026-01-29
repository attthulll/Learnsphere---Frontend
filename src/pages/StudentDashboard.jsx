// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import apiClient from "../api/axios.js";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const COURSES_PER_PAGE = 8;

  const token = localStorage.getItem("token");
  const studentName = localStorage.getItem("userName") || "Student";


  useEffect(() => {
    loadCourses();
    loadProgress();
    // eslint-disable-next-line
  }, []);

  const resolveThumb = (thumb) => {
    if (!thumb) return null;
    if (thumb.startsWith("http")) return thumb;
    if (thumb.startsWith("/")) return `${API_BASE_URL}${thumb}`;
    return `${API_BASE_URL}/${thumb}`;
  };

  const loadCourses = async () => {
    try {
      const res = await apiClient.get("/courses/student/enrolled");
      setCourses(res.data);
    } catch (err) {
      console.log("Load courses error:", err);
    }
  };

  const loadProgress = async () => {
    try {
      const res = await apiClient.get("/courses/student/progress");
      setProgress(res.data);
    } catch (err) {
      console.log("Load progress error:", err);
    }
  };

  const getProgress = (courseId) => {
    const item = progress.find((p) => p.courseId === courseId);
    return item ? item.progress : 0;
  };

  const openCourse = (course) => {
    if (!course.modules || course.modules.length === 0) {
      alert("No modules available.");
      return;
    }
    window.location.href = `/course-player/${course._id}/${course.modules[0]._id}`;
  };

  const indexOfLast = currentPage * COURSES_PER_PAGE;
  const indexOfFirst = indexOfLast - COURSES_PER_PAGE;
  const paginatedCourses = courses.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);

  return (
    <div style={page}>
      <div style={container}>
        <div style={header}>
          <h1 style={title}>
            Welcome back, <span style={highlight}>{studentName}</span> 👋
          </h1>
          <p style={subtitle}>
            Continue your learning journey right where you left off
          </p>
        </div>


        {courses.length === 0 && (
          <p style={emptyText}>
            You haven’t enrolled in any courses yet.
          </p>
        )}

        <div style={grid}>
          {paginatedCourses.map((course) => {
            const prog = getProgress(course._id);
            const thumbSrc = resolveThumb(course.thumbnail);

            return (
              <div
                key={course._id}
                style={card}
                className="student-course-card"
              >

                {thumbSrc && (
                  <img
                    src={thumbSrc}
                    alt={course.title}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    style={image}
                  />
                )}

                <div style={cardBody}>
                  <h2 style={courseTitle}>{course.title}</h2>

                  <p style={desc}>
                    {course.description?.substring(0, 90)}...
                  </p>

                  <div style={progressRow}>
                    <span style={progressText}>{prog}% completed</span>
                  </div>

                  <div style={progressBar}>
                    <div
                      style={{
                        ...progressFill,
                        width: `${prog}%`,
                      }}
                    />
                  </div>

                  <button
                    onClick={() => openCourse(course)}
                    style={continueBtn}
                    className="student-continue-btn"
                  >

                    Continue Learning →
                  </button>
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
  marginBottom: 40,
};

const title = {
  color: "#111827",
  fontSize: 42,
  marginBottom: 6,
};

const subtitle = {
  color: "#475569",
  fontSize: 16,
};

const emptyText = {
  textAlign: "center",
  color: "#64748b",
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

const desc = {
  fontSize: 14,
  color: "#475569",
  marginBottom: 14,
  flexGrow: 1,
};

const progressRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6,
};

const progressText = {
  fontSize: 14,
  fontWeight: 600,
  color: "#2563eb",
};

const progressBar = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden",
  marginBottom: 16,
};

const progressFill = {
  height: "100%",
  background: "linear-gradient(90deg, #2563eb, #3b82f6)",
  borderRadius: 999,
  transition: "width 0.4s ease",
};

const continueBtn = {
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const highlight = {
  color: "#2563eb",
  fontWeight: 700,
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

export default StudentDashboard;
