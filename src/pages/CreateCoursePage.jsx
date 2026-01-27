import { useState, useEffect } from "react";
import axios from "axios";

function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("thumbnail", thumbnail);

      await axios.post(
        "http://localhost:5000/api/courses/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Course created successfully!");

      setTimeout(() => {
        window.location.href = "/instructor/dashboard";
      }, 1000);
    } catch (err) {
      console.log(err);
      setMessage("Failed to create course");
    }
  };

  return (
    <div style={page}>
      <div style={overlay}>
        <form onSubmit={handleCreateCourse} style={card}>
          <h1 style={titleStyle}>Create New Course</h1>
          <p style={subtitle}>
            Fill in the details below to publish your course
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={select}
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* THUMBNAIL */}
          <div style={field}>
            <label style={label}>Course Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              style={fileInput}
              required
            />
          </div>

          <button type="submit" style={button}>
            Create Course
          </button>

          {message && <p style={messageStyle}>{message}</p>}
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
  background: "rgba(255,255,255,0.96)",
  padding: "40px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: 480,
  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const titleStyle = {
  color: "#111827",
  marginBottom: 6,
  fontSize: 32,
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

const messageStyle = {
  textAlign: "center",
  fontSize: 14,
  color: "#16a34a",
};

export default CreateCoursePage;
