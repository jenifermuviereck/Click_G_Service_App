import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

/**
 * Screen 08 - Pickup OTP Verification
 * Shows:
 *  - Green Lock Shield icon
 *  - "Verify this pickup" / "Shop B"
 *  - 6-box OTP inputs
 *  - "Resend OTP"
 *  - Helper disclaimer
 *  - Verify OTP CTA
 */
const VerifyPickupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '6']);

  const handleVerify = () => {
    showNotification('Pickup verified successfully', 'success');
    navigation.navigate('GoodsDetailsPhoto');
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
        <Text className="text-base font-semibold text-slate-800">Verify pickup</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-5 pt-8" showsVerticalScrollIndicator={false}>
        {/* Shield Icon */}
        <View className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 items-center justify-center mb-5">
          <Icon name="shield-lock-outline" size={28} color="#07522C" />
        </View>

        <Text className="text-2xl font-black text-slate-900 leading-tight">
          Verify this pickup
        </Text>
        <Text className="text-base font-bold text-[#07522C] mt-1">Shop B</Text>

        <Text className="text-xs text-slate-500 mt-2 leading-relaxed">
          Ask the contact person for the six-digit pickup OTP to begin collection.
        </Text>

        {/* 6 Box OTP Inputs */}
        <View className="flex-row justify-between mt-8 mb-6">
          {otp.map((digit, idx) => (
            <View
              key={idx}
              className="w-12 h-14 rounded-xl bg-white border border-slate-200 items-center justify-center shadow-sm">
              <Text className="text-xl font-black text-slate-900">{digit}</Text>
            </View>
          ))}
        </View>

        {/* Resend Link */}
        <TouchableOpacity
          className="py-2 items-center"
          activeOpacity={0.7}
          onPress={() => showNotification('New OTP sent to merchant', 'info')}>
          <Text className="text-xs font-bold text-[#07522C]">Resend OTP</Text>
        </TouchableOpacity>

        {/* Security disclaimer */}
        <View className="mt-12 bg-white rounded-xl p-3.5 border border-slate-100">
          <Text className="text-[11px] text-slate-400 leading-relaxed text-center">
            Never share your driver account OTP.{'\n'}This code is only for booking PT1025.
          </Text>
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
          onPress={handleVerify}>
          <Text className="text-base font-bold text-white tracking-wide">Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyPickupScreen;
