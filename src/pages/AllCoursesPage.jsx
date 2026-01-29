// src/pages/AllCoursesPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../api/axios.js";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function AllCoursesPage() {
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [sortOption, setSortOption] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;


  const role = localStorage.getItem("role");

  useEffect(() => {
    loadCourses();
    loadCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortOption]);


  const loadCategories = async () => {
    try {
      const res = await apiClient.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.log("Category load error:", err);
    }
  };

  const resolveThumb = (thumb) => {
    if (!thumb) return null;
    if (thumb.startsWith("http")) return thumb;
    if (thumb.startsWith("/")) return `${API_BASE_URL}${thumb}`;
    return `${API_BASE_URL}/${thumb}`;
  };

  const loadCourses = async () => {
    try {
      const url =
        selectedCategory === "all"
          ? "/courses"
          : `/courses?category=${selectedCategory}`;

      const res = await apiClient.get(url);
      setCourses(res.data || []);
    } catch (err) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  let filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedCategory !== "all") {
    filteredCourses = filteredCourses.filter(
      (c) => c.category && c.category._id === selectedCategory
    );
  }

  if (sortOption === "newest") {
    filteredCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOption === "oldest") {
    filteredCourses.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortOption === "priceLow") {
    filteredCourses.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHigh") {
    filteredCourses.sort((a, b) => b.price - a.price);
  } else if (sortOption === "titleAZ") {
    filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "titleZA") {
    filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
  }


  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );



  if (loading) {
    return (
      <div style={loader}>
        <h2>Loading courses...</h2>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={container}>
        <h1 style={title}>All Courses</h1>

        {/* FILTER BAR */}
        <div style={filterBar}>
          <input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={select}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={select}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priceLow">Price ↑</option>
            <option value="priceHigh">Price ↓</option>
            <option value="titleAZ">A → Z</option>
            <option value="titleZA">Z → A</option>
          </select>
        </div>

        {filteredCourses.length === 0 && (
          <p style={{ color: "#64748b" }}>No courses found.</p>
        )}

        {/* COURSE GRID */}
        <div style={grid}>
          {paginatedCourses.map((c) => {
            console.log("COURSE CARD DATA:", c.title, c.avgRating, c.reviewCount, c.reviews);

            const thumb = resolveThumb(c.thumbnail);

            return (
              <div key={c._id} style={card} className="course-card">

                {thumb && <img src={thumb} alt={c.title} style={image} />}

                <div style={cardBody}>
                  {c.category && (
                    <span style={badge}>{c.category.name}</span>
                  )}

                  <h3 style={courseTitle}>{c.title}</h3>

                  {/* ⭐ RATING */}
                  {/* ⭐ RATING */}
                  {c.reviewCount > 0 && (
                    <div style={ratingRow}>
                      <span style={stars}>⭐</span>
                      <span style={ratingText}>
                        {c.avgRating.toFixed(1)} ({c.reviewCount})
                      </span>
                    </div>
                  )}


                  <p style={desc}>
                    {c.description?.slice(0, 90)}
                    {c.description?.length > 90 && "..."}
                  </p>

                  <div style={meta}>
                    <span style={price}>₹{c.price}</span>
                    <span style={instructor}>
                      {c.instructor?.name || "Instructor"}
                    </span>
                  </div>

                  <div style={actions}>
                    <button
                      onClick={() => (window.location.href = `/course/${c._id}`)}
                      style={viewBtn} className="course-btn">View</button>

                    {role === "student" ? (
                      <button
                        onClick={() => (window.location.href = `/course/${c._id}`)}
                        style={buyBtn} className="course-btn">Buy</button>
                    ) : (
                      role === "instructor" && (
                        <button
                          onClick={() =>
                            (window.location.href = `/course/${c._id}/edit`)
                          }
                          style={editBtn} className="course-btn">Edit</button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={pagination}>
            <button
              style={pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                style={{
                  ...pageBtn,
                  ...(currentPage === i + 1 ? activePageBtn : {}),
                }}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              style={pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  background: "#f8fafc",
  minHeight: "100vh",
  padding: "60px 20px",
};

const container = {
  maxWidth: 1200,
  margin: "0 auto",
};

const title = {
  color: "#111827",
  fontSize: 42,
  marginBottom: 30,
};

const filterBar = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 40,
};

const searchInput = {
  flex: 1,
  minWidth: 240,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const select = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

const card = {
  background: "white",
  color: "#1f2937",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
};

const image = {
  width: "100%",
  height: 150,
  objectFit: "cover",
};

const cardBody = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
};

const badge = {
  background: "#e0edff",
  color: "#2563eb",
  fontSize: 12,
  padding: "4px 10px",
  borderRadius: 20,
  alignSelf: "flex-start",
  marginBottom: 6,
};

const courseTitle = {
  fontSize: 18,
  margin: "6px 0",
};

const desc = {
  fontSize: 14,
  color: "#475569",
  flexGrow: 1,
};

const meta = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
};

const price = {
  fontWeight: 700,
  color: "#2563eb",
};

const instructor = {
  fontSize: 13,
  color: "#64748b",
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 14,
};

const viewBtn = {
  flex: 1,
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const buyBtn = {
  padding: "10px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: 8,
};

const editBtn = {
  padding: "10px",
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: 8,
};

const loader = {
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const ratingRow = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginTop: 6,
};

const stars = {
  color: "#facc15", // gold
  fontSize: 14,
};

const ratingText = {
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginTop: 40,
};

const pageBtn = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  background: "white",
  cursor: "pointer",
  fontWeight: 600,
};

const activePageBtn = {
  background: "#2563eb",
  color: "white",
  borderColor: "#2563eb",
};

export default AllCoursesPage;
