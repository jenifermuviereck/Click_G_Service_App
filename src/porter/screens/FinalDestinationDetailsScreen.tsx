import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 14 - Final Destination Details
 * Shows:
 *  - "One final stop." / "All 3 pickups completed"
 *  - CUSTOMER D card: Dinesh Kumar, address, phone
 *  - Total packages card (17 packages)
 *  - Delivery instructions card
 *  - Call customer button
 *  - Navigate to customer CTA
 */
const FinalDestinationDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleCall = () => {
    Linking.openURL('tel:+919841067234').catch(() => {});
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
        <Text className="text-base font-semibold text-slate-800">Final destination</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-[10px] font-extrabold tracking-wider text-emerald-800 uppercase">
          14-20 FINAL DELIVERY
        </Text>
        <Text className="text-2xl font-black text-slate-900 mt-0.5 leading-tight">
          One final stop.
        </Text>
        <Text className="text-xs font-semibold text-emerald-800 mt-0.5">
          All 3 pickups completed
        </Text>

        {/* Customer D Card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <View className="flex-row items-center mb-1">
            <View className="w-6 h-6 rounded-full bg-emerald-50 items-center justify-center mr-2">
              <Icon name="map-marker-outline" size={16} color="#07522C" />
            </View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CUSTOMER D
            </Text>
          </View>

          <Text className="text-base font-black text-slate-900 mt-1">Dinesh Kumar</Text>
          <Text className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            24, South Usman Road, T. Nagar,{'\n'}Chennai, Tamil Nadu 600017
          </Text>
          <Text className="text-xs font-bold text-slate-700 mt-1.5">+91 98410 67234</Text>
        </View>

        {/* Total Packages Card */}
        <View className="mt-3.5 bg-[#07522C] rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center">
            <Icon name="package-variant-closed" size={20} color="#FFFFFF" />
            <Text className="text-xs font-semibold text-emerald-100 ml-2.5">Total packages</Text>
          </View>
          <Text className="text-base font-black text-white">17 packages</Text>
        </View>

        {/* Delivery Instructions */}
        <View className="mt-3.5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-xs font-bold text-slate-900 mb-1.5">Delivery instructions</Text>
          <Text className="text-xs text-slate-500 leading-relaxed">
            Deliver to the ground-floor reception. Call on arrival. Keep electronics upright and
            verify all goods with the receiver.
          </Text>
        </View>

        {/* Call Customer Button */}
        <TouchableOpacity
          className="mt-4 bg-emerald-50 rounded-xl py-3 px-4 border border-emerald-200 flex-row items-center justify-center"
          activeOpacity={0.7}
          onPress={handleCall}>
          <Icon name="phone" size={18} color="#07522C" />
          <Text className="text-xs font-bold text-emerald-900 ml-2">Call customer</Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Delivery · 17 packages
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NavigateToCustomer')}>
          <Text className="text-base font-bold text-white tracking-wide">Navigate to customer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FinalDestinationDetailsScreen;
