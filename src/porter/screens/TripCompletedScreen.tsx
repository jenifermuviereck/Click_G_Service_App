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

const TripCompletedScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100 bg-white">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-slate-900">Trip completed</Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingVertical: 28, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}>
        
        {/* Success Icon Circle */}
        <View className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 items-center justify-center mb-5">
          <Icon name="check" size={42} color="#07522C" />
        </View>

        {/* Title & Subtitle */}
        <Text className="text-2xl font-black text-slate-900 text-center mb-2">
          Delivery completed successfully
        </Text>
        <Text className="text-sm text-slate-500 text-center mb-6">
          Great work, Kumar. Every package delivered.
        </Text>

        {/* Booking Settlement Card */}
        <View className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-base font-extrabold text-slate-900 mb-4 pb-3 border-b border-slate-200">
            Booking PT1025
          </Text>

          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="text-xs font-semibold text-slate-500">Total pickups</Text>
            <Text className="text-xs font-bold text-slate-800">3</Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="text-xs font-semibold text-slate-500">Delivered packages</Text>
            <Text className="text-xs font-bold text-slate-800">17</Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="text-xs font-semibold text-slate-500">Final destination</Text>
            <Text className="text-xs font-bold text-slate-800">Customer D</Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
            <Text className="text-xs font-semibold text-slate-500">Trip distance</Text>
            <Text className="text-xs font-bold text-slate-800">18.6 km</Text>
          </View>

          <View className="flex-row justify-between items-center py-2">
            <Text className="text-xs font-semibold text-slate-500">Completed at</Text>
            <Text className="text-xs font-bold text-slate-800">3:42 PM · 17 Nov 2026</Text>
          </View>
        </View>

        {/* Trip Earnings Dark Green Card */}
        <View className="w-full bg-[#07522C] rounded-2xl p-5 mb-8 shadow-sm">
          <Text className="text-[11px] font-bold text-emerald-200/90 uppercase tracking-wider mb-1">
            TRIP EARNINGS
          </Text>
          <Text className="text-3xl font-black text-white">
            ₹650
          </Text>
        </View>

      </ScrollView>

      {/* Bottom Sticky Action */}
      <View className="px-5 py-3 border-t border-slate-100 bg-white">
        <Text className="text-[11px] text-slate-400 text-center mb-2 font-medium">
          PT1025 · All goods delivered and verified
        </Text>
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Home')}>
          <Text className="text-white font-bold text-base">Back to home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TripCompletedScreen;
