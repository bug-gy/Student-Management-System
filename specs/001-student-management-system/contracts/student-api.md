# Student API Contracts

## GET /api/student/subjects
- Response: Enrolled subjects list

## GET /api/student/materials?subject=&topic=
- Response: Downloadable materials

## GET /api/student/assignments?status=
- Response: Filtered assignment list (open/submitted/overdue/graded)

### POST /api/student/assignments/:id/submit
- Body: multipart/form-data file
- Response 201

### GET /api/student/assignments/:id
- Response: Assignment detail with grade + feedback (if graded)

## GET /api/student/marks
- Response: Marks per subject

## GET /api/student/attendance
- Response: Attendance records + percentage per subject

## GET /api/student/notices
- Response: Relevant notices

## Feedback

### GET /api/student/feedback
- Response: List of forms (pending/completed)

### POST /api/student/feedback/:formId/submit
- Body: `{ answers: [{ questionId, value }] }`
- Response 201 (anonymized — no student identity linked)
