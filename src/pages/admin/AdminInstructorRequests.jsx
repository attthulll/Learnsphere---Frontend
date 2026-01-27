import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = "http://localhost:5000";

function AdminInstructorRequests() {
  const [instructors, setInstructors] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line
  }, []);

  const loadRequests = async () => {
    const res = await axios.get(
      `${BACKEND}/api/admin/instructors/pending`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setInstructors(res.data);
  };

  const approve = async (id) => {
    await axios.put(
      `${BACKEND}/api/admin/instructors/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadRequests();
  };

  const reject = async (id) => {
    await axios.put(
      `${BACKEND}/api/admin/instructors/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadRequests();
  };

  return (
    <div style={page}>
      <h1 style={title}>Instructor Requests</h1>
      <p style={subtitle}>Approve or reject instructor applications</p>

      {instructors.length === 0 && (
        <div style={emptyCard}>
          <p>No pending instructor requests 🎉</p>
        </div>
      )}

      <div style={grid}>
        {instructors.map((i) => (
          <div key={i._id} style={card}>
            <div>
              <h3 style={name}>{i.name}</h3>
              <p style={email}>{i.email}</p>
              <span style={badge}>Pending</span>
            </div>

            <div style={actions}>
              <button
                style={{ ...btn, ...approveBtn }}
                onClick={() => approve(i._id)}
              >
                Approve
              </button>
              <button
                style={{ ...btn, ...rejectBtn }}
                onClick={() => reject(i._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminInstructorRequests;

/* ================= STYLES ================= */

const page = {
  maxWidth: 1100,
  margin: "0 auto",
};

const title = {
    color: "#111827",
  fontSize: 36,
  marginBottom: 6,
};

const subtitle = {
  color: "#64748b",
  marginBottom: 30,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 20,
};

const card = {
  background: "white",
  padding: 22,
  borderRadius: 16,
  boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const name = {
  margin: 0,
  fontSize: 18,
  color: "#111827",
};

const email = {
  fontSize: 14,
  color: "#475569",
  marginBottom: 6,
};

const badge = {
  display: "inline-block",
  padding: "4px 10px",
  fontSize: 12,
  borderRadius: 20,
  background: "#fef3c7",
  color: "#92400e",
  fontWeight: 600,
};

const actions = {
  display: "flex",
  gap: 10,
};

const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const approveBtn = {
  background: "#22c55e",
  color: "white",
};

const rejectBtn = {
  background: "#ef4444",
  color: "white",
};

const emptyCard = {
  background: "white",
  padding: 30,
  borderRadius: 16,
  textAlign: "center",
  color: "#64748b",
  boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
};
