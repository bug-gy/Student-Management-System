import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import type { ApiResponse } from "../../types";

interface StudentStats {
  _id: string;
  course?: { _id: string; name: string };
  batch?: { _id: string; label: string };
}

interface DashboardData {
  upcomingDeadlines: number;
  recentGrades: number;
  unreadNotices: number;
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [data, setData] = useState<DashboardData>({ upcomingDeadlines: 0, recentGrades: 0, unreadNotices: 0 });

  useEffect(() => {
    client.get<ApiResponse<StudentStats>>("/dashboard/student").then(({ data }) => {
      setStats(data.data);
    });
  }, []);

  useEffect(() => {
    Promise.all([
      client.get<ApiResponse<unknown[]>>("/student/assignments"),
      client.get<ApiResponse<unknown[]>>("/student/marks"),
      client.get<ApiResponse<unknown[]>>("/student/notices"),
    ]).then(([assignments, marks, notices]) => {
      const pendingAssignments = (assignments.data.data as { studentStatus?: string }[]).filter(
        (a) => a.studentStatus === "pending" || a.studentStatus === "overdue",
      ).length;
      setData({
        upcomingDeadlines: pendingAssignments,
        recentGrades: marks.data.data.length,
        unreadNotices: notices.data.data.length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
      {stats?.course && (
        <p className="text-gray-600 mb-4">Course: {stats.course.name} | Batch: {stats.batch?.label ?? "N/A"}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Upcoming Deadlines</p>
          <p className="text-2xl font-bold">{data.upcomingDeadlines}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Recent Grades</p>
          <p className="text-2xl font-bold">{data.recentGrades}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Unread Notices</p>
          <p className="text-2xl font-bold">{data.unreadNotices}</p>
        </div>
      </div>
    </div>
  );
};
