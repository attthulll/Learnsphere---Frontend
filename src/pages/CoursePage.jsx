// src/pages/CoursePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_BASE = "http://localhost:5000";

const RAZORPAY_KEY = "rzp_test_RnqBv8eN2d8YV6";

function CoursePage() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
const [avgRating, setAvgRating] = useState(0);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");


  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const resolveThumb = (thumb) => {
  if (!thumb) return null;
  if (thumb.startsWith("http")) return thumb;
  if (thumb.startsWith("/")) return `${BACKEND_BASE}${thumb}`;
  return `${BACKEND_BASE}/${thumb}`;
};

  useEffect(() => {
    loadCourse();
    loadReviews();
  }, [id]);

  const loadCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/view/${id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      setCourseData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading course:", err);
      setLoading(false);
    }
  };

  const loadReviews = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/courses/${id}/reviews`
    );
    setReviews(res.data.reviews);
    setAvgRating(res.data.averageRating);
  } catch (err) {
    console.error("Load reviews error:", err);
  }
};


  const buyCourse = async () => {
    try {
      const orderRes = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        { amount: courseData.course.price }
      );

      const order = orderRes.data;

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "LearnSphere",
        description: courseData.course.title,
        order_id: order.id,
        handler: async function (response) {
          await axios.post("http://localhost:5000/api/payments/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          await axios.post(
            `http://localhost:5000/api/courses/${courseData.course._id}/enroll`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("Payment successful — enrolled!");
          loadCourse();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Buy error:", err);
      alert("Payment failed");
    }
  };

  const submitReview = async () => {
  try {
    await axios.post(
      `http://localhost:5000/api/courses/${course._id}/review`,
      { rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Review submitted");
    setRating("");
    setComment("");
    loadCourse();
  } catch (err) {
    alert(err.response?.data?.message || "Review failed");
  }
};


  if (loading) return <h2 style={{ padding: 40 }}>Loading...</h2>;
  if (!courseData) return <h2 style={{ padding: 40 }}>Course not found</h2>;

  const { course, isEnrolled } = courseData;
  const canAccess = role === "instructor" || isEnrolled;

  return (
    <div style={page}>
      {/* HERO */}
      <div style={hero}>
        <div style={heroContent}>
          <h1 style={title}>{course.title}</h1>
          <p style={desc}>{course.description}</p>
          <p style={instructor}>
  Instructor:{" "}
  <span
    style={{ color: "#2563eb", cursor: "pointer" }}
    onClick={() =>
      window.location.href = `/instructor/${course.instructor._id}`
    }
  >
    {course.instructor?.name}
  </span>
</p>

        </div>

        <div style={priceCard}>
          {course.thumbnail && (
  <img
    src={resolveThumb(course.thumbnail)}
    alt={course.title}
    style={thumbnail}
  />
)}


          <h2 style={price}>₹{course.price}</h2>

          {/* CTA */}
          {role === "student" && !isEnrolled && (
            <button style={buyBtn} onClick={buyCourse}>
              Buy Course
            </button>
          )}

          {role === "student" && isEnrolled && (
            <button
              style={startBtn}
              onClick={() =>
                window.location.href = `/course-player/${course._id}/${course.modules[0]?._id}`
              }
            >
              Start Learning →
            </button>
          )}

          {role === "student" && isEnrolled && (
  <button
    style={{ ...startBtn, marginTop: 10, background: "#16a34a" }}
    onClick={() =>
      window.location.href = `/course/${course._id}/certificate`
    }
  >
    View Certificate 🎓
  </button>
)}


          {role === "instructor" && (
            <button
              style={instructorBtn}
              onClick={() =>
                window.location.href = `/course-player/${course._id}/${course.modules[0]?._id}`
              }
            >
              View Course Content →
            </button>
          )}
        </div>
      </div>

      {/* MODULES */}
      <div style={moduleSection}>
        <h2 style={sectionTitle}>Course Content</h2>

        {course.modules.length === 0 && (
          <p>No modules added yet.</p>
        )}

        {course.modules.map((m, i) => (
          <div key={m._id} style={moduleCard}>
            <h3>
              {i + 1}. {m.title}
            </h3>

            {canAccess ? (
              <div style={links}>
                {m.videoUrl && (
                  <a
                    href={m.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={videoLink}
                  >
                    ▶ Watch Video
                  </a>
                )}

                {m.pdfUrl && (
                  <a
                    href={m.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={pdfLink}
                  >
                    📄 View PDF
                  </a>
                )}
              </div>
            ) : (
              <p style={{ color: "#f97316" }}>
                Buy the course to access content
              </p>
            )}
          </div>
        ))}
        {role === "student" && !isEnrolled && (
  <p style={{ color: "#64748b", marginBottom: 10 }}>
    Enroll in this course to submit a review.
  </p>
)}

      </div>
     {/* ================= REVIEWS ================= */}
<div style={{ maxWidth: 1200, margin: "60px auto" }}>
  <h2 style={{ fontSize: 28, marginBottom: 6,color: "#111827" }}>
    Reviews & Ratings
  </h2>

  <p style={{ color: "#475569", marginBottom: 24 }}>
    ⭐ Average Rating: <strong>{avgRating}</strong> / 5
  </p>

  {/* ---------- ADD REVIEW ---------- */}
  {role === "student" && isEnrolled && (
    <div style={reviewForm}>
      <h3 style={{ marginBottom: 12 }}>Leave a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        style={ratingSelect}
      >
        <option value="">Select Rating</option>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} ⭐
          </option>
        ))}
      </select>

      <textarea
        placeholder="Share your experience with this course..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={reviewTextarea}
      />

      <button style={{ ...buyBtn, width: "fit-content" }} onClick={submitReview}>
        Submit Review
      </button>
    </div>
  )}

  {/* ---------- REVIEWS LIST ---------- */}
  {reviews.length === 0 && (
    <p style={{ color: "#64748b" }}>No reviews yet.</p>
  )}

  <div style={reviewGrid}>
    {reviews.map((r) => (
      <div key={r._id} style={reviewCard}>
        <div style={reviewHeader}>
          <strong>{r.student?.name || "Student"}</strong>
          <span style={ratingBadge}>{r.rating} ⭐</span>
        </div>

        <p style={reviewText}>{r.comment}</p>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  background: "#f8fafc",
  minHeight: "100vh",
  padding: "40px 20px",
};

const hero = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 30,
  marginBottom: 50,
};

const heroContent = {
  paddingRight: 20,
};

const title = {
  color: "#111827",
  fontSize: 42,
  marginBottom: 10,
};

const desc = {
  fontSize: 16,
  color: "#475569",
  marginBottom: 10,
};

const instructor = {
  fontSize: 14,
  color: "#64748b",
};

const priceCard = {
  background: "white",
  color: "#1f2937",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
};

const thumbnail = {
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: 12,
  marginBottom: 15,
};

const price = {
  fontSize: 28,
  marginBottom: 15,
};

const buyBtn = {
  width: "100%",
  padding: "12px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const startBtn = {
  ...buyBtn,
  background: "#2563eb",
};

const instructorBtn = {
  ...buyBtn,
  background: "#7c3aed",
};

const moduleSection = {
  maxWidth: 1200,
  margin: "0 auto",
};

const sectionTitle = {
  color: "#111827",
  fontSize: 28,
  marginBottom: 20,
};

const moduleCard = {
  background: "white",
  color: "#1f2937",
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const links = {
  display: "flex",
  gap: 20,
  marginTop: 8,
};

const videoLink = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 500,
};

const pdfLink = {
  color: "#0ea5e9",
  textDecoration: "none",
  fontWeight: 500,
};
const reviewForm = {
  color: "#1f2937",
  background: "white",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  marginBottom: 40,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const ratingSelect = {
  width: 160,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const reviewTextarea = {
  width: "100%",
  minHeight: 90,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  resize: "vertical",
};

const reviewGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 20,
};

const reviewCard = {
  color: "#1f2937",
  background: "white",
  padding: 18,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const reviewHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
};

const ratingBadge = {
  background: "#dbeafe",
  color: "#2563eb",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
};

const reviewText = {
  fontSize: 14,
  color: "#475569",
};


export default CoursePage;
