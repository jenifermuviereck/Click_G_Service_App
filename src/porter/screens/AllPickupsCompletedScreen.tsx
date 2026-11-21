import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 13 - All Pickups Completed
 * Shows:
 *  - Header "Pickups completed"
 *  - Circular checkmark icon
 *  - "All pickups complete" / "Everything is on board. Next, Customer D."
 *  - Checklist card (Shop A, Shop B, Warehouse C completed)
 *  - TOTAL LOADED: 17 packages card
 *  - Customer D Final destination card
 *  - Start final delivery CTA
 */
const AllPickupsCompletedScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="items-center px-4 py-3 border-b border-slate-100">
        <Text className="text-base font-semibold text-slate-800">Pickups completed</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View className="w-14 h-14 rounded-full bg-emerald-100 items-center justify-center mb-4">
          <Icon name="check" size={28} color="#07522C" />
        </View>

        <Text className="text-2xl font-black text-slate-900 leading-tight">
          All pickups complete
        </Text>
        <Text className="text-xs text-slate-500 mt-1">
          Everything is on board. Next, Customer D.
        </Text>

        {/* Completed Pickups Checklist */}
        <View className="mt-5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <View className="flex-row items-center py-2.5 border-b border-slate-50">
            <View className="w-6 h-6 rounded-full bg-emerald-100 items-center justify-center mr-3">
              <Icon name="check" size={14} color="#07522C" />
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-800">Shop A</Text>
              <Text className="text-xs text-slate-400">Electronics · 5 packages</Text>
            </View>
          </View>

          <View className="flex-row items-center py-2.5 border-b border-slate-50">
            <View className="w-6 h-6 rounded-full bg-emerald-100 items-center justify-center mr-3">
              <Icon name="check" size={14} color="#07522C" />
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-800">Shop B</Text>
              <Text className="text-xs text-slate-400">Furniture · 2 packages</Text>
            </View>
          </View>

          <View className="flex-row items-center py-2.5">
            <View className="w-6 h-6 rounded-full bg-emerald-100 items-center justify-center mr-3">
              <Icon name="check" size={14} color="#07522C" />
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-800">Warehouse C</Text>
              <Text className="text-xs text-slate-400">Hardware · 10 boxes</Text>
            </View>
          </View>
        </View>

        {/* Total Loaded Card */}
        <View className="mt-4 bg-[#07522C] rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
          <Text className="text-xs font-bold text-emerald-100 tracking-wider">TOTAL LOADED</Text>
          <Text className="text-base font-extrabold text-white">17 packages</Text>
        </View>

        {/* Customer D Final destination card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-sm font-bold text-slate-900">
            Customer D · Final destination
          </Text>
          <Text className="text-xs text-slate-500 mt-1 leading-relaxed">
            24, South Usman Road, T. Nagar,{'\n'}Chennai 600017
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Final delivery is now available
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('FinalDestinationDetails')}>
          <Text className="text-base font-bold text-white tracking-wide">Start final delivery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AllPickupsCompletedScreen;
