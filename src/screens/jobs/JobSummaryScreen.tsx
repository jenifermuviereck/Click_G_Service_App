import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';

const JobSummaryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const job = route?.params?.job || {
    title: 'Painting Service',
    bookingRef: 'CG-1039',
    completedOn: 'Today • 8:45 AM',
    customer: 'Rahul Mehta',
    area: 'Indiranagar, Bengaluru',
    description: 'Bedroom wall touch-up completed. Work checked and approved by the customer.',
    grossAmount: 4000,
    commission: 800,
    netEarnings: 3200,
    paymentStatus: 'Paid',
    txRef: 'TX-1039',
    payoutAccount: 'HDFC Bank •••• 9012',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Summary</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.card}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.bookingRefText}>Booking {job.bookingRef}</Text>
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>Completed</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={styles.dimLabel}>Completed on</Text>
            <Text style={styles.boldValue}>{job.completedOn || 'Today • 8:45 AM'}</Text>
          </View>
        </View>

        {/* Customer & Area Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.dimLabel}>Customer</Text>
            <Text style={styles.boldValue}>{job.customer || 'Rahul Mehta'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.dimLabel}>Service area</Text>
            <Text style={styles.boldValue}>{job.area || 'Indiranagar, Bengaluru'}</Text>
          </View>

          <Text style={styles.descText}>
            {job.description ||
              'Bedroom wall touch-up completed. Work checked and approved by the customer.'}
          </Text>
        </View>

        {/* Financial Breakdown Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.dimLabel}>Gross Service Amount</Text>
            <Text style={styles.boldValue}>₹{job.grossAmount?.toLocaleString() || '4,000'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.dimLabel}>Platform Commission (20%)</Text>
            <Text style={styles.deductionValue}>
              - ₹{job.commission?.toLocaleString() || '800'}
            </Text>
          </View>

          <View style={[styles.rowBetween, styles.netEarningsRow]}>
            <Text style={styles.netLabel}>Net Partner Earnings</Text>
            <Text style={styles.netValue}>₹{job.netEarnings?.toLocaleString() || '3,200'}</Text>
          </View>
        </View>

        {/* Payout Details Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.dimLabel}>Payment status</Text>
            <Text style={styles.paidValue}>{job.paymentStatus || 'Paid'}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.dimLabel}>Transaction reference</Text>
            <Text style={styles.boldValue}>{job.txRef || 'TX-1039'}</Text>
          </View>

          <View style={[styles.rowBetween, { borderBottomWidth: 0 }]}>
            <Text style={styles.dimLabel}>Payout account</Text>
            <Text style={styles.boldValue}>{job.payoutAccount || 'HDFC Bank •••• 9012'}</Text>
          </View>
        </View>

        {/* Success Note Banner */}
        <View style={styles.infoBanner}>
          <Icon name="checkbox-marked-circle-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text style={styles.infoBannerText}>
            Completion photo and service notes submitted successfully.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MyJobs')}>
          <Text style={styles.backBtnText}>Back to My Jobs</Text>
        </TouchableOpacity>
      </View>
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
  jobTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D2939',
  },
  bookingRefText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
    marginBottom: 8,
  },
  completedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dimLabel: {
    fontSize: 13,
    color: '#667085',
  },
  boldValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  deductionValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D92D20',
  },
  paidValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#07522C',
  },
  descText: {
    fontSize: 12,
    color: '#475467',
    lineHeight: 18,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  netEarningsRow: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    marginTop: 6,
    paddingTop: 12,
  },
  netLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
  },
  netValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#07522C',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F4EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#07522C',
    flex: 1,
    lineHeight: 16,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  backBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
});

export default JobSummaryScreen;
