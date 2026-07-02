import React, { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import type { Subject, User, ApiResponse, PaginatedResponse } from "../../types";

export const TeacherAssignment: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    const [subRes, tchRes] = await Promise.all([
      client.get<PaginatedResponse<Subject>>("/subjects", { params: { limit: "100" } }),
      client.get<PaginatedResponse<User>>("/admin/users", { params: { role: "teacher", limit: "100" } }),
    ]);
    setSubjects(subRes.data.data);
    setTeachers(tchRes.data.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async () => {
    if (!selectedSubject || selectedTeachers.length === 0) return;
    try {
      await client.post<ApiResponse<Subject>>(`/subjects/${selectedSubject}/teachers`, {
        teacherIds: selectedTeachers,
      });
      setMessage("Teachers assigned successfully");
    } catch {
      setMessage("Failed to assign teachers");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Assignment</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-lg space-y-4">
        <Select
          id="subject"
          label="Subject"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          options={subjects.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))}
          placeholder="Select subject"
        />
        <Select
          id="teachers"
          label="Teachers (hold Ctrl/Cmd to select multiple)"
          value={selectedTeachers}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
            setSelectedTeachers(values);
          }}
          options={teachers.map((t) => ({ value: t._id, label: t.name }))}
          placeholder="Select teachers"
        />
        <Button onClick={handleAssign}>Assign Teachers</Button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
};
