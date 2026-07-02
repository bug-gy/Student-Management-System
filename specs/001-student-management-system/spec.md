# Feature Specification: Student Management System

**Feature Branch**: `001-student-management-system`

**Created**: 2026-07-02

**Status**: Draft

**Input**: Full software requirements document (SMS_DOC.md)

## User Scenarios & Testing

### User Story 1 - Admin Manages Core System Setup (Priority: P1)

An administrator can create and manage user accounts, courses, subjects, and teacher assignments to establish the academic structure of the institution.

**Why this priority**: Without user accounts, course structure, and teacher assignments, no other actor can operate. This is the foundational layer.

**Independent Test**: Admin can log in, create a teacher account, create a course, add a subject under it, assign the teacher to that subject, and verify the assignment appears in the teacher's view.

**Acceptance Scenarios**:
1. **Given** an admin is logged in, **When** they create a new teacher account with valid details, **Then** the teacher receives login credentials and can log in.
2. **Given** an admin is logged in, **When** they create a course with name, code, and duration, **Then** the course appears in the course list with an enrolled student count of 0.
3. **Given** a course exists, **When** the admin creates a subject under it for a specific semester, **Then** the subject is visible grouped by course and semester.
4. **Given** a subject exists, **When** the admin assigns a teacher to it, **Then** the teacher can see the subject in their assigned subjects list.

---

### User Story 2 - Teacher Manages Academic Content (Priority: P2)

A teacher can upload study materials, create assignments, enter marks, take attendance, and grade submissions for their assigned subjects.

**Why this priority**: Academic content delivery and assessment are the primary value proposition of the system for teachers and students.

**Independent Test**: Teacher logs in, uploads study material for a subject, creates an assignment with a deadline, takes attendance for a batch, and enters marks for a test.

**Acceptance Scenarios**:
1. **Given** a teacher is assigned to a subject, **When** they upload a PDF study material with a topic label, **Then** students enrolled in that subject can view and download it.
2. **Given** a teacher is viewing a subject, **When** they create an assignment with title, description, deadline, and max marks, **Then** students see the assignment in their pending list.
3. **Given** a teacher is taking attendance for a date, **When** they mark students as Present/Absent/Late and submit, **Then** the attendance record is saved and visible in reports.
4. **Given** a student has submitted an assignment, **When** the teacher assigns a grade and feedback, **Then** the student can view their grade and feedback.

---

### User Story 3 - Student Consumes Content and Tracks Progress (Priority: P3)

A student can access study materials, submit assignments, view marks, track attendance, read notices, and submit anonymous teacher feedback.

**Why this priority**: Student-facing features depend on admin and teacher setup being complete.

**Independent Test**: Student logs in, views enrolled subjects, downloads a study material, submits an assignment, views marks, checks attendance percentage, and fills out a feedback form.

**Acceptance Scenarios**:
1. **Given** a student is logged in, **When** they navigate to their subjects, **Then** they see all subjects for their enrolled course and batch.
2. **Given** study material exists for a subject, **When** the student opens the materials section, **Then** they can filter by subject or topic and download files.
3. **Given** an assignment is open for submission, **When** the student uploads a file before the deadline, **Then** the submission is recorded and visible to the teacher.
4. **Given** marks have been entered for a subject, **When** the student views their marks, **Then** they see scores per exam/assignment and their attendance percentage.
5. **Given** a feedback form is active for a subject, **When** the student submits responses, **Then** the response is stored without any link to their identity.

---

### Edge Cases

- What happens when a teacher tries to access a subject they are not assigned to?
- How does the system handle duplicate email addresses during user creation?
- What happens when a file upload exceeds the maximum allowed size?
- How does the system behave when a student submits after the assignment deadline?
- What happens when an admin deactivates a teacher account that has active subjects?
- How are attendance records handled for dates in the future?
- What happens when multiple teachers are assigned to the same subject and both try to enter marks?

## Requirements

### Functional Requirements

