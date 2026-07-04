import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { StatusBadge } from "../../components/common/StatusBadge";
import type { ApiResponse } from "../../types";

interface Notice {
  _id: string;
  title: string;
  description: string;
  priority: string;
  publishDate: string;
  createdBy: { name: string };
}

export const TeacherNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    client.get<ApiResponse<Notice[]>>("/notices").then(({ data }) => setNotices(data.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notices</h1>
      <div className="space-y-4">
        {notices.length === 0 && <p className="text-gray-500">No notices available.</p>}
        {notices.map((n) => (
          <div key={n._id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{n.title}</h3>
              <StatusBadge status={n.priority} />
            </div>
            <p className="text-sm text-gray-600">{n.description}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(n.publishDate).toLocaleDateString()} — By {n.createdBy?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
