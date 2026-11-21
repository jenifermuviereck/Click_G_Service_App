import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 15 - Navigation to Customer
 * Shows:
 *  - Floating pill: 4.8 km · 14 min away
 *  - Styled Vector Map to Usman Road, T. Nagar
 *  - Bottom floating final destination card (Dinesh Kumar, Navigate & Call)
 *  - Arrived at destination CTA
 */
const NavigateToCustomerScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const openGoogleMaps = () => {
    Linking.openURL('https://maps.google.com/?q=24,South+Usman+Road,T.+Nagar,Chennai').catch(() => {});
  };

  const handleCall = () => {
    Linking.openURL('tel:+919841067234').catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100 bg-white z-20">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">Navigate to customer</Text>
      </View>

      <View className="flex-1 bg-slate-100 relative overflow-hidden">
        {/* Styled Vector Map Canvas */}
        <View className="absolute inset-0 bg-[#E8ECE9]">
          {/* Street blocks */}
          <View className="absolute top-8 left-5 w-28 h-32 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-8 left-38 w-36 h-32 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-8 right-4 w-16 h-32 bg-[#DDE3DE] rounded-lg" />

          <View className="absolute top-48 left-5 w-28 h-36 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-48 left-38 w-36 h-36 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-48 right-4 w-16 h-36 bg-[#DDE3DE] rounded-lg" />

          {/* Road labels */}
          <Text className="absolute top-44 left-8 text-[10px] font-bold text-slate-400 tracking-wider">
            Usman Road
          </Text>
          <Text className="absolute top-44 left-44 text-[11px] font-black text-slate-500 tracking-widest">
            T. NAGAR
          </Text>

          {/* Route Polyline (Green line to customer) */}
          <View className="absolute top-[320px] left-[50px] w-4 h-4 rounded-full bg-[#07522C] border-2 border-white shadow-md z-10" />
          <View className="absolute top-[230px] left-[64px] w-36 h-1 bg-[#07522C] -rotate-45" />
          <View className="absolute top-[170px] left-[135px] w-32 h-1 bg-[#07522C]" />
          <View className="absolute top-[110px] left-[260px] w-1 h-16 bg-[#07522C]" />

          {/* Destination Pin */}
          <View className="absolute top-[100px] left-[253px] w-5 h-5 rounded-full bg-[#07522C] border-2 border-white items-center justify-center shadow-lg z-10">
            <View className="w-1.5 h-1.5 rounded-full bg-white" />
          </View>
        </View>

        {/* Top Floating Pill */}
        <View className="absolute top-4 left-4 right-4 z-20">
          <View className="bg-white rounded-2xl p-3.5 shadow-md border border-slate-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-2.5">
                <Icon name="navigation" size={18} color="#07522C" />
              </View>
              <View>
                <Text className="text-sm font-black text-slate-900">4.8 km</Text>
                <Text className="text-[11px] font-medium text-slate-400">14 min away</Text>
              </View>
            </View>
            <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Text className="text-xs font-bold text-emerald-900">14 min</Text>
            </View>
          </View>
        </View>

        {/* Bottom Floating Location Card */}
        <View className="absolute bottom-4 left-4 right-4 z-20">
          <View className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
            <Text className="text-[10px] font-extrabold tracking-wider text-emerald-800 uppercase">
              FINAL DESTINATION
            </Text>
            <Text className="text-base font-black text-slate-900 mt-0.5">
              Customer D · Dinesh Kumar
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              24, South Usman Road, T. Nagar, Chennai, Tamil Nadu 600017
            </Text>

            {/* Actions */}
            <View className="flex-row gap-3 mt-3.5">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-emerald-50 border border-emerald-200"
                activeOpacity={0.7}
                onPress={openGoogleMaps}>
                <Icon name="navigation-variant" size={16} color="#07522C" />
                <Text className="text-xs font-bold text-emerald-900 ml-1.5">Navigate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-emerald-50 border border-emerald-200"
                activeOpacity={0.7}
                onPress={handleCall}>
                <Icon name="phone" size={16} color="#07522C" />
                <Text className="text-xs font-bold text-emerald-900 ml-1.5">Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Delivery · 17 packages
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DeliveryGoodsSummary')}>
          <Text className="text-base font-bold text-white tracking-wide">
            Arrived at destination
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateToCustomerScreen;
