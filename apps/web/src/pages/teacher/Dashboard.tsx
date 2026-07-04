import React, { useState, useEffect } from "react";
import client from "../../api/client";

interface TeacherStats {
  assignedSubjects: number;
  totalStudents: number;
  pendingGrading: number;
}

export const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState<TeacherStats>({ assignedSubjects: 0, totalStudents: 0, pendingGrading: 0 });

  useEffect(() => {
    Promise.all([
      client.get<{ success: boolean; data: { assignedSubjects: number } }>("/dashboard/teacher"),
      client.get<{ success: boolean; data: unknown[] }>("/teacher/subjects"),
      client.get<{ success: boolean; data: unknown[]; pagination?: { total: number } }>("/teacher/assignments"),
    ]).then(([dash, subjects, assignments]) => {
      const totalStudents = (subjects.data.data as { _id: string }[]).length;
      setStats({
        assignedSubjects: dash.data.data.assignedSubjects,
        totalStudents,
        pendingGrading: assignments.data.pagination?.total ?? 0,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Assigned Subjects</p>
          <p className="text-3xl font-bold">{stats.assignedSubjects}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Assigned Subjects Count</p>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Total Assignments</p>
          <p className="text-3xl font-bold">{stats.pendingGrading}</p>
        </div>
      </div>
    </div>
  );
};
