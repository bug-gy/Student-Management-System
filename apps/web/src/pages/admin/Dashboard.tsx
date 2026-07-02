import React from "react";

export const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "--", color: "bg-blue-500" },
          { label: "Total Teachers", value: "--", color: "bg-green-500" },
          { label: "Total Courses", value: "--", color: "bg-purple-500" },
          { label: "Active Notices", value: "--", color: "bg-orange-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
