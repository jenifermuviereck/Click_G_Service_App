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

const PickupVerificationScreen = () => {
  const navigation = useNavigation<any>();

  const [itemPhotoAdded, setItemPhotoAdded] = useState(true);
  const [billPhotoAdded, setBillPhotoAdded] = useState(true);
  const [packageCondition, setPackageCondition] = useState<PackageCondition>('Good');
  const [otp, setOtp] = useState('8921');
  const [notes, setNotes] = useState('');

  const handleConfirmPickup = () => {
    if (!otp.trim()) {
      showNotification('Please enter store pickup OTP', 'error');
      return;
    }
    showNotification('Pickup verified successfully!', 'success');
    setTimeout(() => {
      navigation.navigate('DeliveryNavigation');
    }, 500);
  };

  const handleCallShop = () => {
    Linking.openURL('tel:+919876543210').catch(() => {
      showNotification('Calling Cloud Warehouse at +91 98765 43210', 'info');
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Reusable Header */}
      <ScreenHeader title="Pickup Verification" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1 px-4 sm:px-5"
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Store Info Banner */}
          <View className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-sm font-extrabold text-slate-900">
                  Interior Paint - 15 buckets
                </Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  Cloud Warehouse • Stop 01
                </Text>
              </View>

              <TouchableOpacity
                className="flex-row items-center bg-[#EDF6EF] border border-[#D1EAD9] rounded-xl px-3 py-1.5"
                activeOpacity={0.7}
                onPress={handleCallShop}>
                <Icon name="phone" size={14} color="#07522C" style={{ marginRight: 4 }} />
                <Text className="text-xs font-bold text-brand-green">Call Shop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reusable Photo Proof Section */}
          <PhotoProofSection
            heading="Verification Photos"
            slots={[
              {
                key: 'item',
                title: 'Item Photo',
                isAdded: itemPhotoAdded,
                onToggle: () => {
                  setItemPhotoAdded(!itemPhotoAdded);
                  showNotification(itemPhotoAdded ? 'Photo removed' : 'Item Photo captured ✓', 'info');
                },
              },
              {
                key: 'bill',
                title: 'Store Bill / Slip',
                icon: 'receipt',
                isAdded: billPhotoAdded,
                onToggle: () => {
                  setBillPhotoAdded(!billPhotoAdded);
                  showNotification(billPhotoAdded ? 'Bill removed' : 'Store Bill captured ✓', 'info');
                },
              },
            ]}
          />

          {/* Reusable Condition Chips */}
          <ConditionChips
            heading="Package Condition *"
            selectedCondition={packageCondition}
            onSelectCondition={setPackageCondition}
          />

          {/* Reusable OTP Input Card */}
          <OtpInputCard
            label="Pickup OTP (From Store Manager) *"
            value={otp}
            onChangeText={setOtp}
            helperText="Ask store manager for the 4-digit pickup handover OTP"
          />

          {/* Notes (Optional) */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">Notes (Optional)</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any remarks, packaging details or observations..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom CTA */}
      <View className="px-4 py-3 bg-white border-t border-slate-100 shadow-md">
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center flex-row shadow-sm"
          activeOpacity={0.85}
          onPress={handleConfirmPickup}>
          <Text className="text-white font-bold text-base mr-2">Confirm Pickup</Text>
          <Icon name="check" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PickupVerificationScreen;
