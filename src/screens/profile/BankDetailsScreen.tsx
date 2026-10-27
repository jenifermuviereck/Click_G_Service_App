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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

const BankDetailsScreen = () => {
  const navigation = useNavigation<any>();

  const [accountHolder, setAccountHolder] = useState('Kumar');
  const [accountNumber, setAccountNumber] = useState('123456789012');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleSave = () => {
    showNotification('Bank details saved successfully');
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Payout Account Header Card */}
        <View className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-5">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xs sm:text-sm font-bold text-slate-800">Payout account</Text>
            <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">Verified</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center pt-2 border-t border-slate-200/60">
            <Text className="text-xs text-slate-500">Current account</Text>
            <Text className="text-xs sm:text-sm font-bold text-slate-900">HDFC Bank •••• 9012</Text>
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
            placeholder="123456789012"
            placeholderTextColor="#98A2B3"
            keyboardType="number-pad"
            inputMode="numeric"
            maxLength={18}
          />
        </View>

        <Text className="text-xs font-semibold text-slate-700 mb-1.5">IFSC Code *</Text>
        <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-1 justify-center">
          <TextInput
            className="text-xs sm:text-sm text-slate-900 p-0"
            value={ifscCode}
            onChangeText={v => setIfscCode(v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11))}
            placeholder="HDFC0001234"
            placeholderTextColor="#98A2B3"
            autoCapitalize="characters"
            maxLength={11}
          />
        </View>
        <Text className="text-[11px] text-slate-500 mb-5">HDFC Bank • BTM Layout, Bengaluru</Text>

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

      {/* Save Button */}
      <View className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity
          className="bg-brand-green w-full h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
          activeOpacity={0.88}
          onPress={handleSave}>
          <Text className="text-white text-[15px] font-bold">Save Bank Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BankDetailsScreen;
