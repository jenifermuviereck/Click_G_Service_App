import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

interface NotifItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'order' | 'payment' | 'alert' | 'complete';
  read: boolean;
  route?: string;
}

const NotificationScreen = () => {
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<NotifItem[]>([
    {
      id: '1',
      title: 'New Delivery Assigned',
      body: 'New batch delivery #CG2048 with 3 stops assigned to you. Total earnings ₹1,250.',
      time: '10 mins ago',
      type: 'order',
      read: false,
      route: 'DeliveryRequest',
    },
    {
      id: '2',
      title: 'Delivery Notice',
      body: 'Goods ready for pickup at Asian Paints store (Stop 02).',
      time: '35 mins ago',
      type: 'alert',
      read: false,
      route: 'PickupStops',
    },
    {
      id: '3',
      title: 'Delivery Completed',
      body: '₹250 credited to your wallet for delivery to Anna Nagar Construction Site.',
      time: '2 hours ago',
      type: 'complete',
      read: true,
      route: 'Earnings',
    },
    {
      id: '4',
      title: 'Payment Update',
      body: 'Weekly payout of ₹4,850 has been transferred to HDFC Bank (••••1234).',
      time: 'Yesterday',
      type: 'payment',
      read: true,
      route: 'Earnings',
    },
    {
      id: '5',
      title: 'Delivery Assignment Changed',
      body: 'Delivery #CG2045 has been reassigned due to route optimization.',
      time: '2 days ago',
      type: 'alert',
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setItems(items.map(i => ({ ...i, read: true })));
    showNotification('All notifications marked as read', 'info');
  };

  const getIcon = (type: NotifItem['type']) => {
    switch (type) {
      case 'order':
        return { name: 'truck-fast', color: '#07522C', bg: 'bg-emerald-100' };
      case 'payment':
        return { name: 'wallet', color: '#0284C7', bg: 'bg-sky-100' };
      case 'complete':
        return { name: 'check-circle', color: '#07522C', bg: 'bg-emerald-100' };
      case 'alert':
      default:
        return { name: 'bell-alert-outline', color: '#D97706', bg: 'bg-amber-100' };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-slate-900 ml-2">Notifications</Text>
        </View>

        <TouchableOpacity onPress={markAllAsRead} className="py-1 px-2">
          <Text className="text-xs font-semibold text-brand-green">Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 sm:px-5"
        contentContainerStyle={{ paddingVertical: 14, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        {items.map(item => {
          const iconConfig = getIcon(item.type);
          return (
            <TouchableOpacity
              key={item.id}
              className={`rounded-2xl p-4 mb-3 border ${
                item.read
                  ? 'bg-white border-slate-200'
                  : 'bg-emerald-50/40 border-emerald-200 shadow-sm'
              }`}
              activeOpacity={0.8}
              onPress={() => {
                if (item.route) {
                  navigation.navigate(item.route);
                }
              }}>
              <View className="flex-row items-start">
                <View
                  className={`w-10 h-10 rounded-xl ${iconConfig.bg} items-center justify-center mr-3 mt-0.5`}>
                  <Icon name={iconConfig.name} size={20} color={iconConfig.color} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className={`text-sm ${
                        item.read ? 'font-bold text-slate-800' : 'font-extrabold text-slate-900'
                      }`}>
                      {item.title}
                    </Text>
                    {!item.read && (
                      <View className="w-2 h-2 rounded-full bg-brand-green ml-2" />
                    )}
                  </View>

                  <Text className="text-xs text-slate-600 leading-relaxed mb-1.5">
                    {item.body}
                  </Text>
                  <Text className="text-[10px] text-slate-400 font-medium">{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;
