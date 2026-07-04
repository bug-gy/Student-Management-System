import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { adminApi } from "../../api/admin.api";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { BulkImportModal } from "../../components/ui/BulkImportModal";
import type { User, Course, PaginatedResponse } from "../../types";

interface Batch { _id: string; label: string; course: { _id: string }; }

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [createModal, setCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "student", course: "", batch: "" });

  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", status: "active" });
  const [editError, setEditError] = useState("");

  const [resetModal, setResetModal] = useState(false);
  const [resetId, setResetId] = useState<string | null>(null);
  const [resetPwd, setResetPwd] = useState("");
  const [resetError, setResetError] = useState("");

  const [confirmModal, setConfirmModal] = useState<{ user: User } | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [bulkModal, setBulkModal] = useState(false);

  useEffect(() => {
    client.get<PaginatedResponse<Course>>("/courses", { params: { limit: "100" } }).then(({ data }) => setCourses(data.data));
    client.get<PaginatedResponse<Batch>>("/batches", { params: { limit: "100" } }).then(({ data }) => setBatches(data.data));
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await adminApi.listUsers(params);
      setUsers(res.data);
      setTotalPages(res.pagination.totalPages);
    } finally { setIsLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  const handleCreate = async () => {
    setCreateError("");
    try {
      await adminApi.createUser(createForm);
      setCreateModal(false);
      setCreateForm({ name: "", email: "", password: "", role: "student", course: "", batch: "" });
      fetchUsers();
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data;
      setCreateError(response?.errors?.join("\n") ?? response?.message ?? "Failed to create user");
    }
  };

  const openEdit = (u: User) => {
    setEditId(u._id);
    setEditForm({ name: u.name, email: u.email, status: u.status });
    setEditError("");
    setEditModal(true);
  };

  const handleEdit = async () => {
    if (!editId) return;
    setEditError("");
    try {
      await adminApi.updateUser(editId, editForm);
      setEditModal(false);
      fetchUsers();
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data;
      setEditError(response?.errors?.join("\n") ?? response?.message ?? "Failed to update user");
    }
  };

  const handleToggleStatus = async (u: User) => {
    setConfirmModal({ user: u });
  };

  const confirmToggleStatus = async () => {
    if (!confirmModal) return;
    const u = confirmModal.user;
    if (u.status === "active") {
      await adminApi.deactivateUser(u._id);
    } else {
      await adminApi.updateUser(u._id, { status: "active" });
    }
    setConfirmModal(null);
    fetchUsers();
  };

  const openResetPwd = (id: string) => {
    setResetId(id);
    setResetPwd("");
    setResetError("");
    setResetModal(true);
  };

  const handleResetPwd = async () => {
    if (!resetId) return;
    setResetError("");
    try {
      await adminApi.resetPassword(resetId, resetPwd);
      setResetModal(false);
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data;
      setResetError(response?.errors?.join("\n") ?? response?.message ?? "Failed to reset password");
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (u: User) => <span className="capitalize">{u.role}</span> },
    { key: "status", header: "Status", render: (u: User) => <StatusBadge status={u.status} /> },
    {
      key: "actions", header: "Actions",
      render: (u: User) => (
        <div className="flex gap-1 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => openEdit(u)}>Edit</Button>
          <Button variant={u.status === "active" ? "danger" : "ghost"} size="sm" onClick={() => handleToggleStatus(u)}>
            {u.status === "active" ? "Deactivate" : "Reactivate"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openResetPwd(u._id)}>Reset Pwd</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setBulkModal(true)}>Bulk Import</Button>
          <Button onClick={() => { setCreateForm({ name: "", email: "", password: "", role: "student", course: "", batch: "" }); setCreateError(""); setCreateModal(true); }}>Create User</Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Input id="search" placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-xs" />
        <Select id="roleFilter" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} options={[{ value: "", label: "All Roles" }, { value: "admin", label: "Admin" }, { value: "teacher", label: "Teacher" }, { value: "student", label: "Student" }]} />
      </div>

      <DataTable columns={columns} data={users} page={page} totalPages={totalPages} onPageChange={setPage} isLoading={isLoading} />

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create User">
        <div className="space-y-4">
          {createError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm whitespace-pre-line">{createError}</div>}
          <Input id="cname" label="Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
          <Input id="cemail" label="Email" type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
          <Input id="cpwd" label="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
          <p className="text-xs text-gray-500 -mt-2">Min 8 chars, uppercase, lowercase, digit, and special character required</p>
          <Select id="crole" label="Role" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} options={[{ value: "admin", label: "Admin" }, { value: "teacher", label: "Teacher" }, { value: "student", label: "Student" }]} />
          {createForm.role === "student" && (
            <>
              <Select id="ccourse" label="Course" value={createForm.course} onChange={(e) => setCreateForm({ ...createForm, course: e.target.value })} options={courses.map((c) => ({ value: c._id, label: c.name }))} placeholder="Select course" />
              <Select id="cbatch" label="Batch (optional)" value={createForm.batch} onChange={(e) => setCreateForm({ ...createForm, batch: e.target.value })} options={batches.filter((b) => !createForm.course || b.course?._id === createForm.course).map((b) => ({ value: b._id, label: b.label }))} placeholder="Select batch" />
            </>
          )}
          <Button className="w-full" onClick={handleCreate}>Create</Button>
        </div>
      </Modal>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit User">
        <div className="space-y-4">
          {editError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm whitespace-pre-line">{editError}</div>}
          <Input id="ename" label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <Input id="eemail" label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          <Select id="estatus" label="Status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
          <Button className="w-full" onClick={handleEdit}>Update</Button>
        </div>
      </Modal>

      <Modal isOpen={resetModal} onClose={() => setResetModal(false)} title="Reset Password">
        <div className="space-y-4">
          {resetError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm whitespace-pre-line">{resetError}</div>}
          <Input id="rpwd" label="New Password" type="password" value={resetPwd} onChange={(e) => setResetPwd(e.target.value)} />
          <p className="text-xs text-gray-500 -mt-2">Min 8 chars, uppercase, lowercase, digit, and special character required</p>
          <Button className="w-full" onClick={handleResetPwd}>Reset Password</Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={confirmToggleStatus}
        title={confirmModal ? `${confirmModal.user.status === "active" ? "Deactivate" : "Reactivate"} User` : ""}
        message={confirmModal ? `Are you sure you want to ${confirmModal.user.status === "active" ? "deactivate" : "reactivate"} ${confirmModal.user.name}?` : ""}
        confirmLabel={confirmModal?.user.status === "active" ? "Deactivate" : "Reactivate"}
      />

      <BulkImportModal isOpen={bulkModal} onClose={() => setBulkModal(false)} onSuccess={() => { setBulkModal(false); fetchUsers(); }} />
    </div>
  );
};
