import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Select } from "../../components/ui/Select";
import type { ApiResponse } from "../../types";

interface Material {
  _id: string;
  title: string;
  topic?: string;
  subject: { _id: string; name: string };
  uploadedBy: { name: string };
  filePath: string;
  fileType: string;
}

interface Subject { _id: string; name: string; code: string; }

export const StudentMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const fetchSubjects = async () => {
    try {
      const { data } = await client.get<ApiResponse<Subject[]>>("/student/subjects");
      setSubjects(data.data);
    } catch { /* ignore */ }
  };

  const fetchMaterials = async () => {
    try {
      const params: Record<string, string> = {};
      if (selectedSubject) params.subject = selectedSubject;
      const { data } = await client.get<ApiResponse<Material[]>>("/student/materials", { params });
      setMaterials(data.data);
    } catch { /* ignore */ }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchSubjects(); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchMaterials(); }, [selectedSubject]);

  const getDownloadUrl = (filePath: string) => {
    if (filePath.startsWith("http")) return filePath;
    return `/uploads/${filePath.split("/").pop() ?? filePath}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Study Materials</h1>
      <div className="mb-4 max-w-xs">
        <Select id="subjectFilter" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
          options={[{ value: "", label: "All Subjects" }, ...subjects.map((s) => ({ value: s._id, label: s.name }))]} />
      </div>
      <div className="grid gap-4">
        {materials.length === 0 && <p className="text-gray-500">No materials found.</p>}
        {materials.map((m) => (
          <div key={m._id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{m.title}</h3>
              <p className="text-sm text-gray-500">{m.subject?.name} — {m.topic ?? "General"}</p>
            </div>
            <a href={getDownloadUrl(m.filePath)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Download</a>
          </div>
        ))}
      </div>
    </div>
  );
};
