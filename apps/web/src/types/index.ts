export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "active" | "inactive";
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  duration: number;
  description?: string;
  status: "active" | "archived";
  enrolledStudentCount?: number;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  course: { _id: string; name: string; code: string };
  semester: number;
  creditHours?: number;
  assignedTeachers: { _id: string; name: string; email: string }[];
  status: "active" | "archived";
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
