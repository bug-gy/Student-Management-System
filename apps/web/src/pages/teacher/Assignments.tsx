import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import type { PaginatedResponse, ApiResponse } from "../../types";

interface Assignment {
  _id: string;
  title: string;
  subject: { _id: string; name: string };
  deadline: string;
  maxMarks: number;
  status: string;
}

interface Subject { _id: string; name: string; code: string; }

interface Submission {
  _id: string;
  student: { _id: string; name: string; email: string; rollNumber?: string };
  filePath: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: string;
}

export const TeacherAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ subject: "", title: "", deadline: "", maxMarks: 100 });
  const [createError, setCreateError] = useState("");

  const [submissionsModal, setSubmissionsModal] = useState<{ assignmentId: string; title: string } | null>(null);
  const [submissions, setSubmissions] = useState<{ submissions: Submission[]; notSubmitted: { _id: string; name: string }[] }>({ submissions: [], notSubmitted: [] });

  const [gradeModal, setGradeModal] = useState<{ submissionId: string; studentName: string; currentGrade?: number; currentFeedback?: string } | null>(null);
  const [gradeData, setGradeData] = useState({ grade: 0, feedback: "" });

  const fetchAssignments = async () => {
    const { data } = await client.get<PaginatedResponse<Assignment>>("/teacher/assignments", { params: { page: String(page), limit: "20" } });
    setAssignments(data.data);
    setTotalPages(data.pagination.totalPages);
  };

  const fetchSubjects = async () => {
    const { data } = await client.get<{ success: boolean; data: Subject[] }>("/teacher/subjects");
    setSubjects(data.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchAssignments(); fetchSubjects(); }, [page]);

  const handleCreate = async () => {
    setCreateError("");
    try {
      await client.post("/teacher/assignments", { ...formData, deadline: new Date(formData.deadline).toISOString(), maxMarks: Number(formData.maxMarks) });
      setIsModalOpen(false);
      setFormData({ subject: "", title: "", deadline: "", maxMarks: 100 });
      fetchAssignments();
    } catch (err: unknown) {
      setCreateError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create assignment");
    }
  };

  const viewSubmissions = async (id: string) => {
    try {
      const { data } = await client.get<ApiResponse<{ submissions: Submission[]; notSubmitted: { _id: string; name: string }[] }>>(`/teacher/assignments/${id}/submissions`);
      setSubmissions(data.data);
      setSubmissionsModal({ assignmentId: id, title: assignments.find((a) => a._id === id)?.title ?? "" });
    } catch (err) { console.error(err); }
  };

  const openGrade = (s: Submission) => {
    setGradeData({ grade: s.grade ?? 0, feedback: s.feedback ?? "" });
    setGradeModal({ submissionId: s._id, studentName: s.student.name, currentGrade: s.grade, currentFeedback: s.feedback });
  };

  const handleGrade = async () => {
    if (!gradeModal) return;
    try {
      await client.put(`/teacher/assignments/${submissionsModal?.assignmentId}/submissions/${gradeModal.submissionId}/grade`, gradeData);
      setGradeModal(null);
      if (submissionsModal) viewSubmissions(submissionsModal.assignmentId);
    } catch (err) { console.error(err); }
  };

  const getDownloadUrl = (fp: string) => {
    const fn = fp.split("/").pop() ?? fp;
    return `/uploads/${fn}`;
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "deadline", header: "Deadline", render: (a: Assignment) => new Date(a.deadline).toLocaleDateString() },
    { key: "maxMarks", header: "Max Marks" },
    { key: "status", header: "Status", render: (a: Assignment) => <StatusBadge status={a.status} /> },
    {
      key: "actions", header: "Actions",
      render: (a: Assignment) => (
        <Button variant="secondary" size="sm" onClick={() => viewSubmissions(a._id)}>Submissions</Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Assignment</Button>
      </div>

      <DataTable columns={columns} data={assignments} page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Assignment">
        <div className="space-y-4">
          {createError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{createError}</div>}
          <Select id="subject" label="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))} />
          <Input id="title" label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input id="deadline" label="Deadline" type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
          <Input id="maxMarks" label="Max Marks" type="number" value={String(formData.maxMarks)} onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })} />
          <Button className="w-full" onClick={handleCreate}>Create</Button>
        </div>
      </Modal>

      <Modal isOpen={!!submissionsModal} onClose={() => setSubmissionsModal(null)} title={`Submissions: ${submissionsModal?.title ?? ""}`} size="lg">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <h3 className="font-medium text-sm text-gray-500">Submitted ({submissions.submissions.length})</h3>
          {submissions.submissions.length === 0 && <p className="text-sm text-gray-400">No submissions yet.</p>}
          {submissions.submissions.map((s) => (
            <div key={s._id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{s.student.name} ({s.student.rollNumber ?? s.student.email})</p>
                <p className="text-xs text-gray-500">Submitted: {new Date(s.submittedAt).toLocaleString()}</p>
                {s.grade != null && <p className="text-xs text-blue-600">Grade: {s.grade}</p>}
                {s.feedback && <p className="text-xs text-gray-600">Feedback: {s.feedback}</p>}
              </div>
              <div className="flex gap-2">
                <a href={getDownloadUrl(s.filePath)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Download</a>
                <Button variant="secondary" size="sm" onClick={() => openGrade(s)}>Grade</Button>
              </div>
            </div>
          ))}
          <h3 className="font-medium text-sm text-gray-500 mt-4">Not Submitted ({submissions.notSubmitted.length})</h3>
          {submissions.notSubmitted.length === 0 && <p className="text-sm text-gray-400">All students submitted.</p>}
          {submissions.notSubmitted.map((s) => (
            <div key={s._id} className="border rounded-lg p-3">
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs text-red-500">Not submitted</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={!!gradeModal} onClose={() => setGradeModal(null)} title={`Grade: ${gradeModal?.studentName ?? ""}`}>
        <div className="space-y-4">
          <Input id="grade" label="Grade" type="number" value={String(gradeData.grade)} onChange={(e) => setGradeData({ ...gradeData, grade: Number(e.target.value) })} />
          <Input id="feedback" label="Feedback" value={gradeData.feedback} onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })} />
          <Button className="w-full" onClick={handleGrade}>Save Grade</Button>
        </div>
      </Modal>
    </div>
  );
};
