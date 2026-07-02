# Implementation Plan: Student Management System

**Branch**: `001-student-management-system` | **Date**: 2026-07-02 | **Spec**: `specs/001-student-management-system/spec.md`

**Input**: Feature specification from `specs/001-student-management-system/spec.md`

## Summary

A centralized MERN-stack platform for educational institutions to manage users (Admin/Teacher/Student), academic structure (courses, subjects, batches), study materials, assignments, attendance, marks/grades, notices, and anonymous teacher feedback. Monorepo with Turborepo.

## Technical Context

**Language/Version**: TypeScript 5.6+, Node.js >= 18

**Primary Dependencies**:
- Backend: Express 4, Mongoose 8, Zod 3, bcryptjs, jsonwebtoken, cookie-parser, multer
- Frontend: React 18, Vite 5, React Router 6, React Hook Form 7, Axios, Tailwind CSS 3
- Shared: Zod (runtime validation)

**Storage**: MongoDB via Mongoose ODM; local filesystem via Multer for uploads

**Testing**: Manual for prototype (future: Vitest + Supertest)

**Target Platform**: Web (desktop + mobile responsive)

**Project Type**: Monorepo web application (Turborepo + npm workspaces)

**Performance Goals**: Paginated endpoints < 500ms, dashboard < 2s, support 500 concurrent users

**Constraints**: JWT auth with HTTP-only cookies; no Redis/ caching layer in v1; no email service (console-only)

**Scale/Scope**: Single institution, ~5000 users, 15+ data entities

## Constitution Check

*GATE: Pass — All principles satisfied.*
- I (MVC): Layers separated in directory structure (models / controllers / services)
- II (RBAC): auth + rbac middleware chain planned
- III (Audit): AuditLog model and middleware planned for marks/attendance
- IV (API-First): Contracts defined before frontend implementation
- V (Type Safety): TypeScript strict, shared types package, Zod validation

## Project Structure

```
SMS/
├── apps/
│   ├── server/src/
│   │   ├── index.ts, app.ts
│   │   ├── config/        (db.ts, env.ts, fileStorage.ts)
│   │   ├── middlewares/    (auth, rbac, validate, errorHandler, upload, auditLog)
│   │   ├── models/         (User, Student, Teacher, Course, Subject, Batch, etc.)
│   │   ├── routes/         (auth, admin, teacher, student, course, subject, etc.)
│   │   ├── controllers/    (thin: parse → delegate → respond)
│   │   ├── services/       (business logic, queries, file ops)
│   │   ├── validators/     (Zod schemas per module)
│   │   ├── utils/          (asyncHandler, ApiResponse, ApiError, pagination, jwt)
│   │   └── types/          (express.d.ts, types)
│   └── web/src/
│       ├── api/            (Axios client + per-resource API modules)
│       ├── components/     (ui/, layout/, common/)
│       ├── pages/          (auth/, admin/, teacher/, student/)
│       ├── hooks/          (useAuth, useApi, usePagination)
│       ├── context/        (AuthContext)
│       └── types/          (index.ts)
└── packages/shared/src/    (types, constants)
```

## Phases

1. **Phase 1 — Setup**: Root configs, app scaffolding, env files
2. **Phase 2 — Foundational**: Server bootstrap, DB connection, auth system, error handling, middleware chain
3. **Phase 3 — Admin User Story (P1)**: User CRUD, course management, subject management, teacher assignments
4. **Phase 4 — Teacher User Story (P2)**: Materials, assignments, submissions, marks, attendance
5. **Phase 5 — Student User Story (P3)**: View content, submit work, view results, feedback
6. **Phase 6 — Cross-Cutting**: Notices, dashboard, audit log, reports, filters
