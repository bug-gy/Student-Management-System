import { Notification, INotification } from "../models/Notification.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class NotificationService {
  async create(data: {
    recipient: string;
    type: INotification["type"];
    title: string;
    message: string;
    link?: string;
  }) {
    return Notification.create(data);
  }

  async createBulk(data: {
    recipients: string[];
    type: INotification["type"];
    title: string;
    message: string;
    link?: string;
  }) {
    const docs = data.recipients.map((recipient) => ({
      recipient,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
    }));
    return Notification.insertMany(docs);
  }

  async list(userId: string, query: { page?: string; limit?: string; unreadOnly?: string }) {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = { recipient: userId };
    if (query.unreadOnly === "true") filter.isRead = false;

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
    ]);

    return {
      notifications,
      pagination: getPaginationMeta(total, page, limit),
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string) {
    return Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
  }

  async getUnreadCount(userId: string) {
    return Notification.countDocuments({ recipient: userId, isRead: false });
  }
}
