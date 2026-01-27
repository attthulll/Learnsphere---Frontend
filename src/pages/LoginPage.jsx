import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);

      // 🔥 IMPORTANT
      window.dispatchEvent(new Event("auth-change"));

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={page}>
      <div style={overlay}>
        <form onSubmit={handleLogin} style={card}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h1 style={brand}>LearnSphere</h1>
            <p style={subtitle}>Welcome back. Please login to continue.</p>
          </div>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            required
          />

          <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ ...input, paddingRight: 44 }}
    required
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: 14,
      color: "#475569",
      userSelect: "none",
    }}
  >
    {showPassword ? "👁" : "⌣"}
  </span>
</div>


          <button type="submit" style={button}>
            Login
          </button>

          {message && <p style={error}>{message}</p>}

          <p style={footerText}>
            New to LearnSphere?{" "}
            <span
              style={link}
              onClick={() => navigate("/register")}
            >
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay = {
  minHeight: "100vh",
  background:
    "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.75))",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "40px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "380px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const brand = {
  margin: 0,
  color: "#2563eb",
  fontSize: "32px",
  fontWeight: "800",
};

const subtitle = {
  marginTop: 6,
  color: "#475569",
  fontSize: "14px",
};

const input = {
  padding: "14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
};

const button = {
  padding: "14px",
  marginTop: 10,
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const error = {
  textAlign: "center",
  color: "#dc2626",
  fontSize: "14px",
};

const footerText = {
  textAlign: "center",
  fontSize: "14px",
  color: "#475569",
  marginTop: 10,
};

const link = {
  color: "#2563eb",
  fontWeight: "600",
  cursor: "pointer",
};

export default LoginPage;
