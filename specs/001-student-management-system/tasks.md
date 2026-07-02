---
description: "Task list for Student Management System implementation"
---

# Tasks: Student Management System

**Input**: Design documents from `specs/001-student-management-system/`

**Format**: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create root monorepo configs: package.json, turbo.json, tsconfig.base.json, .gitignore, .env.example
- [ ] T002 [P] Create apps/server package.json with Express + Mongoose + JWT dependencies
- [ ] T003 [P] Create apps/web package.json with React + Vite + Tailwind dependencies
- [ ] T004 [P] Create packages/shared package.json and source files (types, constants)
- [ ] T005 [P] Configure apps/web Vite config with proxy and path aliases
- [ ] T006 [P] Configure Tailwind CSS (tailwind.config.ts, postcss.config.js, index.html)
- [ ] T007 [P] Configure apps/server tsconfig.json for CommonJS output
- [ ] T008 [P] Configure apps/web tsconfig.json with JSX and path aliases
- [ ] T009 [P] Configure packages/shared tsconfig.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create server entry point in apps/server/src/index.ts (bootstrap)
- [ ] T011 Create Express app setup in apps/server/src/app.ts (middleware chain)
- [ ] T012 Create DB connection config in apps/server/src/config/db.ts
- [ ] T013 Create environment validation in apps/server/src/config/env.ts (Zod)
- [ ] T014 Create file storage config in apps/server/src/config/fileStorage.ts (Multer)
- [ ] T015 Create utils/asyncHandler.ts for async error wrapping
- [ ] T016 Create utils/ApiResponse.ts standard response class
- [ ] T017 Create utils/ApiError.ts custom error class
- [ ] T018 Create utils/pagination.ts pagination helper
- [ ] T019 Create utils/jwt.ts token generation and verification
- [ ] T020 Create middleware/errorHandler.ts global error handler
- [ ] T021 Create middleware/auth.ts JWT verification middleware
- [ ] T022 Create middleware/rbac.ts role-based access middleware
- [ ] T023 Create middleware/validate.ts Zod request validation middleware
- [ ] T024 Create middleware/upload.ts file upload middleware
- [ ] T025 Create middleware/auditLog.ts audit trail middleware
- [ ] T026 Create types/express.d.ts for Express augmentation (user property)
- [ ] T027 Create types/api.types.ts for request/response types
- [ ] T028 Create models/User.ts base user schema with discriminators
- [ ] T029 Create models/Student.ts student discriminator
- [ ] T030 Create models/Teacher.ts teacher discriminator
- [ ] T031 Create models/Admin.ts admin discriminator
- [ ] T032 Create routes/index.ts route aggregator
- [ ] T033 Create routes/auth.routes.ts auth routes
- [ ] T034 Create controllers/auth.controller.ts login/logout/refresh/me
- [ ] T035 Create services/auth.service.ts auth business logic
- [ ] T036 Create validators/auth.validator.ts Zod schemas for auth

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Admin Core Management (Priority: P1) 🎯 MVP

**Goal**: Admin can manage users, courses, subjects, and teacher assignments

**Independent Test**: Admin logs in, creates a teacher, creates a course + subject, assigns teacher, and verifies

### Model Tasks

- [ ] T037 [P] [US1] Create models/Course.ts in apps/server/src/models/Course.ts
- [ ] T038 [P] [US1] Create models/Subject.ts in apps/server/src/models/Subject.ts
- [ ] T039 [P] [US1] Create models/Batch.ts in apps/server/src/models/Batch.ts
- [ ] T040 [P] [US1] Create models/AuditLog.ts in apps/server/src/models/AuditLog.ts

### Validator Tasks

- [ ] T041 [P] [US1] Create validators/user.validator.ts for user CRUD schemas
- [ ] T042 [P] [US1] Create validators/course.validator.ts for course schemas
- [ ] T043 [P] [US1] Create validators/subject.validator.ts for subject schemas

### Service Tasks

- [ ] T044 [US1] Create services/user.service.ts in apps/server/src/services/user.service.ts
- [ ] T045 [US1] Create services/course.service.ts in apps/server/src/services/course.service.ts
- [ ] T046 [US1] Create services/subject.service.ts in apps/server/src/services/subject.service.ts

### Route + Controller Tasks

- [ ] T047 [US1] Create routes/admin.routes.ts and controllers/admin.controller.ts for user CRUD
- [ ] T048 [US1] Create routes/course.routes.ts and controllers/course.controller.ts
- [ ] T049 [US1] Create routes/subject.routes.ts and controllers/subject.controller.ts

### Frontend Tasks

