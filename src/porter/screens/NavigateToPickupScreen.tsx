import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

/**
 * Screen 07 - Navigation & Arrival
 * Shows:
 *  - Floating navigation badge: "2.4 km · 8 min away"
 *  - Styled Street Map with route line and destination marker
 *  - Floating bottom location card with Navigate & Call actions
 *  - Arrived at pickup CTA
 */
const NavigateToPickupScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const openGoogleMaps = () => {
    Linking.openURL('https://maps.google.com/?q=48,Royapettah+High+Road,Chennai').catch(() => {});
  };

  const handleCall = () => {
    Linking.openURL('tel:+919841034567').catch(() => {});
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
        <Text className="text-base font-semibold text-slate-800">Navigate to pickup</Text>
      </View>

      <View className="flex-1 bg-slate-100 relative overflow-hidden">
        {/* Styled Vector Map Canvas */}
        <View className="absolute inset-0 bg-[#E8ECE9]">
          {/* Street blocks */}
          <View className="absolute top-10 left-6 w-28 h-28 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-10 left-40 w-36 h-28 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-10 right-4 w-16 h-28 bg-[#DDE3DE] rounded-lg" />

          <View className="absolute top-48 left-6 w-28 h-36 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-48 left-40 w-36 h-36 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-48 right-4 w-16 h-36 bg-[#DDE3DE] rounded-lg" />

          <View className="absolute top-96 left-6 w-28 h-40 bg-[#DDE3DE] rounded-lg" />
          <View className="absolute top-96 left-40 w-36 h-40 bg-[#DDE3DE] rounded-lg" />

          {/* Road labels */}
          <Text className="absolute top-44 left-10 text-[10px] font-bold text-slate-400 tracking-wider">
            Gopalapuram
          </Text>
          <Text className="absolute top-44 left-48 text-[11px] font-black text-slate-500 tracking-widest">
            ROYAPETTAH
          </Text>

          {/* Route Polyline (Visual styled vector segments) */}
          {/* Segment 1: Start point */}
          <View className="absolute top-[280px] left-[70px] w-4 h-4 rounded-full bg-[#07522C] border-2 border-white shadow-md z-10" />

          {/* Segment 2: Angled upward route */}
          <View className="absolute top-[200px] left-[84px] w-28 h-1 bg-[#07522C] -rotate-45" />

          {/* Segment 3: Horizontal street */}
          <View className="absolute top-[170px] left-[150px] w-36 h-1 bg-[#07522C]" />

          {/* Segment 4: Vertical road to destination */}
          <View className="absolute top-[100px] left-[290px] w-1 h-18 bg-[#07522C]" />

          {/* Destination Pin */}
          <View className="absolute top-[92px] left-[283px] w-5 h-5 rounded-full bg-[#07522C] border-2 border-white items-center justify-center shadow-lg z-10">
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
                <Text className="text-sm font-black text-slate-900">2.4 km</Text>
                <Text className="text-[11px] font-medium text-slate-400">8 min away</Text>
              </View>
            </View>
            <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Text className="text-xs font-bold text-emerald-900">8 min</Text>
            </View>
          </View>
        </View>

        {/* Bottom Floating Location Card */}
        <View className="absolute bottom-4 left-4 right-4 z-20">
          <View className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
            <Text className="text-[10px] font-extrabold tracking-wider text-emerald-800 uppercase">
              PICKUP 2 OF 3
            </Text>
            <Text className="text-base font-black text-slate-900 mt-0.5">Shop B</Text>
            <Text className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              48, Royapettah High Road, Chennai, Tamil Nadu 600014
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
          PT1025 · Pickup 2 of 3 · 1 completed
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('VerifyPickup')}>
          <Text className="text-base font-bold text-white tracking-wide">Arrived at pickup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateToPickupScreen;
