import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CoursePlayerPage() {
  const { courseId, moduleId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line
  }, []);

  const loadCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCourse(res.data.course);

      const idx = res.data.course.modules.findIndex(
        (m) => m._id === moduleId
      );
      setCurrentIndex(idx !== -1 ? idx : 0);

      loadCompleted();
    } catch (err) {
      console.log("Error loading course:", err);
    }
  };

  const loadCompleted = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/courses/student/progress",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const courseProgress = res.data.find(
        (p) => p.courseId === courseId
      );

      if (courseProgress) {
        setCompleted(courseProgress.completedModules || []);
      }
    } catch (err) {
      console.log("Error loading progress:", err);
    }
  };

  const markCompleted = async () => {
    try {
      const module = course.modules[currentIndex];

      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/${module._id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompleted((prev) => [...prev, module._id]);
    } catch (err) {
      console.log("Error marking completed:", err);
    }
  };

  const goNext = () => {
    if (currentIndex < course.modules.length - 1) {
      const next = course.modules[currentIndex + 1];
      window.location.href = `/course-player/${courseId}/${next._id}`;
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      const prev = course.modules[currentIndex - 1];
      window.location.href = `/course-player/${courseId}/${prev._id}`;
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    const regExp =
      /^.*((youtu.be\/)|(v\/)|(u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length === 11 ? match[7] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (!course) {
    return <h2 style={{ padding: 40 }}>Loading course...</h2>;
  }

  const currentModule = course.modules[currentIndex];

  return (
    <div style={page}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <h2 style={courseTitle}>{course.title}</h2>

        <div style={moduleList}>
          {course.modules.map((m, i) => (
            <div
              key={m._id}
              onClick={() =>
                (window.location.href = `/course-player/${courseId}/${m._id}`)
              }
              style={{
                ...moduleItem,
                background:
                  i === currentIndex ? "#e0edff" : "transparent",
              }}
            >
              <span>
                Module {i + 1}
              </span>

              {completed.includes(m._id) && (
                <span style={check}>✔</span>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={main}>
        <h1 style={moduleTitle}>{currentModule.title}</h1>

        {currentModule.videoUrl && (
          <div style={videoWrap}>
            <iframe
              src={getEmbedUrl(currentModule.videoUrl)}
              style={video}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Course Video"
            />
          </div>
        )}

        {currentModule.pdfUrl && (
          <a
            href={currentModule.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={pdfLink}
          >
            📘 Open PDF Notes
          </a>
        )}

        {/* STUDENT ACTION */}
        {role === "student" && (
          <button
            onClick={markCompleted}
            style={{
              ...completeBtn,
              background: completed.includes(currentModule._id)
                ? "#9ca3af"
                : "#22c55e",
            }}
          >
            {completed.includes(currentModule._id)
              ? "Completed ✔"
              : "Mark as Completed"}
          </button>
        )}

        {/* NAVIGATION */}
        <div style={nav}>
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            style={{
              ...navBtn,
              opacity: currentIndex === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          <button
            onClick={goNext}
            disabled={currentIndex === course.modules.length - 1}
            style={{
              ...navBtn,
              opacity:
                currentIndex === course.modules.length - 1 ? 0.5 : 1,
            }}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  display: "flex",
  height: "100vh",
  background: "#f8fafc",
};

const sidebar = {
  width: 280,
  padding: 20,
  borderRight: "1px solid #e5e7eb",
  background: "white",
  overflowY: "auto",
};

const courseTitle = {
  color: "#111827",
  fontSize: 25,
  fontWeight: 700,
  marginBottom: 20,
};

const moduleList = {
  color: "#374151",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const moduleItem = {
  padding: "10px 12px",
  color: "#1f2937",
  borderRadius: 8,
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 14,
};

const check = {
  color: "#16a34a",
  fontWeight: 700,
};

const main = {
  flex: 1,
  padding: 30,
  overflowY: "auto",
};

const moduleTitle = {
  color: "#111827",
  fontSize: 28,
  marginBottom: 20,
};

const videoWrap = {
  marginBottom: 20,
};

const video = {
  width: "100%",
  height: 460,
  borderRadius: 14,
  border: "none",
};

const pdfLink = {
  display: "inline-block",
  padding: "12px 20px",
  marginBottom: 20,
  color: "#2563eb",
  fontSize: 16,
  textDecoration: "none",
};

const completeBtn = {
  padding: "12px 20px",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
  marginBottom: 30,
};

const nav = {
  display: "flex",
  gap: 12,
};

const navBtn = {
  padding: "10px 18px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

export default CoursePlayerPage;
