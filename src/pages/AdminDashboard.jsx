function AdminDashboard() {
  return (
    <div style={{ padding: 20, color: "white" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginTop: 30, display: "flex", gap: 20 }}>
        <button
          onClick={() => (window.location.href = "/admin/categories")}
          style={{
            padding: 12,
            background: "purple",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Manage Categories
        </button>

        {/* More admin actions later */}
      </div>
    </div>
  );
}

export default AdminDashboard;
