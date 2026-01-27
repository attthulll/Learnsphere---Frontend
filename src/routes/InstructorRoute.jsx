import { Navigate } from "react-router-dom";

export default function InstructorRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "instructor") return <Navigate to="/" replace />;

  return children;
}
