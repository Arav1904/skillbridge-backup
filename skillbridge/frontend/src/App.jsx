import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Courses from './pages/public/Courses';
import NotFound from './pages/public/NotFound';

import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import CourseViewer from './pages/student/CourseViewer';
import Assignments from './pages/student/Assignments';
import Certificates from './pages/student/Certificates';

import InstructorLayout from './pages/instructor/InstructorLayout';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CourseManagement from './pages/instructor/CourseManagement';
import CreateCourse from './pages/instructor/CreateCourse';
import GradingPortal from './pages/instructor/GradingPortal';
import StudentsPage from './pages/instructor/StudentsPage';
import AddLesson from './pages/instructor/AddLesson';
import CreateAssignment from './pages/instructor/CreateAssignment';

function AppRoutes() {
  const { user } = useAuth();
  const dash = user?.role_id === 2 ? '/instructor' : '/student';

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={user ? <Navigate to={dash} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={dash} replace /> : <Register />} />

        <Route path="/student" element={<ProtectedRoute requiredRole={3}><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="course/:courseId" element={<CourseViewer />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="certificates" element={<Certificates />} />
        </Route>

        <Route path="/instructor" element={<ProtectedRoute requiredRole={2}><InstructorLayout /></ProtectedRoute>}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="edit-course/:courseId" element={<CreateCourse />} />
          <Route path="grading" element={<GradingPortal />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="add-lesson" element={<AddLesson />} />
          <Route path="create-assignment" element={<CreateAssignment />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}
