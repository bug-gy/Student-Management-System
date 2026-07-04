import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { Subject, Course, PaginatedResponse, ApiResponse } from "../../types";

export const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", course: "", semester: 1 });
  const [error, setError] = useState("");
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (showArchived) params.status = "archived";
      const { data } = await client.get<PaginatedResponse<Subject>>("/subjects", { params });
      setSubjects(data.data);
      setTotalPages(data.pagination.totalPages);
    } finally { setIsLoading(false); }
  };

  const fetchCourses = async () => {
    const { data } = await client.get<PaginatedResponse<Course>>("/courses", { params: { limit: "100" } });
    setCourses(data.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchSubjects(); fetchCourses(); }, [page, showArchived]);

  const openCreate = () => {
    setModalMode("create"); setEditId(null);
    setFormData({ name: "", code: "", course: "", semester: 1 });
    setError("");
  };

  const openEdit = (s: Subject) => {
    setModalMode("edit"); setEditId(s._id);
    setFormData({ name: s.name, code: s.code, course: s.course._id, semester: s.semester });
    setError("");
  };

  const handleSave = async () => {
    setError("");
    try {
      if (modalMode === "edit" && editId) {
        await client.put<ApiResponse<Subject>>(`/subjects/${editId}`, formData);
      } else {
        await client.post<ApiResponse<Subject>>("/subjects", formData);
      }
      setModalMode(null); setEditId(null);
      fetchSubjects();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Operation failed";
      setError(msg);
    }
  };

  const handleArchive = async (id: string) => {
    await client.delete(`/subjects/${id}`);
    fetchSubjects();
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "code", header: "Code" },
    { key: "course", header: "Course", render: (s: Subject) => s.course?.name ?? "--" },
    { key: "semester", header: "Semester" },
    { key: "status", header: "Status", render: (s: Subject) => <StatusBadge status={s.status} /> },
    {
      key: "teachers", header: "Teachers",
      render: (s: Subject) => s.assignedTeachers?.map((t) => t.name).join(", ") ?? "--",
    },
    {
      key: "actions", header: "Actions",
      render: (s: Subject) => (
        <div className="flex gap-1">
          {s.status === "archived" ? (
            <Button variant="secondary" size="sm" onClick={async () => { await client.put(`/subjects/${s._id}/restore`); fetchSubjects(); }}>Restore</Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => openEdit(s)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setArchiveTarget(s._id)}>Archive</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subject Management</h1>
        <div className="flex gap-2">
          <Button variant={showArchived ? "primary" : "ghost"} size="sm" onClick={() => { setShowArchived(!showArchived); setPage(1); }}>
            {showArchived ? "Active" : "Archived"}
          </Button>
          {!showArchived && <Button onClick={openCreate}>Add Subject</Button>}
        </div>
      </div>
      <DataTable columns={columns} data={subjects} page={page} totalPages={totalPages} onPageChange={setPage} isLoading={isLoading} />

      <Modal isOpen={modalMode !== null} onClose={() => setModalMode(null)} title={modalMode === "edit" ? "Edit Subject" : "Add Subject"}>
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <Input id="name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input id="code" label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
          <Select id="course" label="Course" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} options={courses.map((c) => ({ value: c._id, label: c.name }))} placeholder="Select course" />
          <Input id="semester" label="Semester" type="number" value={String(formData.semester)} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })} />
          <Button className="w-full" onClick={handleSave}>{modalMode === "edit" ? "Update" : "Create"}</Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => { if (archiveTarget) handleArchive(archiveTarget); setArchiveTarget(null); }}
        title="Archive Subject"
        message="Are you sure you want to archive this subject? You can restore it later."
        confirmLabel="Archive"
      />
    </div>
  );
};
