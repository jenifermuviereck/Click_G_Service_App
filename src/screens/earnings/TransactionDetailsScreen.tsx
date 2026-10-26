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

const TransactionDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const transaction = route?.params?.transaction || {
    id: 'tx-1',
    title: 'Plumbing Repair',
    bookingRef: 'CG-1042',
    txRef: 'TX-1042',
    status: 'Pending',
    grossAmount: 1500,
    platformCommission: 300,
    netEarnings: 1200,
    completedOn: '10 Oct 2026 • 11:15 AM',
    customer: 'Ananya Sharma',
    serviceArea: 'Koramangala, Bengaluru',
    paymentMethod: 'Bank transfer',
    accountHolder: 'Kumar',
    bank: 'HDFC Bank •••• 9012',
    expectedSettlement: '12 Oct 2026',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Amount Card */}
        <View style={styles.card}>
          <Text style={styles.serviceTitle}>{transaction.title || 'Plumbing Repair'}</Text>
          <Text style={styles.subRef}>
            Booking {transaction.bookingRef || 'CG-1042'} • Transaction {transaction.txRef || 'TX-1042'}
          </Text>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{transaction.status || 'Pending'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Gross Service Amount</Text>
            <Text style={styles.amountValue}>₹{transaction.grossAmount?.toLocaleString() || '1,500'}</Text>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Platform Commission (20%)</Text>
            <Text style={styles.deductionValue}>
              - ₹{transaction.platformCommission?.toLocaleString() || '300'}
            </Text>
          </View>

          <View style={[styles.amountRow, styles.netEarningsRow]}>
            <Text style={styles.netLabel}>Net Partner Earnings</Text>
            <Text style={styles.netValue}>₹{transaction.netEarnings?.toLocaleString() || '1,200'}</Text>
          </View>
        </View>

        {/* Completion & Customer Details Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Completed on</Text>
            <Text style={styles.infoValue}>{transaction.completedOn || '10 Oct 2026 • 11:15 AM'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer</Text>
            <Text style={styles.infoValue}>{transaction.customer || 'Ananya Sharma'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service area</Text>
            <Text style={styles.infoValue}>{transaction.serviceArea || 'Koramangala, Bengaluru'}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Payment method</Text>
            <Text style={styles.infoValue}>{transaction.paymentMethod || 'Bank transfer'}</Text>
          </View>
        </View>

        {/* Payout Account Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Payout account</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account holder</Text>
            <Text style={styles.infoValue}>{transaction.accountHolder || 'Kumar'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bank</Text>
            <Text style={styles.infoValue}>{transaction.bank || 'HDFC Bank •••• 9012'}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Expected settlement</Text>
            <Text style={styles.infoValue}>{transaction.expectedSettlement || '12 Oct 2026'}</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text style={styles.infoBannerText}>
            ₹{transaction.netEarnings?.toLocaleString() || '1,200'} is pending settlement. Your payment status will update once transferred.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Earnings')}>
          <Text style={styles.backBtnText}>Back to Earnings</Text>
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
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D2939',
  },
  subRef: {
    fontSize: 12,
    color: '#667085',
    marginTop: 4,
    marginBottom: 10,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF0C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B54708',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 10,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  amountLabel: {
    fontSize: 13,
    color: '#667085',
  },
  amountValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  deductionValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D92D20',
  },
  netEarningsRow: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    marginTop: 8,
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
  cardHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  infoLabel: {
    fontSize: 12,
    color: '#667085',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D2939',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F4EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
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

export default TransactionDetailsScreen;
