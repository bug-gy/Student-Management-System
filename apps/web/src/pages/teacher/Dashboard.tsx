import React, { useState, useEffect } from "react";
import client from "../../api/client";
import type { ApiResponse } from "../../types";

export const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState<{ assignedSubjects: number } | null>(null);

  useEffect(() => {
    client.get<ApiResponse<{ assignedSubjects: number }>>("/dashboard/teacher").then(({ data }) => {
      setStats(data.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600">Assigned Subjects</p>
        <p className="text-3xl font-bold">{stats?.assignedSubjects ?? "--"}</p>
      </div>
    </div>
  );
};
