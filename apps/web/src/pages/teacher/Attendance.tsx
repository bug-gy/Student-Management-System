import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { StatusBadge } from "../../components/common/StatusBadge";

interface Subject { _id: string; name: string; code: string; }
interface Student { _id: string; name: string; email: string; rollNumber?: string; }

export const TeacherAttendance: React.FC = () => {
  const [tab, setTab] = useState<"take" | "history" | "low">("take");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, "present" | "absent" | "late">>({});
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [history, setHistory] = useState<{ _id: string; student: { _id: string; name: string }; status: string; date: string; subject: { _id: string; name: string } }[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [lowAttendance, setLowAttendance] = useState<{ _id: string; student: { name: string; email: string }; percentage: number; total: number; present: number }[]>([]);
  const [lowLoading, setLowLoading] = useState(false);

  useEffect(() => {
    client.get<{ success: boolean; data: Subject[] }>("/teacher/subjects").then((res) => setSubjects(res.data.data));
  }, []);

  const loadStudents = async () => {
    if (!selectedSubject || !date) return;
    setFetchingStudents(true);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        client.get<{ success: boolean; data: Student[] }>(`/teacher/subjects/${selectedSubject}/students`),
        client.get<{ success: boolean; data: { _id: string; student: { _id: string }; status: string }[] }>("/teacher/attendance", { params: { subject: selectedSubject, date } }),
      ]);
      setStudents(studentsRes.data.data);
      const recordMap: Record<string, "present" | "absent" | "late"> = {};
      for (const r of attendanceRes.data.data) { recordMap[r.student._id] = r.status as "present" | "absent" | "late"; }
      for (const s of studentsRes.data.data) { if (!recordMap[s._id]) recordMap[s._id] = "absent"; }
      setRecords(recordMap);
    } catch { setMessage({ type: "error", text: "Failed to load data" }); }
    finally { setFetchingStudents(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { loadStudents(); }, [selectedSubject, date]);

  const markAll = (status: "present" | "absent" | "late") => {
    const updated = { ...records };
    for (const s of students) updated[s._id] = status;
    setRecords(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true); setMessage(null);
    try {
      await client.post("/teacher/attendance", {
        subject: selectedSubject, date: new Date(date + "T00:00:00").toISOString(),
        records: Object.entries(records).map(([studentId, status]) => ({ studentId, status })),
      });
      setMessage({ type: "success", text: "Attendance saved" });
      loadStudents();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed";
      setMessage({ type: "error", text: msg });
    } finally { setSubmitting(false); }
  };

  const loadHistory = async () => {
    if (!selectedSubject) return;
    setHistoryLoading(true);
    try {
      const { data } = await client.get<{ success: boolean; data: { _id: string; student: { _id: string; name: string }; status: string; date: string; subject: { _id: string; name: string } }[] }>("/teacher/attendance", { params: { subject: selectedSubject } });
      setHistory(data.data);
    } catch { setMessage({ type: "error", text: "Failed to load history" }); }
    finally { setHistoryLoading(false); }
  };

  const loadLowAttendance = async () => {
    if (!selectedSubject) return;
    setLowLoading(true);
    try {
      const { data } = await client.get<{ success: boolean; data: { _id: string; student: { name: string; email: string }; percentage: number; total: number; present: number }[] }>("/teacher/attendance/low-attendance", { params: { subject: selectedSubject, threshold: "75" } });
      setLowAttendance(data.data);
    } catch { setMessage({ type: "error", text: "Failed to load low attendance" }); }
    finally { setLowLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (tab === "history") loadHistory(); }, [tab, selectedSubject]);
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (tab === "low") loadLowAttendance(); }, [tab, selectedSubject]);

  const tabs = [
    { key: "take" as const, label: "Take Attendance" },
    { key: "history" as const, label: "History" },
    { key: "low" as const, label: "Low Attendance" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select id="subject" label="Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
            options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))} />
          {tab === "take" && <Input id="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />}
        </div>
        {message && <div className={`px-4 py-2 rounded-lg text-sm mb-4 ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>{message.text}</div>}
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "take" && (
        fetchingStudents ? <LoadingSpinner /> : !selectedSubject ? <p className="text-gray-500">Select a subject and date.</p> : students.length === 0 ? <p className="text-gray-500">No students.</p> : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b flex gap-2">
              <span className="text-sm text-gray-500 self-center">Mark all:</span>
              <button onClick={() => markAll("present")} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">Present</button>
              <button onClick={() => markAll("absent")} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Absent</button>
              <button onClick={() => markAll("late")} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded">Late</button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, idx) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-3 text-sm font-medium">{student.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{student.rollNumber ?? "-"}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-1">
                        {(["present", "absent", "late"] as const).map((status) => (
                          <button key={status} onClick={() => setRecords({ ...records, [student._id]: status })}
                            className={`px-3 py-1 text-xs rounded-full capitalize ${records[student._id] === status ? status === "present" ? "bg-green-600 text-white" : status === "absent" ? "bg-red-600 text-white" : "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{status}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t"><Button onClick={handleSubmit} isLoading={submitting} className="w-full">Save Attendance</Button></div>
          </div>
        )
      )}

      {tab === "history" && (
        historyLoading ? <LoadingSpinner /> : !selectedSubject ? <p className="text-gray-500">Select a subject.</p> : history.length === 0 ? <p className="text-gray-500">No attendance records found.</p> : (
          <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((r) => (
                  <tr key={r._id}><td className="px-6 py-3 text-sm">{r.student.name}</td><td className="px-6 py-3 text-sm">{new Date(r.date).toLocaleDateString()}</td><td className="px-6 py-3"><StatusBadge status={r.status} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === "low" && (
        lowLoading ? <LoadingSpinner /> : !selectedSubject ? <p className="text-gray-500">Select a subject.</p> : lowAttendance.length === 0 ? <p className="text-gray-500">No students below 75% threshold.</p> : (
          <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowAttendance.map((s) => (
                  <tr key={s._id}><td className="px-6 py-3 text-sm">{s.student.name}</td><td className={`px-6 py-3 text-sm font-bold ${s.percentage < 75 ? "text-red-600" : "text-green-600"}`}>{s.percentage}%</td><td className="px-6 py-3 text-sm">{s.present}</td><td className="px-6 py-3 text-sm">{s.total}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};
