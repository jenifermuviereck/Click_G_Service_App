import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 02 - New Trip Request
 * Shows:
 *  - Estimated earnings card (₹650, 18.6 km total)
 *  - 3 pickups • 1 drop route overview
 *  - 17 packages link
 *  - Vehicle model
 *  - Reject / Accept trip CTAs
 */
const TripRequestScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const stops = [
    { num: '1', title: 'Shop A', desc: 'Electronics · 5 packages', isDrop: false },
    { num: '2', title: 'Shop B', desc: 'Furniture · 2 packages', isDrop: false },
    { num: '3', title: 'Warehouse C', desc: 'Hardware · 10 boxes', isDrop: false },
    { num: '4', title: 'Customer D', desc: 'Final destination · T. Nagar', isDrop: true },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">Trip request</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-extrabold text-slate-900 leading-tight">
          A new trip,{' \n'}ready for you.
        </Text>

        {/* Estimated Earnings Card */}
        <View className="mt-4 bg-[#07522C] rounded-2xl p-4 flex-row items-center justify-between shadow-sm">
          <View>
            <Text className="text-xs font-medium text-emerald-200">Estimated earnings</Text>
            <Text className="text-3xl font-extrabold text-white mt-1">₹650</Text>
          </View>
          <View className="bg-emerald-900/60 px-3 py-1.5 rounded-full border border-emerald-700/50">
            <Text className="text-xs font-semibold text-emerald-100">18.6 km total</Text>
          </View>
        </View>

        {/* Route Preview Card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-base font-bold text-slate-900 mb-3">3 pickups · 1 drop</Text>

          {/* Stepper */}
          <View className="relative">
            {stops.map((stop, idx) => (
              <View key={stop.num} className="flex-row items-start mb-4 relative">
                {/* Connecting Line */}
                {idx < stops.length - 1 && (
                  <View className="absolute left-3.5 top-7 w-[2px] h-9 bg-emerald-200" />
                )}

                {/* Badge Number */}
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center mr-3 z-10 ${
                    stop.isDrop ? 'bg-slate-900' : 'bg-emerald-50 border border-emerald-300'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      stop.isDrop ? 'text-white' : 'text-emerald-800'
                    }`}>
                    {stop.num}
                  </Text>
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-800">{stop.title}</Text>
                  <Text className="text-xs text-slate-500 mt-0.5">{stop.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* View Trip Details Link */}
          <TouchableOpacity
            className="mt-1 pt-3 border-t border-slate-100 flex-row items-center justify-between"
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TripRequestDetails')}>
            <Text className="text-xs font-bold text-emerald-800">
              17 packages · View trip details
            </Text>
            <Icon name="chevron-right" size={18} color="#07522C" />
          </TouchableOpacity>
        </View>

        {/* Vehicle Info */}
        <View className="mt-4 items-center">
          <Text className="text-xs font-medium text-slate-500">Tata Ace · TN 09 BK 4721</Text>
        </View>

        {/* Reject Link */}
        <TouchableOpacity
          className="mt-3 py-2 items-center"
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Text className="text-sm font-semibold text-red-500">Reject trip</Text>
        </TouchableOpacity>

        <View className="h-24" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · One booking, one delivery
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('TripAccepted')}>
          <Text className="text-base font-bold text-white tracking-wide">Accept trip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TripRequestScreen;
