/**
 * @file notificationHistoryService.ts
 * @description Persistent In-App Notification Center & History Manager.
 *
 * Manages the list of received notifications, unread badges, and read/clear actions
 * locally using AsyncStorage with automatic synchronization.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  isRead: boolean;
  type: 'new_job' | 'job_update' | 'job_cancelled' | 'payout' | 'system';
  jobId?: string;
  data?: Record<string, any>;
}

const STORAGE_KEY = '@clickg_notification_history';

const INITIAL_SEEDED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'seed-1',
    title: '🔧 Welcome to ClickG Partner!',
    body: 'Your service partner account is verified. Toggle your status to Online to begin receiving jobs.',
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    isRead: false,
    type: 'system',
  },
  {
    id: 'seed-2',
    title: '💰 Payout System Ready',
    body: 'Daily and weekly earnings will be credited directly to your registered bank account.',
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    isRead: true,
    type: 'payout',
  },
];

/**
 * Retrieves all stored notifications ordered by newest first.
 */
export async function getNotificationHistory(): Promise<AppNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial welcoming notifications
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_NOTIFICATIONS));
      return INITIAL_SEEDED_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[NotificationHistory] Failed to read notifications:', err);
    return INITIAL_SEEDED_NOTIFICATIONS;
  }
}

/**
 * Appends a newly received push notification to the history list.
 */
export async function addNotification(
  notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>,
): Promise<AppNotification> {
  try {
    const list = await getNotificationHistory();
    const newItem: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      isRead: false,
    };

    const updated = [newItem, ...list.slice(0, 99)]; // Keep latest 100
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  } catch (err) {
    console.warn('[NotificationHistory] Failed to add notification:', err);
    return {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: Date.now(),
      isRead: false,
    };
  }
}

/**
 * Marks a single notification as read.
 */
export async function markAsRead(id: string): Promise<void> {
  try {
    const list = await getNotificationHistory();
    const updated = list.map(n => (n.id === id ? { ...n, isRead: true } : n));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[NotificationHistory] markAsRead error:', err);
  }
}

/**
 * Marks all notifications in the history as read.
 */
export async function markAllAsRead(): Promise<void> {
  try {
    const list = await getNotificationHistory();
    const updated = list.map(n => ({ ...n, isRead: true }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[NotificationHistory] markAllAsRead error:', err);
  }
}

/**
 * Deletes all notifications from local history.
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.warn('[NotificationHistory] clearAllNotifications error:', err);
  }
}

/**
 * Calculates the current number of unread notifications.
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const list = await getNotificationHistory();
    return list.filter(n => !n.isRead).length;
  } catch {
    return 0;
  }
}

export default {
  getNotificationHistory,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
  getUnreadCount,
};
