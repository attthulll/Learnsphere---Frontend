import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BACKEND = "http://localhost:5000";

const resolveThumb = (thumb) => {
  if (!thumb) return null;
  if (thumb.startsWith("http")) return thumb;
  if (thumb.startsWith("/")) return `${BACKEND}${thumb}`;
  return `${BACKEND}/${thumb}`;
};

function InstructorProfilePage() {
  const { instructorId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [instructorId]);

  const loadProfile = async () => {
    try {
      const res = await axios.get(
        `${BACKEND}/api/courses/instructor/${instructorId}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Instructor profile error:", err);
    }
  };

  if (!data) return <p style={{ padding: 40 }}>Loading profile...</p>;

  const { instructor, courses, totalStudents } = data;

  return (
    <div style={page}>
      {/* HERO */}
      <div style={hero}>
        <h1 style={name}>{instructor.name}</h1>
        <p style={bio}>Experienced instructor at LearnSphere</p>

        <div style={stats}>
          <Stat label="Courses Created" value={courses.length} />
          <Stat label="Total Students Enrolled" value={totalStudents} />
        </div>
      </div>

      {/* COURSES */}
      <div style={container}>
        <h2 style={section}>Courses by {instructor.name}</h2>

        <div style={grid}>
          {courses.map((c) => (
            <div
  key={c._id}
  style={card}
  onClick={() => (window.location.href = `/course/${c._id}`)}
>
  {/* COURSE THUMBNAIL */}
  {c.thumbnail && (
    <img
      src={resolveThumb(c.thumbnail)}
      alt={c.title}
      style={thumb}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  )}

  <h3 style={courseTitle}>{c.title}</h3>
  <p style={desc}>{c.description?.substring(0, 80)}...</p>
  <p style={price}>₹{c.price}</p>
</div>

          ))}
        </div>
      </div>
    </div>
  );
}

/* STAT COMPONENT */
function Stat({ label, value }) {
  return (
    <div style={statCard}>
      <h2 style={statValue}>{value}</h2>
      <p style={statLabel}>{label}</p>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  background: "#f8fafc",
  minHeight: "100vh",
};

const hero = {
  padding: "80px 20px 40px",
  textAlign: "center",
};

const name = {
  fontSize: 42,
  color: "#0f172a",
  marginBottom: 6,
};

const bio = {
  color: "#475569",
  marginBottom: 30,
};

const stats = {
  display: "flex",
  justifyContent: "center",
  gap: 24,
  flexWrap: "wrap",
};

const statCard = {
  background: "white",
  padding: "20px 30px",
  borderRadius: 16,
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  minWidth: 200,
};

const statValue = {
  fontSize: 32,
  color: "#2563eb",
};

const statLabel = {
  color: "#64748b",
};

const container = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "40px 20px 80px",
};

const section = {
  fontSize: 28,
  marginBottom: 30,
  color: "#0f172a",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
  gap: 24,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 16,
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  transition: "transform 0.25s ease",
};

const courseTitle = {
  color: "#111827",
  fontSize: 18,
  marginBottom: 6,
};

const desc = {
  fontSize: 14,
  color: "#475569",
};

const price = {
  marginTop: 8,
  color: "#2563eb",
  fontWeight: 700,
};

const thumb = {
  width: "100%",
  height: 150,
  objectFit: "cover",
  borderRadius: 12,
  marginBottom: 12,
};

export default InstructorProfilePage;

