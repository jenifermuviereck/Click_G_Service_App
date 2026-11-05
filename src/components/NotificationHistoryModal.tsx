/**
 * @file NotificationHistoryModal.tsx
 * @description In-App Notification Center Modal.
 *
 * Displays a slide-up notification drawer showing unread badges, past job alerts,
 * payment credits, and system announcements.
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import notificationHistoryService, {
  AppNotification,
} from '../services/notifications/notificationHistoryService';

interface NotificationHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToJob?: (jobId?: string) => void;
}

export const NotificationHistoryModal: React.FC<NotificationHistoryModalProps> = ({
  visible,
  onClose,
  onNavigateToJob,
}) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = async () => {
    const list = await notificationHistoryService.getNotificationHistory();
    setNotifications(list);
  };

  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  const handleMarkAllRead = async () => {
    await notificationHistoryService.markAllAsRead();
    loadNotifications();
  };

  const handleClearAll = async () => {
    await notificationHistoryService.clearAllNotifications();
    setNotifications([]);
  };

  const handleNotificationPress = async (item: AppNotification) => {
    if (!item.isRead) {
      await notificationHistoryService.markAsRead(item.id);
      loadNotifications();
    }

    onClose();
    if (item.type === 'new_job' && onNavigateToJob) {
      onNavigateToJob(item.jobId);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getIconName = (type: AppNotification['type']) => {
    switch (type) {
      case 'new_job':
        return 'wrench';
      case 'job_update':
        return 'bell-ring-outline';
      case 'job_cancelled':
        return 'close-circle-outline';
      case 'payout':
        return 'cash-check';
      case 'system':
      default:
        return 'information-outline';
    }
  };

  const getIconBg = (type: AppNotification['type']) => {
    switch (type) {
      case 'new_job':
        return 'bg-emerald-100 text-emerald-800';
      case 'payout':
        return 'bg-amber-100 text-amber-800';
      case 'job_cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          className="bg-white rounded-t-3xl max-h-[85%] w-full overflow-hidden shadow-2xl"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          {/* Top Drag Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-12 h-1.5 rounded-full bg-slate-300" />
          </View>

          {/* Header Row */}
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100">
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-slate-900 mr-2">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View className="bg-brand-green px-2 py-0.5 rounded-full">
                  <Text className="text-[11px] font-bold text-white">
                    {unreadCount} new
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-3">
              {notifications.length > 0 && unreadCount > 0 && (
                <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
                  <Text className="text-xs font-semibold text-brand-green">
                    Mark all read
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
                activeOpacity={0.7}>
                <Icon name="close" size={18} color="#475467" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content List */}
          <ScrollView
            className="px-5 py-2"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            {notifications.length === 0 ? (
              <View className="items-center justify-center py-16 px-4">
                <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
                  <Icon name="bell-off-outline" size={32} color="#98A2B3" />
                </View>
                <Text className="text-base font-bold text-slate-800 mb-1">
                  No notifications yet
                </Text>
                <Text className="text-xs text-slate-500 text-center">
                  You are completely caught up! New job alerts and updates will appear here.
                </Text>
              </View>
            ) : (
              notifications.map(item => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.75}
                  onPress={() => handleNotificationPress(item)}
                  className={`flex-row items-start p-3.5 my-1.5 rounded-2xl border ${
                    item.isRead
                      ? 'bg-white border-slate-200'
                      : 'bg-emerald-50/50 border-emerald-200'
                  }`}>
                  {/* Category Icon */}
                  <View
                    className={`w-10 h-10 rounded-xl items-center justify-center mr-3 mt-0.5 ${getIconBg(
                      item.type,
                    )}`}>
                    <Icon
                      name={getIconName(item.type)}
                      size={20}
                      color="#07522C"
                    />
                  </View>

                  {/* Body Text */}
                  <View className="flex-1 pr-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text
                        className={`text-sm ${
                          item.isRead ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'
                        }`}
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text className="text-[10px] text-slate-400 font-medium">
                        {formatTimeAgo(item.timestamp)}
                      </Text>
                    </View>
                    <Text className="text-xs text-slate-600 leading-4">
                      {item.body}
                    </Text>
                  </View>

                  {/* Unread indicator dot */}
                  {!item.isRead && (
                    <View className="w-2 h-2 rounded-full bg-brand-green ml-1.5 mt-2" />
                  )}
                </TouchableOpacity>
              ))
            )}

            {notifications.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                className="items-center justify-center py-3 mt-2"
                activeOpacity={0.7}>
                <Text className="text-xs font-semibold text-red-600">
                  Clear all notifications
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationHistoryModal;
