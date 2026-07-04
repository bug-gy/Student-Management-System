# SMS — Setup & Run

## Prerequisites

| Tool      | Version    |
|-----------|------------|
| Node.js   | >= 18      |
| npm       | >= 9       |
| MongoDB   | >= 6       |

## 1. Start MongoDB

```bash
# systemd (most Linux distros)
sudo systemctl start mongod

# or directly
mongod --dbpath /data/db --fork --logpath /var/log/mongod.log

# check it's running
mongosh --eval "db.version()"
```

## 2. Environment Variables

```bash
cp .env.example apps/server/.env
```

Edit `apps/server/.env` — at minimum change the **JWT secrets**:

```
JWT_ACCESS_SECRET=<random-64-char-string>
JWT_REFRESH_SECRET=<another-random-64-char-string>
```

Make sure `MONGODB_URI` points to your running MongoDB instance (default: `mongodb://localhost:27017/sms`).

## 3. Install Dependencies

```bash
npm install
```

## 4. Seed Admin User

Creates the first admin so you can log in:

```bash
npm run -w @sms/server seed
```

Default credentials:

```
Email:    admin@sms.com
Password: admin@123
```

> **Important:** Change this password after first login.

## 5. Start the Server

```bash
npm run -w @sms/server dev
```

Runs on `http://localhost:5000` (uses `tsx watch` for auto-reload).

## 6. Start the Frontend (separate terminal)

```bash
npm run -w @sms/web dev
```

Runs on `http://localhost:5173` (the dev server proxies `/api` → localhost:5000).

## 7. Login

Open `http://localhost:5173` and use the admin credentials from step 3.

## Available Scripts

| Command                                    | Description              |
|--------------------------------------------|--------------------------|
| `npm run -w @sms/server dev`               | Start server (dev mode)  |
| `npm run -w @sms/server start`             | Start server (prod)      |
| `npm run -w @sms/server build`             | Build server             |
| `npm run -w @sms/server seed`              | Seed admin user          |
| `npm run -w @sms/web dev`                  | Start frontend (dev)     |
| `npm run -w @sms/web build`                | Build frontend           |
| `npm run -w @sms/server typecheck`         | TypeScript check server  |
| `npm run -w @sms/web typecheck`            | TypeScript check frontend|

## What's Implemented

| Role    | Features |
|---------|----------|
| **Admin**  | Dashboard, User CRUD, Course CRUD, Subject CRUD, Teacher Assignment |
| **Teacher**| Dashboard, My Subjects, Assignment CRUD, Attendance (mark), Marks (enter) |
| **Student**| Dashboard, My Subjects, Materials (view/download), Assignments (submit), My Marks, Attendance (view), Notices, Feedback |
