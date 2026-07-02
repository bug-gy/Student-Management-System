import React, { useState, useEffect, useCallback } from "react";
import client from "../../api/client";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import type { Course, PaginatedResponse } from "../../types";

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", duration: 4, description: "" });

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await client.get<PaginatedResponse<Course>>("/courses", {
        params: { page: String(page), limit: "20" },
      });
      setCourses(data.data);
      setTotalPages(data.pagination.totalPages);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreate = async () => {
    try {
      await client.post("/courses", formData);
      setIsModalOpen(false);
      setFormData({ name: "", code: "", duration: 4, description: "" });
      fetchCourses();
    } catch (err) {
      console.error("Failed to create course:", err);
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "code", header: "Code" },
    { key: "duration", header: "Duration (years)" },
    {
      key: "enrolledStudentCount",
      header: "Students",
      render: (c: Course) => c.enrolledStudentCount ?? 0,
    },
    { key: "status", header: "Status", render: (c: Course) => <StatusBadge status={c.status} /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Course</Button>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Course">
        <div className="space-y-4">
          <Input id="name" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input id="code" label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
          <Input id="duration" label="Duration (years)" type="number" value={String(formData.duration)} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} />
          <Input id="description" label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Button className="w-full" onClick={handleCreate}>Create</Button>
        </div>
      </Modal>
    </div>
  );
};
