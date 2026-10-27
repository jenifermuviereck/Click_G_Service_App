import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';

const TransactionDetailsScreen = () => {
  const insets = useSafeAreaInsets();
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

  const isPaid = transaction.status === 'Paid';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Transaction Details</Text>
      </View>

      <View className="flex-1 bg-slate-50">
        <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Main Amount Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <Text className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            {transaction.title || 'Plumbing Repair'}
          </Text>
          <Text className="text-xs text-slate-500 mb-2.5">
            Booking {transaction.bookingRef || 'CG-1042'} • Transaction {transaction.txRef || 'TX-1042'}
          </Text>

          <View
            className={`self-start px-3 py-1 rounded-full mb-3 ${
              isPaid ? 'bg-emerald-100' : 'bg-amber-100'
            }`}>
            <Text
              className={`text-xs font-bold ${
                isPaid ? 'text-emerald-800' : 'text-amber-800'
              }`}>
              {transaction.status || 'Pending'}
            </Text>
          </View>

          <View className="h-px bg-slate-100 my-2" />

          <View className="flex-row justify-between py-1.5">
            <Text className="text-xs sm:text-[13px] text-slate-600">Gross Service Amount</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{transaction.grossAmount?.toLocaleString() || '1,500'}
            </Text>
          </View>

          <View className="flex-row justify-between py-1.5">
            <Text className="text-xs sm:text-[13px] text-slate-600">Platform Commission (20%)</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-red-600">
              - ₹{transaction.platformCommission?.toLocaleString() || '300'}
            </Text>
          </View>

          <View className="flex-row justify-between pt-3 mt-1 border-t border-slate-100">
            <Text className="text-xs sm:text-sm font-bold text-brand-green">Net Partner Earnings</Text>
            <Text className="text-sm sm:text-base font-extrabold text-brand-green">
              ₹{transaction.netEarnings?.toLocaleString() || '1,200'}
            </Text>
          </View>
        </View>

        {/* Completion & Customer Details Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Completed on</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              {transaction.completedOn || '10 Oct 2026 • 11:15 AM'}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Customer</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              {transaction.customer || 'Ananya Sharma'}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Service area</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              {transaction.serviceArea || 'Koramangala, Bengaluru'}
            </Text>
          </View>

          <View className="flex-row justify-between pt-2">
            <Text className="text-xs sm:text-[13px] text-slate-500">Payment method</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              {transaction.paymentMethod || 'Bank transfer'}
            </Text>
          </View>
        </View>

        {/* Payout Account Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-2">Payout account</Text>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Account holder</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              {transaction.accountHolder || 'Kumar'}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Bank</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              {transaction.bank || 'HDFC Bank •••• 9012'}
            </Text>
          </View>

          <View className="flex-row justify-between pt-2">
            <Text className="text-xs sm:text-[13px] text-slate-500">Expected settlement</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              {transaction.expectedSettlement || '12 Oct 2026'}
            </Text>
          </View>
        </View>

        {/* Info Banner */}
        <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
          <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text className="text-xs text-brand-green flex-1">
            ₹{transaction.netEarnings?.toLocaleString() || '1,200'} is pending settlement. Your payment status will update once transferred.
          </Text>
        </View>
      </ScrollView>
      </View>

      {/* Bottom Action Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity
          className="bg-brand-green w-full h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Earnings')}>
          <Text className="text-white text-[15px] font-bold">Back to Earnings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TransactionDetailsScreen;
