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
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import authService from '../../services/authService';

const TOTAL_STEPS = 4;

const PartnerRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialMobile = route?.params?.mobile || '+91 98765 43210';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Kumar',
    mobile: initialMobile.startsWith('+91') ? initialMobile : `+91 ${initialMobile}`,
    email: '',
    address: '18, 6th Cross, BTM Layout',
    city: 'Bengaluru',
    pincode: '560076',
    experienceYears: '5',
    docType1: 'Aadhaar Card',
    docFile1: 'aadhaar-front.pdf • 420 KB',
    docType2: 'Pan Card',
    docFile2: 'aadhaar-back.pdf • 380 KB',
    accountHolderName: 'Kumar',
    accountNumber: '123456789012',
    ifscCode: 'HDFC0001234',
    gPayUpi: 'kj987654321oabc',
    phonePeUpi: 'kj987654321oabc',
  });

  const updateField = (key: string, value: string) => {
    let cleanVal = value;
    if (key === 'mobile') {
      // Only digits, maximum 10 digits
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 10);
    } else if (key === 'pincode') {
      // PIN code: strictly 6 digits
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 6);
    } else if (key === 'experienceYears') {
      // Experience: strictly digits, max 2
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 2);
    } else if (key === 'accountNumber') {
      // Bank Account: strictly digits, up to 18
      cleanVal = value.replace(/[^0-9]/g, '').slice(0, 18);
    } else if (key === 'ifscCode') {
      // IFSC Code: uppercase alphanumeric, max 11
      cleanVal = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11);
    } else if (key === 'fullName' || key === 'accountHolderName') {
      // Names: strictly alphabetical letters and spaces
      cleanVal = value.replace(/[^a-zA-Z\s]/g, '');
    }
    setFormData(prev => ({ ...prev, [key]: cleanVal }));
  };

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    try {
      await authService.registerPartner({
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        experienceYears: formData.experienceYears,
        idDocType1: formData.docType1,
        idDocType2: formData.docType2,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        gPayUpiId: formData.gPayUpi,
        phonePeUpiId: formData.phonePeUpi,
      });
      setIsSubmitted(true);
    } catch {
      showNotification('Submission error');
    }
  };

  // Render Step Indicator Bar
  const renderStepHeader = () => (
    <View style={styles.stepHeaderContainer}>
      <View style={styles.stepHeaderRow}>
        <Text style={styles.stepCounterText}>{`Step ${currentStep} of ${TOTAL_STEPS}`}</Text>
        <Text style={styles.requiredIndicator}>* Required</Text>
      </View>
      <View style={styles.progressBarTrack}>
        {[1, 2, 3, 4].map(step => (
          <View
            key={step}
            style={[
              styles.progressSegment,
              step <= currentStep ? styles.progressSegmentActive : styles.progressSegmentInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  // Render Step 1: Personal Details
  const renderStep1 = () => (
    <View>
      <Text style={styles.sectionTitle}>Personal Details</Text>

      {/* Add Profile Photo Card */}
      <TouchableOpacity style={styles.photoUploadCard} activeOpacity={0.8}>
        <Icon name="camera-outline" size={20} color="#07522C" style={{ marginRight: 8 }} />
        <Text style={styles.photoUploadText}>Add Profile Photo (optional)</Text>
      </TouchableOpacity>

      <Text style={styles.fieldLabel}>Full Name *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.fullName}
          onChangeText={v => updateField('fullName', v)}
          placeholder="Enter full name"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text style={styles.fieldLabel}>Mobile Number *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.mobile}
          onChangeText={v => updateField('mobile', v)}
          placeholder="Mobile Number (10 digits)"
          placeholderTextColor="#98A2B3"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={10}
        />
      </View>
      <Text style={styles.helperText}>Verified mobile number</Text>

      <Text style={styles.fieldLabel}>Email (optional)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.email}
          onChangeText={v => updateField('email', v)}
          placeholder="Enter email address"
          placeholderTextColor="#98A2B3"
          keyboardType="email-address"
        />
      </View>
    </View>
  );

  // Render Step 2: Address & Experience
  const renderStep2 = () => (
    <View>
      <Text style={styles.sectionTitle}>Address &amp; Experience</Text>

      <Text style={styles.fieldLabel}>Address *</Text>
      <View style={[styles.inputContainer, styles.multilineContainer]}>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={formData.address}
          onChangeText={v => updateField('address', v)}
          placeholder="Enter complete address"
          placeholderTextColor="#98A2B3"
          multiline
        />
      </View>

      <Text style={styles.fieldLabel}>City *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.city}
          onChangeText={v => updateField('city', v)}
          placeholder="City"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text style={styles.fieldLabel}>PIN Code *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.pincode}
          onChangeText={v => updateField('pincode', v)}
          placeholder="560076"
          placeholderTextColor="#98A2B3"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={6}
        />
      </View>

      <Text style={styles.fieldLabel}>Experience in Years *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.experienceYears}
          onChangeText={v => updateField('experienceYears', v)}
          placeholder="5"
          placeholderTextColor="#98A2B3"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={2}
        />
      </View>
      <Text style={styles.helperText}>Enter total years of service experience.</Text>
    </View>
  );

  // Render Step 3: Identity Documents
  const renderStep3 = () => (
    <View>
      <Text style={styles.sectionTitle}>Identity Documents</Text>

      {/* Doc 1 */}
      <Text style={styles.fieldLabel}>Document Type *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.docType1}
          onChangeText={v => updateField('docType1', v)}
        />
      </View>

      <View style={styles.docUploadCard}>
        <Icon name="file-document-outline" size={26} color="#07522C" style={styles.docIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.docStatusTitle}>File uploaded • Replace</Text>
          <Text style={styles.docFileName}>{formData.docFile1}</Text>
        </View>
      </View>

      {/* Doc 2 */}
      <Text style={styles.fieldLabel}>Document Type *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.docType2}
          onChangeText={v => updateField('docType2', v)}
        />
      </View>

      <View style={styles.docUploadCard}>
        <Icon name="file-document-outline" size={26} color="#07522C" style={styles.docIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.docStatusTitle}>File uploaded • Replace</Text>
          <Text style={styles.docFileName}>{formData.docFile2}</Text>
        </View>
      </View>

      {/* Verification Notice */}
      <View style={styles.infoBox}>
        <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
        <Text style={styles.infoText}>Your documents are used only for partner verification.</Text>
      </View>
    </View>
  );

  // Render Step 4: Bank Details
  const renderStep4 = () => (
    <View>
      <Text style={styles.sectionTitle}>Bank Details</Text>

      <Text style={styles.fieldLabel}>Account Holder Name *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.accountHolderName}
          onChangeText={v => updateField('accountHolderName', v)}
          placeholder="Account Holder Name"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text style={styles.fieldLabel}>Account Number *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.accountNumber}
          onChangeText={v => updateField('accountNumber', v)}
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
          value={formData.ifscCode}
          onChangeText={v => updateField('ifscCode', v.toUpperCase())}
          placeholder="HDFC0001234"
          placeholderTextColor="#98A2B3"
          autoCapitalize="characters"
        />
      </View>

      <Text style={styles.fieldLabel}>G Pay UPI Id *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.gPayUpi}
          onChangeText={v => updateField('gPayUpi', v)}
          placeholder="user@upi"
          placeholderTextColor="#98A2B3"
        />
      </View>

      <Text style={styles.fieldLabel}>Phone Pay UPI Id *</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={formData.phonePeUpi}
          onChangeText={v => updateField('phonePeUpi', v)}
          placeholder="user@ybl"
          placeholderTextColor="#98A2B3"
        />
      </View>

      {/* Account Info Notice */}
      <View style={styles.infoBox}>
        <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
        <Text style={styles.infoText}>
          Ensure the account holder name matches your identity document.
        </Text>
      </View>
    </View>
  );

  // Render Submitted / Success Screen
  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Icon name="arrow-left" size={22} color="#07522C" />
          </TouchableOpacity>
          <Text style={styles.navHeaderTitle}>Registration Submitted</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.submittedContainer}>
          {/* Checkmark Circle */}
          <View style={styles.successCircle}>
            <Icon name="check" size={32} color="#07522C" />
          </View>

          <Text style={styles.submittedHeading}>Details submitted successfully</Text>

          {/* Reference Card */}
          <View style={styles.referenceCard}>
            <View style={styles.refRow}>
              <Text style={styles.refLabel}>Partner</Text>
              <Text style={styles.refValue}>{formData.fullName || 'Kumar'}</Text>
            </View>
            <View style={styles.refRow}>
              <Text style={styles.refLabel}>Registration reference</Text>
              <Text style={styles.refValue}>CG-P-2084</Text>
            </View>
            <View style={[styles.refRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.refLabel}>Submitted</Text>
              <Text style={styles.refValue}>08 Oct 2026</Text>
            </View>
          </View>
        </View>

        {/* Back to Login Button */}
        <View style={styles.submittedBottomBar}>
          <TouchableOpacity
            style={styles.submitVerifyBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.submitVerifyBtnText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.navHeaderRow}>
        <TouchableOpacity onPress={handleBack} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.navHeaderTitle}>Partner Registration</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {renderStepHeader()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {currentStep === 1 && (
          <TouchableOpacity
            style={styles.step1BackHeader}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={16} color="#07522C" style={{ marginRight: 6 }} />
            <Text style={styles.step1BackHeaderText}>Partner Registration</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <View style={styles.twoButtonRow}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={handleBack}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueBtn} activeOpacity={0.85} onPress={handleNext}>
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.step4SubmitWrapper}>
            <TouchableOpacity
              style={styles.submitVerifyBtn}
              activeOpacity={0.85}
              onPress={handleSubmit}>
              <Text style={styles.submitVerifyBtnText}>Submit for Verification</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.step4BackLink} onPress={handleBack}>
              <Text style={styles.step4BackText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  navHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#07522C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  stepHeaderContainer: {
    marginBottom: 20,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCounterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#07522C',
  },
  requiredIndicator: {
    fontSize: 12,
    color: '#98A2B3',
  },
  progressBarTrack: {
    flexDirection: 'row',
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: '#07522C',
  },
  progressSegmentInactive: {
    backgroundColor: '#EAECF0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 16,
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
    marginBottom: 18,
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
  multilineContainer: {
    height: 70,
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 15,
    color: '#101828',
    height: '100%',
    padding: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 4,
  },
  docUploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 14,
    marginTop: 10,
    marginBottom: 14,
  },
  docIcon: {
    marginRight: 12,
  },
  docStatusTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  docFileName: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F4EB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
  },
  infoText: {
    fontSize: 12,
    color: '#07522C',
    flex: 1,
    lineHeight: 16,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    backgroundColor: '#FFFFFF',
  },
  step1BackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  step1BackHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#07522C',
  },
  twoButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#344054',
  },
  continueBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#07522C',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  step4SubmitWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  submitVerifyBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#07522C',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#07522C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  submitVerifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  step4BackLink: {
    marginTop: 14,
    paddingVertical: 4,
  },
  step4BackText: {
    fontSize: 14,
    color: '#344054',
    fontWeight: '600',
  },
  submittedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E7F4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submittedHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2939',
    textAlign: 'center',
    marginBottom: 28,
  },
  referenceCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  refLabel: {
    fontSize: 13,
    color: '#667085',
  },
  refValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  submittedBottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});

export default PartnerRegistrationScreen;
