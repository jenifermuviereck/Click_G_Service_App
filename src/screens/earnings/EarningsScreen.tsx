import React, { useState } from 'react';
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
import BottomNavBar from '../../components/BottomNavBar';
import { mockEarningsSummary, mockTransactions } from '../../data/mockData';

const EarningsScreen = () => {
  const navigation = useNavigation<any>();
  const [summary] = useState(mockEarningsSummary);
  const [transactions] = useState(mockTransactions);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings &amp; Payments</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top 3 Summary Cards */}
        <View style={styles.summaryCardsRow}>
          {/* Today */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Text style={styles.summaryCardLabel}>Today</Text>
              <Icon name="dots-vertical" size={16} color="#667085" />
            </View>
            <Text style={styles.summaryCardAmount}>₹{summary.todayTotal.toLocaleString()}</Text>
          </View>

          {/* This month */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Text style={styles.summaryCardLabel}>This month</Text>
            </View>
            <Text style={styles.summaryCardAmount}>₹{summary.thisMonthTotal.toLocaleString()}</Text>
          </View>

          {/* Pending Payments */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <Text style={styles.summaryCardLabel}>Pending Payments</Text>
            </View>
            <Text style={styles.summaryCardAmount}>₹{summary.pendingTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Today's Earnings Breakdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Today's earnings breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Gross Service Amount</Text>
            <Text style={styles.breakdownValue}>
              ₹{summary.grossServiceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              Platform Commission ({summary.platformCommissionRate}%)
            </Text>
            <Text style={styles.breakdownDeduction}>
              - ₹{summary.platformCommissionAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={[styles.breakdownRow, styles.netRow]}>
            <Text style={styles.netLabel}>Net Partner Earnings</Text>
            <Text style={styles.netValue}>₹{summary.netPartnerEarnings.toLocaleString()}</Text>
          </View>

          <Text style={styles.completedSubtext}>
            {summary.completedJobsCount} completed jobs • Includes the latest ₹1,200 job
          </Text>
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsHeaderRow}>
          <Text style={styles.transactionsSectionTitle}>Transactions</Text>
          <Text style={styles.transactionDateFilter}>Today</Text>
        </View>

        {transactions.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.transactionCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('TransactionDetails', {
                transaction: {
                  ...item,
                  txRef: `TX-${item.bookingRef.replace('CG-', '')}`,
                  grossAmount: 1500,
                  platformCommission: 300,
                  netEarnings: item.amount,
                  completedOn: `${item.dateStr} 2026 • ${item.timeStr}`,
                  customer: 'Ananya Sharma',
                  serviceArea: 'Koramangala, Bengaluru',
                  paymentMethod: 'Bank transfer',
                  accountHolder: 'Kumar',
                  bank: 'HDFC Bank •••• 9012',
                  expectedSettlement: '12 Oct 2026',
                },
              })
            }>
            <View style={styles.transactionLeft}>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txDetails}>
                {item.bookingRef} • {item.dateStr} • {item.timeStr}
              </Text>
            </View>

            <View style={styles.transactionRight}>
              <Text style={styles.txAmount}>₹{item.amount.toLocaleString()}</Text>
              <View
                style={[
                  styles.txStatusPill,
                  item.status === 'Paid' ? styles.txStatusPaid : styles.txStatusPending,
                ]}>
                <Text
                  style={[
                    styles.txStatusText,
                    item.status === 'Paid' ? styles.txStatusTextPaid : styles.txStatusTextPending,
                  ]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Nav Bar */}
      <BottomNavBar currentTab="Earnings" />
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
  summaryCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 28,
  },
  summaryCardLabel: {
    fontSize: 11,
    color: '#667085',
    flex: 1,
  },
  summaryCardAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D2939',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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
  netRow: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    marginTop: 8,
    paddingTop: 10,
  },
  netLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
  },
  netValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#07522C',
  },
  completedSubtext: {
    fontSize: 11,
    color: '#667085',
    marginTop: 8,
  },
  transactionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D2939',
  },
  transactionDateFilter: {
    fontSize: 12,
    color: '#667085',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionLeft: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 2,
  },
  txDetails: {
    fontSize: 11,
    color: '#667085',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D2939',
    marginBottom: 4,
  },
  txStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  txStatusPaid: {
    backgroundColor: '#E7F4EB',
  },
  txStatusPending: {
    backgroundColor: '#FEF0C7',
  },
  txStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  txStatusTextPaid: {
    color: '#07522C',
  },
  txStatusTextPending: {
    color: '#B54708',
  },
});

export default EarningsScreen;