- **FR-A01**: System MUST allow admin to create student accounts individually or via bulk CSV/Excel import
- **FR-A02**: System MUST allow admin to create teacher accounts
- **FR-A03**: System MUST allow admin to edit student and teacher profile information
- **FR-A04**: System MUST allow admin to activate/deactivate (suspend) accounts (soft-delete)
- **FR-A05**: System MUST allow admin to delete user accounts with confirmation (soft-delete)
- **FR-A06**: System MUST allow admin to reset passwords on behalf of users
- **FR-A07**: System MUST provide a list of all users with search/filter by role, course, batch, status
- **FR-A08**: System MUST allow admin to assign students to a course/batch/section
- **FR-A09**: System MUST allow admin to create courses (name, code, duration, description)
- **FR-A10**: System MUST allow admin to edit course details
- **FR-A11**: System MUST allow admin to archive/deactivate a course
- **FR-A12**: System MUST show course list with enrolled student count
- **FR-A13**: System MUST allow admin to create subjects under a course and semester
- **FR-A14**: System MUST allow admin to edit subject details
- **FR-A15**: System MUST allow admin to delete/archive a subject
- **FR-A16**: System MUST show subjects grouped by course and semester
- **FR-A17**: System MUST allow admin to assign teachers to a subject
- **FR-A18**: System MUST allow admin to reassign/remove a teacher from a subject
- **FR-A19**: System MUST show which teacher is teaching which subjects
- **FR-A20**: System MUST allow admin to create notices with title, description, attachments
- **FR-A21**: System MUST allow admin to target notices to: all users / all students / all teachers / specific course or batch
- **FR-A22**: System MUST support notice priority (normal/urgent) and publish/expiry dates
- **FR-A23**: System MUST allow admin to edit or delete published notices
- **FR-A24**: System MUST show admin a list of all notices with read/unread tracking
- **FR-A25**: System MUST allow admin to create feedback forms (rating, multiple choice, text)
- **FR-A26**: System MUST allow admin to assign feedback forms to a subject/teacher/course
- **FR-A27**: System MUST support feedback form availability windows (open/close dates)
- **FR-A28**: System MUST show aggregated/anonymized feedback results
- **FR-A29**: System MUST allow admin to export feedback results (PDF/Excel)
- **FR-A30**: System MUST show admin a system-wide dashboard with stats
- **FR-A31**: System MUST show admin attendance summary reports
- **FR-A32**: System MUST show admin marks/grade reports across subjects
- **FR-A33**: System MUST show admin an audit log of key actions
- **FR-T01**: Teacher MUST be able to log in and log out
- **FR-T02**: Teacher MUST be able to reset forgotten password
- **FR-T03**: Teacher MUST be able to view and edit own profile
- **FR-T04**: Teacher MUST be able to view assigned subjects and batches
- **FR-T05**: Teacher MUST be able to upload study material per subject
- **FR-T06**: Teacher MUST be able to organize material by topic/chapter/week
- **FR-T07**: Teacher MUST be able to edit or delete uploaded material
- **FR-T08**: Teacher SHOULD be able to view download/access counts
- **FR-T09**: Teacher MUST be able to create assignments (title, description, deadline, max marks)
- **FR-T10**: Teacher MUST be able to open/close submission portal
- **FR-T11**: Teacher MUST be able to extend assignment deadline
- **FR-T12**: Teacher MUST be able to view submitted vs. not-submitted lists
- **FR-T13**: Teacher MUST be able to download individual or all submissions
- **FR-T14**: Teacher MUST be able to grade submissions with feedback
- **FR-T15**: Teacher MUST be able to return graded assignments
- **FR-T16**: Teacher MUST be able to enter marks per student per subject
- **FR-T17**: Teacher MUST be able to edit marks with reason/audit trail
- **FR-T18**: Teacher MUST be able to bulk upload marks via spreadsheet
- **FR-T19**: Teacher MUST be able to view class-wise marks summary
- **FR-T20**: Teacher MUST be able to take attendance (Present/Absent/Late)
- **FR-T21**: Teacher MUST be able to edit previous attendance records
- **FR-T22**: Teacher MUST be able to view attendance history/reports
- **FR-T23**: Teacher MUST be able to view students with attendance below threshold
- **FR-T24**: Teacher MUST be able to view relevant notices
- **FR-T25**: Teacher MAY post subject-specific announcements
- **FR-S01**: Student MUST be able to log in and log out
- **FR-S02**: Student MUST be able to reset forgotten password
- **FR-S03**: Student MUST be able to view and edit limited profile fields
- **FR-S04**: Student MUST be able to view enrolled course, batch, and subjects
- **FR-S05**: Student MUST be able to view/download study material
- **FR-S06**: Student MUST be able to filter material by subject/topic
- **FR-S07**: Student MUST be able to view assignments (open, submitted, overdue, graded)
- **FR-S08**: Student MUST be able to submit assignment files before deadline
- **FR-S09**: Student MUST be able to resubmit before deadline if allowed
- **FR-S10**: Student MUST be able to view grade and feedback after grading
- **FR-S11**: Student MUST be able to view own marks per subject
- **FR-S12**: Student MUST be able to view own attendance record and percentage
- **FR-S13**: Student MUST be able to view relevant notices
- **FR-S14**: Student MUST be able to fill out feedback forms
- **FR-S15**: Feedback submission MUST be fully anonymous — no student identity stored
- **FR-S16**: Student MUST be able to view pending vs. completed feedback forms

### Key Entities

- **User**: Base entity with email, password (hashed), role (admin/teacher/student), status (active/inactive)
- **Student**: Extends User with course, batch, enrollment details
- **Teacher**: Extends User with assigned subjects, bio, contact
- **Course**: Name, code, duration, description, status
- **Subject**: Name, code, course, semester, credit hours, assigned teachers
- **Batch**: Course, year, section label
- **StudyMaterial**: Subject, uploaded by, file, topic, upload date
- **Assignment**: Subject, created by, deadline, max marks, status
- **Submission**: Assignment, student, file, submitted date, grade, feedback
- **Attendance**: Subject, date, student, status (present/absent/late)
- **Grade**: Subject, student, exam type, score, entered by, audit trail
- **Notice**: Title, description, attachment, target audience, priority, dates
- **FeedbackForm**: Subject/teacher, questions, open/close dates
- **FeedbackResponse**: Form, anonymized answers — no student link
- **AuditLog**: Actor, action, target type, target ID, old/new values, timestamp

## Success Criteria

### Measurable Outcomes

- **SC-001**: Admin can complete full user creation (single + bulk) in under 5 minutes for 100 users
- **SC-002**: Teacher can take attendance for a 60-student batch in under 3 minutes
- **SC-003**: Student dashboard loads with all data in under 2 seconds
- **SC-004**: Paginated list endpoints return data in under 500ms for pages of 50 items
- **SC-005**: Anonymous feedback contains zero metadata that could identify the submitting student
- **SC-006**: Audit log captures every marks/attendance edit with complete before/after values
- **SC-007**: System handles 500 concurrent users without degradation

## Assumptions

- Users have stable internet connectivity — offline mode is out of scope for v1
- Email delivery is handled via console-based logging (Nodemailer configured for development)
- File storage uses local filesystem; cloud storage (S3/Cloudinary) is a future enhancement
- Mobile responsive web is sufficient; native mobile apps are out of scope for v1
- The institution has a single admin managing the system (multi-admin roles are future enhancement)
- MongoDB is the sole database; no caching layer (Redis) in v1
- One-time setup of courses, subjects, and batches is acceptable before student enrollment
