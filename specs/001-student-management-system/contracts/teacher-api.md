# Teacher API Contracts

## GET /api/teacher/subjects
- Response: List of assigned subjects with batch details

## Study Material

### GET /api/teacher/materials?subject=&topic=
- Response: List of materials

### POST /api/teacher/materials
- Body: multipart/form-data (file + metadata)

### PUT /api/teacher/materials/:id
- Body: `{ title?, topic?, week? }`

### DELETE /api/teacher/materials/:id

## Assignments

### GET /api/teacher/assignments?subject=&status=
- Response: List with submission counts

### POST /api/teacher/assignments
- Body: `{ subject, title, description?, deadline, maxMarks }`

### PUT /api/teacher/assignments/:id
- Body: `{ title?, description?, deadline?, maxMarks?, status? }`

### GET /api/teacher/assignments/:id/submissions
- Response: List split by submitted/not-submitted

### GET /api/teacher/assignments/:id/submissions/:studentId/download
- Response: File download

### PUT /api/teacher/assignments/:id/submissions/:studentId/grade
- Body: `{ grade, feedback }`

## Marks

### GET /api/teacher/marks?subject=&examType=
- Response: Student marks list

### POST /api/teacher/marks
- Body: `{ subject, examType, marks: [{ studentId, score, maxScore, remark? }] }`

### PUT /api/teacher/marks/:id
- Body: `{ score?, maxScore?, remark? }` (triggers audit log)

### POST /api/teacher/marks/bulk
- Body: multipart/form-data with spreadsheet

### GET /api/teacher/marks/summary?subject=
- Response: { average, highest, lowest, count }

## Attendance

### GET /api/teacher/attendance?subject=&date=
- Response: Student attendance list

### POST /api/teacher/attendance
- Body: `{ subject, date, records: [{ studentId, status }] }`

### PUT /api/teacher/attendance/:id
- Body: `{ status }` (triggers audit log)

### GET /api/teacher/attendance/report?subject=&studentId=
- Response: Attendance history + percentage

### GET /api/teacher/attendance/low-attendance?subject=&threshold=75
- Response: Students below threshold
