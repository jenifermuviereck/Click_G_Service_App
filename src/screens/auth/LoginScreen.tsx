import React, { useState } from 'react';
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

        {/* Center Input and Action Section */}
        <View style={styles.centerSection}>
          {/* Mobile Number Input */}
          <View style={styles.inputContainer}>
            <Icon name="cellphone" size={24} color="#344054" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Mobile Number"
              placeholderTextColor="#98A2B3"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            style={styles.sendOtpBtn}
            activeOpacity={0.85}
            disabled={loading}
            onPress={handleSendOtp}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendOtpBtnText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Registration Card */}
        <TouchableOpacity
          style={styles.registrationCard}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('PartnerRegistration', { mobile })}>
          <View style={styles.avatarIconBox}>
            <Icon name="account-plus-outline" size={22} color="#07522C" />
          </View>
          <View style={styles.cardTextCol}>
            <Text style={styles.cardSubtitle}>Don't Have an Seller Account</Text>
            <Text style={styles.cardTitle}>Service Men Registration</Text>
          </View>
          <View style={styles.arrowCircle}>
            <Icon name="arrow-right" size={18} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 36,
  },
  topLogoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  centerSection: {
    width: '100%',
    paddingVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#101828',
    height: '100%',
    padding: 0,
  },
  sendOtpBtn: {
    backgroundColor: '#07522C',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#07522C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sendOtpBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  registrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F4EB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CEE7D6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 'auto',
  },
  avatarIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C8E6D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTextCol: {
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#07522C',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#07522C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});

export default LoginScreen;
