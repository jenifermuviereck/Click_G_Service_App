import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

const BatchSummaryScreen = () => {
  const navigation = useNavigation<any>();

  const batchList = [
    {
      id: '1',
      site: 'Anna Nagar Construction Site',
      item: 'Cement Bags (10 bags)',
      time: '10:45 AM',
      amount: '₹250',
    },
    {
      id: '2',
      site: 'Indiranagar Residential Site',
      item: 'Asian Paints (8 buckets)',
      time: '11:20 AM',
      amount: '₹350',
    },
    {
      id: '3',
      site: 'Koramangala Commercial Site',
      item: 'Interior Paint (15 buckets)',
      time: '12:05 PM',
      amount: '₹300',
    },
    {
      id: '4',
      site: 'Whitefield Villa Project',
      item: 'Hardware & Ceramic Tiles',
      time: '12:50 PM',
      amount: '₹350',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} className="p-2 -ml-2">
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-slate-900 ml-2">Batch Summary</Text>
      </View>

      <ScrollView
        className="flex-1 px-4 sm:px-5"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        
        {/* Celebration Banner Card */}
        <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-5 items-center">
          <View className="w-14 h-14 rounded-full bg-brand-green items-center justify-center mb-3">
            <Icon name="check-all" size={30} color="#FFFFFF" />
          </View>
          <Text className="text-xl font-black text-emerald-950 text-center">
            All Deliveries Completed! 🎉
          </Text>
          <Text className="text-xs text-emerald-700 text-center mt-1">
            Batch #CG2048 completed in 2 hrs 15 mins
          </Text>

          {/* 3 Metric Pills */}
          <View className="flex-row items-center justify-around w-full mt-4 pt-3 border-t border-emerald-200/80">
            <View className="items-center">
              <Text className="text-[11px] font-semibold text-emerald-800">Delivered</Text>
              <Text className="text-base font-black text-emerald-950">4 / 4</Text>
            </View>
            <View className="h-6 w-px bg-emerald-300" />
            <View className="items-center">
              <Text className="text-[11px] font-semibold text-emerald-800">Distance</Text>
              <Text className="text-base font-black text-emerald-950">18.2 km</Text>
            </View>
            <View className="h-6 w-px bg-emerald-300" />
            <View className="items-center">
              <Text className="text-[11px] font-semibold text-emerald-800">Total Payout</Text>
              <Text className="text-base font-black text-brand-green">₹1,250</Text>
            </View>
          </View>
        </View>

        {/* Deliveries Breakdown */}
        <Text className="text-sm font-bold text-slate-900 mb-3">Delivered Shipments</Text>
        {batchList.map((item, index) => (
          <View
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-3.5 mb-2.5 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center mr-3">
                <Text className="text-xs font-bold text-brand-green">{index + 1}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-900" numberOfLines={1}>
                  {item.site}
                </Text>
                <Text className="text-[11px] text-slate-500 mt-0.5">{item.item}</Text>
                <Text className="text-[10px] text-slate-400 mt-0.5">Delivered at {item.time}</Text>
              </View>
            </View>

            <View className="items-end">
              <Text className="text-sm font-black text-brand-green">{item.amount}</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="check-circle" size={12} color="#07522C" style={{ marginRight: 2 }} />
                <Text className="text-[10px] font-bold text-emerald-700">Done</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Payout & Settlement Note */}
        <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3">
          <View className="flex-row items-center justify-between pb-2 border-b border-slate-200">
            <Text className="text-xs text-slate-500">Settlement Method</Text>
            <Text className="text-xs font-bold text-slate-800">Direct Bank Transfer</Text>
          </View>
          <View className="flex-row items-center justify-between py-2 border-b border-slate-200">
            <Text className="text-xs text-slate-500">Account</Text>
            <Text className="text-xs font-semibold text-slate-700">HDFC Bank ••••1234</Text>
          </View>
          <View className="flex-row items-center justify-between pt-2">
            <Text className="text-xs text-slate-500">Batch Reference</Text>
            <Text className="text-xs font-mono font-bold text-slate-800">#CG2048-BATCH</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="px-4 py-3 bg-white border-t border-slate-100 shadow-md">
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MainTabs')}>
          <Text className="text-white font-bold text-base">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BatchSummaryScreen;
