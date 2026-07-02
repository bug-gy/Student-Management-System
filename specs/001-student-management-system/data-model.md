# Data Model: Student Management System

## Entity Relationship Overview

```
User (base, discriminated by role)
├── Admin    (no additional fields)
├── Teacher  (bio, contact, assignedSubjects[])
└── Student  (course, batch, enrollmentDate)

Course ──< Subject ──< StudyMaterial
  │          │            └── uploadedBy: Teacher
  │          │< Assignment
  │          │    └──< Submission ── Student
  │          │< Attendance (date, student, status)
  │          │< Grade (student, examType, score)
  │          └──< FeedbackForm
  │                  └──< FeedbackResponse (anonymized)
  │
  └──< Batch

Notice (targeted to roles/courses/batches)
AuditLog (actor, action, target, timestamp)
```

## Entities

### User
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | required, trim |
| email | String | required, unique, lowercase |
| password | String | required, min 8 chars, hashed |
| role | Enum | admin, teacher, student |
| status | Enum | active, inactive (default: active) |
| profilePicture | String | optional |
| timestamps | - | createdAt, updatedAt |

### Student (extends User)
| Field | Type | Constraints |
|-------|------|-------------|
| course | ObjectId (Course) | required |
| batch | ObjectId (Batch) | required |
| enrollmentDate | Date | required |
| rollNumber | String | optional, unique within batch |

### Teacher (extends User)
| Field | Type | Constraints |
|-------|------|-------------|
| bio | String | optional, max 500 |
| contact | String | optional |
| assignedSubjects | [ObjectId (Subject)] | default [] |

### Course
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | required, unique |
| code | String | required, unique, uppercase |
| duration | Number | required (in years) |
| description | String | optional |
| status | Enum | active, archived (default: active) |

### Batch
| Field | Type | Constraints |
|-------|------|-------------|
| course | ObjectId (Course) | required |
| year | Number | required (e.g., 2024) |
| section | String | required (e.g., "A", "B") |
| label | String | computed: "{course.code}-{year}-{section}" |

### Subject
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | required |
| code | String | required |
| course | ObjectId (Course) | required |
| semester | Number | required |
| creditHours | Number | optional |
| assignedTeachers | [ObjectId (Teacher)] | default [] |
| status | Enum | active, archived (default: active) |

### StudyMaterial
| Field | Type | Constraints |
|-------|------|-------------|
| subject | ObjectId (Subject) | required |
| uploadedBy | ObjectId (Teacher) | required |
| title | String | required |
| topic | String | optional |
| week | Number | optional |
| filePath | String | required |
| fileType | String | required (MIME) |
| fileSize | Number | required |
| downloadCount | Number | default 0 |

### Assignment
| Field | Type | Constraints |
|-------|------|-------------|
| subject | ObjectId (Subject) | required |
| createdBy | ObjectId (Teacher) | required |
| title | String | required |
| description | String | optional |
| attachment | String | optional file path |
| deadline | Date | required |
| maxMarks | Number | required |
| status | Enum | open, closed (default: open) |

### Submission
| Field | Type | Constraints |
|-------|------|-------------|
| assignment | ObjectId (Assignment) | required |
| student | ObjectId (Student) | required |
| filePath | String | required |
| submittedAt | Date | default now |
| grade | Number | optional |
| feedback | String | optional |
| status | Enum | submitted, graded, returned |

### Attendance
| Field | Type | Constraints |
|-------|------|-------------|
| subject | ObjectId (Subject) | required |
| date | Date | required |
| student | ObjectId (Student) | required |
| status | Enum | present, absent, late |
| takenBy | ObjectId (Teacher) | required |

### Grade
| Field | Type | Constraints |
|-------|------|-------------|
| subject | ObjectId (Subject) | required |
| student | ObjectId (Student) | required |
| examType | String | required (e.g., "midterm", "final") |
| score | Number | required |
| maxScore | Number | required |
| enteredBy | ObjectId (Teacher) | required |
| remark | String | optional |

### Notice
| Field | Type | Constraints |
|-------|------|-------------|
| title | String | required |
| description | String | required |
| attachment | String | optional |
| targetAudience | Object | { type: Enum (all/students/teachers/course/batch), refId: ObjectId (optional) } |
| priority | Enum | normal, urgent |
| publishDate | Date | default now |
| expiryDate | Date | optional |
| createdBy | ObjectId (Admin) | required |

### FeedbackForm
| Field | Type | Constraints |
|-------|------|-------------|
| title | String | required |
| subject | ObjectId (Subject) | optional |
| targetTeacher | ObjectId (Teacher) | optional |
| questions | [Question] | required array |
| openDate | Date | required |
| closeDate | Date | required |
| createdBy | ObjectId (Admin) | required |

### FeedbackResponse
| Field | Type | Constraints |
|-------|------|-------------|
| form | ObjectId (FeedbackForm) | required |
| answers | [Answer] | required |
| submittedAt | Date | default now |

**Anonymity constraint**: No studentId field exists on this model. Token-to-student mapping is ephemeral and deleted after submission.

### AuditLog
| Field | Type | Constraints |
|-------|------|-------------|
| actor | ObjectId (User) | required |
| action | String | required (create/update/delete) |
| targetType | String | required (e.g., "Grade", "Attendance") |
| targetId | ObjectId | required |
| oldValue | Mixed | optional |
| newValue | Mixed | optional |
| reason | String | optional (for edits) |
| timestamp | Date | default now |
