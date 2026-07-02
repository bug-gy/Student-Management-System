import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../api/admin.api";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { User } from "../../types";

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.listUsers({ page: String(page), limit: "20" });
      setUsers(res.data);
      setTotalPages(res.pagination.totalPages);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async () => {
    setIsCreating(true);
    setCreateError("");
    try {
      await adminApi.createUser(formData);
      setIsModalOpen(false);
      setCreateError("");
      setFormData({ name: "", email: "", password: "", role: "student" });
      fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create user";
      setCreateError(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (confirm("Deactivate this user?")) {
      await adminApi.deactivateUser(id);
      fetchUsers();
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (u: User) => <span className="capitalize">{u.role}</span> },
    {
      key: "status",
      header: "Status",
      render: (u: User) => <StatusBadge status={u.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (u: User) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeactivate(u._id)}
          disabled={u.status === "inactive"}
        >
          {u.status === "active" ? "Deactivate" : "Inactive"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create User</Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create User">
        <div className="space-y-4">
          {createError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{createError}</div>
          )}
          <Input
            id="name"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Select
            id="role"
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: "admin", label: "Admin" },
              { value: "teacher", label: "Teacher" },
              { value: "student", label: "Student" },
            ]}
          />
          <Button className="w-full" onClick={handleCreate} isLoading={isCreating}>
            Create
          </Button>
        </div>
      </Modal>
    </div>
  );
};
