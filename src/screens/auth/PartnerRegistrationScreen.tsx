import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UploadPickerModal, { PickedFile } from '../../components/UploadPickerModal';
import authService from '../../services/authService';

const TOTAL_STEPS = 4;

const PartnerRegistrationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialMobile = route?.params?.mobile || '+91 98765 43210';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<'profile' | 'doc1' | 'doc2' | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Kumar',
    mobile: initialMobile.startsWith('+91') ? initialMobile : `+91 ${initialMobile}`,
    email: '',
    address: '18, 6th Cross, BTM Layout',
    city: 'Bengaluru',
    pincode: '560076',
    experienceYears: '5',
    docType1: 'Aadhaar Card',
    docFile1: 'aadhaar-front.pdf • 420 KB',
    docType2: 'Pan Card',
    docFile2: 'aadhaar-back.pdf • 380 KB',
    accountHolderName: 'Kumar',
    accountNumber: '123456789012',
    ifscCode: 'HDFC0001234',
    gPayUpi: 'kj987654321oabc',
    phonePeUpi: 'kj987654321oabc',
  });

  const updateField = (key: string, value: string) => {
    let cleanVal = value;
    if (key === 'mobile') {
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 10);
    } else if (key === 'pincode') {
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 6);
    } else if (key === 'experienceYears') {
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 2);
    } else if (key === 'accountNumber') {
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 18);
    } else if (key === 'ifscCode') {
      cleanVal = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11);
    } else if (key === 'fullName' || key === 'accountHolderName') {
      cleanVal = value.replace(/[^a-zA-Z\s]/g, '');
    }
    setFormData(prev => ({ ...prev, [key]: cleanVal }));
  };

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleFilePicked = (file: PickedFile) => {
    if (uploadTarget === 'profile') {
      setProfilePhoto(file.uri);
      showNotification('Profile photo uploaded');
    } else if (uploadTarget === 'doc1') {
      updateField('docFile1', `${file.name} • ${file.size}`);
      showNotification('Document 1 uploaded');
    } else if (uploadTarget === 'doc2') {
      updateField('docFile2', `${file.name} • ${file.size}`);
      showNotification('Document 2 uploaded');
    }
    setUploadTarget(null);
  };

  const handleSubmit = async () => {
    try {
      await authService.registerPartner({
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        experienceYears: formData.experienceYears,
        idDocType1: formData.docType1,
        idDocType2: formData.docType2,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        gPayUpiId: formData.gPayUpi,
        phonePeUpiId: formData.phonePeUpi,
      });
      setIsSubmitted(true);
    } catch {
      showNotification('Submission error');
    }
  };

  // Render Step Indicator Bar
  const renderStepHeader = () => (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs sm:text-[13px] font-bold text-brand-green">{`Step ${currentStep} of ${TOTAL_STEPS}`}</Text>
        <Text className="text-xs text-slate-400">* Required</Text>
      </View>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4].map(step => (
          <View
            key={step}
            className={`flex-1 h-1 rounded-full ${
              step <= currentStep ? 'bg-brand-green' : 'bg-slate-200'
            }`}
          />
        ))}
      </View>
    </View>
  );

  // Render Step 1: Personal Details
  const renderStep1 = () => (
    <View>
      <Text className="text-base sm:text-lg font-bold text-slate-900 mb-4">Personal Details</Text>

      {/* Add Profile Photo Card */}
      {profilePhoto ? (
        <View className="flex-row items-center bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3 mb-4">
          <Image source={{ uri: profilePhoto }} className="w-12 h-12 rounded-full border border-emerald-400 mr-3" />
          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-800">Profile Photo Uploaded</Text>
            <Text className="text-[11px] text-emerald-800">Ready for review</Text>
          </View>
          <TouchableOpacity
            className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 mr-1.5"
            onPress={() => setUploadTarget('profile')}>
            <Text className="text-[11px] font-bold text-brand-green">Change</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-1.5 bg-white rounded-lg border border-rose-200"
            onPress={() => setProfilePhoto(null)}>
            <Icon name="trash-can-outline" size={16} color="#D92D20" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="flex-row items-center justify-center border border-dashed border-emerald-300 bg-emerald-50/50 rounded-2xl py-3.5 mb-4"
          activeOpacity={0.8}
          onPress={() => setUploadTarget('profile')}>
          <Icon name="camera-outline" size={20} color="#07522C" style={{ marginRight: 8 }} />
          <Text className="text-xs sm:text-sm font-bold text-brand-green">Add Profile Photo (optional)</Text>
        </TouchableOpacity>
      )}

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Full Name *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.fullName}
          onChangeText={v => updateField('fullName', v)}
          placeholder="Enter full name"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-1 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.mobile}
          onChangeText={v => updateField('mobile', v)}
          placeholder="Mobile Number (10 digits)"
          placeholderTextColor="#98A2B3"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={10}
        />
      </View>
      <Text className="text-[11px] text-slate-400 mb-4">Verified mobile number</Text>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Email (optional)</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.email}
          onChangeText={v => updateField('email', v)}
          placeholder="Enter email address"
          placeholderTextColor="#98A2B3"
          keyboardType="email-address"
        />
      </View>
    </View>
  );

  // Render Step 2: Address & Experience
  const renderStep2 = () => (
    <View>
      <Text className="text-base sm:text-lg font-bold text-slate-900 mb-4">Address &amp; Experience</Text>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Address *</Text>
      <View className="border border-slate-300 rounded-xl p-3.5 h-20 bg-white mb-4">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0 flex-1"
          value={formData.address}
          onChangeText={v => updateField('address', v)}
          placeholder="Enter complete address"
          placeholderTextColor="#98A2B3"
          multiline
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">City *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.city}
          onChangeText={v => updateField('city', v)}
          placeholder="City"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">PIN Code *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.pincode}
          onChangeText={v => updateField('pincode', v)}
          placeholder="560076"
          placeholderTextColor="#98A2B3"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={6}
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Experience in Years *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-1 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.experienceYears}
          onChangeText={v => updateField('experienceYears', v)}
          placeholder="5"
          placeholderTextColor="#98A2B3"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={2}
        />
      </View>
      <Text className="text-[11px] text-slate-400 mb-4">Enter total years of service experience.</Text>
    </View>
  );

  // Render Step 3: Identity Documents
  const renderStep3 = () => (
    <View>
      <Text className="text-base sm:text-lg font-bold text-slate-900 mb-4">Identity Documents</Text>

      {/* Doc 1 */}
      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Document Type *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-3 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.docType1}
          onChangeText={v => updateField('docType1', v)}
        />
      </View>

      <TouchableOpacity
        className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4"
        activeOpacity={0.7}
        onPress={() => setUploadTarget('doc1')}>
        <Icon name="file-document-outline" size={24} color="#07522C" style={{ marginRight: 10 }} />
        <View className="flex-1">
          <Text className="text-xs font-bold text-slate-800">File uploaded • Tap to replace</Text>
          <Text className="text-[11px] text-slate-500">{formData.docFile1}</Text>
        </View>
        <View className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">
          <Text className="text-[11px] font-bold text-brand-green">Replace</Text>
        </View>
      </TouchableOpacity>

      {/* Doc 2 */}
      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Document Type *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-3 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.docType2}
          onChangeText={v => updateField('docType2', v)}
        />
      </View>

      <TouchableOpacity
        className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4"
        activeOpacity={0.7}
        onPress={() => setUploadTarget('doc2')}>
        <Icon name="file-document-outline" size={24} color="#07522C" style={{ marginRight: 10 }} />
        <View className="flex-1">
          <Text className="text-xs font-bold text-slate-800">File uploaded • Tap to replace</Text>
          <Text className="text-[11px] text-slate-500">{formData.docFile2}</Text>
        </View>
        <View className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">
          <Text className="text-[11px] font-bold text-brand-green">Replace</Text>
        </View>
      </TouchableOpacity>

      {/* Verification Notice */}
      <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3">
        <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
        <Text className="text-xs text-brand-green flex-1">Your documents are used only for partner verification.</Text>
      </View>
    </View>
  );

  // Render Step 4: Bank Details
  const renderStep4 = () => (
    <View>
      <Text className="text-base sm:text-lg font-bold text-slate-900 mb-4">Bank Details</Text>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Account Holder Name *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.accountHolderName}
          onChangeText={v => updateField('accountHolderName', v)}
          placeholder="Account Holder Name"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Account Number *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.accountNumber}
          onChangeText={v => updateField('accountNumber', v)}
          placeholder="123456789012"
          placeholderTextColor="#98A2B3"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={18}
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">IFSC Code *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.ifscCode}
          onChangeText={v => updateField('ifscCode', v.toUpperCase())}
          placeholder="HDFC0001234"
          placeholderTextColor="#98A2B3"
          autoCapitalize="characters"
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">G Pay UPI Id *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.gPayUpi}
          onChangeText={v => updateField('gPayUpi', v)}
          placeholder="user@upi"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Phone Pay UPI Id *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.phonePeUpi}
          onChangeText={v => updateField('phonePeUpi', v)}
          placeholder="user@ybl"
          placeholderTextColor="#98A2B3"
        />
      </View>

      {/* Account Info Notice */}
      <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3">
        <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
        <Text className="text-xs text-brand-green flex-1">
          Ensure the account holder name matches your identity document.
        </Text>
      </View>
    </View>
  );

  // Render Submitted / Success Screen
  if (isSubmitted) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
        {/* Header - Left-aligned Title with Back Button */}
        <View className="flex-row items-center px-4 py-3.5 border-b border-slate-100">
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="p-1.5 -ml-1 mr-3"
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
          <Text className="text-lg sm:text-xl font-bold text-slate-900">Registration Submitted</Text>
        </View>

        <View className="flex-1 items-center justify-center p-6">
          <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
            <Icon name="check" size={32} color="#07522C" />
          </View>

          <Text className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-6">
            Details submitted successfully
          </Text>

          {/* Reference Card */}
          <View className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <View className="flex-row justify-between py-2 border-b border-slate-200/60">
              <Text className="text-xs text-slate-500">Partner</Text>
              <Text className="text-xs sm:text-sm font-bold text-slate-800">{formData.fullName || 'Kumar'}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-slate-200/60">
              <Text className="text-xs text-slate-500">Registration reference</Text>
              <Text className="text-xs sm:text-sm font-bold text-brand-green">CG-P-2084</Text>
            </View>
            <View className="flex-row justify-between pt-2">
              <Text className="text-xs text-slate-500">Submitted</Text>
              <Text className="text-xs sm:text-sm font-semibold text-slate-700">08 Oct 2026</Text>
            </View>
          </View>
        </View>

        {/* Back to Login Button */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="p-4 bg-white border-t border-slate-100">
          <TouchableOpacity
            className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Login')}>
            <Text className="text-white text-[15px] font-bold">Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 border-b border-slate-100">
        <TouchableOpacity
          onPress={handleBack}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Partner Registration</Text>
      </View>

      <ScrollView
        contentContainerClassName="p-4 sm:p-5 pb-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {renderStepHeader()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="p-4 bg-white border-t border-slate-100">
        {currentStep < 4 ? (
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 h-12 rounded-xl border border-slate-300 bg-white items-center justify-center"
              activeOpacity={0.8}
              onPress={handleBack}>
              <Text className="text-slate-700 text-sm font-bold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 h-12 rounded-xl bg-brand-green items-center justify-center shadow-sm"
              activeOpacity={0.85}
              onPress={handleNext}>
              <Text className="text-white text-sm font-bold">Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              className="w-full h-12 bg-brand-green rounded-xl items-center justify-center mb-2 shadow-sm"
              activeOpacity={0.85}
              onPress={handleSubmit}>
              <Text className="text-white text-sm font-bold">Submit for Verification</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-1 items-center" onPress={handleBack}>
              <Text className="text-xs font-semibold text-slate-500">Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <UploadPickerModal
        visible={uploadTarget !== null}
        onClose={() => setUploadTarget(null)}
        onPick={handleFilePicked}
        title={uploadTarget === 'profile' ? 'Upload Profile Photo' : 'Upload Document'}
        allowDocs={uploadTarget !== 'profile'}
      />
    </SafeAreaView>
  );
};

export default PartnerRegistrationScreen;
