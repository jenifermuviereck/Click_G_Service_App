import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import ClickGLogo from '../../components/ClickGLogo';
import authService from '../../services/authService';

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleSendOtp = async () => {
    if (!mobile.trim()) {
      showNotification('Please enter mobile number');
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      showNotification('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.sendOtp(mobile.trim());
      if (response.success) {
        showNotification(response.message || 'OTP sent successfully');
        navigation.navigate('OtpVerification', { mobile: mobile.trim() });
      } else {
        showNotification('Failed to send OTP');
      }
    } catch {
      showNotification('Network error while requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (text: string) => {
    // Strict numeric validation: only allows 0-9 digits up to 10 characters
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setMobile(digitsOnly.slice(0, 10));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="flex-1 px-5 sm:px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="w-full max-w-sm self-center py-6">
          {/* Logo Section */}
          <View className="items-center justify-center mb-6 sm:mb-8">
            <ClickGLogo size="large" showTagline={true} />
          </View>

          {/* Mobile Number Input */}
          <View className="flex-row items-center border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-5 focus:border-brand-green">
            <Icon name="cellphone" size={22} color="#1D2939" style={{ marginRight: 12 }} />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 h-full p-0"
              placeholder="Mobile Number"
              placeholderTextColor="#98A2B3"
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChangeText={handleMobileChange}
            />
          </View>

          {/* Send OTP Button (Centered Pill) */}
          <TouchableOpacity
            className="bg-brand-green w-48 sm:w-52 h-12 rounded-xl self-center items-center justify-center shadow-md shadow-brand-green/20 mb-6 sm:mb-8"
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleSendOtp}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white text-[15px] font-bold tracking-wide">Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Registration Card */}
          <TouchableOpacity
            className="flex-row items-center bg-[#EDF6EF] border border-[#D1EAD9] rounded-2xl px-4 py-3.5 w-full self-center"
            activeOpacity={0.88}
            onPress={() => navigation.navigate('PartnerRegistration', { mobile })}>
            <View className="w-10 h-10 rounded-full bg-[#D1EAD9] items-center justify-center mr-3.5">
              <Icon name="account-plus-outline" size={22} color="#07522C" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-0.5">Don't Have a Seller Account</Text>
              <Text className="text-[14px] sm:text-[15px] font-bold text-brand-green">Service Men Registration</Text>
            </View>
            <View className="w-9 h-9 rounded-full bg-brand-green items-center justify-center ml-2">
              <Icon name="arrow-right" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
