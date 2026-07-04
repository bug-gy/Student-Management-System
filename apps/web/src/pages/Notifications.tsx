import React, { useState, useEffect, useCallback } from "react";
import { notificationApi } from "../api/notification.api";
import { Button } from "../components/ui/Button";

interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (unreadOnly) params.unreadOnly = "true";
      const { data } = await notificationApi.list(params);
      setNotifications(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch { /* ignore */ }
  }, [page, unreadOnly]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkAll = async () => {
    await notificationApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  const typeColors: Record<string, string> = {
    assignment: "bg-blue-100 text-blue-700",
    grade: "bg-green-100 text-green-700",
    attendance: "bg-yellow-100 text-yellow-700",
    material: "bg-purple-100 text-purple-700",
    feedback: "bg-pink-100 text-pink-700",
    notice: "bg-orange-100 text-orange-700",
    system: "bg-gray-100 text-gray-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button variant={unreadOnly ? "primary" : "ghost"} size="sm" onClick={() => { setUnreadOnly(!unreadOnly); setPage(1); }}>
            Unread only
          </Button>
          <Button variant="secondary" size="sm" onClick={handleMarkAll}>Mark all read</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border divide-y">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No notifications found.</div>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className={`p-4 flex items-start gap-3 ${!n.isRead ? "bg-blue-50" : ""}`}>
              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${typeColors[n.type] ?? typeColors.system}`}>
                {n.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.isRead ? "font-semibold" : "font-medium"} text-gray-800`}>{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <div className="shrink-0 flex gap-1">
                {!n.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => toggleRead(n._id)}>
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 text-sm rounded-full ${page === p ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
