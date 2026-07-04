# SMS Project Memory for AI Agents

## Project Identity
- **Name**: Student Management System (SMS)
- **Stack**: MERN (MongoDB, Express, React + Vite, Node.js) + TypeScript
- **Architecture**: MVC with service layer
- **Monorepo**: Turborepo (npm workspaces)
- **Package Manager**: npm

## Key Conventions
- TypeScript strict mode everywhere
- Zod for runtime validation on both client and server
- JWT auth stored in HTTP-only cookies
- Tailwind CSS for styling
- React Hook Form + Zod for forms
- React Context + useReducer for state management

## Directory Layout
```
SMS/
├── apps/
│   ├── server/       # Express backend
│   └── web/          # React + Vite frontend
├── packages/
│   └── shared/       # Shared types, constants, validators
├── specs/            # Speckit feature specs
└── .specify/         # Speckit configuration
```

## Code Standards
- **Models**: Mongoose schemas with TypeScript interfaces in `/types`
- **Controllers**: Thin layer — parse request, call service, send response
- **Services**: Business logic, database queries, file operations
- **Validators**: Zod schemas per module
- **Routes**: Express Router per resource, chained middleware
- **Responses**: Standard `ApiResponse` class: `{ success, data, message, pagination? }`
- **Errors**: Custom `ApiError` class with statusCode, message, errors array
- **Async**: `asyncHandler` wrapper for all route handlers

## RBAC Model
- Three roles: `admin`, `teacher`, `student`
- Middleware chain: `auth` (verify JWT) → `rbac(role)`

## Feature Workflow (Speckit)
1. `/speckit.specify` — Define feature spec
2. `/speckit.plan` — Technical plan + data model
3. `/speckit.tasks` — Break into tasks
4. `/speckit.implement` — Execute tasks
5. `/speckit.converge` — Verify completion

## Auto-Testing Protocol (MANDATORY)
**Before reporting completion of any work, you MUST execute the full verification pipeline:**

1. Run `npm run typecheck` — Fix ALL TypeScript errors. Zero tolerance.
2. Run `npm run build` — Ensure both server and web compile without errors.
3. Run `npm run lint` — Fix all lint errors (pre-existing config issues are acceptable but must be noted).
4. Run a comprehensive functional review:
   - Check every new/modified file for runtime errors (missing imports, wrong exports, incorrect API paths)
   - Verify all API routes match between backend route definitions and frontend API calls
   - Verify all Zod validators match what controllers expect
   - Verify form state management, error handling, and edge cases (empty states, loading states, error states)
   - Check for hardcoded URLs, environment-specific values, and insecure patterns
   - Verify responsive design: test that UI components handle overflow, are usable on mobile widths
5. Dependency audit: Check package.json files for version mismatches between related packages (e.g., React, TypeScript, Zod versions must be compatible across workspaces).

**Failure of any step means the work is NOT complete.** Fix issues before reporting success.
