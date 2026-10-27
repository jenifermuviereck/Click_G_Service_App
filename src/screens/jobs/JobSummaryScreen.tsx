import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Job Summary</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <Text className="text-base sm:text-lg font-bold text-slate-900">{job.title}</Text>
          <Text className="text-xs text-slate-500 mt-0.5 mb-2">Booking {job.bookingRef}</Text>
          <View className="self-start bg-emerald-100 px-2.5 py-0.5 rounded-full mb-3">
            <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">Completed</Text>
          </View>
          <View className="h-px bg-slate-100 mb-2" />
          <View className="flex-row justify-between py-1">
            <Text className="text-xs sm:text-[13px] text-slate-500">Completed on</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-800">{job.completedOn || 'Today • 8:45 AM'}</Text>
          </View>
        </View>

        {/* Customer & Area Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Customer</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-800">{job.customer || 'Rahul Mehta'}</Text>
          </View>

          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Service area</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-800">{job.area || 'Indiranagar, Bengaluru'}</Text>
          </View>

          <Text className="text-xs text-slate-600 leading-5 pt-3">
            {job.description ||
              'Bedroom wall touch-up completed. Work checked and approved by the customer.'}
          </Text>
        </View>

        {/* Financial Breakdown Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Gross Service Amount</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{job.grossAmount?.toLocaleString() || '4,000'}
            </Text>
          </View>

          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Platform Commission (20%)</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-red-600">
              - ₹{job.commission?.toLocaleString() || '800'}
            </Text>
          </View>

          <View className="flex-row justify-between pt-3">
            <Text className="text-xs sm:text-sm font-bold text-brand-green">Net Partner Earnings</Text>
            <Text className="text-sm sm:text-base font-extrabold text-brand-green">
              ₹{job.netEarnings?.toLocaleString() || '3,200'}
            </Text>
          </View>
        </View>

        {/* Payout Details Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Payment status</Text>
            <Text className="text-xs sm:text-[13px] font-bold text-brand-green">{job.paymentStatus || 'Paid'}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Transaction reference</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-800">{job.txRef || 'TX-1039'}</Text>
          </View>

          <View className="flex-row justify-between pt-2">
            <Text className="text-xs sm:text-[13px] text-slate-500">Payout account</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-800">{job.payoutAccount || 'HDFC Bank •••• 9012'}</Text>
          </View>
        </View>

        {/* Success Note Banner */}
        <View className="flex-row items-center bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-2">
          <Icon name="checkbox-marked-circle-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text className="text-xs text-brand-green flex-1">
            Completion photo and service notes submitted successfully.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity
          className="w-full h-12 bg-white border border-slate-300 rounded-xl items-center justify-center shadow-xs"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MyJobs')}>
          <Text className="text-xs sm:text-sm font-semibold text-slate-700">Back to My Jobs</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobSummaryScreen;
