import React, { useState, useEffect } from "react";
import client from "../../api/client";
import type { Subject, ApiResponse } from "../../types";

export const StudentSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    client.get<ApiResponse<Subject[]>>("/student/subjects").then(({ data }) => {
      setSubjects(data.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Subjects</h1>
      <div className="grid gap-4">
        {subjects.map((s) => (
          <div key={s._id} className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-600">{s.code} — Semester {s.semester}</p>
            {s.assignedTeachers?.length > 0 && (
              <p className="text-sm text-gray-500">Teachers: {s.assignedTeachers.map((t) => t.name).join(", ")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
