import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ScrollToTopButton from "./Components/ScrollToTopButton";


import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import CoursePage from "./pages/CoursePage";
import CreateCoursePage from "./pages/CreateCoursePage";
import AddModulePage from "./pages/AddModulePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryManager from "./pages/admin/CategoryManager";
import AdminLayout from "./layouts/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import InstructorProfilePage from "./pages/InstructorProfilePage";
import AdminReviews from "./pages/admin/AdminReviews";
import CourseCertificatePage from "./pages/CourseCertificatePage";
import AdminInstructorRequests from "./pages/admin/AdminInstructorRequests";









import Navbar from "./components/Navbar";

import ProtectedRoute from "./routes/ProtectedRoute";
import StudentRoute from "./routes/StudentRoute";
import InstructorRoute from "./routes/InstructorRoute";
import EditModulePage from "./pages/EditModulePage";
import EditCoursePage from "./pages/EditCoursePage";
import CoursePlayerPage from "./pages/CoursePlayerPage";




function App() {
  return (
    <>
      <Navbar />
      <Routes>

        {/* PUBLIC ROUTES */}
        {/* <Route
  path="/"
  element={
    <MainLayout>
      <HomePage />
    </MainLayout>
  }
/> */}
        <Route path="/" element={<HomePage />} />


        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<AllCoursesPage />} />

        {/* STUDENT ONLY ROUTES */}
        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          }
        />

        {/* INSTRUCTOR ONLY ROUTES */}
        <Route
          path="/instructor/dashboard"
          element={
            <InstructorRoute>
              <InstructorDashboard />
            </InstructorRoute>
          }
        />
        <Route path="/instructor/:instructorId" element={<InstructorProfilePage />} />

        <Route
          path="/create-course"
          element={
            <InstructorRoute>
              <CreateCoursePage />
            </InstructorRoute>
          }
        />

        <Route
          path="/course/:id/add-module"
          element={
            <InstructorRoute>
              <AddModulePage />
            </InstructorRoute>
          }
        />

        {/* PROTECTED ROUTES (Both roles allowed but must be logged in) */}
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId/edit-module/:moduleId"
          element={
            <InstructorRoute>
              <EditModulePage />
            </InstructorRoute>
          }
        />

        <Route
          path="/course/:courseId/edit"
          element={
            <InstructorRoute>
              <EditCoursePage />
            </InstructorRoute>
          }
        />

        <Route
          path="/course-player/:courseId/:moduleId"
          element={<ProtectedRoute><CoursePlayerPage /></ProtectedRoute>}
        />

        <Route
          path="/course/:courseId/certificate"
          element={<ProtectedRoute><CourseCertificatePage /></ProtectedRoute>}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="/admin/instructors" element={<AdminInstructorRequests />} />


        </Route>

        <Route
          path="/admin/courses"
          element={
            <AdminRoute>
              <AdminCourses />
            </AdminRoute>
          }
        />





      </Routes>
      <ScrollToTopButton />
    </>
  );
}

export default App;
