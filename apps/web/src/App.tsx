import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./pages/auth/Login";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { CourseManagement } from "./pages/admin/CourseManagement";
import { SubjectManagement } from "./pages/admin/SubjectManagement";
import { TeacherAssignment } from "./pages/admin/TeacherAssignment";
import { BatchManagement } from "./pages/admin/BatchManagement";
import { NoticeManagement } from "./pages/admin/NoticeManagement";
import { FeedbackManagement } from "./pages/admin/FeedbackManagement";
import { Reports } from "./pages/admin/Reports";
import { TeacherDashboard } from "./pages/teacher/Dashboard";
import { TeacherSubjects } from "./pages/teacher/MySubjects";
import { TeacherAssignments } from "./pages/teacher/Assignments";
import { TeacherAttendance } from "./pages/teacher/Attendance";
import { TeacherMarks } from "./pages/teacher/Marks";
import { TeacherMaterials } from "./pages/teacher/Materials";
import { TeacherNotices } from "./pages/teacher/Notices";
import { StudentDashboard } from "./pages/student/Dashboard";
import { StudentSubjects } from "./pages/student/MySubjects";
import { StudentMaterials } from "./pages/student/Materials";
import { StudentAssignments } from "./pages/student/Assignments";
import { StudentMarks } from "./pages/student/MyMarks";
import { StudentAttendance } from "./pages/student/Attendance";
import { StudentNotices } from "./pages/student/Notices";
import { StudentFeedback } from "./pages/student/Feedback";
import { Notifications } from "./pages/Notifications";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute roles={["admin"]}><CourseManagement /></ProtectedRoute>} />
            <Route path="/admin/subjects" element={<ProtectedRoute roles={["admin"]}><SubjectManagement /></ProtectedRoute>} />
            <Route path="/admin/teacher-assignment" element={<ProtectedRoute roles={["admin"]}><TeacherAssignment /></ProtectedRoute>} />
            <Route path="/admin/batches" element={<ProtectedRoute roles={["admin"]}><BatchManagement /></ProtectedRoute>} />
            <Route path="/admin/notices" element={<ProtectedRoute roles={["admin"]}><NoticeManagement /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute roles={["admin"]}><FeedbackManagement /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><Reports /></ProtectedRoute>} />

            <Route path="/teacher/dashboard" element={<ProtectedRoute roles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/subjects" element={<ProtectedRoute roles={["teacher"]}><TeacherSubjects /></ProtectedRoute>} />
            <Route path="/teacher/assignments" element={<ProtectedRoute roles={["teacher"]}><TeacherAssignments /></ProtectedRoute>} />
            <Route path="/teacher/attendance" element={<ProtectedRoute roles={["teacher"]}><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/teacher/marks" element={<ProtectedRoute roles={["teacher"]}><TeacherMarks /></ProtectedRoute>} />
            <Route path="/teacher/materials" element={<ProtectedRoute roles={["teacher"]}><TeacherMaterials /></ProtectedRoute>} />
            <Route path="/teacher/notices" element={<ProtectedRoute roles={["teacher"]}><TeacherNotices /></ProtectedRoute>} />

            <Route path="/student/dashboard" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/subjects" element={<ProtectedRoute roles={["student"]}><StudentSubjects /></ProtectedRoute>} />
            <Route path="/student/materials" element={<ProtectedRoute roles={["student"]}><StudentMaterials /></ProtectedRoute>} />
            <Route path="/student/assignments" element={<ProtectedRoute roles={["student"]}><StudentAssignments /></ProtectedRoute>} />
            <Route path="/student/marks" element={<ProtectedRoute roles={["student"]}><StudentMarks /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute roles={["student"]}><StudentAttendance /></ProtectedRoute>} />
            <Route path="/student/notices" element={<ProtectedRoute roles={["student"]}><StudentNotices /></ProtectedRoute>} />
            <Route path="/student/feedback" element={<ProtectedRoute roles={["student"]}><StudentFeedback /></ProtectedRoute>} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
