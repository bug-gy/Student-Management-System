import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { FileUpload } from "../../components/ui/FileUpload";
import type { ApiResponse } from "../../types";

interface Material {
  _id: string;
  title: string;
  topic?: string;
  subject: { _id: string; name: string };
  uploadedBy: { name: string };
  filePath: string;
  fileType: string;
  downloadCount: number;
  status?: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
}

export const TeacherMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ subject: "", title: "", topic: "" });
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    client.get<{ success: boolean; data: Subject[] }>("/teacher/subjects").then((res) => setSubjects(res.data.data));
  }, []);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (showArchived) params.status = "archived";
      const { data } = await client.get<ApiResponse<Material[]>>("/teacher/materials", { params });
      setMaterials(data.data);
    } finally { setIsLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchMaterials(); }, [showArchived]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("subject", formData.subject);
    fd.append("title", formData.title);
    if (formData.topic) fd.append("topic", formData.topic);
    try {
      await client.post("/teacher/materials", fd);
      setIsModalOpen(false);
      setFormData({ subject: "", title: "", topic: "" });
      setSelectedFile(null);
      fetchMaterials();
    } catch (err) { console.error(err); }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    await client.delete(`/teacher/materials/${archiveTarget}`);
    setArchiveTarget(null);
    fetchMaterials();
  };

  const getDownloadUrl = (filePath: string) => {
    if (filePath.startsWith("http")) return filePath;
    const filename = filePath.split("/").pop() ?? filePath;
    return `/uploads/${filename}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Study Materials</h1>
        <div className="flex gap-2">
          <Button variant={showArchived ? "primary" : "ghost"} size="sm" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? "Active" : "Archived"}
          </Button>
          {!showArchived && <Button onClick={() => setIsModalOpen(true)}>Upload Material</Button>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
        ) : materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No materials found.</div>
        ) : (
          <div className="divide-y">
            {materials.map((m) => (
              <div key={m._id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-sm text-gray-500">{m.subject?.name} &mdash; {m.topic ?? "General"} | Downloads: {m.downloadCount ?? 0}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <a href={getDownloadUrl(m.filePath)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View</a>
                  {m.status === "archived" ? (
                    <Button variant="secondary" size="sm" onClick={async () => { await client.put(`/teacher/materials/${m._id}/restore`); fetchMaterials(); }}>Restore</Button>
                  ) : (
                    <Button variant="danger" size="sm" onClick={() => setArchiveTarget(m._id)}>Archive</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Study Material">
        <div className="space-y-4">
          <Select id="subj" label="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))} placeholder="Select subject" />
          <Input id="title" label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input id="topic" label="Topic (optional)" value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} />
          <FileUpload accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif" onFileSelect={(file) => setSelectedFile(file)} />
          <Button className="w-full" onClick={handleUpload} disabled={!selectedFile || !formData.subject || !formData.title}>Upload</Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={confirmArchive}
        title="Archive Material"
        message="Are you sure you want to archive this study material? You can restore it later."
        confirmLabel="Archive"
      />
    </div>
  );
};
