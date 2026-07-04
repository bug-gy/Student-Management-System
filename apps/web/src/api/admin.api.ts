import client from "./client";
import type { User, ApiResponse, PaginatedResponse } from "../types";

export const adminApi = {
  listUsers: async (params?: Record<string, string>) => {
    const { data } = await client.get<PaginatedResponse<User>>("/admin/users", { params });
    return data;
  },

  createUser: async (userData: { name: string; email: string; password: string; role: string; course?: string; batch?: string }) => {
    const { data } = await client.post<ApiResponse<User>>("/admin/users", userData);
    return data;
  },

  updateUser: async (id: string, userData: Record<string, unknown>) => {
    const { data } = await client.put<ApiResponse<User>>(`/admin/users/${id}`, userData);
    return data;
  },

  deactivateUser: async (id: string) => {
    const { data } = await client.delete<ApiResponse<User>>(`/admin/users/${id}`);
    return data;
  },

  resetPassword: async (id: string, newPassword: string) => {
    const { data } = await client.post(`/admin/users/${id}/reset-password`, { newPassword });
    return data;
  },

  bulkCreateUsers: async (users: { name: string; email: string; password: string; role: string; course?: string; batch?: string }[]) => {
    const { data } = await client.post<ApiResponse<{ created: number; skipped: number; errors: { email: string; error: string }[] }>>("/admin/users/bulk", { users });
    return data;
  },
};