- [ ] T050 [US1] Create api/client.ts Axios instance with interceptor in apps/web/src/api/client.ts
- [ ] T051 [US1] Create api/auth.api.ts login/logout/refresh/me API calls
- [ ] T052 [US1] Create api/admin.api.ts user management API calls
- [ ] T053 [US1] Create context/AuthContext.tsx with useReducer for auth state
- [ ] T054 [US1] Create hooks/useAuth.ts auth hook
- [ ] T055 [US1] Create components/ui/Button.tsx, Input.tsx, Select.tsx, Table.tsx, Modal.tsx, Pagination.tsx
- [ ] T056 [US1] Create components/layout/AppLayout.tsx, Sidebar.tsx, Header.tsx
- [ ] T057 [US1] Create components/layout/AdminLayout.tsx
- [ ] T058 [US1] Create components/common/ProtectedRoute.tsx RBAC wrapper
- [ ] T059 [US1] Create components/common/DataTable.tsx generic table
- [ ] T060 [US1] Create pages/auth/Login.tsx login page
- [ ] T061 [US1] Create pages/admin/Dashboard.tsx admin dashboard
- [ ] T062 [US1] Create pages/admin/UserManagement.tsx user list and CRUD
- [ ] T063 [US1] Create pages/admin/UserDetail.tsx user detail/edit
- [ ] T064 [US1] Create pages/admin/BulkImport.tsx CSV/Excel import page
- [ ] T065 [US1] Create pages/admin/CourseManagement.tsx course CRUD
- [ ] T066 [US1] Create pages/admin/SubjectManagement.tsx subject CRUD
- [ ] T067 [US1] Create pages/admin/TeacherAssignment.tsx assign teachers to subjects
- [ ] T068 [US1] Create App.tsx with router and auth context provider
- [ ] T069 [US1] Create main.tsx entry point with React root
- [ ] T070 [US1] Create routes.tsx with role-based route definitions

**Checkpoint**: Admin can log in, manage users, courses, subjects, and assignments

---

## Phase 4: User Story 2 — Teacher Academic Content (Priority: P2)

**Goal**: Teacher can upload materials, manage assignments, grade submissions, enter marks, take attendance

**Independent Test**: Teacher logs in, uploads material, creates assignment, takes attendance, enters marks

### Model Tasks

- [ ] T071 [P] [US2] Create models/StudyMaterial.ts in apps/server/src/models/StudyMaterial.ts
- [ ] T072 [P] [US2] Create models/Assignment.ts in apps/server/src/models/Assignment.ts
- [ ] T073 [P] [US2] Create models/Submission.ts in apps/server/src/models/Submission.ts
- [ ] T074 [P] [US2] Create models/Attendance.ts in apps/server/src/models/Attendance.ts
- [ ] T075 [P] [US2] Create models/Grade.ts in apps/server/src/models/Grade.ts

### Validator Tasks

- [ ] T076 [P] [US2] Create validators/assignment.validator.ts
- [ ] T077 [P] [US2] Create validators/attendance.validator.ts
- [ ] T078 [P] [US2] Create validators/grade.validator.ts

### Service Tasks

- [ ] T079 [US2] Create services/material.service.ts in apps/server/src/services/material.service.ts
- [ ] T080 [US2] Create services/assignment.service.ts in apps/server/src/services/assignment.service.ts
- [ ] T081 [US2] Create services/attendance.service.ts in apps/server/src/services/attendance.service.ts
- [ ] T082 [US2] Create services/grade.service.ts in apps/server/src/services/grade.service.ts
- [ ] T083 [US2] Create services/file.service.ts in apps/server/src/services/file.service.ts

### Route + Controller Tasks

- [ ] T084 [US2] Create routes/teacher.routes.ts and controllers/teacher.controller.ts
- [ ] T085 [US2] Add material endpoints to teacher routes
- [ ] T086 [US2] Add assignment endpoints to teacher routes
- [ ] T087 [US2] Add attendance endpoints to teacher routes
- [ ] T088 [US2] Add marks/grade endpoints to teacher routes

### Frontend Tasks

- [ ] T089 [US2] Create components/layout/TeacherLayout.tsx
- [ ] T090 [US2] Create pages/teacher/Dashboard.tsx teacher landing
- [ ] T091 [US2] Create pages/teacher/MySubjects.tsx assigned subjects list
- [ ] T092 [US2] Create pages/teacher/StudyMaterial.tsx material CRUD
- [ ] T093 [US2] Create pages/teacher/Assignments.tsx assignment list + CRUD
- [ ] T094 [US2] Create pages/teacher/AssignmentGrading.tsx grading interface
- [ ] T095 [US2] Create pages/teacher/Marks.tsx marks entry and summary
- [ ] T096 [US2] Create pages/teacher/Attendance.tsx attendance taking

**Checkpoint**: Teacher can manage all academic content

---

## Phase 5: User Story 3 — Student Experience (Priority: P3)

