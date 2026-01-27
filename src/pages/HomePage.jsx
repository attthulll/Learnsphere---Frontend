// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
];

const BACKEND_BASE = "http://localhost:5000";


function HomePage() {
  const [courses, setCourses] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchText, setSearchText] = useState("");


  /* ---------------- LOAD COURSES ---------------- */
  useEffect(() => {
    loadFeaturedCourses();
  }, []);

  const loadFeaturedCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data.slice(0, 4));
    } catch (err) {
      console.log("Home load error:", err);
    }
  };

  const resolveThumb = (thumb) => {
  if (!thumb) return null;
  if (thumb.startsWith("http")) return thumb;
  if (thumb.startsWith("/")) return `${BACKEND_BASE}${thumb}`;
  return `${BACKEND_BASE}/${thumb}`;
};

 
  /* ---------------- HERO CAROUSEL ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={page}>
      {/* ================= HERO ================= */}
      <section style={hero}>
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            style={{
              ...heroSlide,
              backgroundImage: `url(${img})`,
              opacity: index === currentSlide ? 1 : 0,
            }}
          />
        ))}

        <div style={heroOverlay} />

        <div style={heroInner}>
          <span style={badge}>🎓 LearnSphere</span>

          <h1 style={heroTitle}>
            Learn Smarter.<br />Grow Faster.
          </h1>

          <p style={heroSubtitle}>
            High-quality online courses designed to help you build real-world
            skills and advance your career.
          </p>

          <div style={searchWrap}>
            <input
  placeholder="What do you want to learn?"
  style={searchInput}
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && searchText.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(
        searchText
      )}`;
    }
  }}
/>

            <button
  style={searchBtn}
  onClick={() => {
    if (searchText.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(
        searchText
      )}`;
    }
  }}
>
  Search
