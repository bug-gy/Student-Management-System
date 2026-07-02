# Admin API Contracts

## User Management

### GET /api/admin/users
- Query: `?role=&course=&batch=&status=&search=&page=1&limit=20`
- Response: Paginated list of users
- Access: Admin only

### POST /api/admin/users
- Body: `{ name, email, password, role, course?, batch? }`
- Response 201: Created user
- Access: Admin only

### PUT /api/admin/users/:id
- Body: `{ name?, email?, status?, course?, batch? }`
- Response 200: Updated user
- Access: Admin only

### DELETE /api/admin/users/:id
- Response 200: Soft-deleted (status → inactive)
- Access: Admin only

### POST /api/admin/users/bulk-import
- Body: multipart/form-data with CSV/Excel file
- Response 201: `{ created: number, failed: number, errors: [] }`
- Access: Admin only

### POST /api/admin/users/:id/reset-password
- Body: `{ newPassword: string }`
- Response 200: Password reset
- Access: Admin only

## Course Management

### GET /api/courses
- Query: `?status=&page=1&limit=20`
- Response: Paginated list with enrolled student count

### POST /api/courses
- Body: `{ name, code, duration, description? }`
- Response 201

### PUT /api/courses/:id
- Body: `{ name?, code?, duration?, description? }`

### DELETE /api/courses/:id
- Response 200 (soft archive)

## Subject Management

### GET /api/subjects
- Query: `?course=&semester=&page=1&limit=20`
- Response: Grouped by course and semester

### POST /api/subjects
- Body: `{ name, code, course, semester, creditHours? }`
- Response 201

### PUT /api/subjects/:id
- Body: `{ name?, code?, semester?, creditHours? }`

### DELETE /api/subjects/:id
- Response 200 (soft archive)

## Teacher Assignment

### POST /api/subjects/:id/teachers
- Body: `{ teacherIds: string[] }`
- Response 200

### DELETE /api/subjects/:id/teachers/:teacherId
- Response 200

### GET /api/subjects/:id/teachers
- Response: List of assigned teachers
