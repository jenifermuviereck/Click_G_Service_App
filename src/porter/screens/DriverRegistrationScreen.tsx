import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

interface RegistrationData {
  // Step 1: Personal
  fullName: string;
  mobile: string;
  email: string;
  profilePhotoAdded: boolean;

  // Step 2: Address & Experience
  address: string;
  city: string;
  pinCode: string;
  experienceYears: string;

  // Step 3: Documents
  aadhaarType: string;
  aadhaarFileName: string;
  aadhaarFileSize: string;
  panType: string;
  panFileName: string;
  panFileSize: string;

  // Step 4: Bank Details
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  gpayUpiId: string;
  phonePeUpiId: string;
}

const DriverRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialMobile = route.params?.mobile || '+91 98765 43210';

  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<RegistrationData>({
    fullName: 'Kumar',
    mobile: initialMobile,
    email: '',
    profilePhotoAdded: true,

    address: '18, 6th Cross, BTM Layout',
    city: 'Bengaluru',
    pinCode: '560076',
    experienceYears: '5',

    aadhaarType: 'Aadhaar Card',
    aadhaarFileName: 'aadhaar-front.pdf',
    aadhaarFileSize: '420 KB',
    panType: 'Pan Card',
    panFileName: 'aadhaar-back.pdf',
    panFileSize: '380 KB',

    accountHolderName: 'Kumar',
    accountNumber: '123456789012',
    ifscCode: 'HDFC0001234',
    gpayUpiId: 'kj987654321@okaxis',
    phonePeUpiId: 'kj987654321@ybl',
  });

  const updateField = (field: keyof RegistrationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!data.fullName.trim()) {
        showNotification('Please enter your full name', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!data.address.trim() || !data.city.trim() || !data.pinCode.trim()) {
        showNotification('Please complete address details', 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (!data.accountHolderName.trim() || !data.accountNumber.trim() || !data.ifscCode.trim()) {
        showNotification('Please fill in bank account information', 'error');
        return;
      }
      // Success! Move to Step 5 (Submission screen)
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  // Step 5: Submitted Screen
  if (step === 5) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
          <TouchableOpacity onPress={() => navigation.navigate('Login')} className="p-2 -ml-2">
            <Icon name="arrow-left" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-slate-900 ml-2">Registration Submitted</Text>
        </View>

        <View className="flex-1 px-6 justify-center items-center">
          {/* Green Check Circle */}
          <View className="w-20 h-20 rounded-full bg-emerald-50 items-center justify-center mb-6 border-4 border-emerald-100">
            <Icon name="check" size={42} color="#07522C" />
          </View>

          <Text className="text-2xl font-bold text-slate-900 text-center mb-2">
            Details submitted successfully
          </Text>
          <Text className="text-sm text-slate-500 text-center mb-8 px-4">
            Our team will review your application and documents. You will receive an SMS confirmation once verified.
          </Text>

          {/* Reference Info Card */}
          <View className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
            <View className="flex-row justify-between py-2 border-b border-slate-200/60">
              <Text className="text-sm text-slate-500">Partner</Text>
              <Text className="text-sm font-bold text-slate-800">{data.fullName || 'Kumar'}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-slate-200/60">
              <Text className="text-sm text-slate-500">Registration reference</Text>
              <Text className="text-sm font-bold text-slate-800">CG-P-2084</Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-slate-500">Submitted</Text>
              <Text className="text-sm font-bold text-slate-800">08 Oct 2026</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <View className="p-5 border-t border-slate-100">
          <TouchableOpacity
            className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-sm"
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}>
            <Text className="text-white font-bold text-base">Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Navigation */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-brand-green ml-2">
          {step === 1 ? 'Driver Details' : 'Driver Registration'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Step Indicator */}
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs font-bold text-slate-700">Step {step} of 4</Text>
              <Text className="text-xs text-slate-400">* Required</Text>
            </View>
            {/* Progress Bar (4 segments) */}
            <View className="flex-row gap-1.5 h-1.5 w-full">
              {[1, 2, 3, 4].map(s => (
                <View
                  key={s}
                  className={`flex-1 rounded-full ${
                    s <= step ? 'bg-brand-green' : 'bg-slate-200'
                  }`}
                />
              ))}
            </View>
          </View>

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <View>
              {/* Profile Photo Placeholder */}
              <TouchableOpacity
                className="w-full border border-dashed border-brand-green/40 bg-brand-lightGreen/20 rounded-2xl p-4 items-center justify-center flex-row mb-5"
                activeOpacity={0.8}
                onPress={() => updateField('profilePhotoAdded', !data.profilePhotoAdded)}>
                <Icon
                  name={data.profilePhotoAdded ? 'check-circle' : 'camera-plus-outline'}
                  size={20}
                  color="#07522C"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-sm font-semibold text-brand-green">
                  {data.profilePhotoAdded ? 'Profile Photo Added ✓' : 'Add Profile Photo (optional)'}
                </Text>
              </TouchableOpacity>

              {/* Full Name */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Full Name *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.fullName}
                  onChangeText={v => updateField('fullName', v)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Mobile Number */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.mobile}
                  editable={false}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#94A3B8"
                />
                <Text className="text-[11px] text-emerald-600 font-medium mt-1">
                  ✓ Verified mobile number
                </Text>
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Email (optional)</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.email}
                  onChangeText={v => updateField('email', v)}
                  placeholder="Enter email address"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* STEP 2: Address & Experience */}
          {step === 2 && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">Address & Experience</Text>

              {/* Address */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Address *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.address}
                  onChangeText={v => updateField('address', v)}
                  placeholder="Street / Flat / Area"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* City */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">City *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.city}
                  onChangeText={v => updateField('city', v)}
                  placeholder="City"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* PIN Code */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">PIN Code *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.pinCode}
                  onChangeText={v => updateField('pinCode', v)}
                  placeholder="6 digit PIN code"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              {/* Experience in Years */}
              <View className="mb-4">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Experience in Years *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.experienceYears}
                  onChangeText={v => updateField('experienceYears', v)}
                  placeholder="e.g. 5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text className="text-[11px] text-slate-500 mt-1">
                  Enter total years of service experience.
                </Text>
              </View>
            </View>
          )}

          {/* STEP 3: Identity Documents */}
          {step === 3 && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">Identity Documents</Text>

              {/* Document 1: Aadhaar Card */}
              <View className="mb-5">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Document Type *</Text>
                <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-2.5">
                  <Text className="text-sm font-medium text-slate-800">{data.aadhaarType}</Text>
                </View>

                {/* Uploaded Card */}
                <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 mr-2">
                    <View className="w-9 h-9 rounded-xl bg-emerald-50 items-center justify-center mr-3 border border-emerald-100">
                      <Icon name="file-document-outline" size={20} color="#07522C" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-slate-800">
                        File uploaded • <Text className="text-brand-green">Replace</Text>
                      </Text>
                      <Text className="text-[11px] text-slate-500 mt-0.5">
                        {data.aadhaarFileName} • {data.aadhaarFileSize}
                      </Text>
                    </View>
                  </View>
                  <Icon name="check-circle" size={18} color="#07522C" />
                </View>
              </View>

              {/* Document 2: Pan Card */}
              <View className="mb-5">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Document Type *</Text>
                <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-2.5">
                  <Text className="text-sm font-medium text-slate-800">{data.panType}</Text>
                </View>

                {/* Uploaded Card */}
                <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 mr-2">
                    <View className="w-9 h-9 rounded-xl bg-emerald-50 items-center justify-center mr-3 border border-emerald-100">
                      <Icon name="file-document-outline" size={20} color="#07522C" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-slate-800">
                        File uploaded • <Text className="text-brand-green">Replace</Text>
                      </Text>
                      <Text className="text-[11px] text-slate-500 mt-0.5">
                        {data.panFileName} • {data.panFileSize}
                      </Text>
                    </View>
                  </View>
                  <Icon name="check-circle" size={18} color="#07522C" />
                </View>
              </View>

              {/* Privacy Notice Banner */}
              <View className="flex-row items-center bg-[#EDF6EF] border border-[#D1EAD9] rounded-xl p-3 mt-1">
                <Icon name="shield-check-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
                <Text className="text-xs text-brand-green font-medium flex-1">
                  Your documents are used only for partner verification.
                </Text>
              </View>
            </View>
          )}

          {/* STEP 4: Bank Details */}
          {step === 4 && (
            <View>
              <Text className="text-lg font-bold text-slate-900 mb-4">Bank Details</Text>

              {/* Account Holder Name */}
              <View className="mb-3.5">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Account Holder Name *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.accountHolderName}
                  onChangeText={v => updateField('accountHolderName', v)}
                  placeholder="Name as per bank"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Account Number */}
              <View className="mb-3.5">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Account Number *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.accountNumber}
                  onChangeText={v => updateField('accountNumber', v)}
                  placeholder="Enter bank account number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              {/* IFSC Code */}
              <View className="mb-3.5">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">IFSC Code *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.ifscCode}
                  onChangeText={v => updateField('ifscCode', v)}
                  placeholder="e.g. HDFC0001234"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                />
              </View>

              {/* G Pay UPI Id */}
              <View className="mb-3.5">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">G Pay UPI Id *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.gpayUpiId}
                  onChangeText={v => updateField('gpayUpiId', v)}
                  placeholder="e.g. username@okaxis"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
              </View>

              {/* PhonePe UPI Id */}
              <View className="mb-3.5">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">Phone Pay UPI Id *</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-brand-green focus:bg-white"
                  value={data.phonePeUpiId}
                  onChangeText={v => updateField('phonePeUpiId', v)}
                  placeholder="e.g. username@ybl"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
              </View>

              {/* Info Note */}
              <View className="flex-row items-center bg-[#EDF6EF] border border-[#D1EAD9] rounded-xl p-3 mt-1 mb-2">
                <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
                <Text className="text-xs text-brand-green font-medium flex-1">
                  Ensure the account holder name matches your identity document.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Buttons */}
      <View className="p-4 border-t border-slate-100 bg-white">
        {step < 4 ? (
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 h-12 border border-slate-300 rounded-xl items-center justify-center bg-white"
              activeOpacity={0.7}
              onPress={handleBack}>
              <Text className="text-slate-700 font-bold text-sm">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-12 bg-brand-green rounded-xl items-center justify-center shadow-sm"
              activeOpacity={0.85}
              onPress={handleNext}>
              <Text className="text-white font-bold text-sm">Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-sm mb-2.5"
              activeOpacity={0.85}
              onPress={handleNext}>
              <Text className="text-white font-bold text-sm">Submit for Verification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-1.5 items-center justify-center"
              activeOpacity={0.7}
              onPress={handleBack}>
              <Text className="text-slate-600 font-medium text-xs">Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DriverRegistrationScreen;
