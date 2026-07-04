import client from "./client";
import type { ApiResponse, PaginatedResponse } from "../types";

interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  list(params?: Record<string, string>) {
    return client.get<PaginatedResponse<Notification>>("/notifications", { params });
  },
  getUnreadCount() {
    return client.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
  },
  markAsRead(id: string) {
    return client.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
  },
  markAllAsRead() {
    return client.put<ApiResponse<null>>("/notifications/read-all");
  },
};

export type { Notification };
