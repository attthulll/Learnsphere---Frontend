import { useEffect, useState } from "react";
import apiClient from "../../api/axios.js";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line
  }, []);

  const loadReviews = async () => {
    try {
      const res = await apiClient.get(`/admin/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Load reviews error:", err);
    }
  };

  const deleteReview = async (courseId, reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await apiClient.delete(
        `/admin/reviews/${courseId}/${reviewId}`
      );
      loadReviews();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  return (
    <div style={page}>
      <h1 style={title}>Review Moderation</h1>

      {reviews.length === 0 && <p>No reviews found.</p>}

      {reviews.map((r) => (
        <div key={r.reviewId} style={card}>
          <h3>{r.courseTitle}</h3>
          <p>
            <strong>{r.student?.name}</strong> ⭐ {r.rating}
          </p>
          <p>{r.comment}</p>

          <button
            onClick={() => deleteReview(r.courseId, r.reviewId)}
            style={deleteBtn}
          >
            Remove Review
          </button>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: "60px 20px",
  maxWidth: 900,
  margin: "0 auto",
};

const title = {
  color: "#111827",
  fontSize: 36,
  marginBottom: 30,
};

const card = {
  background: "white",
  color: "#374151",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  marginBottom: 20,
};

const deleteBtn = {
  marginTop: 10,
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

export default AdminReviews;
