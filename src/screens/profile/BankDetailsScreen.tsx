import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import profileApi from '../../common/api/profileApi';

const BankDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [currentAccountDisplay, setCurrentAccountDisplay] = useState('Not configured yet');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await profileApi.getProfile();
        if (res.success && res.data) {
          const p = res.data as any;
          if (p.bank) {
            setAccountHolder(p.bank.accountHolderName || '');
            setAccountNumber(p.bank.accountNumber || '');
            setIfscCode(p.bank.ifscCode || '');
            if (p.bank.accountNumber) {
              const last4 = p.bank.accountNumber.slice(-4);
              setCurrentAccountDisplay(`${p.bank.bankName || 'Bank'} •••• ${last4}`);
            }
          }
        }
      } catch (err) {
        console.warn('[BankDetailsScreen] fetchBankDetails error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  const handleSave = async () => {
    if (!accountHolder.trim() || !accountNumber.trim() || !ifscCode.trim()) {
      showNotification('Please fill in all bank details');
      return;
    }
    try {
      setIsSaving(true);
      const res = await profileApi.updateBankDetails({
        accountHolderName: accountHolder.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
      });
      if (res.success) {
        showNotification('Bank details saved successfully');
        const last4 = accountNumber.trim().slice(-4);
        setCurrentAccountDisplay(`Bank •••• ${last4}`);
        navigation.goBack();
      } else {
        showNotification(res.message || 'Failed to save bank details. Try again.');
      }
    } catch (err) {
      console.warn('[BankDetailsScreen] save error:', err);
      showNotification('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Bank Details</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#07522C" />
          <Text className="text-xs text-slate-500 mt-3">Loading bank details...</Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
          {/* Payout Account Header Card */}
          <View className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-5">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs sm:text-sm font-bold text-slate-800">Payout account</Text>
              <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">
                  {currentAccountDisplay !== 'Not configured yet' ? 'Active' : 'Pending'}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center pt-2 border-t border-slate-200/60">
              <Text className="text-xs text-slate-500">Current account</Text>
              <Text className="text-xs sm:text-sm font-bold text-slate-900">{currentAccountDisplay}</Text>
            </View>
          </View>

          {/* Form Inputs */}
          <Text className="text-xs font-semibold text-slate-700 mb-1.5">Account Holder Name *</Text>
          <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
            <TextInput
              className="text-xs sm:text-sm text-slate-900 p-0"
              value={accountHolder}
              onChangeText={v => setAccountHolder(v.replace(/[^a-zA-Z\s]/g, ''))}
              placeholder="Account Holder Name"
              placeholderTextColor="#98A2B3"
            />
          </View>

          <Text className="text-xs font-semibold text-slate-700 mb-1.5">Account Number *</Text>
          <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
            <TextInput
              className="text-xs sm:text-sm text-slate-900 p-0"
              value={accountNumber}
              onChangeText={v => setAccountNumber(v.replace(/[^0-9]/g, '').slice(0, 18))}
              placeholder="Enter Account Number"
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
              value={ifscCode}
              onChangeText={v => setIfscCode(v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11))}
              placeholder="e.g. SBIN0001234"
              placeholderTextColor="#98A2B3"
              autoCapitalize="characters"
              maxLength={11}
            />
          </View>

          {/* Notice Info Card */}
          <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-3">
            <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
            <Text className="text-xs text-brand-green flex-1">
              Changes to your payout account will be verified before your next payment.
            </Text>
          </View>

          <Text className="text-center text-[11px] text-slate-400 px-3">
            Check your account number and IFSC carefully to avoid payment delays.
          </Text>
        </ScrollView>
      )}

      {/* Save Button */}
      {!isLoading && (
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="p-4 bg-white border-t border-slate-100">
          <TouchableOpacity
            className="bg-brand-green w-full h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
            activeOpacity={0.88}
            disabled={isSaving}
            onPress={handleSave}>
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-[15px] font-bold">Save Bank Details</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BankDetailsScreen;
