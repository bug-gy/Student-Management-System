import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../../api/notification.api";

export const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recent, setRecent] = useState<{ _id: string; title: string; message: string; link?: string; isRead: boolean; createdAt: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        notificationApi.getUnreadCount(),
        notificationApi.list({ limit: "5" }),
      ]);
      setUnreadCount(countRes.data.data.count);
      setRecent(listRes.data.data);
    } catch { /* ignore */ }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleMarkAll = async () => {
    await notificationApi.markAllAsRead();
    setUnreadCount(0);
    setRecent((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemClick = async (n: { _id: string; link?: string; isRead: boolean }) => {
    if (!n.isRead) {
      await notificationApi.markAsRead(n._id);
      setUnreadCount((c) => Math.max(0, c - 1));
      setRecent((prev) => prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
    }
    if (n.link) navigate(n.link);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-semibold text-gray-700">Notifications</span>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-blue-600 hover:underline">
                  Mark all read
                </button>
              )}
              <button onClick={() => { navigate("/notifications"); setIsOpen(false); }} className="text-xs text-gray-500 hover:underline">
                View all
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No notifications</div>
            ) : (
              recent.map((n) => (
                <button key={n._id} onClick={() => handleItemClick(n)} className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50" : ""}`}>
                  <p className={`text-sm ${!n.isRead ? "font-semibold" : "font-medium"} text-gray-800`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
