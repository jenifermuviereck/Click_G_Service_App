import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UploadPickerModal, { PickedFile } from '../../components/UploadPickerModal';

const DocumentsVerificationScreen = () => {
  const navigation = useNavigation<any>();

  const [aadhaarFront, setAadhaarFront] = useState('aadhaar-front.pdf');
  const [aadhaarBack, setAadhaarBack] = useState('aadhaar-back.pdf');
  const [bankDoc, setBankDoc] = useState('cancelled-cheque.pdf');
  const [activeUploadTarget, setActiveUploadTarget] = useState<'front' | 'back' | 'bank' | null>(null);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleFilePicked = (file: PickedFile) => {
    if (activeUploadTarget === 'front') {
      setAadhaarFront(file.name);
      showNotification('Aadhaar Front updated');
    } else if (activeUploadTarget === 'back') {
      setAadhaarBack(file.name);
      showNotification('Aadhaar Back updated');
    } else if (activeUploadTarget === 'bank') {
      setBankDoc(file.name);
      showNotification('Bank document updated');
    }
    setActiveUploadTarget(null);
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

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Verified Partner Banner Card */}
        <View className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-9 h-9 rounded-full bg-emerald-200 items-center justify-center mr-3">
              <Icon name="check" size={18} color="#07522C" />
            </View>
            <View className="flex-1">
              <Text className="text-sm sm:text-base font-bold text-emerald-950">Verified partner</Text>
              <Text className="text-[11px] sm:text-xs text-emerald-800">Your identity and bank details have been verified.</Text>
            </View>
          </View>

          <View className="h-px bg-emerald-200/60 mb-2.5" />

          <View className="flex-row justify-between py-1">
            <Text className="text-xs text-emerald-800/80">Partner reference</Text>
            <Text className="text-xs font-bold text-emerald-950">CG-P-2084</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-xs text-emerald-800/80">Approved on</Text>
            <Text className="text-xs font-bold text-emerald-950">09 Oct 2026</Text>
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
            <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-emerald-800">Verified</Text>
            </View>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs text-slate-500">Document number</Text>
            <Text className="text-xs font-semibold text-slate-800">•••• •••• 4821</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
            <View>
              <Text className="text-xs text-slate-500">Front copy</Text>
              <Text className="text-xs font-semibold text-brand-green">{aadhaarFront}</Text>
            </View>
            <TouchableOpacity
              className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200"
              onPress={() => setActiveUploadTarget('front')}>
              <Text className="text-[11px] font-bold text-brand-green">Replace</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center pt-2.5">
            <View>
              <Text className="text-xs text-slate-500">Back copy</Text>
              <Text className="text-xs font-semibold text-brand-green">{aadhaarBack}</Text>
            </View>
            <TouchableOpacity
              className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200"
              onPress={() => setActiveUploadTarget('back')}>
              <Text className="text-[11px] font-bold text-brand-green">Replace</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Verification Section */}
        <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">Bank verification</Text>
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs text-slate-500">Account</Text>
            <Text className="text-xs font-semibold text-slate-800">HDFC Bank •••• 9012</Text>
          </View>
          <View className="flex-row justify-between items-center py-2.5 border-b border-slate-100">
            <View>
              <Text className="text-xs text-slate-500">Cheque / Statement</Text>
              <Text className="text-xs font-semibold text-brand-green">{bankDoc}</Text>
            </View>
            <TouchableOpacity
              className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200"
              onPress={() => setActiveUploadTarget('bank')}>
              <Text className="text-[11px] font-bold text-brand-green">Upload</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between pt-2">
            <Text className="text-xs text-slate-500">Status</Text>
            <Text className="text-xs font-bold text-brand-green">Verified</Text>
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
