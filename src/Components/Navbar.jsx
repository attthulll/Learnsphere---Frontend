// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => setRole(localStorage.getItem("role"));

    update();
    window.addEventListener("auth-change", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("auth-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    setRole(null);
    navigate("/login");
  };

  return (
    <nav style={navbar}>
      {/* LOGO */}
      <div style={logo} onClick={() => navigate("/")}>
        Learn<span style={{ color: "#38bdf8" }}>Sphere</span>
      </div>

      {/* LINKS */}
      <div style={links}>
        <NavItem label="Courses" onClick={() => navigate("/courses")} />

        {/* STUDENT */}
        {role === "student" && (
          <>
            <NavItem label="My Learning" onClick={() => navigate("/student/dashboard")} />
            <Logout onClick={logoutUser} />
          </>
        )}

        {/* INSTRUCTOR */}
{role === "instructor" && (
  <>
    <NavItem
      label="Dashboard"
      onClick={() => navigate("/instructor/dashboard")}
    />

    {/* ⭐ NEW: Instructor Profile */}
    <NavItem
      label="My Profile"
      onClick={() =>
        navigate(`/instructor/${localStorage.getItem("userId")}`)
      }
    />

    <NavItem
      label="Create Course"
      onClick={() => navigate("/create-course")}
    />

    <Logout onClick={logoutUser} />
  </>
)}


        {/* ADMIN */}
        {role === "admin" && (
          <>
            <NavItem label="Admin Panel" onClick={() => navigate("/admin")} />
            <Logout onClick={logoutUser} />
          </>
        )}

        {/* GUEST */}
        {!role && (
          <>
            <NavItem label="Login" onClick={() => navigate("/login")} />
            <button style={cta} onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ================= COMPONENTS ================= */

function NavItem({ label, onClick }) {
  return (
    <span onClick={onClick} style={navItem}>
      {label}
    </span>
  );
}

function Logout({ onClick }) {
  return (
    <span onClick={onClick} style={logout}>
      Logout
    </span>
  );
}

/* ================= STYLES ================= */

const navbar = {
  width: "100%",
  height: 72,
  padding: "0 40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "linear-gradient(135deg, #020617, #020617)",
  borderBottom: "1px solid #1e293b",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const logo = {
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: 0.5,
  cursor: "pointer",
  color: "#e5e7eb",
};

const links = {
  display: "flex",
  alignItems: "center",
  gap: 26,
};

const navItem = {
  cursor: "pointer",
  color: "#e5e7eb",
  fontWeight: 500,
  position: "relative",
  transition: "color 0.25s ease",
};

navItem["::after"] = {};

const logout = {
  cursor: "pointer",
  color: "#f87171",
  fontWeight: 600,
  transition: "color 0.25s ease",
};

const cta = {
  padding: "8px 18px",
  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  color: "#020617",
  border: "none",
  borderRadius: 999,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(56,189,248,0.35)",
  transition: "transform 0.2s ease",
};

export default Navbar;
