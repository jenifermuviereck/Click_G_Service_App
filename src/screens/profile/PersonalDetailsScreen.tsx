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
import { useAuth } from '../../context/AuthContext';

const PersonalDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.name || 'Kumar');
  const [mobile] = useState(user?.mobile || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'kumar@gmail.com');
  const [address, setAddress] = useState('18, 6th Cross, BTM Layout');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [pincode, setPincode] = useState('560076');

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleSave = async () => {
    await updateUser({
      name: fullName,
      email,
      city,
    });
    showNotification('Personal details updated successfully');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Photo Upload */}
        <TouchableOpacity style={styles.photoUploadCard} activeOpacity={0.8}>
          <Icon name="camera-outline" size={20} color="#07522C" style={{ marginRight: 8 }} />
          <Text style={styles.photoUploadText}>Add Profile Photo (optional)</Text>
        </TouchableOpacity>

        {/* Full Name */}
        <Text style={styles.fieldLabel}>Full Name *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={fullName}
            onChangeText={v => setFullName(v.replace(/[^a-zA-Z\s]/g, ''))}
            placeholder="Full Name"
            placeholderTextColor="#98A2B3"
          />
        </View>

        {/* Mobile Number */}
        <Text style={styles.fieldLabel}>Mobile Number *</Text>
        <View style={[styles.inputContainer, styles.disabledInput]}>
          <TextInput
            style={styles.textInput}
            value={mobile}
            editable={false}
            placeholder="+91 Mobile"
            placeholderTextColor="#98A2B3"
          />
        </View>
        <Text style={styles.helperText}>Verified • Your registered mobile number</Text>

        {/* Email */}
        <Text style={styles.fieldLabel}>Email (optional)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor="#98A2B3"
            keyboardType="email-address"
          />
        </View>

        {/* Residential Address Section */}
        <Text style={styles.sectionHeading}>Residential address</Text>

        <Text style={styles.fieldLabel}>Address *</Text>
        <View style={[styles.inputContainer, styles.multilineContainer]}>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            placeholderTextColor="#98A2B3"
            multiline
          />
        </View>

        {/* City and PIN Code Row */}
        <View style={styles.twoColRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>City *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#98A2B3"
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>PIN Code *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={pincode}
                onChangeText={v => setPincode(v.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="560076"
                placeholderTextColor="#98A2B3"
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={6}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.88} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
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
  photoUploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    paddingVertical: 14,
    marginBottom: 16,
  },
  photoUploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#07522C',
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
  disabledInput: {
    backgroundColor: '#F9FAFB',
  },
  textInput: {
    fontSize: 15,
    color: '#101828',
    height: '100%',
    padding: 0,
  },
  helperText: {
    fontSize: 11,
    color: '#667085',
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D2939',
    marginTop: 22,
    marginBottom: 6,
  },
  multilineContainer: {
    height: 64,
    paddingVertical: 8,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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

export default PersonalDetailsScreen;
