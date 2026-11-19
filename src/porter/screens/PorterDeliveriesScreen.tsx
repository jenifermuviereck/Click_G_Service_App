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
import BottomNavBar from '../../components/BottomNavBar';

interface PorterDeliveriesScreenProps {
  hideBottomNav?: boolean;
  onBackToHome?: () => void;
}

const PorterDeliveriesScreen: React.FC<PorterDeliveriesScreenProps> = ({
  hideBottomNav = false,
  onBackToHome,
}) => {
  const navigation = useNavigation<any>();
  const [activeSubTab, setActiveSubTab] = useState<'Upcoming' | 'In-Transit' | 'Completed'>('In-Transit');

  const orders = [
    {
      id: '#CG2048',
      status: 'In-Transit',
      pickup: 'Cloud Warehouse',
      pickupAddress: 'Plot 12, Industrial Area, 2nd Main Rd',
      destination: 'Anna Nagar Construction Site',
      destinationAddress: '21/A, Anna Nagar 2nd Main',
      items: 'Cement Bags (10 bags • 500 kg)',
      stops: '1 Pickup • 3 Drops',
      earnings: '₹1,250',
      time: 'Today, 10:15 AM',
      route: 'DeliveryNavigation',
    },
    {
      id: '#CG2052',
      status: 'Upcoming',
      pickup: 'Hardware Hub Depot',
      pickupAddress: 'Sector 4, HSR Layout',
      destination: 'Electronic City Phase 1',
      destinationAddress: 'Tollgate Junction, Hosur Rd',
      items: 'Steel Pipes & Fixtures (80 kg)',
      stops: '1 Pickup • 1 Drop',
      earnings: '₹420',
      time: 'Today, 02:30 PM',
      route: 'DeliveryRequest',
    },
    {
      id: '#CG2031',
      status: 'Completed',
      pickup: 'Asian Paints Central Depot',
      pickupAddress: 'Peenya Industrial Estate',
      destination: 'Indiranagar Residential Complex',
      destinationAddress: '100 Feet Rd, Indiranagar',
      items: 'Paint Buckets & Brushes (180 L)',
      stops: '1 Pickup • 2 Drops',
      earnings: '₹850',
      time: 'Yesterday, 04:15 PM',
      route: 'BatchSummary',
    },
  ];

  const filteredOrders = orders.filter(o => {
    if (activeSubTab === 'Upcoming') return o.status === 'Upcoming';
    if (activeSubTab === 'In-Transit') return o.status === 'In-Transit';
    return o.status === 'Completed';
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => (onBackToHome ? onBackToHome() : navigation.goBack())}
            className="p-2 -ml-2">
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-slate-900 ml-2">My Deliveries</Text>
        </View>

        <TouchableOpacity className="p-2" activeOpacity={0.7}>
          <Icon name="tune-variant" size={20} color="#475467" />
        </TouchableOpacity>
      </View>

      {/* Sub Tabs Pill Bar */}
      <View className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80">
        <View className="flex-row bg-slate-200/70 p-1 rounded-xl">
          {(['Upcoming', 'In-Transit', 'Completed'] as const).map(tab => {
            const active = activeSubTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                className={`flex-1 py-2 rounded-lg items-center justify-center ${
                  active ? 'bg-white shadow-sm' : 'bg-transparent'
                }`}
                activeOpacity={0.8}
                onPress={() => setActiveSubTab(tab)}>
                <Text
                  className={`text-xs ${
                    active ? 'font-bold text-brand-green' : 'font-medium text-slate-600'
                  }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 sm:px-5"
        contentContainerStyle={{ paddingVertical: 14, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-16">
            <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
              <Icon name="package-variant-closed" size={30} color="#94A3B8" />
            </View>
            <Text className="text-sm font-bold text-slate-700">No {activeSubTab} Deliveries</Text>
            <Text className="text-xs text-slate-400 mt-1">Check back later or switch tabs</Text>
          </View>
        ) : (
          filteredOrders.map(order => (
            <View
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 mb-3.5 shadow-sm">
              {/* Card Header */}
              <View className="flex-row items-center justify-between pb-2.5 border-b border-slate-100">
                <View className="flex-row items-center">
                  <Text className="text-base font-extrabold text-slate-900 mr-2">{order.id}</Text>
                  <View
                    className={`px-2 py-0.5 rounded-full ${
                      order.status === 'In-Transit'
                        ? 'bg-blue-100'
                        : order.status === 'Completed'
                        ? 'bg-emerald-100'
                        : 'bg-amber-100'
                    }`}>
                    <Text
                      className={`text-[10px] font-bold ${
                        order.status === 'In-Transit'
                          ? 'text-blue-800'
                          : order.status === 'Completed'
                          ? 'text-emerald-800'
                          : 'text-amber-800'
                      }`}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <Text className="text-xs text-slate-400">{order.time}</Text>
              </View>

              {/* Route Summary */}
              <View className="py-3 space-y-2">
                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full bg-brand-green items-center justify-center mr-2 mt-0.5">
                    <Icon name="arrow-up" size={10} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-800">{order.pickup}</Text>
                    <Text className="text-[11px] text-slate-400" numberOfLines={1}>
                      {order.pickupAddress}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="w-5 h-5 rounded-full bg-red-500 items-center justify-center mr-2 mt-0.5">
                    <Icon name="map-marker" size={10} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-800">{order.destination}</Text>
                    <Text className="text-[11px] text-slate-400" numberOfLines={1}>
                      {order.destinationAddress}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Item & Earnings Footer */}
              <View className="pt-2.5 border-t border-slate-100 flex-row items-center justify-between">
                <View>
                  <Text className="text-[11px] text-slate-500">{order.items}</Text>
                  <Text className="text-base font-black text-brand-green mt-0.5">
                    {order.earnings}
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-brand-green px-4 py-2 rounded-xl flex-row items-center"
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate(order.route)}>
                  <Text className="text-xs font-bold text-white mr-1">
                    {order.status === 'In-Transit' ? 'Continue Route' : 'View Details'}
                  </Text>
                  <Icon name="chevron-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {!hideBottomNav && <BottomNavBar currentTab="Jobs" />}
    </SafeAreaView>
  );
};

export default PorterDeliveriesScreen;
