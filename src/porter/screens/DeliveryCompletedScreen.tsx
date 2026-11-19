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

const DeliveryCompletedScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}>
        
        {/* Animated / Styled Green Checkmark Circle */}
        <View className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 items-center justify-center mb-5">
          <Icon name="check" size={44} color="#07522C" />
        </View>

        <Text className="text-2xl font-black text-slate-900 text-center mb-1.5">
          Delivery Completed!
        </Text>
        <Text className="text-sm text-slate-500 text-center mb-8 px-6">
          Your delivery has been confirmed successfully. Earnings credited to your wallet.
        </Text>

        {/* Order Details Card */}
        <View className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-200">
            <View className="flex-row items-center">
              <Text className="text-base font-extrabold text-slate-900 mr-2">#CG2048</Text>
              <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-[11px] font-bold text-emerald-800">Delivered</Text>
              </View>
            </View>
            <Text className="text-xs text-slate-400">10:42 AM</Text>
          </View>

          {/* Item details */}
          <View className="flex-row items-center py-3.5 border-b border-slate-200">
            <View className="w-10 h-10 rounded-xl bg-emerald-100/60 items-center justify-center mr-3">
              <Icon name="sack" size={20} color="#07522C" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-800">Cement Bags</Text>
              <Text className="text-xs text-slate-500">10 Bags (500 kg)</Text>
            </View>
          </View>

          {/* Delivered to */}
          <View className="py-3 border-b border-slate-200">
            <Text className="text-[11px] font-semibold text-slate-400 uppercase">Delivered at</Text>
            <Text className="text-xs font-bold text-slate-800 mt-0.5">
              Anna Nagar Construction Site
            </Text>
            <Text className="text-[11px] text-slate-500 mt-0.5">
              21/A, Anna Nagar 2nd Main Rd • 4.5 km
            </Text>
          </View>

          {/* Earnings display */}
          <View className="flex-row justify-between items-center pt-3.5">
            <Text className="text-sm font-bold text-slate-700">Earnings Credited</Text>
            <Text className="text-2xl font-black text-brand-green">₹250</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-3">
          <TouchableOpacity
            className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-sm"
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BatchSummary')}>
            <Text className="text-white font-bold text-base">View Batch Summary</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full h-12 border border-slate-200 rounded-xl items-center justify-center bg-white"
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MainTabs')}>
            <Text className="text-slate-700 font-bold text-sm">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeliveryCompletedScreen;
