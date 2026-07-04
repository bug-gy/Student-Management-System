import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { DataTable } from "../../components/common/DataTable";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { Course, PaginatedResponse, ApiResponse } from "../../types";

interface Batch {
  _id: string;
  course: { _id: string; name: string; code: string };
  year: number;
  section: string;
  label: string;
  status?: string;
}

export const BatchManagement: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Batch | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [formData, setFormData] = useState({ course: "", year: new Date().getFullYear(), section: "" });
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (showArchived) params.status = "archived";
      const { data } = await client.get<PaginatedResponse<Batch>>("/batches", { params });
      setBatches(data.data);
      setTotalPages(data.pagination.totalPages);
    } finally { setIsLoading(false); }
  };

  const fetchCourses = async () => {
    const { data } = await client.get<PaginatedResponse<Course>>("/courses", { params: { limit: "100" } });
    setCourses(data.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchBatches(); fetchCourses(); }, [page, showArchived]);

  const openCreate = () => {
    setEditTarget(null);
    setFormData({ course: "", year: new Date().getFullYear(), section: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (batch: Batch) => {
    setEditTarget(batch);
    setFormData({ course: batch.course._id, year: batch.year, section: batch.section });
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      if (editTarget) {
        await client.put<ApiResponse<Batch>>(`/batches/${editTarget._id}`, formData);
      } else {
        await client.post<ApiResponse<Batch>>("/batches", formData);
      }
      setIsModalOpen(false);
      setEditTarget(null);
      setFormData({ course: "", year: new Date().getFullYear(), section: "" });
      fetchBatches();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save batch");
    }
  };

  const handleArchive = async (id: string) => {
    await client.delete(`/batches/${id}`);
    fetchBatches();
  };

  const columns = [
    { key: "label", header: "Batch" },
    { key: "course", header: "Course", render: (b: Batch) => b.course?.name ?? "--" },
    { key: "year", header: "Year" },
    { key: "section", header: "Section" },
    {
      key: "actions", header: "Actions",
      render: (b: Batch) => (
        <div className="flex gap-1">
          {b.status === "archived" ? (
            <Button variant="secondary" size="sm" onClick={async () => { await client.put(`/batches/${b._id}/restore`); fetchBatches(); }}>Restore</Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => openEdit(b)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setArchiveTarget(b._id)}>Archive</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Batch Management</h1>
        <div className="flex gap-2">
          <Button variant={showArchived ? "primary" : "ghost"} size="sm" onClick={() => { setShowArchived(!showArchived); setPage(1); }}>
            {showArchived ? "Active" : "Archived"}
          </Button>
          {!showArchived && <Button onClick={openCreate}>Add Batch</Button>}
        </div>
      </div>

      <DataTable columns={columns} data={batches} page={page} totalPages={totalPages} onPageChange={setPage} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editTarget ? "Edit Batch" : "Add Batch"}>
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <Select id="course" label="Course" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} options={courses.map((c) => ({ value: c._id, label: c.name }))} placeholder="Select course" />
          <Input id="year" label="Year" type="number" value={String(formData.year)} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} />
          <Input id="section" label="Section" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
          <Button className="w-full" onClick={handleSave}>{editTarget ? "Update" : "Create"}</Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => { if (archiveTarget) handleArchive(archiveTarget); setArchiveTarget(null); }}
        title="Archive Batch"
        message="Are you sure you want to archive this batch? You can restore it later."
        confirmLabel="Archive"
      />
    </div>
  );
};
