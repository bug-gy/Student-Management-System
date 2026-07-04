import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { ApiResponse } from "../../types";

interface FeedbackFormItem {
  _id: string;
  title: string;
  subject?: { _id: string; name: string };
  targetTeacher?: { _id: string; name: string };
  openDate: string;
  closeDate: string;
  questions?: { questionText: string; type: string; options?: string[] }[];
  isArchived?: boolean;
}

interface QuestionData { questionText: string; type: string; options: string; }

interface FeedbackResults {
  form: FeedbackFormItem;
  totalResponses: number;
  aggregated: { question: string; type: string; average?: number; counts?: Record<string, number>; responses?: unknown[] }[];
}

export const FeedbackManagement: React.FC = () => {
  const [forms, setForms] = useState<FeedbackFormItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FeedbackFormItem | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", openDate: "", closeDate: "", questions: [{ questionText: "", type: "rating", options: "" }] as QuestionData[] });
  const [resultsModal, setResultsModal] = useState<FeedbackResults | null>(null);
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (showArchived) params.status = "archived";
      const { data } = await client.get<ApiResponse<FeedbackFormItem[]>>("/feedback", { params });
      setForms(data.data);
    } finally { setIsLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchForms(); }, [showArchived]);

  const openCreate = () => {
    setEditTarget(null);
    setFormData({ title: "", openDate: "", closeDate: "", questions: [{ questionText: "", type: "rating", options: "" }] as QuestionData[] });
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (form: FeedbackFormItem) => {
    setEditTarget(form);
    setFormData({
      title: form.title,
      openDate: form.openDate ? new Date(form.openDate).toISOString().slice(0, 16) : "",
      closeDate: form.closeDate ? new Date(form.closeDate).toISOString().slice(0, 16) : "",
      questions: (form.questions ?? []).map((q) => ({
        questionText: q.questionText,
        type: q.type,
        options: q.options ? q.options.join(", ") : "",
      })) as QuestionData[],
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = {
        ...formData,
        openDate: new Date(formData.openDate).toISOString(),
        closeDate: new Date(formData.closeDate).toISOString(),
        questions: formData.questions.map((q) => ({
          questionText: q.questionText, type: q.type,
          options: q.type === "multiple_choice" ? q.options.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        })),
      };
      if (editTarget) {
        await client.put(`/feedback/${editTarget._id}`, payload);
      } else {
        await client.post("/feedback", payload);
      }
      setIsModalOpen(false);
      setEditTarget(null);
      setFormData({ title: "", openDate: "", closeDate: "", questions: [{ questionText: "", type: "rating", options: "" }] as QuestionData[] });
      fetchForms();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Operation failed");
    }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    try {
      await client.delete(`/feedback/${archiveTarget}`);
      setArchiveTarget(null);
      fetchForms();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleRestore = async (id: string) => {
    await client.put(`/feedback/${id}/restore`);
    fetchForms();
  };

  const viewResults = async (id: string) => {
    try {
      const { data } = await client.get<ApiResponse<FeedbackResults>>(`/feedback/${id}/results`);
      setResultsModal(data.data);
    } catch (err) { console.error(err); }
  };

  const addQuestion = () => { setFormData({ ...formData, questions: [...formData.questions, { questionText: "", type: "rating", options: "" }] }); };
  const updateQuestion = (idx: number, field: string, value: string) => {
    const qs: QuestionData[] = formData.questions.map((q, i) => {
      if (i !== idx) return q;
      const updated: QuestionData = { questionText: q.questionText, type: q.type, options: q.options };
      if (field === "questionText") updated.questionText = value;
      else if (field === "type") updated.type = value;
      else if (field === "options") updated.options = value;
      return updated;
    });
    setFormData({ ...formData, questions: qs });
  };
  const removeQuestion = (idx: number) => { setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== idx) }); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feedback Management</h1>
        <div className="flex gap-2">
          <Button variant={showArchived ? "primary" : "ghost"} size="sm" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? "Active" : "Archived"}
          </Button>
          {!showArchived && <Button onClick={openCreate}>Create Feedback Form</Button>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
        ) : forms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No feedback forms found.</div>
        ) : (
          <div className="divide-y">
            {forms.map((f) => (
              <div key={f._id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(f.openDate).toLocaleDateString()} - {new Date(f.closeDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => viewResults(f._id)}>Results</Button>
                  {f.isArchived ? (
                    <Button variant="secondary" size="sm" onClick={() => handleRestore(f._id)}>Restore</Button>
                  ) : (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => openEdit(f)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => setArchiveTarget(f._id)}>Archive</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editTarget ? "Edit Feedback Form" : "Create Feedback Form"} size="lg">
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <Input id="title" label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input id="openDate" label="Open Date" type="datetime-local" value={formData.openDate} onChange={(e) => setFormData({ ...formData, openDate: e.target.value })} />
          <Input id="closeDate" label="Close Date" type="datetime-local" value={formData.closeDate} onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })} />
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Questions</h4>
            {formData.questions.map((q, idx) => (
              <div key={idx} className="border rounded-lg p-3 mb-2 space-y-2">
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <Input id={`qtext-${idx}`} label={`Question ${idx + 1}`} value={q.questionText} onChange={(e) => updateQuestion(idx, "questionText", e.target.value)} />
                    <Select id={`qtype-${idx}`} label="Type" value={q.type} onChange={(e) => updateQuestion(idx, "type", e.target.value)} options={[{ value: "rating", label: "Rating (1-5)" }, { value: "text", label: "Text" }, { value: "multiple_choice", label: "Multiple Choice" }]} />
                    {q.type === "multiple_choice" && (<Input id={`qopts-${idx}`} label="Options (comma-separated)" value={q.options} onChange={(e) => updateQuestion(idx, "options", e.target.value)} />)}
                  </div>
                  <button onClick={() => removeQuestion(idx)} className="text-red-500 hover:text-red-700 mt-6 text-sm">Remove</button>
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={addQuestion}>Add Question</Button>
          </div>
          <Button className="w-full" onClick={handleSave}>{editTarget ? "Update" : "Create"}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!resultsModal} onClose={() => setResultsModal(null)} title={resultsModal?.form.title ?? "Results"} size="lg">
        {resultsModal && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Total responses: {resultsModal.totalResponses}</p>
            {resultsModal.aggregated.map((item, idx) => (
              <div key={idx} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm mb-1">{item.question}</p>
                {item.type === "rating" && <p className="text-lg font-bold text-blue-600">Average: {item.average?.toFixed(2) ?? "N/A"}</p>}
                {item.type === "multiple_choice" && item.counts && (
                  <div className="space-y-1">
                    {Object.entries(item.counts).map(([opt, count]) => (
                      <div key={opt} className="flex justify-between text-sm"><span>{opt}</span><span className="font-medium">{count}</span></div>
                    ))}
                  </div>
                )}
                {item.type === "text" && <p className="text-sm text-gray-600">Responses: {item.responses?.length ?? 0}</p>}
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={confirmArchive}
        title="Archive Feedback Form"
        message="Are you sure you want to archive this feedback form? You can restore it later."
        confirmLabel="Archive"
      />
    </div>
  );
};
