export const API_URL = "/api";

export const ROLES = ["admin", "teacher", "student"] as const;

export const NAV_ITEMS = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Courses", path: "/admin/courses" },
    { label: "Subjects", path: "/admin/subjects" },
  ],
  teacher: [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "My Subjects", path: "/teacher/subjects" },
    { label: "Assignments", path: "/teacher/assignments" },
    { label: "Attendance", path: "/teacher/attendance" },
    { label: "Marks", path: "/teacher/marks" },
  ],
  student: [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "My Subjects", path: "/student/subjects" },
    { label: "Assignments", path: "/student/assignments" },
    { label: "Marks", path: "/student/marks" },
    { label: "Attendance", path: "/student/attendance" },
    { label: "Feedback", path: "/student/feedback" },
  ],
} as const;
