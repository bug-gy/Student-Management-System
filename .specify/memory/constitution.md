<!-- Sync Impact Report: v0.1.0 (initial) → v1.0.0
  Added: All 5 principles (MVC, RBAC, Audit, API-First, Type Safety)
  Added: Technical Stack & Security sections
  Added: Development Workflow & Quality Gates section
  Added: Governance rules
  Templates updated: spec-template, plan-template, tasks-template
  No deferred placeholders.
-->
# SMS Project Constitution

## Core Principles

### I. MVC Architecture with Service Layer
Controllers MUST be thin — parse the request, delegate to a service, send the response. Services contain all business logic, database queries, and file operations. Models define the schema and data access only. A controller MUST NOT directly call a model or perform business logic.

### II. Role-Based Security (NON-NEGOTIABLE)
Every protected endpoint MUST pass through the auth middleware (JWT verification) followed by the rbac middleware (role check). Anonymous teacher feedback MUST be truly anonymized at the database level — no student identity field in FeedbackResponse. Passwords MUST be hashed with bcrypt, never stored in plain text.

### III. Audit Compliance
Every marks/attendance edit MUST create an immutable AuditLog entry recording: actor ID, action type, target type, target ID, old value, new value, and timestamp. Soft-delete (isActive flag) MUST be used for user accounts instead of hard deletion to preserve referential integrity.

### IV. API-First Design
Backend route contracts MUST be defined before any frontend implementation begins. All list endpoints MUST return paginated responses with the standard shape: `{ success, data, message, pagination: { page, limit, total, totalPages } }`. API responses MUST use the `ApiResponse` utility class consistently.

### V. Type Safety
All code MUST use TypeScript strict mode. Shared types between server and client MUST live in `packages/shared`. Runtime validation on both client and server MUST use Zod schemas. No `any` types allowed unless explicitly justified with a comment.

## Technical Stack

- **Runtime**: Node.js >= 18
- **Backend**: Express.js + TypeScript
- **Frontend**: React 18 + Vite + TypeScript
- **Database**: MongoDB + Mongoose (with discriminators for User roles)
- **Validation**: Zod (server + client)
- **Auth**: JWT (access + refresh tokens) stored in HTTP-only cookies
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State Management**: React Context + useReducer
- **File Storage**: Local filesystem via Multer (`apps/server/uploads/`)
- **Monorepo**: Turborepo with npm workspaces

## Security Requirements

- JWT access tokens expire in 15 minutes; refresh tokens in 7 days
- Refresh token rotation: old refresh token is invalidated when a new one is issued
- CORS restricted to the frontend origin specified in environment
- File uploads limited to 10MB with allowed types (PDF, DOC, DOCX, PPT, PPTX, images)
- Rate limiting on auth endpoints (login, forgot-password)
- Input validation on every request body via Zod middleware

## Development Workflow

1. Feature starts with a Speckit spec (`/speckit.specify`)
2. Technical plan is created (`/speckit.plan`) with data model and contracts
3. Tasks are broken down (`/speckit.tasks`) organized by user story priority
4. Implementation begins with Phase 1 (Setup) → Phase 2 (Foundational) → User Stories
5. After implementation, convergence check (`/speckit.converge`) verifies completion
6. Run `npm run typecheck` and `npm run lint` before any commit

## Quality Gates

- TypeScript compilation must pass with zero errors (`npm run typecheck`)
- All Zod validation schemas must have corresponding tests for edge cases
- API endpoints must return appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- No secrets or environment-specific values committed to the repository
- Every pull request must pass CI (lint + typecheck + build)

## Governance

This constitution supersedes all other development practices. Amendments require a documented proposal, team approval, and a migration plan. Constitution version follows semver: MAJOR for principle changes, MINOR for section additions, PATCH for clarifications. All PRs must verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-07-02 | **Last Amended**: 2026-07-02