**Goal**: Student can view materials, submit assignments, check marks and attendance, give feedback

**Independent Test**: Student logs in, views subjects, downloads material, submits assignment, views grades

### Model Tasks

- [ ] T097 [P] [US3] Create models/Notice.ts in apps/server/src/models/Notice.ts
- [ ] T098 [P] [US3] Create models/FeedbackForm.ts in apps/server/src/models/FeedbackForm.ts
- [ ] T099 [P] [US3] Create models/FeedbackResponse.ts in apps/server/src/models/FeedbackResponse.ts

### Validator Tasks

- [ ] T100 [P] [US3] Create validators/notice.validator.ts
- [ ] T101 [P] [US3] Create validators/feedback.validator.ts

### Service Tasks

- [ ] T102 [US3] Create services/notice.service.ts in apps/server/src/services/notice.service.ts
- [ ] T103 [US3] Create services/feedback.service.ts in apps/server/src/services/feedback.service.ts

### Route + Controller Tasks

- [ ] T104 [US3] Create routes/student.routes.ts and controllers/student.controller.ts
- [ ] T105 [US3] Create routes/notice.routes.ts and controllers/notice.controller.ts
- [ ] T106 [US3] Create routes/feedback.routes.ts and controllers/feedback.controller.ts

### Frontend Tasks

- [ ] T107 [US3] Create components/layout/StudentLayout.tsx
- [ ] T108 [US3] Create pages/student/Dashboard.tsx student landing
- [ ] T109 [US3] Create pages/student/MySubjects.tsx enrolled subjects
- [ ] T110 [US3] Create pages/student/Materials.tsx material viewer/download
- [ ] T111 [US3] Create pages/student/Assignments.tsx assignment list + submission
- [ ] T112 [US3] Create pages/student/MyMarks.tsx marks viewer
- [ ] T113 [US3] Create pages/student/Attendance.tsx attendance viewer
- [ ] T114 [US3] Create pages/student/Notices.tsx notice viewer
- [ ] T115 [US3] Create pages/student/Feedback.tsx feedback form filler
- [ ] T116 [US3] Create pages/auth/ForgotPassword.tsx
- [ ] T117 [US3] Create pages/auth/ResetPassword.tsx

**Checkpoint**: Student can consume content, submit work, view results

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T118 Create pages/admin/Notices.tsx notice CRUD in admin panel
- [ ] T119 Create pages/admin/FeedbackForms.tsx form creation and management
- [ ] T120 Create pages/admin/FeedbackResults.tsx aggregated results viewer
- [ ] T121 Create pages/admin/Reports.tsx dashboard reports
- [ ] T122 Create pages/admin/AuditLog.tsx audit log viewer
- [ ] T123 Create services/dashboard.service.ts in apps/server/src/services/dashboard.service.ts
- [ ] T124 Create services/report.service.ts in apps/server/src/services/report.service.ts
- [ ] T125 Create routes/dashboard.routes.ts and controllers/dashboard.controller.ts
- [ ] T126 Create routes/report.routes.ts and controllers/report.controller.ts
- [ ] T127 Add utils/csvParser.ts for bulk import functionality
- [ ] T128 Add services/email.service.ts console-based email placeholder
- [ ] T129 Create hooks/useApi.ts generic API hook
- [ ] T130 Create hooks/usePagination.ts pagination hook
- [ ] T131 Create utils/cn.ts Tailwind class merge utility
- [ ] T132 Create utils/format.ts date/number formatters
- [ ] T133 Add rate limiting middleware on auth routes
- [ ] T134 Add file type and size validation on upload endpoints
- [ ] T135 Add missing index.js exports and verify module resolution
- [ ] T136 Run `npm run typecheck` across all packages and fix errors
- [ ] T137 Run `npm run lint` across all packages and fix errors
- [ ] T138 Verify all contracts match implementation

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (P1 → P2 → P3)**: All depend on Foundational phase
  - P2 depends on P1 (teacher needs subjects and assignments from admin)
  - P3 depends on P1 + P2 (student needs content from teachers)
- **Polish (Phase 6)**: Depends on all user stories being complete

### Parallel Opportunities
- All Setup tasks marked [P] can run in parallel
- Model creation tasks marked [P] can run in parallel
- Validator creation tasks marked [P] can run in parallel
- Frontend pages for different roles can run parallel within their phase

### Implementation Strategy

1. Complete Phase 1: Setup — all configs
2. Complete Phase 2: Foundational — server core, auth, middleware chain
3. Complete Phase 3: Admin (P1) — deploy MVP
4. Complete Phase 4: Teacher (P2) — add academic features
5. Complete Phase 5: Student (P3) — complete student experience
6. Complete Phase 6: Polish — cross-cutting features
