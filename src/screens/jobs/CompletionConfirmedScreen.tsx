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

const CompletionConfirmedScreen = () => {
  const insets = useSafeAreaInsets();
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
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Completion confirmed</Text>
      </View>

      <View className="flex-1 bg-slate-50">
        <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6 items-center" showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View className="mb-4 mt-2">
          <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center">
            <Icon name="check" size={32} color="#07522C" />
          </View>
        </View>

        <Text className="text-lg sm:text-xl font-bold text-slate-900 text-center">
          Job Completed Successfully
        </Text>
        <Text className="text-xs sm:text-[13px] text-slate-500 mt-1 mb-5 text-center">
          {job.category} • Booking {job.bookingRef}
        </Text>

        {/* Breakdown Card */}
        <View className="w-full bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Gross Service Amount</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{job.grossAmount?.toLocaleString() || '1,500'}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Platform Commission (20%)</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-red-600">
              - ₹{job.platformCommission?.toLocaleString() || '300'}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">Additional Charges</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{job.additionalCharges?.toLocaleString() || '500'}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-500">GST 18%</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{job.gstAmount?.toLocaleString() || '170'}
            </Text>
          </View>

          <View className="flex-row justify-between py-3 my-1 border-t border-b border-slate-100">
            <Text className="text-xs sm:text-sm font-bold text-brand-green">Net Partner Earnings</Text>
            <Text className="text-sm sm:text-base font-extrabold text-brand-green">
              ₹{job.netEarnings?.toLocaleString() || '1,870'}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-xs text-slate-500">Completed</Text>
            <Text className="text-xs font-semibold text-slate-800">{job.completedAt || 'Today • 11:15 AM'}</Text>
          </View>

          <View className="flex-row justify-between pt-2">
            <Text className="text-xs text-slate-500">Payment status</Text>
            <Text className="text-xs font-bold text-brand-green">Completed</Text>
          </View>
        </View>

        {/* Notice Info Text */}
        <Text className="text-xs text-slate-500 text-center leading-5 px-3">
          Your completion has been submitted. ₹{job.netEarnings?.toLocaleString() || '1,870'} has been
          added to your pending earnings.
        </Text>
      </ScrollView>
      </View>

      {/* Bottom Action Buttons */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="p-4 bg-white border-t border-slate-100 items-center">
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center mb-2.5 shadow-md shadow-brand-green/20"
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Earnings')}>
          <Text className="text-white text-[15px] font-bold">View Earnings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-1.5"
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Home')}>
          <Text className="text-xs sm:text-sm font-semibold text-slate-700">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CompletionConfirmedScreen;
