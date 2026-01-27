import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND = "http://localhost:5000";

function EditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourse();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  /* ---------------- FETCH COURSE ---------------- */
const fetchCourse = async () => {
  try {
    const res = await axios.get(
      `${BACKEND}/api/courses/view/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const course = res.data.course;
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setCategoryId(course.category?._id || "");
  } catch (err) {
    console.error("Load course error:", err);
    alert("Failed to load course data");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- FETCH CATEGORIES ---------------- */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Load categories error:", err);
    }
  };

  /* ---------------- UPDATE COURSE ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);

      if (categoryId) formData.append("category", categoryId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      await axios.put(
        `${BACKEND}/api/courses/${courseId}/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Course updated successfully!");
      navigate(`/course/${courseId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    }
  };

  if (loading) {
    return <h2 style={{ padding: 40 }}>Loading...</h2>;
  }

  return (
    <div style={page}>
      <div style={overlay}>
        <form onSubmit={handleUpdate} style={card}>
          <h1 style={titleStyle}>Edit Course</h1>
          <p style={subtitle}>
            Update your course details and save changes
          </p>

          {/* TITLE */}
          <div style={field}>
            <label style={label}>Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={input}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div style={field}>
            <label style={label}>Course Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={textarea}
              required
            />
          </div>

          {/* PRICE */}
          <div style={field}>
            <label style={label}>Course Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={input}
              required
            />
          </div>

          {/* CATEGORY */}
          <div style={field}>
            <label style={label}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={select}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* THUMBNAIL */}
          <div style={field}>
            <label style={label}>Update Thumbnail (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              style={fileInput}
            />
          </div>

          <button type="submit" style={button}>
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e0ecff, #f8fafc)",
};

const overlay = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
};

const card = {
  background: "rgba(255,255,255,0.97)",
  padding: "40px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: 500,
  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const titleStyle = {
  color: "#111827",
  fontSize: 32,
  marginBottom: 6,
};

const subtitle = {
  marginBottom: 20,
  color: "#475569",
  fontSize: 14,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const label = {
  fontSize: 14,
  fontWeight: 600,
  color: "#334155",
};

const input = {
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 15,
};

const textarea = {
  ...input,
  height: 100,
  resize: "vertical",
};

const select = {
  ...input,
  background: "white",
};

const fileInput = {
  fontSize: 14,
};

const button = {
  marginTop: 10,
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

export default EditCoursePage;
