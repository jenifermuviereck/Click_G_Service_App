import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';
import { mockEarningsSummary, mockTransactions } from '../../data/mockData';

interface EarningsScreenProps {
  hideBottomNav?: boolean;
  onBackToHome?: () => void;
}

const EarningsScreen: React.FC<EarningsScreenProps> = ({ hideBottomNav = false, onBackToHome }) => {
  const navigation = useNavigation<any>();
  const [summary] = useState(mockEarningsSummary);
  const [transactions] = useState(mockTransactions);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');
  const [menuOpen, setMenuOpen] = useState(false);

  const timeframeOptions = ['Weekly', 'Monthly', 'Year', '5 Years', 'Life Time'];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => (onBackToHome ? onBackToHome() : (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')))}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Earnings & Payments</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Top 3 Summary Cards */}
        <View className="flex-row gap-1.5 sm:gap-3 mb-4">
          {/* Today / Component 22 */}
          <View className="flex-1 bg-white rounded-2xl border border-slate-200 px-2 py-2.5 sm:p-3 shadow-sm relative z-50">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] sm:text-xs text-slate-500 font-medium" numberOfLines={1}>
                {selectedTimeframe}
              </Text>
              <TouchableOpacity
                onPress={() => setMenuOpen(!menuOpen)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="dots-vertical" size={15} color="#667085" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900" numberOfLines={1} adjustsFontSizeToFit>
              ₹{summary.todayTotal.toLocaleString()}
            </Text>

            {menuOpen && (
              <View className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                {timeframeOptions.map((opt, i) => (
                  <TouchableOpacity
                    key={opt}
                    className={`px-3 py-2 ${
                      i !== timeframeOptions.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                    onPress={() => {
                      setSelectedTimeframe(opt);
                      setMenuOpen(false);
                    }}>
                    <Text className="text-xs text-slate-700 font-medium">{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* This month */}
          <View className="flex-1 bg-white rounded-2xl border border-slate-200 px-2 py-2.5 sm:p-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] sm:text-xs text-slate-500 font-medium" numberOfLines={1}>
                This month
              </Text>
            </View>
            <Text className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900" numberOfLines={1} adjustsFontSizeToFit>
              ₹{summary.thisMonthTotal.toLocaleString()}
            </Text>
          </View>

          {/* Pending Payments */}
          <View className="flex-1 bg-white rounded-2xl border border-slate-200 px-2 py-2.5 sm:p-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] sm:text-xs text-slate-500 font-medium" numberOfLines={1}>
                Pending
              </Text>
            </View>
            <Text className="text-xs sm:text-sm md:text-base font-extrabold text-amber-700" numberOfLines={1} adjustsFontSizeToFit>
              ₹{summary.pendingTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Today's Earnings Breakdown Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3">Today's earnings breakdown</Text>

          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">Gross Service Amount</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{summary.grossServiceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">
              Platform Commission ({summary.platformCommissionRate}%)
            </Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-red-600">
              - ₹{summary.platformCommissionAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View className="flex-row justify-between pt-3 pb-1">
            <Text className="text-xs sm:text-sm font-bold text-brand-green">Net Partner Earnings</Text>
            <Text className="text-sm sm:text-base font-extrabold text-brand-green">
              ₹{summary.netPartnerEarnings.toLocaleString()}
            </Text>
          </View>

          <Text className="text-[11px] text-slate-400 mt-2">
            {summary.completedJobsCount} completed jobs • Includes the latest ₹1,200 job
          </Text>
        </View>

        {/* Transactions Section */}
        <View className="flex-row items-center justify-between mb-3 mt-1">
          <Text className="text-base font-bold text-slate-900">Transactions</Text>
          <Text className="text-xs font-semibold text-brand-green">Today</Text>
        </View>

        {transactions.map(item => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center justify-between bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm active:scale-[0.99]"
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
            <View className="flex-1 mr-3">
              <Text className="text-sm font-bold text-slate-900 mb-1">{item.title}</Text>
              <Text className="text-xs text-slate-500">
                {item.bookingRef} • {item.dateStr} • {item.timeStr}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5">
                ₹{item.amount.toLocaleString()}
              </Text>
              <View
                className={`px-2.5 py-0.5 rounded-full ${
                  item.status === 'Paid' ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                <Text
                  className={`text-[10px] sm:text-xs font-bold ${
                    item.status === 'Paid' ? 'text-emerald-800' : 'text-amber-800'
                  }`}>
                  {item.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Nav Bar */}
      {!hideBottomNav && <BottomNavBar currentTab="Earnings" />}
    </SafeAreaView>
  );
};

export default EarningsScreen;
