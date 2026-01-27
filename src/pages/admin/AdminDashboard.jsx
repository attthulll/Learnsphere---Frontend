import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";


const BACKEND = "http://localhost:5000";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Admin stats error:", err);
    }
  };

  if (!stats) {
    return (
      <div style={loadingPage}>
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <div>
            <h1 style={title}>Admin Dashboard</h1>
            <p style={subtitle}>System overview & management</p>
          </div>
        </div>

        {/* STATS GRID */}
        <div style={statsGrid}>
          <StatCard title="Total Users" value={stats.totalUsers} accent="#6366f1" />
          <StatCard title="Students" value={stats.totalStudents} accent="#22c55e" />
          <StatCard title="Instructors" value={stats.totalInstructors} accent="#f59e0b" />
          <StatCard title="Courses" value={stats.totalCourses} accent="#0ea5e9" />
        </div>

        {/* ================= CHARTS ================= */}
<div style={chartGrid}>
  
  {/* USER DISTRIBUTION */}
  <div style={chartCard}>
    <h3 style={chartTitle}>User Distribution</h3>

    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={[
            { name: "Students", value: stats.totalStudents },
            { name: "Instructors", value: stats.totalInstructors },
          ]}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          label
        >
          <Cell fill="#22c55e" />
          <Cell fill="#f59e0b" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* PLATFORM OVERVIEW */}
  <div style={chartCard}>
    <h3 style={chartTitle}>Platform Overview</h3>

    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={[
          { name: "Users", value: stats.totalUsers },
          { name: "Students", value: stats.totalStudents },
          { name: "Instructors", value: stats.totalInstructors },
          { name: "Courses", value: stats.totalCourses },
        ]}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

</div>


        {/* ADMIN ACTIONS */}
        <div style={actionsGrid}>
          <ActionCard
            title="Manage Categories"
            desc="Create, edit and organize course categories"
            to="/admin/categories"
            color="#6366f1"
          />

          <ActionCard
            title="Manage Users"
            desc="View, control and manage platform users"
            to="/admin/users"
            color="#22c55e"
          />

          <ActionCard
            title="Manage Courses"
            desc="Moderate and review all courses"
            to="/admin/courses"
            color="#0ea5e9"
          />
          <ActionCard
            title="Moderate Reviews"
            desc="Review and remove inappropriate feedback"
            to="/admin/reviews"
            color="#ef4444"
          />
          <ActionCard
            title="Instructor Requests"
            desc="Approve or reject instructor applications"
            to="/admin/instructors"
            color="#f59e0b"
          />

        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, accent }) {
  return (
    <div style={{ ...statCard, borderLeft: `6px solid ${accent}` }}>
      <p style={statTitle}>{title}</p>
      <h2 style={{ ...statValue, color: accent }}>{value}</h2>
    </div>
  );
}

function ActionCard({ title, desc, to, color }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div style={{ ...actionCard, borderTop: `4px solid ${color}` }}>
        <h3 style={{ color }}>{title}</h3>
        <p style={actionDesc}>{desc}</p>
        <span style={{ ...actionLink, color }}>Open →</span>
      </div>
    </Link>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
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
  fontSize: 40,
  marginBottom: 6,
};

const subtitle = {
  color: "#475569",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 24,
  marginBottom: 50,
};

const statCard = {
  background: "white",
  padding: "22px",
  borderRadius: 16,
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const statTitle = {
  fontSize: 14,
  color: "#64748b",
  marginBottom: 6,
};

const statValue = {
  fontSize: 32,
  margin: 0,
};

const actionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

const actionCard = {
  background: "white",
  padding: 24,
  borderRadius: 18,
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
};

const actionDesc = {
  color: "#475569",
  fontSize: 14,
  margin: "8px 0 12px",
};

const actionLink = {
  fontWeight: 700,
};

const loadingPage = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: 30,
  marginBottom: 50,
};

const chartCard = {
  background: "white",
  padding: 24,
  borderRadius: 18,
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const chartTitle = {
  marginBottom: 10,
  color: "#111827",
};

export default AdminDashboard;
