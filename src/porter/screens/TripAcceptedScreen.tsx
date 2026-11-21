import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 04 - Trip Acceptance Confirmation
 * Shows:
 *  - Big green checkmark icon
 *  - Trip accepted successfully title
 *  - Booking PT1025 card (3 pickups, 17 packages, ₹650)
 *  - View active trip CTA
 */
const TripAcceptedScreen: React.FC = () => {
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
        <Text className="text-base font-semibold text-slate-800">Trip accepted</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-5 pt-8" showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-5">
            <Icon name="check" size={42} color="#07522C" />
          </View>

          <Text className="text-2xl font-black text-slate-900 text-center tracking-tight">
            Trip accepted{'\n'}successfully
          </Text>

          <Text className="text-sm text-slate-500 text-center mt-2">
            One trip. Three pickups.{'\n'}Let's get the goods moving.
          </Text>
        </View>

        {/* Booking Card */}
        <View className="mt-8 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <Text className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Booking PT1025
          </Text>

          <View className="py-3 border-b border-slate-50 flex-row items-center justify-between">
            <Text className="text-xs text-slate-500">Pickup locations</Text>
            <Text className="text-sm font-bold text-slate-800">3</Text>
          </View>

          <View className="py-3 border-b border-slate-50 flex-row items-center justify-between">
            <Text className="text-xs text-slate-500">Total packages</Text>
            <Text className="text-sm font-bold text-slate-800">17</Text>
          </View>

          <View className="pt-3 flex-row items-center justify-between">
            <Text className="text-xs text-slate-500">Estimated earnings</Text>
            <Text className="text-base font-extrabold text-[#07522C]">₹650</Text>
          </View>
        </View>

        {/* Starting tip */}
        <Text className="text-xs font-medium text-slate-400 text-center mt-6">
          Start with Shop A on Ritchie Street.
        </Text>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Your route is ready
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ActiveTripOverview')}>
          <Text className="text-base font-bold text-white tracking-wide">View active trip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TripAcceptedScreen;
