import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UploadPickerModal, { PickedFile } from '../../components/UploadPickerModal';
import profileApi from '../../common/api/profileApi';
import { useAuth } from '../../context/AuthContext';
import showNotification from '../../common/utils/notification';

const DocumentsVerificationScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [hasAadhaarDoc, setHasAadhaarDoc] = useState(false);
  const [hasPanDoc, setHasPanDoc] = useState(false);
  const [aadhaarFileName, setAadhaarFileName] = useState<string | null>(null);
  const [panFileName, setPanFileName] = useState<string | null>(null);
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [panInput, setPanInput] = useState('');
  const [aadhaarMasked, setAadhaarMasked] = useState('Not provided');
  const [panMasked, setPanMasked] = useState('Not provided');
  const [bankAccountDisplay, setBankAccountDisplay] = useState('Not provided');
  const [isVerified, setIsVerified] = useState(user?.verified ?? false);

  const [activeUploadTarget, setActiveUploadTarget] = useState<'AADHAAR' | 'PAN' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingNumbers, setIsSavingNumbers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocInfo = async () => {
    try {
      setIsLoading(true);
      const res = await profileApi.getProfile();
      if (res.success && res.data) {
        const p = res.data as any;
        if (p.kyc) {
          if (p.kyc.aadhaarNumberMasked) setAadhaarMasked(p.kyc.aadhaarNumberMasked);
          if (p.kyc.panNumberMasked) setPanMasked(p.kyc.panNumberMasked);
          setHasAadhaarDoc(Boolean(p.kyc.hasAadhaarDoc));
          setHasPanDoc(Boolean(p.kyc.hasPanDoc));
          if (p.kyc.isVerified || p.status === 'APPROVED' || p.status === 'ACTIVE') {
            setIsVerified(true);
          }
        }
        if (p.bank?.accountNumber) {
          const last4 = p.bank.accountNumber.slice(-4);
          setBankAccountDisplay(`${p.bank.bankName || 'Bank'} •••• ${last4}`);
        }
      }
    } catch (err) {
      console.warn('[DocumentsVerificationScreen] fetchDocInfo error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, []);

  const handleFilePicked = async (file: PickedFile) => {
    const docType = activeUploadTarget;
    if (!docType) return;
    setActiveUploadTarget(null);

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type || 'image/jpeg',
      } as any);
      formData.append('documentType', docType);

      const res = await profileApi.uploadKycDocument(formData);

      if (res.success) {
        showNotification(res.message || `${docType} uploaded successfully`);
        if (docType === 'AADHAAR') {
          setHasAadhaarDoc(true);
          setAadhaarFileName(file.name);
        } else {
          setHasPanDoc(true);
          setPanFileName(file.name);
        }
        await fetchDocInfo();
      } else {
        showNotification(res.message || 'Upload failed');
      }
    } catch (err: any) {
      console.warn('[DocumentsVerificationScreen] upload error:', err);
      showNotification(err?.message || 'Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveKycDetails = async () => {
    const cleanAadhaar = aadhaarInput.replace(/[^0-9]/g, '');
    const cleanPan = panInput.trim().toUpperCase();

    if (cleanAadhaar && (cleanAadhaar.length !== 12 || cleanAadhaar.startsWith('0') || cleanAadhaar.startsWith('1'))) {
      showNotification('Aadhaar must be a 12-digit number starting with 2-9');
      return;
    }

    if (cleanPan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      showNotification('PAN must be 10 characters (e.g. ABCDE1234F)');
      return;
    }

    if (!cleanAadhaar && !cleanPan) {
      showNotification('Please enter Aadhaar or PAN number');
      return;
    }

    try {
      setIsSavingNumbers(true);
      const res = await profileApi.updateKycDetails({
        aadhaarNumber: cleanAadhaar || undefined,
        panNumber: cleanPan || undefined,
      });

      if (res.success) {
        showNotification('Identity details saved successfully');
        setAadhaarInput('');
        setPanInput('');
        await fetchDocInfo();
      } else {
        showNotification(res.message || 'Failed to save identity details');
      }
    } catch (err: any) {
      console.warn('[DocumentsVerificationScreen] updateKycDetails error:', err);
      showNotification(err?.message || 'Error saving identity numbers');
    } finally {
      setIsSavingNumbers(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Top Header */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Documents &amp; Verification</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#07522C" />
          <Text className="text-xs text-slate-500 mt-2">Loading document status...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1">
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag">
          {/* Verified Partner Banner Card */}
          <View className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-5">
            <View className="flex-row items-center mb-3">
              <View className="w-9 h-9 rounded-full bg-emerald-200 items-center justify-center mr-3">
                <Icon name="check" size={18} color="#07522C" />
              </View>
              <View className="flex-1">
                <Text className="text-sm sm:text-base font-bold text-emerald-950">
                  {isVerified ? 'Verified Partner' : 'Verification Pending'}
                </Text>
                <Text className="text-[11px] sm:text-xs text-emerald-800">
                  {isVerified
                    ? 'Your documents have been approved by Click G.'
                    : 'Submit your KYC documents below for account verification.'}
                </Text>
              </View>
            </View>
            <View className="border-t border-emerald-200/60 pt-2.5 flex-row justify-between">
              <Text className="text-xs text-emerald-800">Partner reference</Text>
              <Text className="text-xs font-bold text-emerald-900">CG-PRO</Text>
            </View>
            <View className="pt-1.5 flex-row justify-between">
              <Text className="text-xs text-emerald-800">Status</Text>
              <Text className="text-xs font-bold text-emerald-900">
                {isVerified ? 'Approved' : 'Pending Verification'}
              </Text>
            </View>
          </View>

          {/* Section: Upload Real Documents */}
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">
            1. Identity Documents Upload
          </Text>
          <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
            {/* Aadhaar Card Document */}
            <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
              <View className="flex-1 mr-3">
                <Text className="text-xs font-bold text-slate-800">Aadhaar Card Copy</Text>
                <Text className="text-[11px] text-slate-500">
                  {hasAadhaarDoc
                    ? aadhaarFileName || 'Uploaded on Server'
                    : 'Upload front/back photo of Aadhaar'}
                </Text>
              </View>
              <TouchableOpacity
                className={`px-3 py-1.5 rounded-lg border ${
                  hasAadhaarDoc
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-emerald-600 border-emerald-600'
                }`}
                disabled={isUploading}
                onPress={() => setActiveUploadTarget('AADHAAR')}>
                <Text
                  className={`text-xs font-bold ${
                    hasAadhaarDoc ? 'text-brand-green' : 'text-white'
                  }`}>
                  {hasAadhaarDoc ? 'Replace' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* PAN Card Document */}
            <View className="flex-row justify-between items-center py-2.5">
              <View className="flex-1 mr-3">
                <Text className="text-xs font-bold text-slate-800">PAN Card Copy</Text>
                <Text className="text-[11px] text-slate-500">
                  {hasPanDoc ? panFileName || 'Uploaded on Server' : 'Upload photo of PAN card'}
                </Text>
              </View>
              <TouchableOpacity
                className={`px-3 py-1.5 rounded-lg border ${
                  hasPanDoc
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-emerald-600 border-emerald-600'
                }`}
                disabled={isUploading}
                onPress={() => setActiveUploadTarget('PAN')}>
                <Text
                  className={`text-xs font-bold ${
                    hasPanDoc ? 'text-brand-green' : 'text-white'
                  }`}>
                  {hasPanDoc ? 'Replace' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Identity Numbers (Aadhaar & PAN) */}
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">
            2. Government Identity Numbers
          </Text>
          <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
            {/* Aadhaar Number */}
            <View className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs font-semibold text-slate-700">Aadhaar Number (12 digits)</Text>
                <Text className="text-[11px] text-slate-500">{aadhaarMasked}</Text>
              </View>
              <TextInput
                className="border border-slate-200 rounded-xl px-3.5 h-11 text-xs sm:text-sm text-slate-900 bg-slate-50"
                placeholder="Enter 12-digit Aadhaar (e.g. 234567890123)"
                placeholderTextColor="#98A2B3"
                value={aadhaarInput}
                onChangeText={v => setAadhaarInput(v.replace(/[^0-9]/g, '').slice(0, 12))}
                keyboardType="numeric"
                maxLength={12}
              />
            </View>

            {/* PAN Number */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs font-semibold text-slate-700">PAN Number (10 chars)</Text>
                <Text className="text-[11px] text-slate-500">{panMasked}</Text>
              </View>
              <TextInput
                className="border border-slate-200 rounded-xl px-3.5 h-11 text-xs sm:text-sm text-slate-900 bg-slate-50"
                placeholder="Enter 10-char PAN (e.g. ABCDE1234F)"
                placeholderTextColor="#98A2B3"
                value={panInput}
                onChangeText={v => setPanInput(v.toUpperCase().slice(0, 10))}
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              className="bg-brand-green h-11 rounded-xl items-center justify-center"
              disabled={isSavingNumbers}
              onPress={handleSaveKycDetails}>
              {isSavingNumbers ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-xs font-bold text-white">Save Identity Numbers</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bank Verification Section */}
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">3. Bank Verification</Text>
          <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
            <View className="flex-row justify-between py-2 border-b border-slate-100">
              <Text className="text-xs text-slate-500">Configured Account</Text>
              <Text className="text-xs font-semibold text-slate-800">{bankAccountDisplay}</Text>
            </View>
            <View className="flex-row justify-between pt-2">
              <Text className="text-xs text-slate-500">Payout Status</Text>
              <Text className={`text-xs font-bold ${isVerified ? 'text-brand-green' : 'text-slate-500'}`}>
                {isVerified ? 'Verified' : 'Pending Verification'}
              </Text>
            </View>
          </View>

          {/* Support Help Banner */}
          <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
            <Text className="text-xs text-brand-green flex-1">
              Uploading real Aadhaar &amp; PAN documents will instantly satisfy Step 3 and unlock Skills &amp; Services.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      )}

      <UploadPickerModal
        visible={activeUploadTarget !== null}
        onClose={() => setActiveUploadTarget(null)}
        onPick={handleFilePicked}
        title={activeUploadTarget === 'AADHAAR' ? 'Upload Aadhaar Card' : 'Upload PAN Card'}
        allowDocs={true}
      />
    </SafeAreaView>
  );
};

export default DocumentsVerificationScreen;
