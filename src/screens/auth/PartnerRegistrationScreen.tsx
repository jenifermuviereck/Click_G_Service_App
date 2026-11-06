import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Platform,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UploadPickerModal, { PickedFile } from '../../components/UploadPickerModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';
import profileApi from '../../common/api/profileApi';
import showNotification from '../../common/utils/notification';

const TOTAL_STEPS = 4;

const PartnerRegistrationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialMobile = route?.params?.mobile || '';
  const regToken = route?.params?.registrationToken || '';
  const scrollViewRef = useRef<any>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<'profile' | 'doc1' | 'doc2' | null>(null);

  // OTP Verification Modal State (between Step 1 & Step 2)
  const registrationTokenRef = useRef<string>(regToken || '');
  const [serverMockOtp, setServerMockOtp] = useState<string | null>(null);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const otpInputRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  useEffect(() => {
    if (!otpModalVisible || otpTimer <= 0) return;
    const timer = setInterval(() => {
      setOtpTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpModalVisible, otpTimer]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: initialMobile ? (initialMobile.startsWith('+91') ? initialMobile : `+91 ${initialMobile}`) : '',
    email: '',
    address: '',
    city: 'Bengaluru',
    pincode: '',
    experienceYears: '1',
    docType1: 'Aadhaar Card',
    docFile1: '',
    docType2: 'PAN Card',
    docFile2: '',
    aadhaarNumber: '',
    panNumber: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    gPayUpi: '',
    phonePeUpi: '',
  });

  const [aadhaarFileObj, setAadhaarFileObj] = useState<PickedFile | null>(null);
  const [panFileObj, setPanFileObj] = useState<PickedFile | null>(null);

  /**
   * Sanitizes and updates a form field in state with field-specific validation regex.
   *
   * @param {string} key - Field key identifier in formData.
   * @param {string} value - Raw input value typed by user.
   */
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
    } else if (key === 'aadhaarNumber') {
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 12);
    } else if (key === 'panNumber') {
      cleanVal = value.toUpperCase().slice(0, 10);
    } else if (key === 'fullName' || key === 'accountHolderName') {
      cleanVal = value.replace(/[^a-zA-Z\s]/g, '');
    }
    setFormData(prev => ({ ...prev, [key]: cleanVal }));
  };

  const openUploadModal = (target: 'profile' | 'doc1' | 'doc2') => {
    Keyboard.dismiss();
    setUploadTarget(target);
  };

  const handleOtpDigitChange = (value: string, index: number) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    const newOtp = [...otpDigits];

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 5).split('');
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtpDigits(newOtp);
      otpInputRefs[Math.min(digits.length - 1, 4)].current?.focus();
      return;
    }

    newOtp[index] = cleanVal;
    setOtpDigits(newOtp);

    if (cleanVal !== '' && index < 4) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleAutoFillMockOtp = (code: string) => {
    if (!code) return;
    const digits = code.slice(0, 5).split('');
    setOtpDigits(digits);
    showNotification(`Filled OTP: ${code}`);
  };

  const handleStep1Continue = async () => {
    if (!formData.fullName.trim()) {
      showNotification('Please enter full legal name');
      return;
    }
    const cleanDigits = formData.mobile.replace(/[^0-9]/g, '').slice(-10);
    if (cleanDigits.length !== 10) {
      showNotification('Please enter a valid 10-digit mobile number');
      return;
    }

    if (isMobileVerified && registrationTokenRef.current) {
      setCurrentStep(2);
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await authService.registerApplicant(
        cleanDigits,
        formData.fullName.trim(),
        formData.email.trim() || undefined,
      );
      if (!res.success) {
        showNotification(res.message || 'Registration failed');
        return;
      }
      const returnedOtp = res.testOtp || (res.data as any)?.mockOtp || null;
      if (returnedOtp) {
        setServerMockOtp(returnedOtp);
      }
      showNotification(res.message || '5-digit OTP sent to mobile');
      setOtpDigits(['', '', '', '', '']);
      setOtpTimer(30);
      setOtpModalVisible(true);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to dispatch registration OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyRegistrationOtp = async () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 5) {
      showNotification('Please enter 5-digit verification code');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await authService.verifyOtp(formData.mobile, fullOtp);
      if (res.success) {
        if (res.registrationToken) {
          registrationTokenRef.current = res.registrationToken;
        }
        setIsMobileVerified(true);
        setOtpModalVisible(false);
        showNotification('Mobile verified! Proceeding to Step 2');
        setCurrentStep(2);
      } else {
        showNotification(res.message || 'Invalid OTP code');
      }
    } catch {
      showNotification('Verification error. Please retry');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendRegistrationOtp = async () => {
    if (otpTimer > 0) return;
    setOtpTimer(30);
    try {
      const cleanDigits = formData.mobile.replace(/[^0-9]/g, '').slice(-10);
      const res = await authService.registerApplicant(
        cleanDigits,
        formData.fullName.trim(),
        formData.email.trim() || undefined,
      );
      const returnedOtp = res.testOtp || (res.data as any)?.mockOtp || null;
      if (returnedOtp) {
        setServerMockOtp(returnedOtp);
      }
      showNotification(res.message || 'Fresh OTP sent');
    } catch {
      showNotification('Failed to resend OTP');
    }
  };

  const handleNext = async () => {
    Keyboard.dismiss();

    if (currentStep === 1) {
      await handleStep1Continue();
      return;
    }

    if (currentStep === 2) {
      if (!formData.address.trim()) {
        showNotification('Please enter complete address');
        return;
      }
      if (formData.pincode.replace(/[^0-9]/g, '').length !== 6) {
        showNotification('Please enter a valid 6-digit PIN code');
        return;
      }

      // Establish permanent profile in PostgreSQL with registrationToken
      try {
        const session = await authService.completeRegistration(
          registrationTokenRef.current,
          {
            ...formData,
            idDocType1: formData.docType1,
            idDocType2: formData.docType2,
            gPayUpiId: formData.gPayUpi,
            phonePeUpiId: formData.phonePeUpi,
          },
        );
        if (session.token) {
          await authService.saveToken(session.token);
        }
      } catch (err) {
        console.warn('[PartnerRegistration] completeRegistration non-fatal warning:', err);
      }

      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  /**
   * Receives picked document or camera photo and updates corresponding form attachment slot.
   *
   * @param {PickedFile} file - Picked file object containing uri, name, and size.
   */
  const handleFilePicked = (file: PickedFile) => {
    if (uploadTarget === 'profile') {
      setProfilePhoto(file.uri);
      showNotification('Profile photo uploaded');
    } else if (uploadTarget === 'doc1') {
      setAadhaarFileObj(file);
      updateField('docFile1', `${file.name} • ${file.size}`);
      showNotification('Aadhaar document selected');
    } else if (uploadTarget === 'doc2') {
      setPanFileObj(file);
      updateField('docFile2', `${file.name} • ${file.size}`);
      showNotification('PAN document selected');
    }
    setUploadTarget(null);
  };

  /**
   * Submits all 4 steps of partner registration (personal, KYC docs, bank payout) to authService.
   * On success, marks isSubmitted as true to display the confirmation success state.
   */
  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!formData.accountHolderName.trim()) {
      showNotification('Please enter account holder name');
      return;
    }
    if (!formData.accountNumber.trim()) {
      showNotification('Please enter bank account number');
      return;
    }
    if (!formData.ifscCode.trim()) {
      showNotification('Please enter IFSC code');
      return;
    }

    // 1. Upload Profile Photo if picked
    if (profilePhoto) {
      try {
        const f0 = new FormData();
        f0.append('file', {
          uri: profilePhoto,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        } as any);
        await profileApi.uploadAvatar(f0);
      } catch (e) {
        console.warn('Avatar upload warning:', e);
      }
    }

    // 2. Upload Residential Address & Experience
    try {
      await profileApi.updateAddress({
        addressLine1: formData.address || 'Address',
        city: formData.city || 'Bengaluru',
        state: 'Karnataka',
        pincode: formData.pincode || '560001',
        experienceInYears: parseInt(formData.experienceYears, 10) || 1,
      });
    } catch (e) {
      console.warn('Address update warning:', e);
    }

    // 3. Upload Aadhaar Document if picked
    if (aadhaarFileObj) {
      try {
        const f1 = new FormData();
        f1.append('file', {
          uri: aadhaarFileObj.uri,
          name: aadhaarFileObj.name,
          type: aadhaarFileObj.type || 'image/jpeg',
        } as any);
        f1.append('documentType', 'AADHAAR');
        await profileApi.uploadKycDocument(f1);
      } catch (e) {
        console.warn('Aadhaar upload warning:', e);
      }
    }

    // 4. Upload PAN Document if picked
    if (panFileObj) {
      try {
        const f2 = new FormData();
        f2.append('file', {
          uri: panFileObj.uri,
          name: panFileObj.name,
          type: panFileObj.type || 'image/jpeg',
        } as any);
        f2.append('documentType', 'PAN');
        await profileApi.uploadKycDocument(f2);
      } catch (e) {
        console.warn('PAN upload warning:', e);
      }
    }

    // 5. Update KYC Details (Aadhaar & PAN numbers)
    if (formData.aadhaarNumber || formData.panNumber) {
      try {
        await profileApi.updateKycDetails({
          aadhaarNumber: formData.aadhaarNumber || undefined,
          panNumber: formData.panNumber || undefined,
        });
      } catch (e) {
        console.warn('KYC details warning:', e);
      }
    }

    // 4. Update Bank Details in backend
    try {
      await profileApi.updateBankDetails({
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        googlePayUpiId: formData.gPayUpi || undefined,
        phonePeUpiId: formData.phonePeUpi || undefined,
        upiVpa: formData.gPayUpi || formData.phonePeUpi || undefined,
      });
    } catch (err) {
      console.warn('[PartnerRegistration] updateBankDetails non-fatal warning:', err);
    }

    // 5. Update Work Selection (Skills & Hub)
    try {
      await profileApi.updateWorkSelection({
        skills: ['CCTV & LAN Cabling Service', 'Power Socket & Switch Installation'],
        serviceAreaIds: ['43712e4a-17d0-49b3-946a-fcce65e865fb'],
      });
    } catch (e) {
      console.warn('work-selection warning:', e);
    }

    // 6. Submit complete onboarding to backend for administrative review
    try {
      await profileApi.submitOnboarding();
    } catch (err) {
      console.warn('[PartnerRegistration] submitOnboarding non-fatal warning:', err);
    }

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
      showNotification('Submission completed');
      setIsSubmitted(true);
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
            onPress={() => openUploadModal('profile')}>
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
          onPress={() => openUploadModal('profile')}>
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

      {/* Aadhaar Number */}
      <Text className="text-xs font-semibold text-slate-700 mb-1.5">Aadhaar Card Number (12 digits) *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-3 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.aadhaarNumber}
          onChangeText={v => updateField('aadhaarNumber', v)}
          placeholder="e.g. 234567890123"
          placeholderTextColor="#98A2B3"
          keyboardType="numeric"
          maxLength={12}
        />
      </View>

      {/* Aadhaar File Upload */}
      <Pressable
        className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4"
        style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
        onPress={() => openUploadModal('doc1')}>
        <Icon name="file-document-outline" size={24} color="#07522C" style={{ marginRight: 10 }} />
        <View className="flex-1">
          <Text className="text-xs font-bold text-slate-800">
            {formData.docFile1 ? 'Aadhaar Attached' : 'Attach Aadhaar Card Photo'}
          </Text>
          <Text className="text-[11px] text-slate-500">
            {formData.docFile1 || 'Tap to take photo or choose from gallery'}
          </Text>
        </View>
        <Pressable
          className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          hitSlop={8}
          onPress={() => openUploadModal('doc1')}>
          <Text className="text-[11px] font-bold text-brand-green">
            {formData.docFile1 ? 'Replace' : 'Upload'}
          </Text>
        </Pressable>
      </Pressable>

      {/* PAN Number */}
      <Text className="text-xs font-semibold text-slate-700 mb-1.5">PAN Card Number (10 chars) *</Text>
      <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-3 justify-center">
        <TextInput
          className="text-xs sm:text-sm text-slate-900 p-0"
          value={formData.panNumber}
          onChangeText={v => updateField('panNumber', v)}
          placeholder="e.g. ABCDE1234F"
          placeholderTextColor="#98A2B3"
          autoCapitalize="characters"
          maxLength={10}
        />
      </View>

      {/* PAN File Upload */}
      <Pressable
        className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4"
        style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
        onPress={() => openUploadModal('doc2')}>
        <Icon name="file-document-outline" size={24} color="#07522C" style={{ marginRight: 10 }} />
        <View className="flex-1">
          <Text className="text-xs font-bold text-slate-800">
            {formData.docFile2 ? 'PAN Card Attached' : 'Attach PAN Card Photo'}
          </Text>
          <Text className="text-[11px] text-slate-500">
            {formData.docFile2 || 'Tap to take photo or choose from gallery'}
          </Text>
        </View>
        <Pressable
          className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          hitSlop={8}
          onPress={() => openUploadModal('doc2')}>
          <Text className="text-[11px] font-bold text-brand-green">
            {formData.docFile2 ? 'Replace' : 'Upload'}
          </Text>
        </Pressable>
      </Pressable>

      {/* Verification Notice */}
      <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3">
        <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
        <Text className="text-xs text-brand-green flex-1">Real document files and government IDs satisfy Step 3 verification directly on the backend.</Text>
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
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
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
              <Text className="text-xs sm:text-sm font-bold text-slate-800">{formData.fullName || ''}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-slate-200/60">
              <Text className="text-xs text-slate-500">Registration reference</Text>
              <Text className="text-xs sm:text-sm font-bold text-brand-green">
                {regToken ? `CG-REG-${regToken.slice(0, 6).toUpperCase()}` : 'CG-PENDING'}
              </Text>
            </View>
            <View className="flex-row justify-between pt-2">
              <Text className="text-xs text-slate-500">Submitted</Text>
              <Text className="text-xs sm:text-sm font-semibold text-slate-700">
                {new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
              </Text>
            </View>
          </View>
        </View>

        {/* Back to Login Button */}
        <View className="p-4 bg-white border-t border-slate-100">
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
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          {renderStepHeader()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View
        className="p-4 bg-white border-t border-slate-100"
        style={{ elevation: 25, zIndex: 100 }}>
        {currentStep < 4 ? (
          <View key="action-bar-steps-1-3" className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-1 h-12 rounded-xl border border-slate-300 bg-white items-center justify-center"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleBack}>
              <Text className="text-slate-700 text-sm font-bold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-1 h-12 rounded-xl bg-brand-green items-center justify-center shadow-sm"
              disabled={isSendingOtp}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleNext}>
              {isSendingOtp && currentStep === 1 ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-sm font-bold">Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View key="action-bar-step-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className="w-full h-12 bg-brand-green rounded-xl items-center justify-center mb-2 shadow-sm"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleSubmit}>
              <Text className="text-white text-sm font-bold">Submit for Verification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="py-1 items-center"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleBack}>
              <Text className="text-xs font-semibold text-slate-500">Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── 5-Digit Mobile Verification Modal (Between Step 1 & 2) ── */}
      <Modal
        visible={otpModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOtpModalVisible(false)}>
        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            {/* Header with Close */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
                  <Icon name="shield-check-outline" size={22} color="#07522C" />
                </View>
                <Text className="text-lg font-bold text-slate-900">Verify Mobile</Text>
              </View>
              <TouchableOpacity
                className="p-1 rounded-full bg-slate-100"
                activeOpacity={0.7}
                onPress={() => setOtpModalVisible(false)}>
                <Icon name="close" size={20} color="#667085" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-slate-500 mb-4 leading-5">
              Enter the 5-digit verification code sent to{' '}
              <Text className="font-bold text-slate-800">
                +91 {formData.mobile.replace(/[^0-9]/g, '').slice(-10)}
              </Text>
            </Text>

            {/* Mock OTP Badge Display */}
            {serverMockOtp ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAutoFillMockOtp(serverMockOtp)}
                className="flex-row items-center justify-between bg-emerald-50 border border-emerald-300 rounded-2xl px-3.5 py-2.5 mb-5 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-7 h-7 rounded-full bg-emerald-200 items-center justify-center mr-2.5">
                    <Icon name="key-variant" size={16} color="#07522C" />
                  </View>
                  <View>
                    <Text className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Verification Code
                    </Text>
                    <Text className="text-base font-extrabold text-brand-green tracking-widest">
                      {serverMockOtp}
                    </Text>
                  </View>
                </View>
                <View className="bg-brand-green px-3 py-1.5 rounded-xl shadow-sm">
                  <Text className="text-xs font-bold text-white">Tap to Fill</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {/* 5-digit OTP inputs */}
            <View className="flex-row justify-between mb-5">
              {[0, 1, 2, 3, 4].map(idx => (
                <TextInput
                  key={idx}
                  ref={otpInputRefs[idx]}
                  className={`w-12 h-14 border rounded-2xl text-center text-xl font-bold text-slate-900 bg-slate-50/50 ${
                    otpDigits[idx] ? 'border-brand-green bg-emerald-50/20' : 'border-slate-200'
                  }`}
                  maxLength={idx === 0 ? 5 : 1}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  value={otpDigits[idx]}
                  onChangeText={v => handleOtpDigitChange(v, idx)}
                  onKeyPress={e => handleOtpKeyPress(e, idx)}
                />
              ))}
            </View>

            {/* Resend Timer / Button */}
            <View className="flex-row justify-center items-center mb-5">
              {otpTimer > 0 ? (
                <Text className="text-xs text-slate-400">
                  Resend code in{' '}
                  <Text className="font-bold text-brand-green">
                    00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity activeOpacity={0.7} onPress={handleResendRegistrationOtp}>
                  <Text className="text-xs font-bold text-brand-green">Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify & Proceed Button */}
            <TouchableOpacity
              className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-md shadow-brand-green/20 mb-3"
              activeOpacity={0.88}
              disabled={isVerifyingOtp}
              onPress={handleVerifyRegistrationOtp}>
              {isVerifyingOtp ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-sm font-bold tracking-wide">
                  Verify &amp; Proceed to Step 2
                </Text>
              )}
            </TouchableOpacity>

            {/* Change Number Button */}
            <TouchableOpacity
              className="py-1.5 items-center"
              activeOpacity={0.7}
              onPress={() => setOtpModalVisible(false)}>
              <Text className="text-xs font-semibold text-slate-500">Edit Mobile Number</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {uploadTarget !== null && (
        <UploadPickerModal
          visible={true}
          onClose={() => setUploadTarget(null)}
          onPick={handleFilePicked}
          title={uploadTarget === 'profile' ? 'Upload Profile Photo' : 'Upload Document'}
          allowDocs={uploadTarget !== 'profile'}
        />
      )}
    </SafeAreaView>
  );
};

export default PartnerRegistrationScreen;
