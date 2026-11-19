import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

interface StopItem {
  id: string;
  stopNumber: string;
  name: string;
  address: string;
  phone: string;
  items: string;
  pickedUp: boolean;
}

const PickupStopsScreen = () => {
  const navigation = useNavigation<any>();

  const [stops, setStops] = useState<StopItem[]>([
    {
      id: '1',
      stopNumber: '01',
      name: 'Cloud Warehouse',
      address: 'Plot 12, Industrial Area, 2nd Main Rd',
      phone: '+919876543210',
      items: 'Cement Bags (10 bags • 500 kg)',
      pickedUp: true,
    },
    {
      id: '2',
      stopNumber: '02',
      name: 'Asian Paints Store',
      address: '104, 12th Cross, Indiranagar, Bengaluru',
      phone: '+919876543211',
      items: 'Interior Paint (8 buckets • 160 L)',
      pickedUp: false,
    },
    {
      id: '3',
      stopNumber: '03',
      name: 'Berger Paints Store',
      address: '42, 80 Feet Rd, Koramangala 4th Block',
      phone: '+919876543212',
      items: 'Primer & Wall Emulsion (6 buckets)',
      pickedUp: false,
    },
  ]);

  const handleCall = (phone: string, name: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      showNotification(`Calling ${name} at ${phone}`, 'info');
    });
  };

  const handleNavigate = (name: string, address: string) => {
    showNotification(`Opening Maps navigation to ${name}...`, 'info');
    const url = `geo:0,0?q=${encodeURIComponent(`${name}, ${address}`)}`;
    Linking.openURL(url).catch(() => {
      showNotification(`Navigation target: ${name}`, 'info');
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-slate-900 ml-2">Pickup Stops</Text>
        </View>

        <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
          <Text className="text-xs font-bold text-emerald-800">1 of 3 Picked Up</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 sm:px-5"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        
        {/* Instruction Note */}
        <View className="flex-row items-center bg-[#EDF6EF] border border-[#D1EAD9] rounded-xl p-3 mb-4">
          <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 8 }} />
          <Text className="text-xs text-brand-green font-medium flex-1">
            Pickup items from stores before delivery. Verify each stop with photo and store OTP.
          </Text>
        </View>

        {/* Stops List */}
        {stops.map(stop => (
          <View
            key={stop.id}
            className={`bg-white border rounded-2xl p-4 mb-3.5 shadow-sm ${
              stop.pickedUp ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
            }`}>
            {/* Stop Header */}
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-row items-center">
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center mr-2.5 ${
                    stop.pickedUp ? 'bg-brand-green' : 'bg-slate-200'
                  }`}>
                  <Text
                    className={`text-xs font-bold ${
                      stop.pickedUp ? 'text-white' : 'text-slate-700'
                    }`}>
                    {stop.stopNumber}
                  </Text>
                </View>
                <Text className="text-base font-bold text-slate-900">{stop.name}</Text>
              </View>

              {stop.pickedUp ? (
                <View className="flex-row items-center bg-emerald-100 px-2 py-0.5 rounded-full">
                  <Icon name="check" size={12} color="#07522C" style={{ marginRight: 3 }} />
                  <Text className="text-[10px] font-bold text-emerald-800">Picked Up</Text>
                </View>
              ) : (
                <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-amber-800">Pending</Text>
                </View>
              )}
            </View>

            {/* Address */}
            <View className="flex-row items-center mb-2 pl-9">
              <Icon name="map-marker-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text className="text-xs text-slate-500 flex-1" numberOfLines={1}>
                {stop.address}
              </Text>
            </View>

            {/* Items summary */}
            <View className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3 ml-9">
              <Text className="text-[11px] font-semibold text-slate-500">Items to Collect:</Text>
              <Text className="text-xs font-bold text-slate-800 mt-0.5">{stop.items}</Text>
            </View>

            {/* Action Buttons Row */}
            <View className="flex-row items-center gap-2.5 ml-9">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center bg-slate-100 border border-slate-200 rounded-xl py-2"
                activeOpacity={0.7}
                onPress={() => handleNavigate(stop.name, stop.address)}>
                <Icon name="navigation-variant-outline" size={16} color="#07522C" style={{ marginRight: 5 }} />
                <Text className="text-xs font-bold text-slate-700">Navigate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center bg-slate-100 border border-slate-200 rounded-xl py-2"
                activeOpacity={0.7}
                onPress={() => handleCall(stop.phone, stop.name)}>
                <Icon name="phone-outline" size={16} color="#07522C" style={{ marginRight: 5 }} />
                <Text className="text-xs font-bold text-slate-700">Call Shop</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom CTA Button */}
      <View className="px-4 py-3 bg-white border-t border-slate-100 shadow-md">
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center flex-row shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PickupVerification')}>
          <Text className="text-white font-bold text-base mr-2">Pickup Verification</Text>
          <Icon name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PickupStopsScreen;
