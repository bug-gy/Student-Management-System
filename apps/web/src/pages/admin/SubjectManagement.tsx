import React, { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { Subject, Course, PaginatedResponse } from "../../types";

export const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", course: "", semester: 1 });

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await client.get<PaginatedResponse<Subject>>("/subjects", {
        params: { page: String(page), limit: "20" },
      });
      setSubjects(data.data);
      setTotalPages(data.pagination.totalPages);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const fetchCourses = useCallback(async () => {
    const { data } = await client.get<PaginatedResponse<Course>>("/courses", { params: { limit: "100" } });
    setCourses(data.data);
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, [fetchSubjects, fetchCourses]);

  const handleCreate = async () => {
    try {
      await client.post("/subjects", formData);
      setIsModalOpen(false);
      setFormData({ name: "", code: "", course: "", semester: 1 });
      fetchSubjects();
    } catch (err) {
      console.error("Failed to create subject:", err);
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "code", header: "Code" },
    {
      key: "course",
      header: "Course",
      render: (s: Subject) => s.course?.name ?? "--",
    },
    { key: "semester", header: "Semester" },
    { key: "status", header: "Status", render: (s: Subject) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subject Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Subject</Button>
      </div>

      <DataTable
        columns={columns}
        data={subjects}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Subject">
        <div className="space-y-4">
          <Input id="name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input id="code" label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
          <Select
            id="course"
            label="Course"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            options={courses.map((c) => ({ value: c._id, label: c.name }))}
            placeholder="Select course"
          />
          <Input id="semester" label="Semester" type="number" value={String(formData.semester)} onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })} />
          <Button className="w-full" onClick={handleCreate}>Create</Button>
        </div>
      </Modal>
    </div>
  );
};
