import { Navigate } from "react-router-dom";

export default function StudentRoute({ children }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  if (role !== "student") return <Navigate to="/login" />;

  return children;
}