</button>

          </div>

          <div>
            <button
              style={primaryBtn}
              onClick={() => (window.location.href = "/courses")}
            >
              Browse Courses
            </button>
            <button
              style={secondaryBtn}
              onClick={() => (window.location.href = "/register")}
            >
              Join for Free
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section style={statsSection}>
        <div style={statsInner}>
          {[
            ["50+", "Courses"],
            ["10k+", "Students"],
            ["95%", "Success Rate"],
            ["24/7", "Online Access"],
          ].map(([num, text]) => (
            <div key={text} style={statCard}>
              <h2>{num}</h2>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section style={features}>
        <h2 style={sectionTitle}>Why Choose LearnSphere?</h2>

        <div style={featureGrid}>
          {[
            ["🎓 Expert Mentors", "Learn from industry professionals"],
            ["📘 Structured Learning", "Clear learning paths"],
            ["📈 Career Focused", "Skills employers want"],
            ["🌍 Learn Anywhere", "Anytime, any device"],
          ].map(([title, desc]) => (
            <div key={title} style={featureCard}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section style={courseSection}>
        <h2 style={sectionTitle}>Featured Courses</h2>

        <div style={courseGrid}>
          {courses.map((course) => {
  const thumb = resolveThumb(course.thumbnail);

  return (
    <div
  key={course._id}
  style={courseCard}
  onClick={() => (window.location.href = `/course/${course._id}`)}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
    e.currentTarget.style.boxShadow =
      "0 18px 40px rgba(0,0,0,0.15)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 6px 20px rgba(0,0,0,0.08)";
  }}
>

      {thumb && (
        <img
          src={thumb}
          alt={course.title}
          style={courseImg}
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <div style={courseBody}>
        <h3>{course.title}</h3>
        {/* ⭐ RATING */}
  {course.avgRating > 0 && (
    <div style={ratingRow}>
      <span style={stars}>
        {"★".repeat(Math.round(course.avgRating))}
      </span>
      <span style={ratingText}>
        {course.avgRating.toFixed(1)}
        {course.reviewCount
          ? ` (${course.reviewCount})`
          : ""}
      </span>
    </div>
  )}
        <p style={desc}>
          {course.description?.substring(0, 80)}...
        </p>
        <p style={price}>₹{course.price}</p>
      </div>
    </div>
  );
})}

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section style={cta}>
        <h2>Start Learning Today</h2>
        <p>Build skills that shape your future.</p>
        <button
          style={primaryBtn}
          onClick={() => (window.location.href = "/register")}
        >
          Get Started
        </button>
      </section>
     {/* ================= FOOTER ================= */}
<footer style={footer}>
  <div style={footerInner}>

    {/* BRAND */}
    <div style={footerCol}>
      <h2 style={footerLogo}>LearnSphere</h2>
      <p style={footerText}>
        LearnSphere is a modern e-learning platform helping students and
        professionals build real-world skills with expert-led courses.
      </p>
    </div>

    {/* PLATFORM */}
    <div style={footerCol}>
      <h4 style={footerTitle}>Platform</h4>

      {[
        { label: "Browse Courses", href: "/courses" },
        { label: "Join for Free", href: "/register" },
        { label: "Login", href: "/login" },
      ].map((item) => (
        <a
          key={item.label}
          href={item.href}
          style={footerLink}
          onMouseEnter={(e) =>
            (e.currentTarget.lastChild.style.width = "100%")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.lastChild.style.width = "0%")
          }
        >
          {item.label}
          <span style={footerUnderline}></span>
        </a>
      ))}
    </div>

    {/* RESOURCES */}
    <div style={footerCol}>
      <h4 style={footerTitle}>Resources</h4>

      {["Help Center", "Privacy Policy", "Terms & Conditions"].map((text) => (
        <span
          key={text}
          style={footerLink}
          onMouseEnter={(e) =>
            (e.currentTarget.lastChild.style.width = "100%")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.lastChild.style.width = "0%")
          }
        >
          {text}
          <span style={footerUnderline}></span>
        </span>
      ))}
    </div>

    {/* CONTACT */}
    <div style={footerCol}>
      <h4 style={footerTitle}>Connect</h4>
      <p style={footerText}>support@learnsphere.com</p>
      <p style={footerText}>India 🇮🇳</p>
    </div>

  </div>

  <div style={footerBottom}>
    © {new Date().getFullYear()} LearnSphere. All rights reserved.
  </div>
</footer>


    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  width: "100%",
  minHeight: "100vh",
  background: "#f8fafc",
  color: "#1f2937",
};

/* HERO */
const hero = {
  position: "relative",
  height: "90vh",
  overflow: "hidden",
};

const heroSlide = {
  position: "absolute",
  inset: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "opacity 1s ease-in-out",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(135deg, rgba(2,6,23,0.7), rgba(2,6,23,0.4))",
};

const heroInner = {
  position: "relative",
  zIndex: 2,
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "140px 20px",
  color: "white",
};

const badge = {
  background: "rgba(255,255,255,0.15)",
  padding: "6px 14px",
  borderRadius: 20,
  fontWeight: 600,
};

const heroTitle = {
  fontSize: "56px",
  margin: "20px 0",
};

const heroSubtitle = {
  fontSize: "20px",
  maxWidth: "600px",
  marginBottom: "30px",
};

/* SEARCH */
const searchWrap = {
  display: "flex",
  maxWidth: "520px",
  marginBottom: "30px",
};

const searchInput = {
  flex: 1,
  padding: "14px",
  borderRadius: "8px 0 0 8px",
  border: "none",
};

const searchBtn = {
  padding: "14px 24px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "0 8px 8px 0",
};

/* BUTTONS */
const primaryBtn = {
  padding: "14px 30px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
  marginRight: 10,
};

const secondaryBtn = {
  ...primaryBtn,
  background: "white",
  color: "#2563eb",
};

/* STATS */
const statsSection = {
  background: "white",
  padding: "60px 20px",
};

const statsInner = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
};

const statCard = {
  background: "#f1f5f9",
  padding: 30,
  borderRadius: 14,
  textAlign: "center",
};

/* FEATURES */
const features = {
  padding: "80px 20px",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "36px",
  marginBottom: "50px",
};

const featureGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 20,
};

const featureCard = {
  background: "white",
  padding: 25,
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
};

/* COURSES */
const courseSection = {
  background: "#f1f5f9",
  padding: "80px 20px",
};

const courseGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 20,
};

const courseCard = {
  background: "white",
  borderRadius: 14,
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};


const courseImg = {
  width: "100%",
  height: 160,
  objectFit: "cover",
};

const courseBody = {
  padding: 16,
};

const desc = {
  fontSize: 14,
  color: "#475569",
};

const price = {
  color: "#2563eb",
  fontWeight: 700,
};

/* CTA */
const cta = {
  background: "#2563eb",
  color: "white",
  textAlign: "center",
  padding: "90px 20px",
};

const ratingRow = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginTop: 6,
};

const stars = {
  color: "#f59e0b",
  fontSize: 14,
  letterSpacing: 1,
};

const ratingText = {
  fontSize: 13,
  color: "#475569",
};

/* FOOTER */
const footer = {
  background: "#020617",
  color: "#e5e7eb",
  paddingTop: 60,
};

const footerInner = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 40,
};

const footerCol = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const footerLogo = {
  fontSize: 28,
  fontWeight: 800,
};

const footerTitle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 8,
};

const footerText = {
  fontSize: 14,
  color: "#94a3b8",
  lineHeight: 1.6,
};

const footerLink = {
  fontSize: 14,
  color: "#cbd5f5",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};



const footerUnderline = {
  display: "block",
  height: 1,
  width: "0%",
  background: "#38bdf8",
  marginTop: 4,
  transition: "width 0.2s ease",
};



const footerBottom = {
  marginTop: 50,
  padding: "20px",
  textAlign: "center",
  fontSize: 13,
  color: "#94a3b8",
  borderTop: "1px solid #1e293b",
};



export default HomePage;
