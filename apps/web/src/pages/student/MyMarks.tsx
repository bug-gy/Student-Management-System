import React, { useState, useEffect } from "react";
import client from "../../api/client";
import type { ApiResponse } from "../../types";

interface Grade {
  _id: string;
  subject: { _id: string; name: string; code: string };
  examType: string;
  score: number;
  maxScore: number;
}

export const StudentMarks: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    client.get<ApiResponse<Grade[]>>("/student/marks").then(({ data }) => {
      setGrades(data.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Marks</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Out of</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grades.map((g) => (
              <tr key={g._id}>
                <td className="px-6 py-4 text-sm">{g.subject?.name}</td>
                <td className="px-6 py-4 text-sm capitalize">{g.examType}</td>
                <td className="px-6 py-4 text-sm font-medium">{g.score}</td>
                <td className="px-6 py-4 text-sm">{g.maxScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
