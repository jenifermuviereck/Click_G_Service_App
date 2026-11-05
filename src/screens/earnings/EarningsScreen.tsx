import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';
import financialApi from '../../common/api/financialApi';

interface EarningsSummary {
  todayTotal: number;
  thisMonthTotal: number;
  pendingTotal: number;
  grossServiceAmount: number;
  platformCommissionRate: number;
  platformCommissionAmount: number;
  netPartnerEarnings: number;
  completedJobsCount: number;
}

interface TransactionItem {
  id: string;
  title: string;
  bookingRef: string;
  dateStr: string;
  timeStr: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

interface EarningsScreenProps {
  hideBottomNav?: boolean;
  onBackToHome?: () => void;
}

const EarningsScreen: React.FC<EarningsScreenProps> = ({ hideBottomNav = false, onBackToHome }) => {
  const navigation = useNavigation<any>();
  const [summary, setSummary] = useState<EarningsSummary>({
    todayTotal: 0,
    thisMonthTotal: 0,
    pendingTotal: 0,
    grossServiceAmount: 0,
    platformCommissionRate: 20,
    platformCommissionAmount: 0,
    netPartnerEarnings: 0,
    completedJobsCount: 0,
  });
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');
  const [menuOpen, setMenuOpen] = useState(false);

  const timeframeOptions = ['Weekly', 'Monthly', 'Year', '5 Years', 'Life Time'];

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true);
        const [sumRes, ledgerRes] = await Promise.all([
          financialApi.getFinancialSummary(),
          financialApi.getLedgerTransactions(1, 10),
        ]);

        if (sumRes.success && sumRes.data) {
          const d = sumRes.data;
          const today = d.todayEarnings ? parseFloat(d.todayEarnings) : 0;
          const gross = Math.round(today * 1.25);
          const commission = Math.round(today * 0.25);
          setSummary({
            todayTotal: today,
            thisMonthTotal: d.thisMonthEarnings
              ? parseFloat(d.thisMonthEarnings)
              : d.totalEarnings
              ? parseFloat(d.totalEarnings)
              : 0,
            pendingTotal: d.pendingPayouts ? parseFloat(d.pendingPayouts) : 0,
            grossServiceAmount: gross,
            platformCommissionRate: 20,
            platformCommissionAmount: commission,
            netPartnerEarnings: today,
            completedJobsCount: d.completedJobsCount ?? 0,
          });
        }

        if (ledgerRes.success && ledgerRes.data?.items) {
          const mappedTx: TransactionItem[] = ledgerRes.data.items.map((t: any) => ({
            id: t.id,
            title: t.description || 'Service Credit',
            bookingRef: t.referenceId || 'CG-TX',
            dateStr: new Date(t.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            timeStr: new Date(t.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            amount: parseFloat(t.amount) || 0,
            status: (t.type === 'CREDIT' ? 'Paid' : 'Pending') as 'Paid' | 'Pending',
          }));
          setTransactions(mappedTx);
        }
      } catch (err) {
        console.warn('[EarningsScreen] fetchFinancialData error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

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

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#07522C" />
          <Text className="text-xs text-slate-500 mt-3">Loading earnings...</Text>
        </View>
      ) : (
      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Top 3 Summary Cards */}
        <View className="flex-row gap-1.5 sm:gap-3 mb-4">
          {/* Today */}
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

        {/* Commission Calculation Breakdown Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3">Earnings Breakdown</Text>

          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">Gross Service Amount</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{summary.grossServiceAmount.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">Platform Commission ({summary.platformCommissionRate}%)</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-red-600">
              - ₹{summary.platformCommissionAmount.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between pt-2.5">
            <Text className="text-xs sm:text-[13px] font-bold text-slate-900">Net Partner Earnings</Text>
            <Text className="text-sm sm:text-base font-extrabold text-brand-green">
              ₹{summary.netPartnerEarnings.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Recent Transactions List */}
        <View className="mb-4">
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">Transaction History</Text>
          {transactions.map(item => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-3.5 mb-2.5 flex-row items-center justify-between shadow-sm"
              activeOpacity={0.7}
              onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}>
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-9 h-9 rounded-full bg-emerald-50 items-center justify-center mr-3">
                  <Icon name="arrow-down-left" size={18} color="#07522C" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs sm:text-sm font-bold text-slate-900" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-[10px] sm:text-xs text-slate-500">{item.dateStr} • {item.timeStr}</Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-xs sm:text-sm font-bold text-brand-green">+ ₹{item.amount.toLocaleString()}</Text>
                <Text className={`text-[10px] font-semibold ${item.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      )}

      {!hideBottomNav && <BottomNavBar currentTab="Earnings" />}
    </SafeAreaView>
  );
};

export default EarningsScreen;
