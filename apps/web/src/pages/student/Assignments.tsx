import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { FileUpload } from "../../components/ui/FileUpload";
import { StatusBadge } from "../../components/common/StatusBadge";
import type { ApiResponse } from "../../types";

interface AssignmentView {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  maxMarks: number;
  studentStatus: string;
  submission?: { grade?: number; feedback?: string };
}

export const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentView[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    client.get<ApiResponse<AssignmentView[]>>("/student/assignments").then(({ data }) => {
      setAssignments(data.data);
    });
  }, []);

  const handleSubmit = async (file: File) => {
    if (!selectedId) return;
    const formData = new FormData();
    formData.append("file", file);
    await client.post(`/student/assignments/${selectedId}/submit`, formData);
    setSelectedId(null);
    const { data } = await client.get<ApiResponse<AssignmentView[]>>("/student/assignments");
    setAssignments(data.data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Assignments</h1>
      <div className="space-y-4">
        {assignments.map((a) => (
          <div key={a._id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
                <p className="text-sm text-gray-500">
                  Due: {new Date(a.deadline).toLocaleDateString()} — Max Marks: {a.maxMarks}
                </p>
                {a.submission?.grade != null && (
                  <p className="text-sm font-medium">Grade: {a.submission.grade}/{a.maxMarks}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={a.studentStatus} />
                {a.studentStatus === "pending" || a.studentStatus === "overdue" ? (
                  <button
                    onClick={() => setSelectedId(a._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {selectedId === a._id ? "Cancel" : "Submit"}
                  </button>
                ) : null}
              </div>
            </div>
            {selectedId === a._id && (
              <div className="mt-4">
                <FileUpload onFileSelect={handleSubmit} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
