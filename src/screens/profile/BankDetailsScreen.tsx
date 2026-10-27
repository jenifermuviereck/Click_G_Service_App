import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Payout Account Header Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.payoutTitle}>Payout account</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>

          <View style={styles.currentAccountRow}>
            <Text style={styles.currentAccountLabel}>Current account</Text>
            <Text style={styles.currentAccountValue}>HDFC Bank •••• 9012</Text>
          </View>
        </View>

        {/* Form Inputs */}
        <Text style={styles.fieldLabel}>Account Holder Name *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={accountHolder}
            onChangeText={v => setAccountHolder(v.replace(/[^a-zA-Z\s]/g, ''))}
            placeholder="Account Holder Name"
            placeholderTextColor="#98A2B3"
          />
        </View>

        <Text style={styles.fieldLabel}>Account Number *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={accountNumber}
            onChangeText={v => setAccountNumber(v.replace(/[^0-9]/g, '').slice(0, 18))}
            placeholder="123456789012"
            placeholderTextColor="#98A2B3"
            keyboardType="number-pad"
            inputMode="numeric"
            maxLength={18}
          />
        </View>

        <Text style={styles.fieldLabel}>IFSC Code *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={ifscCode}
            onChangeText={v => setIfscCode(v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11))}
            placeholder="HDFC0001234"
            placeholderTextColor="#98A2B3"
            autoCapitalize="characters"
            maxLength={11}
          />
        </View>
        <Text style={styles.bankBranchText}>HDFC Bank • BTM Layout, Bengaluru</Text>

        {/* Notice Info Card */}
        <View style={styles.infoBanner}>
          <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text style={styles.infoBannerText}>
            Changes to your payout account will be verified before your next payment.
          </Text>
        </View>

        <Text style={styles.helperNotice}>
          Check your account number and IFSC carefully to avoid payment delays.
        </Text>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.88} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Bank Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#07522C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 16,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  payoutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D2939',
  },
  verifiedBadge: {
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  currentAccountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
  },
  currentAccountLabel: {
    fontSize: 12,
    color: '#667085',
  },
  currentAccountValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 6,
    marginTop: 10,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 15,
    color: '#101828',
    height: '100%',
    padding: 0,
  },
  bankBranchText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 4,
    marginBottom: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F4EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#07522C',
    flex: 1,
    lineHeight: 16,
  },
  helperNotice: {
    fontSize: 11,
    color: '#667085',
    marginTop: 6,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    backgroundColor: '#FFFFFF',
  },
  saveBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#07522C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default BankDetailsScreen;
