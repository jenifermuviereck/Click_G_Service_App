import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UploadPickerModal, { PickedFile } from '../../components/UploadPickerModal';
import profileApi from '../../common/api/profileApi';
import { useAuth } from '../../context/AuthContext';

const DocumentsVerificationScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [aadhaarFront, setAadhaarFront] = useState<string | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<string | null>(null);
  const [bankDoc, setBankDoc] = useState<string | null>(null);
  const [activeUploadTarget, setActiveUploadTarget] = useState<'front' | 'back' | 'bank' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aadhaarMasked, setAadhaarMasked] = useState('Not provided');
  const [bankAccountDisplay, setBankAccountDisplay] = useState('Not provided');
  const [isVerified, setIsVerified] = useState(user?.verified ?? false);

  useEffect(() => {
    const fetchDocInfo = async () => {
      try {
        const res = await profileApi.getProfile();
        if (res.success && res.data) {
          const p = res.data as any;
          if (p.kyc?.aadhaarNumberMasked) {
            setAadhaarMasked(p.kyc.aadhaarNumberMasked);
          }
          if (p.bank?.accountNumber) {
            const last4 = p.bank.accountNumber.slice(-4);
            setBankAccountDisplay(`${p.bank.bankName || 'Bank'} •••• ${last4}`);
          }
          if (p.status === 'ACTIVE' || p.status === 'APPROVED' || p.kyc?.status === 'VERIFIED') {
            setIsVerified(true);
          }
        }
      } catch (err) {
        console.warn('[DocumentsVerificationScreen] fetchDocInfo error:', err);
      }
    };
    fetchDocInfo();
  }, []);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleFilePicked = async (file: PickedFile) => {
    const docType =
      activeUploadTarget === 'front'
        ? 'AADHAAR_FRONT'
        : activeUploadTarget === 'back'
        ? 'AADHAAR_BACK'
        : 'BANK_DOCUMENT';

    setActiveUploadTarget(null);

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('document', {
        uri: file.uri,
        name: file.name,
        type: file.type || 'application/pdf',
      } as any);
      formData.append('documentType', docType);

      const res = await profileApi.uploadKycDocument(formData);

      if (res.success) {
        if (docType === 'AADHAAR_FRONT') {
          setAadhaarFront(file.name);
          showNotification('Aadhaar Front uploaded successfully');
        } else if (docType === 'AADHAAR_BACK') {
          setAadhaarBack(file.name);
          showNotification('Aadhaar Back uploaded successfully');
        } else {
          setBankDoc(file.name);
          showNotification('Bank document uploaded successfully');
        }
      } else {
        showNotification(res.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      console.warn('[DocumentsVerificationScreen] upload error:', err);
      showNotification('Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Documents &amp; Verification</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-12" showsVerticalScrollIndicator={false}>
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
                  ? 'Your identity and bank details have been verified.'
                  : 'Submit your KYC documents below for account verification.'}
              </Text>
            </View>
          </View>

          <View className="h-px bg-emerald-200/60 mb-2.5" />

          <View className="flex-row justify-between py-1">
            <Text className="text-xs text-emerald-800/80">Partner reference</Text>
            <Text className="text-xs font-bold text-emerald-950">
              {user?.registrationRef || user?.id || '—'}
            </Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-xs text-emerald-800/80">Status</Text>
            <Text className="text-xs font-bold text-emerald-950">
              {isVerified ? 'Approved' : 'Pending Verification'}
            </Text>
          </View>
        </View>

        {/* Identity Documents Section */}
        <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">Identity documents</Text>
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Icon name="card-account-details-outline" size={20} color="#07522C" style={{ marginRight: 8 }} />
              <Text className="text-xs sm:text-sm font-bold text-slate-800">Aadhaar Card</Text>
            </View>
            <View className={`px-2 py-0.5 rounded-full ${isVerified ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              <Text className={`text-[10px] font-bold ${isVerified ? 'text-emerald-800' : 'text-slate-600'}`}>
                {isVerified ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs text-slate-500">Document number</Text>
            <Text className="text-xs font-semibold text-slate-800">{aadhaarMasked}</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
            <View>
              <Text className="text-xs text-slate-500">Front copy</Text>
              <Text className="text-xs font-semibold text-brand-green">
                {aadhaarFront ?? 'Not uploaded'}
              </Text>
            </View>
            <TouchableOpacity
              className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200"
              disabled={isUploading}
              onPress={() => setActiveUploadTarget('front')}>
              {isUploading && activeUploadTarget === 'front' ? (
                <ActivityIndicator size="small" color="#07522C" />
              ) : (
                <Text className="text-[11px] font-bold text-brand-green">Replace</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center pt-2.5">
            <View>
              <Text className="text-xs text-slate-500">Back copy</Text>
              <Text className="text-xs font-semibold text-brand-green">
                {aadhaarBack ?? 'Not uploaded'}
              </Text>
            </View>
            <TouchableOpacity
              className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200"
              disabled={isUploading}
              onPress={() => setActiveUploadTarget('back')}>
              {isUploading && activeUploadTarget === 'back' ? (
                <ActivityIndicator size="small" color="#07522C" />
              ) : (
                <Text className="text-[11px] font-bold text-brand-green">Replace</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Verification Section */}
        <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">Bank verification</Text>
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs text-slate-500">Account</Text>
            <Text className="text-xs font-semibold text-slate-800">{bankAccountDisplay}</Text>
          </View>
          <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
            <View>
              <Text className="text-xs text-slate-500">Cheque / Statement</Text>
              <Text className="text-xs font-semibold text-brand-green">
                {bankDoc ?? 'Not uploaded'}
              </Text>
            </View>
            <TouchableOpacity
              className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200"
              disabled={isUploading}
              onPress={() => setActiveUploadTarget('bank')}>
              {isUploading && activeUploadTarget === 'bank' ? (
                <ActivityIndicator size="small" color="#07522C" />
              ) : (
                <Text className="text-[11px] font-bold text-brand-green">Upload</Text>
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between pt-2">
            <Text className="text-xs text-slate-500">Status</Text>
            <Text className={`text-xs font-bold ${isVerified ? 'text-brand-green' : 'text-slate-500'}`}>
              {isVerified ? 'Verified' : 'Pending Verification'}
            </Text>
          </View>
        </View>

        {/* Support Help Banner */}
        <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text className="text-xs text-brand-green flex-1">
            Need to update your identity documents? You can upload and replace copies above for verification.
          </Text>
        </View>
      </ScrollView>

      <UploadPickerModal
        visible={activeUploadTarget !== null}
        onClose={() => setActiveUploadTarget(null)}
        onPick={handleFilePicked}
        title="Upload Verification Document"
        allowDocs={true}
      />
    </SafeAreaView>
  );
};

export default DocumentsVerificationScreen;
