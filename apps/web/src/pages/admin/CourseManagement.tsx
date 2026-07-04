import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import type { Course, PaginatedResponse, ApiResponse } from "../../types";

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", duration: 4, description: "" });
  const [error, setError] = useState("");
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (showArchived) params.status = "archived";
      const { data } = await client.get<PaginatedResponse<Course>>("/courses", { params });
      setCourses(data.data);
      setTotalPages(data.pagination.totalPages);
    } finally { setIsLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchCourses(); }, [page, showArchived]);

  const openCreate = () => {
    setModalMode("create"); setEditId(null);
    setFormData({ name: "", code: "", duration: 4, description: "" });
    setError("");
  };

  const openEdit = (course: Course) => {
    setModalMode("edit"); setEditId(course._id);
    setFormData({ name: course.name, code: course.code, duration: course.duration, description: course.description ?? "" });
    setError("");
  };

  const handleSave = async () => {
    setError("");
    try {
      if (modalMode === "edit" && editId) {
        await client.put<ApiResponse<Course>>(`/courses/${editId}`, formData);
      } else {
        await client.post<ApiResponse<Course>>("/courses", formData);
      }
      setModalMode(null); setEditId(null);
      fetchCourses();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Operation failed";
      setError(msg);
    }
  };

  const handleArchive = async (id: string) => {
    await client.delete(`/courses/${id}`);
    fetchCourses();
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "code", header: "Code" },
    { key: "duration", header: "Duration (years)" },
    { key: "enrolledStudentCount", header: "Students", render: (c: Course) => c.enrolledStudentCount ?? 0 },
    { key: "status", header: "Status", render: (c: Course) => <StatusBadge status={c.status} /> },
    {
      key: "actions", header: "Actions",
      render: (c: Course) => (
        <div className="flex gap-1">
          {c.status === "archived" ? (
            <Button variant="secondary" size="sm" onClick={async () => { await client.put(`/courses/${c._id}/restore`); fetchCourses(); }}>Restore</Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => openEdit(c)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setArchiveTarget(c._id)}>Archive</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <div className="flex gap-2">
          <Button variant={showArchived ? "primary" : "ghost"} size="sm" onClick={() => { setShowArchived(!showArchived); setPage(1); }}>
            {showArchived ? "Active" : "Archived"}
          </Button>
          {!showArchived && <Button onClick={openCreate}>Add Course</Button>}
        </div>
      </div>
      <DataTable columns={columns} data={courses} page={page} totalPages={totalPages} onPageChange={setPage} isLoading={isLoading} />

      <Modal isOpen={modalMode !== null} onClose={() => setModalMode(null)} title={modalMode === "edit" ? "Edit Course" : "Add Course"}>
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <Input id="name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input id="code" label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
          <Input id="duration" label="Duration (years)" type="number" value={String(formData.duration)} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} />
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Button className="w-full" onClick={handleSave}>{modalMode === "edit" ? "Update" : "Create"}</Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => { if (archiveTarget) handleArchive(archiveTarget); setArchiveTarget(null); }}
        title="Archive Course"
        message="Are you sure you want to archive this course? You can restore it later."
        confirmLabel="Archive"
      />
    </div>
  );
};
