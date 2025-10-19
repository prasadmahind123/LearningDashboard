import { Routes , Route } from "react-router-dom"
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import CoursesPage from "./pages/CoursesPage";
import Learner from "./learnerDash/Learner";
import Dashboard from "./learnerDash/Dashboard";
import MyCourses from "./learnerDash/MyCourses";
import Teacher from "./teacherDash/Teacher";
import Progress from "./learnerDash/Progress";
import TDashboard from "./teacherDash/TDashboard";
import TCourses from "./teacherDash/TCourses";
import TStudents from "./teacherDash/TStudents";
import Revenue from "./teacherDash/Revenue";
import Admin from "./adminDash/Admin";
import CourseID from "./pages/CourseID";
import ForgotPassword from "./pages/ForgotPassword";
import CourseDetails from "./pages/CourseDetails";
import PdfViewer from "./pages/PdfViewer";
import { useAppContext } from "./context/AppContext.jsx";

function App() {
  const {showUserLogin} = useAppContext();
  const location = useLocation();
  const hideNavFooterPaths = ["/login", "/register",'/learner' , '/teacher', '/admin' ,'/teacher/courses',
    '/teacher/students', '/teacher/revenue','/learner/my-courses' , '/mycourses'];

  const hideNavFooter = hideNavFooterPaths.some(path => location.pathname.startsWith(path));


  return (
    <div>
      {showUserLogin ? <Login /> : null}
      {!hideNavFooter ? <Navbar /> : null}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/learning-path/:id" element={<CourseID />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pdf-viewer/:url" element={<PdfViewer />} />
          <Route path="/mycourses/:courseId" element={<CourseDetails />} />
          <Route path="/learner" element={<ProtectedRoute allowedRoles={["learner"]}><Learner /></ProtectedRoute>}>
            <Route index element={<Dashboard/>} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="progress" element={<Progress/>} />
          </Route>
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><Teacher /></ProtectedRoute>}>
            <Route index element={<TDashboard />} />
            <Route path="courses" element={<TCourses />} />
            <Route path="students" element={<TStudents />} />
            <Route path="revenue" element={<Revenue />} />
          </Route>
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><Admin /></ProtectedRoute>} />
        </Routes>
      </div>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App; 

