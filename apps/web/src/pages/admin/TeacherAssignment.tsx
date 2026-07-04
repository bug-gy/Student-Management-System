import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import type { Subject, User, ApiResponse, PaginatedResponse } from "../../types";

export const TeacherAssignment: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allTeachers, setAllTeachers] = useState<User[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentTeachers, setCurrentTeachers] = useState<{ _id: string; name: string; email: string }[]>([]);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchData = async () => {
    const [subRes, tchRes] = await Promise.all([
      client.get<PaginatedResponse<Subject>>("/subjects", { params: { limit: "100" } }),
      client.get<PaginatedResponse<User>>("/admin/users", { params: { role: "teacher", limit: "100" } }),
    ]);
    setSubjects(subRes.data.data);
    setAllTeachers(tchRes.data.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!selectedSubject) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentTeachers([]);
      setAssignedIds([]);
      return;
    }
    const sub = subjects.find((s) => s._id === selectedSubject);
    const teachers = sub?.assignedTeachers ?? [];
    setCurrentTeachers(teachers);
    setAssignedIds(teachers.map((t) => t._id));
    setSelectedTeachers([]);
    setMessage(null);
  }, [selectedSubject, subjects]);

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const handleAssign = async () => {
    if (!selectedSubject || selectedTeachers.length === 0) return;
    try {
      await client.post<ApiResponse<Subject>>(`/subjects/${selectedSubject}/teachers`, { teacherIds: selectedTeachers });
      setMessage({ type: "success", text: "Teachers assigned successfully" });
      setSelectedTeachers([]);
      const subRes = await client.get<PaginatedResponse<Subject>>("/subjects", { params: { limit: "100" } });
      setSubjects(subRes.data.data);
    } catch { setMessage({ type: "error", text: "Failed to assign teachers" }); }
  };

  const handleRemoveTeacher = async (teacher: { _id: string; name: string }) => {
    setRemoveTarget({ id: teacher._id, name: teacher.name });
  };

  const confirmRemoveTeacher = async () => {
    if (!removeTarget) return;
    try {
      await client.delete(`/subjects/${selectedSubject}/teachers/${removeTarget.id}`);
      setRemoveTarget(null);
      setMessage({ type: "success", text: "Teacher removed" });
      const subRes = await client.get<PaginatedResponse<Subject>>("/subjects", { params: { limit: "100" } });
      setSubjects(subRes.data.data);
    } catch { setMessage({ type: "error", text: "Failed to remove teacher" }); }
  };

  const unassignedTeachers = allTeachers.filter((t) => !assignedIds.includes(t._id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Assignment</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">Assign Teachers</h2>
          <Select id="subject" label="Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
            options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))} placeholder="Select subject" />

          {selectedSubject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Teachers</label>
              <div className="border rounded-lg max-h-48 overflow-y-auto p-2 space-y-1">
                {unassignedTeachers.length === 0 ? (
                  <p className="text-gray-400 text-sm px-2">All teachers already assigned to this subject</p>
                ) : unassignedTeachers.map((t) => (
                  <label key={t._id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer text-sm">
                    <input type="checkbox" checked={selectedTeachers.includes(t._id)} onChange={() => toggleTeacher(t._id)} className="rounded border-gray-300" />
                    {t.name} ({t.email})
                  </label>
                ))}
              </div>
              {selectedTeachers.length > 0 && <p className="text-xs text-gray-500 mt-1">{selectedTeachers.length} teacher(s) selected</p>}
            </div>
          )}
          <Button onClick={handleAssign} disabled={!selectedSubject || selectedTeachers.length === 0}>Assign Teachers</Button>
          {message && <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">Currently Assigned</h2>
          {!selectedSubject ? (
            <p className="text-gray-500 text-sm">Select a subject to view assigned teachers.</p>
          ) : currentTeachers.length === 0 ? (
            <p className="text-gray-500 text-sm">No teachers assigned to this subject.</p>
          ) : (
            <ul className="divide-y">
              {currentTeachers.map((t) => (
                  <li key={t._id} className="py-2 flex justify-between items-center">
                    <span className="text-sm">{t.name}</span>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveTeacher(t)}>Remove</Button>
                  </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemoveTeacher}
        title="Remove Teacher"
        message={removeTarget ? `Remove ${removeTarget.name} from this subject?` : ""}
        confirmLabel="Remove"
      />
    </div>
  );
};
