import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';
import {
  ScreenHeader,
  PhotoProofSection,
  ConditionChips,
  OtpInputCard,
  PackageCondition,
} from '../../common/components';

const DeliveryConfirmationScreen = () => {
  const navigation = useNavigation<any>();

  const [deliveryPhotoAdded, setDeliveryPhotoAdded] = useState(true);
  const [slipPhotoAdded, setSlipPhotoAdded] = useState(true);
  const [packageCondition, setPackageCondition] = useState<PackageCondition>('Good');
  const [customerOtp, setCustomerOtp] = useState('5942');
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    if (!customerOtp.trim()) {
      showNotification('Please enter customer delivery OTP', 'error');
      return;
    }
    showNotification('Delivery confirmed!', 'success');
    setTimeout(() => {
      navigation.navigate('DeliveryCompleted');
    }, 400);
  };

  const handleCall = () => {
    Linking.openURL('tel:+919876543210').catch(() => {
      showNotification('Calling customer at +91 98765 43210', 'info');
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Reusable Header */}
      <ScreenHeader title="Delivery Confirmation" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1 px-4 sm:px-5"
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Site / Customer Info Card */}
          <View className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-sm font-extrabold text-slate-900">
                  Anna Nagar Construction Site
                </Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  Cement Bags • 10 bags • Rajesh Kumar
                </Text>
              </View>

              <TouchableOpacity
                className="flex-row items-center bg-[#EDF6EF] border border-[#D1EAD9] rounded-xl px-3 py-1.5"
                activeOpacity={0.7}
                onPress={handleCall}>
                <Icon name="phone" size={14} color="#07522C" style={{ marginRight: 4 }} />
                <Text className="text-xs font-bold text-brand-green">Call</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reusable Photo Proof Section */}
          <PhotoProofSection
            heading="Proof of Delivery"
            slots={[
              {
                key: 'delivery',
                title: 'Site Drop Photo',
                activeTitle: 'Delivery Photo ✓',
                isAdded: deliveryPhotoAdded,
                onToggle: () => {
                  setDeliveryPhotoAdded(!deliveryPhotoAdded);
                  showNotification(deliveryPhotoAdded ? 'Delivery photo removed' : 'Delivery photo captured ✓', 'info');
                },
              },
              {
                key: 'slip',
                title: 'Received Slip',
                activeTitle: 'Signed Slip ✓',
                icon: 'file-sign',
                isAdded: slipPhotoAdded,
                onToggle: () => {
                  setSlipPhotoAdded(!slipPhotoAdded);
                  showNotification(slipPhotoAdded ? 'Slip photo removed' : 'Signed slip captured ✓', 'info');
                },
              },
            ]}
          />

          {/* Reusable Condition Chips */}
          <ConditionChips
            heading="Delivered Condition *"
            selectedCondition={packageCondition}
            onSelectCondition={setPackageCondition}
          />

          {/* Reusable OTP Input Card */}
          <OtpInputCard
            label="Customer Delivery OTP *"
            value={customerOtp}
            onChangeText={setCustomerOtp}
            helperText="Obtain 4-digit verification code from recipient"
          />

          {/* Notes (Optional) */}
          <View className="mb-5">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">Delivery Remarks (Optional)</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Unloaded safely at gate 2 received by supervisor"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Earnings Breakdown Card */}
          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <Text className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Payment Breakdown
            </Text>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-xs text-slate-500">Base Delivery Fee</Text>
              <Text className="text-xs font-semibold text-slate-800">₹180</Text>
            </View>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-xs text-slate-500">Platform Commission (10%)</Text>
              <Text className="text-xs font-semibold text-red-500">- ₹18</Text>
            </View>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-xs text-slate-500">Heavy Weight Surcharge (500 kg)</Text>
              <Text className="text-xs font-semibold text-emerald-600">+ ₹88</Text>
            </View>
            <View className="h-px bg-slate-200 my-2" />
            <View className="flex-row justify-between items-center py-1">
              <Text className="text-sm font-bold text-slate-900">Net Partner Earnings</Text>
              <Text className="text-lg font-black text-brand-green">₹250</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom CTA */}
      <View className="px-4 py-3 bg-white border-t border-slate-100 shadow-md">
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center flex-row shadow-sm"
          activeOpacity={0.85}
          onPress={handleConfirm}>
          <Text className="text-white font-bold text-base mr-2">Confirm Delivery</Text>
          <Icon name="check" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryConfirmationScreen;
