export type Role = "admin" | "teacher" | "student";

export type UserStatus = "active" | "inactive";

export type AttendanceStatus = "present" | "absent" | "late";

export type NoticePriority = "normal" | "urgent";

export type NoticeTarget = "all" | "students" | "teachers" | "course" | "batch";

export type AssignmentStatus = "open" | "closed";

export type SubmissionStatus = "submitted" | "graded" | "returned";

export interface PaginationParams {
  page: number;
  limit: number;
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
