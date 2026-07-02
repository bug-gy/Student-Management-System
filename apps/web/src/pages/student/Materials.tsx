import React, { useState, useEffect } from "react";
import client from "../../api/client";
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

export const StudentMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    client.get<ApiResponse<Material[]>>("/student/materials").then(({ data }) => {
      setMaterials(data.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Study Materials</h1>
      <div className="grid gap-4">
        {materials.map((m) => (
          <div key={m._id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{m.title}</h3>
              <p className="text-sm text-gray-500">{m.subject?.name} — {m.topic ?? "General"}</p>
            </div>
            <a
              href={`http://localhost:5000/${m.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
