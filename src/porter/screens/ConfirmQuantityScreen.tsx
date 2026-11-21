import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 10 - Quantity Confirmation
 * Shows:
 *  - "Every package counts." / "Shop B"
 *  - EXPECTED PACKAGES card: 2
 *  - Actual packages received: Stepper [-] 2 [+]
 *  - Count before you confirm alert box
 *  - Report quantity mismatch link
 *  - Confirm quantity CTA
 */
const ConfirmQuantityScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [quantity, setQuantity] = useState(2);

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
        <Text className="text-base font-semibold text-slate-800">Confirm quantity</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">
          Every package counts.
        </Text>
        <Text className="text-sm font-bold text-emerald-800 mt-0.5">Shop B</Text>

        {/* Expected Packages Card */}
        <View className="mt-5 bg-white rounded-2xl p-5 border border-slate-100 items-center justify-center shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            EXPECTED PACKAGES
          </Text>
          <Text className="text-4xl font-black text-slate-900">2</Text>
        </View>

        {/* Actual Packages Received Section */}
        <View className="mt-6">
          <Text className="text-sm font-bold text-slate-800 mb-3">Actual packages received</Text>

          {/* Stepper Card */}
          <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
            <TouchableOpacity
              className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 items-center justify-center"
              activeOpacity={0.7}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Icon name="minus" size={22} color="#07522C" />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-2xl font-black text-slate-900">{quantity}</Text>
              <Text className="text-[11px] font-medium text-slate-400">packages</Text>
            </View>

            <TouchableOpacity
              className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 items-center justify-center"
              activeOpacity={0.7}
              onPress={() => setQuantity(quantity + 1)}>
              <Icon name="plus" size={22} color="#07522C" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notice alert */}
        <View className="mt-4 bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex-row items-center">
          <Icon name="check" size={18} color="#07522C" />
          <Text className="text-xs text-emerald-900 font-medium ml-2.5 flex-1">
            Count before you confirm · Include every sealed package.
          </Text>
        </View>

        {/* Report quantity mismatch */}
        <TouchableOpacity
          className="mt-4 bg-white rounded-xl p-3.5 border border-slate-200 flex-row items-center justify-center"
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ReportPickupIssue')}>
          <Icon name="alert-outline" size={18} color="#EF4444" />
          <Text className="text-xs font-bold text-red-500 ml-2">Report quantity mismatch</Text>
        </TouchableOpacity>

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
          onPress={() => navigation.navigate('ConfirmLoading')}>
          <Text className="text-base font-bold text-white tracking-wide">Confirm quantity</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmQuantityScreen;
