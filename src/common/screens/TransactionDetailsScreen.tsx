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

  const rawTx = route?.params?.transaction;

  if (!rawTx) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
        <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-1.5 -ml-1 mr-3"
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
          <Text className="text-lg sm:text-xl font-bold text-slate-900">Transaction Details</Text>
        </View>
        <View className="flex-1 items-center justify-center p-6 bg-slate-50">
          <Text className="text-base font-bold text-slate-800 mb-1">No Transaction Found</Text>
          <Text className="text-xs text-slate-500 text-center mb-4">No transaction details were passed.</Text>
          <TouchableOpacity
            className="bg-brand-green px-5 py-2.5 rounded-xl shadow-sm"
            onPress={() => navigation.goBack()}>
            <Text className="text-white text-xs sm:text-sm font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const transaction = {
    id: rawTx.id || 'tx-1',
    title: rawTx.title || 'Service Payment',
    bookingRef: rawTx.bookingRef || 'CG-TX',
    txRef: rawTx.id ? `TX-${rawTx.id.slice(-6).toUpperCase()}` : 'TX-REF',
    status: rawTx.status || 'Paid',
    grossAmount: rawTx.grossAmount || (rawTx.amount ? Math.round(rawTx.amount * 1.25) : 0),
    platformCommission: rawTx.platformCommission || (rawTx.amount ? Math.round(rawTx.amount * 0.25) : 0),
    netEarnings: rawTx.amount || 0,
    completedOn: rawTx.dateStr ? `${rawTx.dateStr} • ${rawTx.timeStr || ''}` : 'Recently',
    customer: rawTx.customer || 'Customer',
    serviceArea: rawTx.serviceArea || 'Assigned Area',
    paymentMethod: rawTx.paymentMethod || 'Direct Payout',
    accountHolder: rawTx.accountHolder || 'Account Holder',
    bank: rawTx.bank || 'Verified Bank Account',
    expectedSettlement: rawTx.dateStr || 'Settled',
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
              {transaction.title}
            </Text>
            <Text className="text-xs text-slate-500 mb-2.5">
              Booking {transaction.bookingRef} • Transaction {transaction.txRef}
            </Text>

            <View className="flex-row justify-between items-center pt-2 mb-3 border-t border-slate-100">
              <View>
                <Text className="text-xs text-slate-500">Net Partner Earnings</Text>
                <Text className="text-xl sm:text-2xl font-extrabold text-brand-green">
                  ₹{transaction.netEarnings.toLocaleString()}
                </Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full ${isPaid ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                <Text className={`text-xs font-bold ${isPaid ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {transaction.status}
                </Text>
              </View>
            </View>

            <Text className="text-[11px] text-slate-400">
              {isPaid ? 'Credited to partner payout balance' : 'In review for payout processing'}
            </Text>
          </View>

          {/* Earnings Breakdown Card */}
          <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
            <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3">Earnings breakdown</Text>

            <View className="flex-row justify-between py-1.5 border-b border-slate-100">
              <Text className="text-xs sm:text-[13px] text-slate-600">Gross service value</Text>
              <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
                ₹{transaction.grossAmount.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row justify-between py-1.5 border-b border-slate-100">
              <Text className="text-xs sm:text-[13px] text-slate-600">Platform commission</Text>
              <Text className="text-xs sm:text-[13px] font-semibold text-red-600">
                - ₹{transaction.platformCommission.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row justify-between pt-2.5">
              <Text className="text-xs sm:text-[13px] font-bold text-slate-900">Net payout</Text>
              <Text className="text-sm sm:text-base font-extrabold text-brand-green">
                ₹{transaction.netEarnings.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Service Details Card */}
          <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
            <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3">Service details</Text>

            <View className="flex-row justify-between py-1.5 border-b border-slate-100">
              <Text className="text-xs text-slate-500">Completed on</Text>
              <Text className="text-xs font-semibold text-slate-800">{transaction.completedOn}</Text>
            </View>

            <View className="flex-row justify-between py-1.5 border-b border-slate-100">
              <Text className="text-xs text-slate-500">Customer</Text>
              <Text className="text-xs font-semibold text-slate-800">
                {transaction.customer}
              </Text>
            </View>

            <View className="flex-row justify-between py-1.5">
              <Text className="text-xs text-slate-500">Service area</Text>
              <Text className="text-xs font-semibold text-slate-800">
                {transaction.serviceArea}
              </Text>
            </View>
          </View>

          {/* Payment Method Card */}
          <View className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3">Payout destination</Text>

            <View className="flex-row justify-between py-1.5 border-b border-slate-100">
              <Text className="text-xs text-slate-500">Method</Text>
              <Text className="text-xs font-semibold text-slate-800">{transaction.paymentMethod}</Text>
            </View>

            <View className="flex-row justify-between py-1.5 border-b border-slate-100">
              <Text className="text-xs text-slate-500">Account</Text>
              <Text className="text-xs font-semibold text-slate-800">
                {transaction.bank}
              </Text>
            </View>

            <View className="flex-row justify-between pt-1.5">
              <Text className="text-xs text-slate-500">Status</Text>
              <Text className={`text-xs font-bold ${isPaid ? 'text-brand-green' : 'text-amber-700'}`}>
                {isPaid ? 'Settled to Bank' : `Estimated settlement: ${transaction.expectedSettlement}`}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Done Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity
          className="bg-brand-green w-full h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
          activeOpacity={0.88}
          onPress={() => navigation.goBack()}>
          <Text className="text-white text-[15px] font-bold">Back to Earnings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TransactionDetailsScreen;
