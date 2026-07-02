import React, { useState, useEffect } from "react";
import client from "../../api/client";
import type { ApiResponse } from "../../types";

interface AttendanceSummary {
  subject: { _id: string; name: string; code: string };
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export const StudentAttendance: React.FC = () => {
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);

  useEffect(() => {
    client.get<ApiResponse<{ summary: AttendanceSummary[] }>>("/student/attendance").then(({ data }) => {
      setSummary(data.data.summary);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>
      <div className="grid gap-4">
        {summary.map((s) => (
          <div key={s.subject._id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{s.subject.name}</h3>
                <p className="text-sm text-gray-500">{s.present} Present | {s.absent} Absent | {s.late} Late</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${s.percentage >= 75 ? "text-green-600" : "text-red-600"}`}>
                  {s.percentage}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
