import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import type { ApiResponse } from "../../types";

interface FeedbackForm {
  _id: string;
  title: string;
  isCompleted: boolean;
  subject?: { _id: string; name: string };
  closeDate: string;
}

export const StudentFeedback: React.FC = () => {
  const [forms, setForms] = useState<FeedbackForm[]>([]);

  useEffect(() => {
    client.get<ApiResponse<FeedbackForm[]>>("/student/feedback").then(({ data }) => {
      setForms(data.data);
    });
  }, []);

  const handleSubmit = async (formId: string) => {
    try {
      await client.post(`/student/feedback/${formId}/submit`, {
        answers: [{ questionText: "General feedback", type: "text", value: "Good" }],
      });
      setForms(forms.map((f) => (f._id === formId ? { ...f, isCompleted: true } : f)));
    } catch {
      console.error("Failed to submit feedback");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Feedback Forms</h1>
      <div className="space-y-4">
        {forms.map((f) => (
          <div key={f._id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-500">
                {f.subject?.name} — Closes {new Date(f.closeDate).toLocaleDateString()}
              </p>
            </div>
            {f.isCompleted ? (
              <span className="text-green-600 text-sm font-medium">Completed</span>
            ) : (
              <Button size="sm" onClick={() => handleSubmit(f._id)}>Fill Now</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
