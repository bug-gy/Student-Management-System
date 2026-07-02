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
