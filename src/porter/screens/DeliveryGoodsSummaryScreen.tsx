import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 16 - Delivery Goods Summary
 * Shows:
 *  - "Ready for handover" / "Customer D · Dinesh Kumar"
 *  - 3 items cards:
 *     - Electronics (From Shop A) | 5 packages
 *     - Furniture (From Shop B) | 2 packages
 *     - Hardware (From Warehouse C) | 10 boxes
 *  - TOTAL PACKAGES 17 dark green bar
 *  - Footnote reminder
 *  - Confirm delivery goods CTA
 */
const DeliveryGoodsSummaryScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const items = [
    { title: 'Electronics', source: 'From Shop A', count: '5', unit: 'packages' },
    { title: 'Furniture', source: 'From Shop B', count: '2', unit: 'packages' },
    { title: 'Hardware', source: 'From Warehouse C', count: '10', unit: 'boxes' },
  ];

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
        <Text className="text-base font-semibold text-slate-800">Delivery goods</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">
          Ready for handover
        </Text>
        <Text className="text-xs text-slate-500 mt-1">Customer D · Dinesh Kumar</Text>

        {/* Goods Cards */}
        <View className="mt-4 gap-3">
          {items.map((item, idx) => (
            <View
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-2">
                <View className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 items-center justify-center mr-3">
                  <Icon name="package-variant" size={20} color="#07522C" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-slate-900">{item.title}</Text>
                  <Text className="text-xs text-slate-400 mt-0.5">{item.source}</Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-lg font-black text-[#07522C]">{item.count}</Text>
                <Text className="text-[10px] font-medium text-slate-400">{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total Packages Bar */}
        <View className="mt-5 bg-[#07522C] rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
          <Text className="text-xs font-bold text-emerald-100 tracking-wider">TOTAL PACKAGES</Text>
          <Text className="text-2xl font-black text-white">17</Text>
        </View>

        {/* Footnote */}
        <Text className="text-xs text-slate-400 leading-relaxed text-center mt-4 px-2">
          Confirm quantity, condition and a delivery photo before receiver verification.
        </Text>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Check every category with the receiver
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DeliveryConfirmation')}>
          <Text className="text-base font-bold text-white tracking-wide">
            Confirm delivery goods
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryGoodsSummaryScreen;
