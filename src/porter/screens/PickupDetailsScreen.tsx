import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 06 - Pickup Location Details
 * Shows:
 *  - Badge "PICKUP 2 OF 3"
 *  - Title "Shop B" with full address
 *  - Contact Person (Priya S., +91 98410 34567)
 *  - Goods to Collect (Furniture · 2 packages, instructions)
 *  - Pickup instructions banner
 *  - Call and Report Issue action buttons
 *  - Navigate to pickup CTA
 */
const PickupDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleCall = () => {
    Linking.openURL('tel:+919841034567').catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">Pickup details</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Badge */}
        <Text className="text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase">
          PICKUP 2 OF 3
        </Text>

        <Text className="text-2xl font-black text-slate-900 mt-1">Shop B</Text>
        <Text className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          48, Royapettah High Road, Chennai, Tamil Nadu 600014
        </Text>

        {/* Contact Person Card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            CONTACT PERSON
          </Text>
          <Text className="text-base font-bold text-slate-900 mt-1">Priya S.</Text>
          <Text className="text-xs text-slate-500 mt-0.5">+91 98410 34567</Text>
        </View>

        {/* Goods To Collect Card */}
        <View className="mt-3.5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            GOODS TO COLLECT
          </Text>
          <Text className="text-base font-bold text-slate-900 mt-1">Furniture · 2 packages</Text>
          <Text className="text-xs text-slate-500 mt-1 leading-relaxed">
            2 packed furniture pieces. Keep dry; do not stack.
          </Text>
        </View>

        {/* Pickup Instructions */}
        <View className="mt-3.5 bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200">
          <Text className="text-xs font-bold text-emerald-900">Pickup instructions</Text>
          <Text className="text-xs text-emerald-800 mt-1 leading-relaxed">
            Use loading bay 2 at the rear. Ask Priya before loading.
          </Text>
        </View>

        {/* Action Row: Call & Report Issue */}
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200"
            activeOpacity={0.7}
            onPress={handleCall}>
            <Icon name="phone" size={18} color="#07522C" />
            <Text className="text-sm font-bold text-emerald-900 ml-2">Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl bg-slate-100 border border-slate-200"
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ReportPickupIssue')}>
            <Icon name="alert-circle-outline" size={18} color="#475569" />
            <Text className="text-sm font-bold text-slate-700 ml-2">Report issue</Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Pickup 2 of 3 · 1 completed
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NavigateToPickup')}>
          <Text className="text-base font-bold text-white tracking-wide">Navigate to pickup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PickupDetailsScreen;
