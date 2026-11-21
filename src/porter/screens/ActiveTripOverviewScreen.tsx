import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 05 - Active Trip Overview
 * Shows:
 *  - "One route. Three pickups."
 *  - Progress bar: "1 / 3 pickups completed"
 *  - Stops list (Shop A completed, Shop B current, Warehouse C pending, Customer D locked)
 *  - NEXT PICKUP card (Shop B, Royapettah)
 *  - Continue to pickup CTA
 */
const ActiveTripOverviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">Active trip</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">
          One route. Three pickups.
        </Text>

        {/* Progress Bar */}
        <View className="mt-3">
          <Text className="text-xs font-semibold text-emerald-800 mb-1.5">
            1 / 3 pickups completed
          </Text>
          <View className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <View className="w-1/3 h-full bg-[#07522C] rounded-full" />
          </View>
        </View>

        {/* Stops Status List Card */}
        <View className="mt-5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          {/* Stop 1: Shop A - Completed */}
          <View className="flex-row items-center justify-between py-3 border-b border-slate-100">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center mr-3">
                <Icon name="check" size={16} color="#07522C" />
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-700">Shop A</Text>
                <Text className="text-xs text-slate-400">Electronics · 5 packages</Text>
              </View>
            </View>
            <Text className="text-xs font-semibold text-emerald-700">Completed</Text>
          </View>

          {/* Stop 2: Shop B - Current (Highlighted) */}
          <View className="flex-row items-center justify-between p-3 my-2 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-7 h-7 rounded-full bg-emerald-700 items-center justify-center mr-3">
                <Text className="text-xs font-bold text-white">2</Text>
              </View>
              <View>
                <Text className="text-sm font-bold text-emerald-950">Shop B</Text>
                <Text className="text-xs text-emerald-800">Furniture · 2 packages</Text>
              </View>
            </View>
            <View className="bg-emerald-600 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-white">Current</Text>
            </View>
          </View>

          {/* Stop 3: Warehouse C - Pending */}
          <View className="flex-row items-center justify-between py-3 border-b border-slate-100">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-7 h-7 rounded-full bg-slate-100 items-center justify-center mr-3">
                <Text className="text-xs font-bold text-slate-500">3</Text>
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-700">Warehouse C</Text>
                <Text className="text-xs text-slate-400">Hardware · 10 boxes</Text>
              </View>
            </View>
            <Text className="text-xs font-semibold text-slate-400">Pending</Text>
          </View>

          {/* Stop 4: Customer D - Locked */}
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-7 h-7 rounded-full bg-slate-800 items-center justify-center mr-3">
                <Text className="text-xs font-bold text-white">4</Text>
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-700">Customer D</Text>
                <Text className="text-xs text-slate-400">Final drop · 17 packages</Text>
              </View>
            </View>
            <Text className="text-xs font-semibold text-slate-400">Locked</Text>
          </View>
        </View>

        {/* Next Pickup Quick Card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            NEXT PICKUP
          </Text>
          <Text className="text-base font-bold text-slate-900 mt-1">Shop B</Text>
          <Text className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            48, Royapettah High Road, Chennai, Tamil Nadu 600014
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Complete pickups in order
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PickupDetails')}>
          <Text className="text-base font-bold text-white tracking-wide">Continue to pickup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ActiveTripOverviewScreen;
