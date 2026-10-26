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

const CompletionConfirmedScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const job = route?.params?.job || {
    bookingRef: 'CG-1042',
    category: 'Plumbing Repair',
    grossAmount: 1500,
    platformCommission: 300,
    additionalCharges: 500,
    gstAmount: 170,
    netEarnings: 1870,
    completedAt: 'Today • 11:15 AM',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Completion confirmed</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successIconWrapper}>
          <View style={styles.successCircle}>
            <Icon name="check" size={32} color="#07522C" />
          </View>
        </View>

        <Text style={styles.confirmedTitle}>Job Completed Successfully</Text>
        <Text style={styles.bookingSubTitle}>
          {job.category} • Booking {job.bookingRef}
        </Text>

        {/* Breakdown Card */}
        <View style={styles.card}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Gross Service Amount</Text>
            <Text style={styles.breakdownValue}>₹{job.grossAmount?.toLocaleString() || '1,500'}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Platform Commission (20%)</Text>
            <Text style={styles.breakdownDeduction}>
              - ₹{job.platformCommission?.toLocaleString() || '300'}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Additional Charges</Text>
            <Text style={styles.breakdownValue}>₹{job.additionalCharges?.toLocaleString() || '500'}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>GST 18%</Text>
            <Text style={styles.breakdownValue}>₹{job.gstAmount?.toLocaleString() || '170'}</Text>
          </View>

          <View style={[styles.breakdownRow, styles.netEarningsRow]}>
            <Text style={styles.netEarningsLabel}>Net Partner Earnings</Text>
            <Text style={styles.netEarningsValue}>₹{job.netEarnings?.toLocaleString() || '1,870'}</Text>
          </View>

          <View style={styles.statusDetailRow}>
            <Text style={styles.statusDetailLabel}>Completed</Text>
            <Text style={styles.statusDetailValue}>{job.completedAt || 'Today • 11:15 AM'}</Text>
          </View>

          <View style={[styles.statusDetailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.statusDetailLabel}>Payment status</Text>
            <Text style={styles.paymentCompletedValue}>Completed</Text>
          </View>
        </View>

        {/* Notice Info Text */}
        <Text style={styles.noticeText}>
          Your completion has been submitted. ₹{job.netEarnings?.toLocaleString() || '1,870'} has been
          added to your pending earnings.
        </Text>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.viewEarningsBtn}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Earnings')}>
          <Text style={styles.viewEarningsBtnText}>View Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backHomeBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backHomeBtnText}>Back to Home</Text>
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
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  successIconWrapper: {
    marginBottom: 16,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E7F4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D2939',
    textAlign: 'center',
  },
  bookingSubTitle: {
    fontSize: 13,
    color: '#667085',
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    width: '100%',
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
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#667085',
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  breakdownDeduction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D92D20',
  },
  netEarningsRow: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
    marginTop: 6,
    paddingVertical: 12,
  },
  netEarningsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
  },
  netEarningsValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#07522C',
  },
  statusDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  statusDetailLabel: {
    fontSize: 12,
    color: '#667085',
  },
  statusDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D2939',
  },
  paymentCompletedValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#07522C',
  },
  noticeText: {
    fontSize: 12,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    alignItems: 'center',
  },
  viewEarningsBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#07522C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  viewEarningsBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backHomeBtn: {
    paddingVertical: 6,
  },
  backHomeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
});

export default CompletionConfirmedScreen;
