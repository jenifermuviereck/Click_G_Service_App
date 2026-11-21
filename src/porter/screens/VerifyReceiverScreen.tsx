import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

/**
 * Screen 18 - Receiver OTP Verification
 * Shows:
 *  - Green Lock Shield icon
 *  - "Verify the receiver" / "Customer D · Dinesh Kumar"
 *  - "Ask the receiver for the six-digit OTP sent to their registered mobile number."
 *  - 6-box OTP inputs
 *  - Resend OTP link
 *  - Note: Next: collect the customer's signature. Trip finishes immediately after both steps.
 *  - Verify & complete CTA (moves to Screen 19: CustomerSignature)
 */
const VerifyReceiverScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [otp, setOtp] = useState(['7', '3', '9', '2', '5', '4']);

  const handleVerify = () => {
    showNotification('Receiver OTP verified successfully', 'success');
    navigation.navigate('CustomerSignature');
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
        <Text className="text-base font-semibold text-slate-800">Verify receiver</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-5 pt-8" showsVerticalScrollIndicator={false}>
        {/* Shield Icon */}
        <View className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 items-center justify-center mb-5">
          <Icon name="shield-lock-outline" size={28} color="#07522C" />
        </View>

        <Text className="text-2xl font-black text-slate-900 leading-tight">
          Verify the receiver
        </Text>
        <Text className="text-sm font-bold text-[#07522C] mt-1">
          Customer D · Dinesh Kumar
        </Text>

        <Text className="text-xs text-slate-500 mt-2 leading-relaxed">
          Ask the receiver for the six-digit OTP sent to their registered mobile number.
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
          onPress={() => showNotification('New OTP sent to customer', 'info')}>
          <Text className="text-xs font-bold text-[#07522C]">Resend OTP</Text>
        </TouchableOpacity>

        {/* Flow Note */}
        <View className="mt-12 bg-white rounded-xl p-3.5 border border-slate-100">
          <Text className="text-[11px] text-slate-400 leading-relaxed text-center">
            Next: collect the customer's signature.{'\n'}Trip finishes immediately after both steps.
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Receiver verification · Step 1 of 2
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={handleVerify}>
          <Text className="text-base font-bold text-white tracking-wide">Verify & continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyReceiverScreen;
