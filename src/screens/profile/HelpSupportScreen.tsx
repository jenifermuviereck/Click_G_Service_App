import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

const HelpSupportScreen = () => {
  const navigation = useNavigation<any>();

  const handleCall = () => {
    Linking.openURL('tel:08045678900');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:partners@clickg.in');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help &amp; Support</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>How can we help?</Text>
        <Text style={styles.mainSubtitle}>
          For help with bookings, payments or verification, contact the partner support team.
        </Text>

        {/* Call Partner Support Card */}
        <View style={styles.card}>
          <View style={styles.supportTypeHeader}>
            <Icon name="phone-outline" size={18} color="#07522C" style={{ marginRight: 6 }} />
            <Text style={styles.supportTypeTitle}>Call partner support</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValueBold}>080 4567 8900</Text>
          </View>
          <Text style={styles.timingSubtext}>Monday - Saturday • 9:00 AM - 6:00 PM</Text>

          <TouchableOpacity style={styles.callSupportBtn} activeOpacity={0.85} onPress={handleCall}>
            <Text style={styles.callSupportBtnText}>Call Support</Text>
          </TouchableOpacity>
        </View>

        {/* Email Support Card */}
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handleEmail}>
          <View style={styles.supportTypeHeader}>
            <Icon name="email-outline" size={18} color="#07522C" style={{ marginRight: 6 }} />
            <Text style={styles.supportTypeTitle}>Email support</Text>
          </View>

          <Text style={styles.emailValue}>partners@clickg.in</Text>
          <Text style={styles.emailNote}>
            Include your booking ID or partner reference so we can help you faster.
          </Text>
        </TouchableOpacity>

        {/* Common Questions Section */}
        <Text style={styles.faqSectionHeading}>Common questions</Text>

        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>When will I receive my payment?</Text>
          <Text style={styles.faqAnswer}>
            Check the expected settlement date in Earnings &gt; Transaction Details.
          </Text>

          <View style={styles.faqDivider} />

          <Text style={styles.faqQuestion}>Why is my verification pending?</Text>
          <Text style={styles.faqAnswer}>
            Document review usually takes 1-2 working days after submission.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
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
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 6,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#667085',
    lineHeight: 18,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  supportTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTypeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#667085',
  },
  detailValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D2939',
  },
  timingSubtext: {
    fontSize: 11,
    color: '#667085',
    marginBottom: 14,
  },
  callSupportBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#07522C',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callSupportBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#07522C',
    marginBottom: 6,
  },
  emailNote: {
    fontSize: 12,
    color: '#667085',
    lineHeight: 16,
  },
  faqSectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D2939',
    marginTop: 8,
    marginBottom: 12,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#475467',
    lineHeight: 16,
  },
  faqDivider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 12,
  },
});

export default HelpSupportScreen;
