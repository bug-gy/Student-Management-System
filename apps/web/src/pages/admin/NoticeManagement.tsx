import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { PaginatedResponse } from "../../types";

interface Notice {
  _id: string;
  title: string;
  description: string;
  priority: string;
  targetAudience: { type: string; refId?: string };
  publishDate: string;
  expiryDate?: string;
  createdBy: { name: string };
  status?: string;
}

export const NoticeManagement: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", priority: "normal", targetAudience: { type: "all" }, expiryDate: "" });
  const [error, setError] = useState("");
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (showArchived) params.status = "archived";
      const { data } = await client.get<PaginatedResponse<Notice>>("/notices", { params });
      setNotices(data.data);
      setTotalPages(data.pagination.totalPages);
    } finally { setIsLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchNotices(); }, [page, showArchived]);

  const openCreate = () => {
    setModalMode("create"); setEditId(null);
    setFormData({ title: "", description: "", priority: "normal", targetAudience: { type: "all" }, expiryDate: "" });
    setError("");
  };

  const openEdit = (n: Notice) => {
    setModalMode("edit"); setEditId(n._id);
    setFormData({ title: n.title, description: n.description, priority: n.priority, targetAudience: n.targetAudience, expiryDate: n.expiryDate ? new Date(n.expiryDate).toISOString().slice(0, 16) : "" });
    setError("");
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = { ...formData, expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined };
      if (modalMode === "edit" && editId) {
        await client.put(`/notices/${editId}`, payload);
      } else {
        await client.post("/notices", payload);
      }
      setModalMode(null);
      fetchNotices();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Operation failed");
    }
  };

  const handleArchive = async (id: string) => {
    await client.delete(`/notices/${id}`);
    fetchNotices();
  };

  const handleRestore = async (id: string) => {
    await client.put(`/notices/${id}/restore`);
    fetchNotices();
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "priority", header: "Priority", render: (n: Notice) => <StatusBadge status={n.priority} /> },
    { key: "targetAudience", header: "Audience", render: (n: Notice) => <span className="capitalize">{n.targetAudience.type}</span> },
    { key: "publishDate", header: "Published", render: (n: Notice) => new Date(n.publishDate).toLocaleDateString() },
    {
      key: "actions", header: "Actions",
      render: (n: Notice) => (
        <div className="flex gap-1">
          {n.status === "archived" ? (
            <Button variant="secondary" size="sm" onClick={() => handleRestore(n._id)}>Restore</Button>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => openEdit(n)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setArchiveTarget(n._id)}>Archive</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notice Management</h1>
        <div className="flex gap-2">
          <Button variant={showArchived ? "primary" : "ghost"} size="sm" onClick={() => { setShowArchived(!showArchived); setPage(1); }}>
            {showArchived ? "Active" : "Archived"}
          </Button>
          {!showArchived && <Button onClick={openCreate}>Create Notice</Button>}
        </div>
      </div>
      <DataTable columns={columns} data={notices} page={page} totalPages={totalPages} onPageChange={setPage} isLoading={isLoading} />

      <Modal isOpen={modalMode !== null} onClose={() => setModalMode(null)} title={modalMode === "edit" ? "Edit Notice" : "Create Notice"}>
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <Input id="title" label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Select id="priority" label="Priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} options={[{ value: "normal", label: "Normal" }, { value: "urgent", label: "Urgent" }]} />
          <Select id="audienceType" label="Target Audience" value={formData.targetAudience.type} onChange={(e) => setFormData({ ...formData, targetAudience: { type: e.target.value } })} options={[{ value: "all", label: "All" }, { value: "students", label: "Students" }, { value: "teachers", label: "Teachers" }]} />
          <Input id="expiryDate" label="Expiry Date (optional)" type="datetime-local" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
          <Button className="w-full" onClick={handleSave}>{modalMode === "edit" ? "Update" : "Create"}</Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => { if (archiveTarget) handleArchive(archiveTarget); setArchiveTarget(null); }}
        title="Archive Notice"
        message="Are you sure you want to archive this notice? You can restore it later."
        confirmLabel="Archive"
      />
    </div>
  );
};
