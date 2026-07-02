import React, { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { DataTable } from "../../components/common/DataTable";
import type { PaginatedResponse } from "../../types";

interface Assignment {
  _id: string;
  title: string;
  subject: { _id: string; name: string };
  deadline: string;
  maxMarks: number;
  status: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
}

export const TeacherAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [formData, setFormData] = useState({ subject: "", title: "", deadline: "", maxMarks: 100 });

  const fetchAssignments = useCallback(async () => {
    const { data } = await client.get<PaginatedResponse<Assignment>>("/teacher/assignments", {
      params: { page: String(page), limit: "20" },
    });
    setAssignments(data.data);
    setTotalPages(data.pagination.totalPages);
  }, [page]);

  const fetchSubjects = useCallback(async () => {
    const { data } = await client.get<{ success: boolean; data: Subject[] }>("/teacher/subjects");
    setSubjects(data.data);
  }, []);

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
  }, [fetchAssignments, fetchSubjects]);

  const handleCreate = async () => {
    setIsCreating(true);
    setCreateError("");
    try {
      await client.post("/teacher/assignments", {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
        maxMarks: Number(formData.maxMarks),
      });
      setIsModalOpen(false);
      setFormData({ subject: "", title: "", deadline: "", maxMarks: 100 });
      fetchAssignments();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create assignment";
      setCreateError(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "deadline", header: "Deadline", render: (a: Assignment) => new Date(a.deadline).toLocaleDateString() },
    { key: "maxMarks", header: "Max Marks" },
    { key: "status", header: "Status" },
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
          {createError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{createError}</div>
          )}
          <Select
            id="subject"
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))}
          />
          <Input id="title" label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input id="deadline" label="Deadline" type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
          <Input id="maxMarks" label="Max Marks" type="number" value={String(formData.maxMarks)} onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })} />
          <Button className="w-full" onClick={handleCreate} isLoading={isCreating}>Create</Button>
        </div>
      </Modal>
    </div>
  );
};
