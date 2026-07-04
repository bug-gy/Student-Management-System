import React, { useState, useEffect } from "react";
import client from "../../api/client";
import type { ApiResponse } from "../../types";

interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalSubjects: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    client.get<ApiResponse<AdminStats>>("/dashboard/admin").then(({ data }) => {
      setStats(data.data);
    });
  }, []);

  const cards = [
    { label: "Total Students", value: stats?.totalStudents, color: "bg-blue-500" },
    { label: "Total Teachers", value: stats?.totalTeachers, color: "bg-green-500" },
    { label: "Total Courses", value: stats?.totalCourses, color: "bg-purple-500" },
    { label: "Total Subjects", value: stats?.totalSubjects, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-2`} />
            <p className="text-2xl font-bold">{stat.value ?? "--"}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
