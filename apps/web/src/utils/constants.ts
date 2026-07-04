export const API_URL = "/api";

export const ROLES = ["admin", "teacher", "student"] as const;

export const NAV_ITEMS = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Courses", path: "/admin/courses" },
    { label: "Subjects", path: "/admin/subjects" },
    { label: "Batches", path: "/admin/batches" },
    { label: "Teacher Assignment", path: "/admin/teacher-assignment" },
    { label: "Notices", path: "/admin/notices" },
    { label: "Feedback Forms", path: "/admin/feedback" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Notifications", path: "/notifications" },
  ],
  teacher: [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "My Subjects", path: "/teacher/subjects" },
    { label: "Materials", path: "/teacher/materials" },
    { label: "Assignments", path: "/teacher/assignments" },
    { label: "Attendance", path: "/teacher/attendance" },
    { label: "Marks", path: "/teacher/marks" },
    { label: "Notices", path: "/teacher/notices" },
    { label: "Notifications", path: "/notifications" },
  ],
  student: [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "My Subjects", path: "/student/subjects" },
    { label: "Materials", path: "/student/materials" },
    { label: "Assignments", path: "/student/assignments" },
    { label: "Marks", path: "/student/marks" },
    { label: "Attendance", path: "/student/attendance" },
    { label: "Notices", path: "/student/notices" },
    { label: "Feedback", path: "/student/feedback" },
    { label: "Notifications", path: "/notifications" },
  ],
} as const;
