import React, { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface Subject {
  _id: string;
  name: string;
  code: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber?: string;
}

interface AttendanceRecord {
  _id: string;
  student: { _id: string; name: string; email: string };
  status: "present" | "absent" | "late";
  date: string;
}

export const TeacherAttendance: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, "present" | "absent" | "late">>({});
  const [existingRecords, setExistingRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    client.get<{ success: boolean; data: Subject[] }>("/teacher/subjects").then((res) => {
      setSubjects(res.data.data);
    });
  }, []);

  const loadStudents = useCallback(async () => {
    if (!selectedSubject || !date) return;
    setFetchingStudents(true);
    setMessage(null);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        client.get<{ success: boolean; data: Student[] }>(`/teacher/subjects/${selectedSubject}/students`),
        client.get<{ success: boolean; data: AttendanceRecord[] }>("/teacher/attendance", {
          params: { subject: selectedSubject, date },
        }),
      ]);
      setStudents(studentsRes.data.data);
      const existing = attendanceRes.data.data;
      setExistingRecords(existing);
      const recordMap: Record<string, "present" | "absent" | "late"> = {};
      for (const r of existing) {
        recordMap[r.student._id] = r.status;
      }
      for (const s of studentsRes.data.data) {
        if (!recordMap[s._id]) recordMap[s._id] = "present";
      }
      setRecords(recordMap);
    } catch {
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setFetchingStudents(false);
    }
  }, [selectedSubject, date]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const markAll = (status: "present" | "absent" | "late") => {
    const updated = { ...records };
    for (const s of students) {
      updated[s._id] = status;
    }
    setRecords(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const dateObj = new Date(date + "T00:00:00");
      await client.post("/teacher/attendance", {
        subject: selectedSubject,
        date: dateObj.toISOString(),
        records: Object.entries(records).map(([studentId, status]) => ({ studentId, status })),
      });
      setMessage({ type: "success", text: "Attendance saved successfully" });
      loadStudents();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save attendance";
      setMessage({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select
            id="subject"
            label="Subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))}
          />
          <Input
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm mb-4 ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {message.text}
          </div>
        )}

        {selectedSubject && date && !fetchingStudents && students.length > 0 && (
          <div className="flex gap-2 mb-4">
            <span className="text-sm text-gray-500 self-center mr-2">Mark all:</span>
            <button onClick={() => markAll("present")} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Present</button>
            <button onClick={() => markAll("absent")} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Absent</button>
            <button onClick={() => markAll("late")} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">Late</button>
          </div>
        )}
      </div>

      {fetchingStudents ? (
        <LoadingSpinner />
      ) : !selectedSubject || !date ? (
        <p className="text-gray-500">Select a subject and date to take attendance.</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students enrolled in this subject.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, idx) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{student.rollNumber ?? "-"}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1">
                      {(["present", "absent", "late"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setRecords({ ...records, [student._id]: status })}
                          className={`px-3 py-1 text-xs rounded-full capitalize ${
                            records[student._id] === status
                              ? status === "present"
                                ? "bg-green-600 text-white"
                                : status === "absent"
                                  ? "bg-red-600 text-white"
                                  : "bg-yellow-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t">
            <Button onClick={handleSubmit} isLoading={submitting} className="w-full">
              Save Attendance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};