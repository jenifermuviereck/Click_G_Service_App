import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

const DocumentsVerificationScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents &amp; Verification</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verified Partner Banner Card */}
        <View style={styles.verifiedBannerCard}>
          <View style={styles.bannerHeaderRow}>
            <View style={styles.checkCircle}>
              <Icon name="check" size={18} color="#07522C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Verified partner</Text>
              <Text style={styles.bannerSub}>Your identity and bank details have been verified.</Text>
            </View>
          </View>

          <View style={styles.bannerDivider} />

          <View style={styles.bannerMetaRow}>
            <Text style={styles.metaLabel}>Partner reference</Text>
            <Text style={styles.metaValue}>CG-P-2084</Text>
          </View>
          <View style={styles.bannerMetaRow}>
            <Text style={styles.metaLabel}>Approved on</Text>
            <Text style={styles.metaValue}>09 Oct 2026</Text>
          </View>
        </View>

        {/* Identity Documents Section */}
        <Text style={styles.sectionHeading}>Identity documents</Text>
        <View style={styles.card}>
          <View style={styles.docHeaderRow}>
            <View style={styles.docTitleRow}>
              <Icon name="card-account-details-outline" size={20} color="#07522C" style={{ marginRight: 8 }} />
              <Text style={styles.docTitle}>Aadhaar Card</Text>
            </View>
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedPillText}>Verified</Text>
            </View>
          </View>

          <View style={styles.docInfoRow}>
            <Text style={styles.docInfoLabel}>Document number</Text>
            <Text style={styles.docInfoValue}>•••• •••• 4821</Text>
          </View>
          <View style={styles.docInfoRow}>
            <Text style={styles.docInfoLabel}>Front copy</Text>
            <Text style={styles.docInfoFile}>aadhaar-front.pdf</Text>
          </View>
          <View style={[styles.docInfoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.docInfoLabel}>Back copy</Text>
            <Text style={styles.docInfoFile}>aadhaar-back.pdf</Text>
          </View>
        </View>

        {/* Bank Verification Section */}
        <Text style={styles.sectionHeading}>Bank verification</Text>
        <View style={styles.card}>
          <View style={styles.docInfoRow}>
            <Text style={styles.docInfoLabel}>Account</Text>
            <Text style={styles.docInfoValue}>HDFC Bank •••• 9012</Text>
          </View>
          <View style={[styles.docInfoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.docInfoLabel}>Status</Text>
            <Text style={styles.verifiedTextGreen}>Verified</Text>
          </View>
        </View>

        {/* Support Help Banner */}
        <View style={styles.supportBanner}>
          <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text style={styles.supportBannerText}>
            Need to update your identity documents? Contact Help &amp; Support for a secure review.
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
  verifiedBannerCard: {
    backgroundColor: '#E7F4EB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CEE7D6',
    padding: 16,
    marginBottom: 20,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#07522C',
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 12,
    color: '#344054',
    lineHeight: 16,
  },
  bannerDivider: {
    height: 1,
    backgroundColor: '#CEE7D6',
    marginVertical: 12,
  },
  bannerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  metaLabel: {
    fontSize: 12,
    color: '#667085',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D2939',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 10,
    marginTop: 6,
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
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D2939',
  },
  verifiedPill: {
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  docInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  docInfoLabel: {
    fontSize: 12,
    color: '#667085',
  },
  docInfoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D2939',
  },
  docInfoFile: {
    fontSize: 12,
    fontWeight: '600',
    color: '#07522C',
  },
  verifiedTextGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#07522C',
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 14,
    marginTop: 8,
  },
  supportBannerText: {
    fontSize: 12,
    color: '#475467',
    flex: 1,
    lineHeight: 16,
  },
});

export default DocumentsVerificationScreen;
