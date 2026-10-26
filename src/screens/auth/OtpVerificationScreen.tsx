import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Top Logo Section */}
        <View style={styles.topLogoSection}>
          <ClickGLogo size="large" showTagline={true} />
        </View>

        {/* Center Verification Section */}
        <View style={styles.centerSection}>
          {/* Masked Mobile Input Display */}
          <View style={styles.inputContainer}>
            <Icon name="cellphone" size={22} color="#1D2939" style={styles.inputIcon} />
            <Text style={styles.maskedNumberText}>XXXXX XXXXX</Text>
          </View>

          {/* 4 Digit OTP Boxes */}
          <View style={styles.otpBoxesRow}>
            {otp.map((digit, idx) => (
              <View key={idx} style={styles.otpBox}>
                <TextInput
                  ref={inputRefs[idx]}
                  style={styles.otpInput}
                  keyboardType="number-pad"
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
          <View style={styles.resendWrapper}>
            <TouchableOpacity
              style={styles.resendBadge}
              activeOpacity={0.8}
              onPress={handleResend}
              disabled={secondsLeft > 0}>
              <Text style={styles.resendPrefix}>Resend code in </Text>
              <Text style={styles.resendTimer}>{formattedTimer}</Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button (Centered Pill) */}
          <TouchableOpacity
            style={styles.verifyBtn}
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleVerify}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.verifyBtnText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom spacer for centering balance */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 24,
  },
  topLogoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  centerSection: {
    width: '100%',
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  maskedNumberText: {
    fontSize: 15,
    color: '#98A2B3',
    letterSpacing: 2,
    fontWeight: '500',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  otpInput: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },
  resendWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF3FB',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  resendPrefix: {
    fontSize: 12.5,
    color: '#344054',
    fontWeight: '500',
  },
  resendTimer: {
    fontSize: 12.5,
    color: '#B45309',
    fontWeight: '700',
  },
  verifyBtn: {
    backgroundColor: '#07522C',
    width: 190,
    height: 48,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#07522C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default OtpVerificationScreen;
