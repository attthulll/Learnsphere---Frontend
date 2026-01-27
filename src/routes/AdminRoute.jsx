// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminRoute({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  useEffect(() => {
    const updateAuth = () => {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      });
    };

    window.addEventListener("auth-change", updateAuth);
    window.addEventListener("storage", updateAuth);

    return () => {
      window.removeEventListener("auth-change", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  if (!auth.token || auth.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;
