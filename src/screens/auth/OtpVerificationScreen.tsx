import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import ClickGLogo from '../../components/ClickGLogo';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const OtpVerificationScreen = () => {
  const [otp, setOtp] = useState(['5', '9', '7', '5']);
  const [secondsLeft, setSecondsLeft] = useState(35);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mobile = route?.params?.mobile || '';
  const { login } = useAuth();

  const displayMobile = mobile
    ? mobile.length === 10
      ? `${mobile.slice(0, 5)} ${mobile.slice(5)}`
      : mobile
    : '98765 43210';

  const inputRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  /**
   * Handles user input inside each individual OTP digit box.
   * Auto-advances focus to the next box upon typing a digit.
   *
   * @param {string} value - The character typed.
   * @param {number} index - Index of the OTP input cell (0 to 3).
   */
  const handleOtpChange = (value: string, index: number) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 4).split('');
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      inputRefs[Math.min(digits.length - 1, 3)].current?.focus();
      return;
    }

    newOtp[index] = cleanVal;
    setOtp(newOtp);

    if (cleanVal !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  /**
   * Handles keyboard backspace events to shift focus backward to the previous input cell.
   *
   * @param {any} e - Native key press event.
   * @param {number} index - Current input box index.
   */
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  /**
   * Submits the 4-digit code to authService.verifyOtp.
   * On success, persists session token, updates AuthContext, and navigates to the Home dashboard.
   */
  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 4) {
      showNotification('Please enter 4-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOtp(mobile, fullOtp);
      if (response.success && response.user && response.token) {
        await login(response.token, response.user);
        showNotification(`Welcome back, ${response.user.name || 'Partner'}!`);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        showNotification(response.message || 'OTP verification failed');
      }
    } catch {
      showNotification('Network error during verification');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets countdown timer and requests a fresh OTP via authService.sendOtp.
   */
  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(35);
    try {
      await authService.sendOtp(mobile || '9876543210');
      showNotification('New OTP sent');
    } catch {
      showNotification('Failed to resend OTP');
    }
  };

  const formattedTimer = `00:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header with Back Button */}
      <View className="px-4 py-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 self-start"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="flex-1 px-5 sm:px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="w-full max-w-sm self-center py-6">
          {/* Logo Section */}
          <View className="items-center justify-center mb-8 sm:mb-10">
            <ClickGLogo size="large" showTagline={true} />
          </View>

          {/* Center Verification Section */}
          <View className="w-full">
            {/* Mobile Input Display */}
            <View className="flex-row items-center border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-6">
              <Icon name="cellphone" size={22} color="#1D2939" style={{ marginRight: 12 }} />
              <Text className="text-[15px] text-slate-800 tracking-wider font-medium">{displayMobile}</Text>
            </View>

            {/* 4 Digit OTP Boxes */}
            <View className="flex-row justify-center mb-6 gap-3 sm:gap-4">
              {otp.map((digit, idx) => (
                <View
                  key={idx}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-slate-200 bg-white items-center justify-center shadow-sm">
                  <TextInput
                    ref={inputRefs[idx]}
                    className="text-xl sm:text-2xl font-bold text-slate-900 text-center w-full h-full p-0"
                    keyboardType="number-pad"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={v => handleOtpChange(v, idx)}
                    onKeyPress={e => handleKeyPress(e, idx)}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>

            {/* Resend Code Pill Badge */}
            <View className="items-center mb-6">
              <TouchableOpacity
                className="flex-row items-center bg-[#EDF3FB] px-4 py-2 rounded-lg"
                activeOpacity={0.8}
                onPress={handleResend}
                disabled={secondsLeft > 0}>
                <Text className="text-xs sm:text-[13px] text-slate-700 font-medium">Resend code in </Text>
                <Text className="text-xs sm:text-[13px] text-amber-700 font-bold">{formattedTimer}</Text>
              </TouchableOpacity>
            </View>

            {/* Verify Button (Centered Pill) */}
            <TouchableOpacity
              className="bg-brand-green w-48 sm:w-52 h-12 rounded-xl self-center items-center justify-center shadow-md shadow-brand-green/20"
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleVerify}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-[15px] font-bold tracking-wide">Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacer for centering balance */}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;
