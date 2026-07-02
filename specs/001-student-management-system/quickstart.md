# Quickstart: Student Management System

## Prerequisites

- Node.js >= 18
- MongoDB >= 6.0 (running locally or remote)
- npm >= 10

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example apps/server/.env
# Edit apps/server/.env with your MongoDB URI and JWT secrets
```

### 3. Start development servers

```bash
# Start both server and web in parallel
npm run dev

# Or individually:
# npm run dev --filter=@sms/server
# npm run dev --filter=@sms/web
```

Server runs on `http://localhost:5000` and web on `http://localhost:5173`.

## Validation Scenarios

### Admin Flow

1. Open `http://localhost:5173/login`
2. Log in with admin credentials (seed script)
3. Navigate to Users → Create Teacher
4. Navigate to Courses → Add Course
5. Navigate to Subjects → Add Subject under course
6. Navigate to Subjects → Assign Teacher

### Teacher Flow

1. Log out and log in as the created teacher
2. View assigned subjects
3. Upload study material for a subject
4. Create an assignment with deadline
5. Take attendance for a batch
6. Enter marks for a test

### Student Flow

1. Log out and log in as a student
2. View enrolled subjects
3. Download study material
4. Submit assignment
5. View marks and attendance

## Expected Outcomes

- All CRUD operations return standard `{ success, data, message }` responses
- Paginated lists return `{ success, data, pagination }`
- Invalid requests return appropriate 4xx errors with descriptive messages
- Marks/attendance edits create audit log entries
- Feedback submissions contain no student identity
