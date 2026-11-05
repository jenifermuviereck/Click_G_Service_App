import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../../components/Icon';
import profileApi from '../../common/api/profileApi';
import { StorageKeys } from '../../common/constants/storage';
import showNotification from '../../common/utils/notification';

const BankDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [currentAccountDisplay, setCurrentAccountDisplay] = useState('Not configured yet');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBankDetails = async () => {
      try {
        // 1. Read locally cached bank details first for instant UI population
        const cachedRaw = await AsyncStorage.getItem(StorageKeys.BANK_DETAILS);
        if (cachedRaw && isMounted) {
          try {
            const cached = JSON.parse(cachedRaw);
            if (cached.accountHolderName) setAccountHolder(cached.accountHolderName);
            if (cached.ifscCode) setIfscCode(cached.ifscCode);
            if (cached.accountNumber) setAccountNumber(cached.accountNumber);
            if (cached.displayAccount) {
              setCurrentAccountDisplay(cached.displayAccount);
            } else if (cached.bankAccountMasked) {
              setCurrentAccountDisplay(`Bank ${cached.bankAccountMasked}`);
            }
          } catch (e) {
            // ignore cache parse errors
          }
        }

        // 2. Fetch full profile from API (ready for when backend includes bank in GET /profile)
        const profileRes = await profileApi.getProfile();
        let fallbackName = '';
        if (profileRes.success && profileRes.data && isMounted) {
          const p = profileRes.data as any;
          if (p.fullName) fallbackName = p.fullName;
          if (p.bank) {
            if (p.bank.accountHolderName) setAccountHolder(p.bank.accountHolderName);
            if (p.bank.accountNumber) setAccountNumber(p.bank.accountNumber);
            if (p.bank.ifscCode) setIfscCode(p.bank.ifscCode);
            const masked =
              p.bank.bankAccountMasked ||
              (p.bank.accountNumber ? `•••• ${p.bank.accountNumber.slice(-4)}` : null);
            if (masked) {
              setCurrentAccountDisplay(`${p.bank.bankName || 'Bank'} ${masked}`);
            }
          }
        }

        // 3. Fallback: query onboarding progress checklist (Step 4 contains bankAccountMasked)
        try {
          const progressRes = await profileApi.getOnboardingProgress();
          if (progressRes.success && isMounted) {
            const steps: any[] = (progressRes.data as any)?.steps || [];
            const bankStep = steps.find(
              (s: any) => s.step === 4 || (s.name && String(s.name).includes('BANK')),
            );
            if (bankStep) {
              if (bankStep.data?.bankAccountMasked) {
                setCurrentAccountDisplay(`Bank ${bankStep.data.bankAccountMasked}`);
              } else if (bankStep.isCompleted && currentAccountDisplay === 'Not configured yet') {
                setCurrentAccountDisplay('Bank Account Configured');
              }
              if (bankStep.data?.ifscCode) {
                setIfscCode(prev => prev || bankStep.data.ifscCode);
              }
              if (bankStep.data?.accountHolderName) {
                setAccountHolder(prev => prev || bankStep.data.accountHolderName);
              }
            }
          }
        } catch (progressErr) {
          console.warn('[BankDetailsScreen] onboarding progress check skipped:', progressErr);
        }

        // 4. If account holder name is still empty, prefill with user's full name from profile
        if (fallbackName && isMounted) {
          setAccountHolder(prev => prev || fallbackName);
        }
      } catch (err) {
        console.warn('[BankDetailsScreen] fetchBankDetails error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBankDetails();

    return () => {
      isMounted = false;
    };
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
        const bankData = res.data as any;
        const last4 = accountNumber.trim().slice(-4);
        const masked = bankData?.bankAccountMasked || `•••• ${last4}`;
        const display = `Bank ${masked}`;

        setCurrentAccountDisplay(display);

        // Cache locally for immediate persistence across app restarts
        await AsyncStorage.setItem(
          StorageKeys.BANK_DETAILS,
          JSON.stringify({
            accountHolderName: accountHolder.trim(),
            accountNumber: accountNumber.trim(),
            ifscCode: ifscCode.trim().toUpperCase(),
            bankAccountMasked: masked,
            displayAccount: display,
          }),
        );

        showNotification(res.message || 'Bank details saved successfully');
        navigation.goBack();
      } else {
        showNotification(res.message || 'Failed to save bank details');
      }
    } catch (err: any) {
      console.warn('[BankDetailsScreen] save error:', err);
      showNotification(err?.message || 'Error saving bank details');
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1">
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag">
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
      </KeyboardAvoidingView>
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
