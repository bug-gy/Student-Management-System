# Student Management System (SMS)

## Software Requirements & Feature Documentation

## 1. Introduction

### Purpose

This document describes the complete functional scope of a web-based
Student Management System (SMS). It defines the actors (user roles), the
features/functions available to each actor, and the system-wide
capabilities that support them. It is intended to serve as a blueprint
before development begins --- no implementation details or code are
included.

### Scope

The SMS is a centralized platform for an educational institution to
manage: - User accounts (Admin, Teacher, Student) - Academic structure
(Courses, Subjects, Teacher assignments) - Study material distribution -
Assignments and submissions - Attendance - Marks/grading - Notices and
announcements - Anonymous teacher feedback

### Definitions

  -----------------------------------------------------------------------
  Term                                Meaning
  ----------------------------------- -----------------------------------
  Admin                               System/institution administrator
                                      with full control

  Course                              A program of study (e.g., "BE
                                      Computer Engineering")

  Subject                             An individual subject/paper under a
                                      course (e.g., "Data Structures")

  Batch/Section                       A group of students within a course
                                      (e.g., "2nd Year, Section A")

  Notice                              An announcement broadcast to
                                      selected users
  -----------------------------------------------------------------------

## 2. Actors (User Roles)

  -----------------------------------------------------------------------
  Actor                               Description
  ----------------------------------- -----------------------------------
  Admin                               Manages the entire system: users,
                                      courses, subjects, notices,
                                      feedback forms

  Teacher                             Manages academic content for
                                      assigned subjects: materials,
                                      assignments, marks, attendance

  Student                             Consumes content, submits work,
                                      views results, gives feedback
  -----------------------------------------------------------------------

> A **Super Admin** role can optionally be added later if multiple
> admins with different permission levels are needed (see Section 6 ---
> Future Enhancements).

## 3. Actor-wise Functional Requirements

### Admin

**3.1.1 User Management** - FR-A01: Create student accounts
(individually or bulk import via CSV/Excel) - FR-A02: Create teacher
accounts - FR-A03: Edit/update student and teacher profile information -
FR-A04: Activate/deactivate (suspend) student or teacher accounts -
FR-A05: Delete user accounts (with confirmation, soft-delete preferred
for record-keeping) - FR-A06: Reset password on behalf of a user -
FR-A07: View list of all users with search/filter (by role, course,
batch, status) - FR-A08: Assign students to a course/batch/section

**3.1.2 Course Management** - FR-A09: Create a new course (name, code,
duration, description) - FR-A10: Edit/update course details - FR-A11:
Archive/deactivate a course (e.g., discontinued program) - FR-A12: View
list of all courses with enrolled student count

**3.1.3 Subject Management** - FR-A13: Create a subject under a specific
course and semester/year - FR-A14: Edit subject details (name, code,
credit hours, semester) - FR-A15: Delete/archive a subject - FR-A16:
View subjects grouped by course and semester

**3.1.4 Teacher Assignment** - FR-A17: Assign one or more teachers to a
subject - FR-A18: Reassign/remove a teacher from a subject - FR-A19:
View which teacher is teaching which subject(s)

**3.1.5 Notices** - FR-A20: Create a notice/announcement with title,
description, and optional attachment - FR-A21: Target a notice to: all
users / all students / all teachers / a specific course or batch -
FR-A22: Set notice priority (normal/urgent) and publish/expiry date -
FR-A23: Edit or delete a published notice - FR-A24: View list of all
notices with read/unread tracking (optional)

**3.1.6 Feedback Form Management** - FR-A25: Create a feedback form
(define questions --- rating scale, multiple choice, text) - FR-A26:
Assign a feedback form to a specific subject/teacher/course - FR-A27:
Set feedback form availability window (open/close dates) - FR-A28: View
aggregated/anonymized feedback results (never linked to a specific
student identity) - FR-A29: Export feedback results (PDF/Excel)

**3.1.7 Reports & Oversight (Admin Dashboard)** - FR-A30: View
system-wide dashboard (total students, teachers, courses, active
notices) - FR-A31: View attendance summary reports across
courses/subjects - FR-A32: View marks/grade reports across subjects -
FR-A33: View audit log of key admin actions (who created/edited/deleted
what, and when)

### Teacher

**3.2.1 Account & Profile** - FR-T01: Log in / log out - FR-T02: Forgot
password / reset password - FR-T03: View and edit own profile (bio,
contact info, profile picture) - FR-T04: View list of assigned subjects
and batches

**3.2.2 Study Material** - FR-T05: Upload study material (PDF, DOC, PPT,
video links, images) per subject - FR-T06: Organize material by
topic/chapter/week - FR-T07: Edit or delete previously uploaded
material - FR-T08: View download/access count of uploaded material
(optional analytics)

**3.2.3 Assignments** - FR-T09: Create an assignment (title,
description, attachment, deadline, max marks) for a subject - FR-T10:
Open/close the submission portal for an assignment - FR-T11: Extend
assignment deadline - FR-T12: View list of students who submitted
vs.not submitted - FR-T13: Download individual or all submissions -
FR-T14: Grade a submission and leave written feedback/remarks - FR-T15:
Return graded assignment to student

**3.2.4 Marks / Grading** - FR-T16: Enter marks for
exams/tests/assignments per student per subject - FR-T17: Edit
previously entered marks (with reason/audit trail) - FR-T18: Bulk upload
marks (e.g., via spreadsheet import) - FR-T19: View class-wise marks
summary/statistics (average, highest, lowest)

**3.2.5 Attendance** - FR-T20: Take attendance for a subject on a given
date (Present/Absent/Late) - FR-T21: Edit a previously taken attendance
record - FR-T22: View attendance history/report for a subject or
individual student - FR-T23: View students with attendance below a
defined threshold (e.g., \<75%)

**3.2.6 Communication** - FR-T24: View notices relevant to them -
FR-T25: (Optional) Post subject-specific announcements to enrolled
students

### Student

**3.3.1 Account & Profile** - FR-S01: Log in / log out - FR-S02: Forgot
password / reset password via email/OTP - FR-S03: View and edit own
profile (limited fields --- contact info, photo) - FR-S04: View enrolled
course, batch, and subjects

**3.3.2 Study Material** - FR-S05: View/download study material uploaded
for enrolled subjects - FR-S06: Filter material by subject/topic

**3.3.3 Assignments** - FR-S07: View list of assignments (open,
submitted, overdue, graded) - FR-S08: Submit assignment file(s) before
the deadline - FR-S09: Resubmit before deadline (if allowed by
teacher) - FR-S10: View grade and teacher's feedback after grading

**3.3.4 Marks & Attendance (Self)** - FR-S11: View own marks/grades per
subject - FR-S12: View own attendance record and percentage per subject

**3.3.5 Notices** - FR-S13: View notices addressed to them (general,
course-specific, batch-specific)

**3.3.6 Feedback** - FR-S14: Fill out feedback forms for
teachers/subjects - FR-S15: Feedback submission is fully anonymous ---
system must not store any identifiable link between the student and
their responses - FR-S16: View which feedback forms are pending
vs.completed (without revealing content already submitted elsewhere)

## 4. System-Wide (Cross-Cutting) Features

These aren't tied to one actor but are needed for the whole system to
function properly.

### Authentication & Authorization

-   Role-based access control (RBAC) --- Admin / Teacher / Student see
    only what they're permitted to
-   Secure password storage (hashing, never plain text)
-   Session management / auto-logout after inactivity
-   Forgot password flow (email or OTP based)
-   two-factor authentication for Admin accounts

### Notifications

-   In-app notification center (new notice, assignment posted, marks
    published, feedback form available)
-   Optional email notifications for critical events (deadline
    reminders, new notice)

### Dashboard (role-specific landing page)

-   Admin: system overview stats
-   Teacher: today's classes, pending grading, recent submissions
-   Student: upcoming deadlines, recent grades, unread notices

### Search & Filter

-   Global search for users, courses, subjects (Admin)
-   Filter lists by course/batch/status across modules

### File Management

-   Centralized file storage for uploaded materials/assignments
-   File type & size validation on upload
-   Virus/malware scan on upload (recommended for production systems)

### Audit Logging

-   Track key actions (create/edit/delete) with timestamp and actor,
    especially for Admin and Teacher actions affecting marks and
    attendance

### Data Export

-   Export reports (attendance, marks, feedback summaries) to PDF/Excel

## 5. Non-Functional Requirements

  -----------------------------------------------------------------------
  Category                            Requirement
  ----------------------------------- -----------------------------------
  Security                            Passwords hashed; role-based access
                                      enforced server-side; anonymous
                                      feedback truly anonymized at the
                                      database level

  Performance                         Dashboard and list pages should
                                      load within acceptable time even
                                      with large user bases (pagination
                                      required for large lists)

  Usability                           Responsive design --- usable on
                                      desktop and mobile browsers

  Reliability                         Regular database backups; graceful
                                      error handling (no raw error leaks
                                      to users)

  Scalability                         System should support adding new
                                      courses/subjects/batches without
                                      structural changes

  Maintainability                     Clear separation of roles/modules
                                      to allow future feature additions

  Data Integrity                      Marks and attendance edits should
                                      be logged, not silently overwritten
  -----------------------------------------------------------------------

## Future Enhancements

-   **Parent Portal**: Parents view their child's attendance, marks, and
    notices
-   **Timetable/Routine Management**: Class scheduling per batch/subject
-   **Fee Management**: Fee structure, payment tracking, receipts
-   **Library Management Integration**
-   **Online Exam/Quiz Module**: MCQ-based tests with auto-grading
-   **Chat/Discussion Forum**: Subject-wise Q&A between students and
    teachers
-   **Multi-Admin Roles**: e.g., "Department Admin" with limited scope
    vs."Super Admin"
-   **Mobile App** (native) alongside the web app
-   **Analytics Dashboard**: Attendance/performance trends over time,
    at-risk student flagging

## 7. Core Data Entities (Conceptual --- not a schema)

A quick mental map of what "things" the system manages, useful before
designing the database:

-   **User** (base: name, email, password, role, status)
    -   Student (linked to: course, batch)
    -   Teacher (linked to: assigned subjects)
-   **Course** (name, code, duration)
-   **Subject** (name, code, course, semester, assigned teacher(s))
-   **Batch/Section** (course, year, section label)
-   **StudyMaterial** (subject, uploaded by, file, topic)
-   **Assignment** (subject, created by, deadline, max marks)
-   **Submission** (assignment, student, file, submitted date, grade,
    feedback)
-   **Attendance** (subject, date, student, status)
-   **Marks** (subject, student, exam type, score)
-   **Notice** (title, description, target audience, created by, date)
-   **FeedbackForm** (subject/teacher, questions, open/close date)
-   **FeedbackResponse** (form, anonymized answers --- no student link)

## 8. Summary Table --- Feature Count by Actor

  Actor         Functional Requirements
  ------------- -------------------------
  Admin         33
  Teacher       25
  Student       16
  System-wide   7 categories
