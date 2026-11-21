import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 03 - Trip Request Details
 * Shows:
 *  - Full route breakdown with exact street addresses
 *  - Pickups in assigned order notice
 *  - Accept trip CTA
 */
const TripRequestDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const detailedStops = [
    {
      num: '1',
      title: 'Shop A',
      address: '12, Ritchie Street, Mount Road,\nChennai 600002',
      items: 'Electronics · 5 packages',
      isDrop: false,
    },
    {
      num: '2',
      title: 'Shop B',
      address: '48, Royapettah High Road,\nChennai 600014',
      items: 'Furniture · 2 packages',
      isDrop: false,
    },
    {
      num: '3',
      title: 'Warehouse C',
      address: '6, SIDCO Industrial Estate, Guindy,\nChennai 600032',
      items: 'Hardware · 10 boxes',
      isDrop: false,
    },
    {
      num: '4',
      title: 'Customer D',
      address: '24, South Usman Road, T. Nagar,\nChennai 600017',
      items: 'Final drop · All 17 packages',
      isDrop: true,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">Trip details</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-extrabold text-slate-900 leading-tight">
          Your route at a glance
        </Text>
        <Text className="text-xs font-medium text-slate-500 mt-1">
          PT1025 · 17 packages · Tata Ace
        </Text>

        {/* Route Card with Full Addresses */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <View className="relative">
            {detailedStops.map((stop, idx) => (
              <View key={stop.num} className="flex-row items-start mb-5 relative">
                {/* Connecting Line */}
                {idx < detailedStops.length - 1 && (
                  <View className="absolute left-3.5 top-7 w-[2px] h-16 bg-emerald-200" />
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
                  <Text className="text-sm font-bold text-slate-900">{stop.title}</Text>
                  <Text className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {stop.address}
                  </Text>
                  <Text
                    className={`text-xs font-semibold mt-1 ${
                      stop.isDrop ? 'text-emerald-700 font-bold' : 'text-emerald-800'
                    }`}>
                    {stop.items}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notice text */}
        <Text className="text-xs text-slate-400 text-center mt-3">
          Pickups are completed in the assigned order.
        </Text>

        <View className="h-24" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          18.6 km · Estimated earnings ₹650
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

export default TripRequestDetailsScreen;
