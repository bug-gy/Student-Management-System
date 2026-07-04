import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import type { ApiResponse } from "../../types";

interface Subject { _id: string; name: string; code: string; }
interface Student { _id: string; name: string; email: string; rollNumber?: string; }
interface GradeRow { studentId: string; score: number; maxScore: number; remark?: string; }

export const TeacherMarks: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examType, setExamType] = useState("midterm");
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, GradeRow>>({});
  const [existingGrades, setExistingGrades] = useState<Record<string, GradeRow>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [summary, setSummary] = useState<{ average: number; highest: number; lowest: number; count: number } | null>(null);

  useEffect(() => {
    client.get<{ success: boolean; data: Subject[] }>("/teacher/subjects").then((res) => setSubjects(res.data.data));
  }, []);

  const loadStudents = async () => {
    if (!selectedSubject) return;
    setLoading(true); setMessage(null); setSummary(null);
    try {
      const [studentsRes, gradesRes, summaryRes] = await Promise.all([
        client.get<{ success: boolean; data: Student[] }>(`/teacher/subjects/${selectedSubject}/students`),
        client.get<{ success: boolean; data: { student: { _id: string }; score: number; maxScore: number; remark?: string }[] }>("/teacher/marks", { params: { subject: selectedSubject, examType } }),
        client.get<ApiResponse<{ average: number; highest: number; lowest: number; count: number }>>("/teacher/marks/summary", { params: { subject: selectedSubject } }),
      ]);
      setStudents(studentsRes.data.data);
      setSummary(summaryRes.data.data);
      const gradeMap: Record<string, GradeRow> = {};
      for (const g of gradesRes.data.data) { gradeMap[g.student._id] = { studentId: g.student._id, score: g.score, maxScore: g.maxScore, remark: g.remark }; }
      setExistingGrades(gradeMap);
      setMarks({});
    } catch { setMessage({ type: "error", text: "Failed to load data" }); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { loadStudents(); }, [selectedSubject, examType]);

  const updateMark = (studentId: string, field: "score" | "maxScore", value: string) => {
    setMarks((prev) => {
      const existing = prev[studentId] ?? existingGrades[studentId] ?? { studentId, score: 0, maxScore: 100 };
      return { ...prev, [studentId]: { ...existing, [field]: Number(value) || 0, studentId } };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true); setMessage(null);
    try {
      await client.post("/teacher/marks/bulk", {
        subject: selectedSubject, examType,
        marks: Object.values(marks).length > 0 ? Object.values(marks) : students.map((s) => ({ studentId: s._id, score: existingGrades[s._id]?.score ?? 0, maxScore: existingGrades[s._id]?.maxScore ?? 100 })),
      });
      setMessage({ type: "success", text: "Marks saved" });
      setMarks({});
      loadStudents();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed";
      setMessage({ type: "error", text: msg });
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Marks Entry</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select id="subject" label="Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))} placeholder="Select subject" />
          <Select id="examType" label="Exam Type" value={examType} onChange={(e) => setExamType(e.target.value)} options={[{ value: "midterm", label: "Midterm" }, { value: "final", label: "Final" }, { value: "quiz", label: "Quiz" }, { value: "assignment", label: "Assignment" }, { value: "practical", label: "Practical" }]} />
        </div>
        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <div><p className="text-xs text-gray-500">Average</p><p className="text-lg font-bold">{summary.average.toFixed(1)}</p></div>
            <div><p className="text-xs text-gray-500">Highest</p><p className="text-lg font-bold text-green-600">{summary.highest}</p></div>
            <div><p className="text-xs text-gray-500">Lowest</p><p className="text-lg font-bold text-red-600">{summary.lowest}</p></div>
            <div><p className="text-xs text-gray-500">Count</p><p className="text-lg font-bold">{summary.count}</p></div>
          </div>
        )}
        {message && <div className={`px-4 py-2 rounded-lg text-sm mb-4 ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>{message.text}</div>}
      </div>

      {loading ? <LoadingSpinner /> : !selectedSubject ? <p className="text-gray-500">Select a subject and exam type.</p> : students.length === 0 ? <p className="text-gray-500">No students.</p> : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="divide-y">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <span>Student</span><span>Score</span><span>Max</span>
            </div>
            {students.map((s) => (
              <div key={s._id} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-4 py-2 hover:bg-gray-50">
                <span className="text-sm font-medium">{s.name} ({s.rollNumber ?? s.email})</span>
                <input type="number" className="w-20 px-2 py-1 border rounded text-sm" placeholder="Score" value={marks[s._id]?.score ?? existingGrades[s._id]?.score ?? ""} onChange={(e) => updateMark(s._id, "score", e.target.value)} />
                <input type="number" className="w-20 px-2 py-1 border rounded text-sm" placeholder="Max" value={marks[s._id]?.maxScore ?? existingGrades[s._id]?.maxScore ?? 100} onChange={(e) => updateMark(s._id, "maxScore", e.target.value)} />
              </div>
            ))}
          </div>
          <div className="p-4 border-t"><Button onClick={handleSubmit} isLoading={submitting} className="w-full">Save Marks</Button></div>
        </div>
      )}
    </div>
  );
};
