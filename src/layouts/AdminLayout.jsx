import { Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div style={layout}>
      {/* ================= SIDEBAR ================= */}
      <aside style={sidebar}>
  <div>
    <h2 style={brand}>LearnSphere</h2>
    <p style={role}>Admin Panel</p>

    <nav style={nav}>
      <NavButton label="Dashboard" onClick={() => navigate("/admin")} />
      <NavButton label="Categories" onClick={() => navigate("/admin/categories")} />
      <NavButton label="Users" onClick={() => navigate("/admin/users")} />
      <NavButton label="Courses" onClick={() => navigate("/admin/courses")} />
        <NavButton
  label="Instructor Requests"
  onClick={() => navigate("/admin/instructors")}
/>

        <NavButton
  label="Reviews"
  onClick={() => navigate("/admin/reviews")}
/>

    </nav>
  </div>
</aside>


      {/* ================= MAIN CONTENT ================= */}
      <main style={main}>
        <div style={content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function NavButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={navBtn}>
      {label}
    </button>
  );
}

/* ================= STYLES ================= */

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
};

const sidebar = {
  width: 260,
  background: "white",
  borderRight: "1px solid #e2e8f0",
  padding: "30px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",   // ✅ keeps content top-aligned
};

const brand = {
  fontSize: 22,
  marginBottom: 2,
  color: "#1e293b",
};

const role = {
  fontSize: 13,
  color: "#64748b",
  marginBottom: 30,
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const navBtn = {
  padding: "12px 14px",
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  cursor: "pointer",
  textAlign: "left",
  fontWeight: 600,
  color: "#1e293b",

  /* animation */
  transition: "all 0.25s ease",
};


const main = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
};

const content = {
  width: "100%",
  maxWidth: 1200,
  padding: "40px 30px",
};

export default AdminLayout;
