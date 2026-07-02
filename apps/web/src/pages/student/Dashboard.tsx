import React from "react";
import { useAuth } from "../../hooks/useAuth";

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Upcoming Deadlines</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Recent Grades</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Unread Notices</p>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>
    </div>
  );
};
