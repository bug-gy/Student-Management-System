import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import type { ApiResponse } from "../../types";

interface Question {
  questionText: string;
  type: "rating" | "multiple_choice" | "text";
  options?: string[];
}

interface FeedbackForm {
  _id: string;
  title: string;
  isCompleted: boolean;
  subject?: { _id: string; name: string };
  closeDate: string;
  questions?: Question[];
}

export const StudentFeedback: React.FC = () => {
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  useEffect(() => {
    client.get<ApiResponse<FeedbackForm[]>>("/student/feedback").then(({ data }) => {
      setForms(data.data);
    });
  }, []);

  const openForm = (form: FeedbackForm) => {
    setSelectedForm(form);
    setAnswers({});
  };

  const handleSubmit = async () => {
    if (!selectedForm) return;
    try {
      const formattedAnswers = Object.entries(answers).map(([questionText, value]) => ({
        questionText,
        type: selectedForm.questions?.find((q) => q.questionText === questionText)?.type ?? "text",
        value,
      }));
      await client.post(`/student/feedback/${selectedForm._id}/submit`, { answers: formattedAnswers });
      setForms(forms.map((f) => (f._id === selectedForm._id ? { ...f, isCompleted: true } : f)));
      setSelectedForm(null);
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
              <Button size="sm" onClick={() => openForm(f)}>Fill Now</Button>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedForm} onClose={() => setSelectedForm(null)} title={selectedForm?.title ?? "Feedback"} size="lg">
        {selectedForm?.questions?.map((q, idx) => (
          <div key={idx} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{q.questionText}</label>
            {q.type === "rating" && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAnswers({ ...answers, [q.questionText]: n })}
                    className={`w-10 h-10 rounded-full text-sm font-medium ${
                      answers[q.questionText] === n
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
            {q.type === "text" && (
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={3}
                value={answers[q.questionText] as string ?? ""}
                onChange={(e) => setAnswers({ ...answers, [q.questionText]: e.target.value })}
              />
            )}
            {q.type === "multiple_choice" && q.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-2 mb-1 text-sm">
                <input
                  type="radio"
                  name={q.questionText}
                  value={opt}
                  onChange={(e) => setAnswers({ ...answers, [q.questionText]: e.target.value })}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        {selectedForm && (
          <Button className="w-full" onClick={handleSubmit}>Submit Feedback</Button>
        )}
      </Modal>
    </div>
  );
};
