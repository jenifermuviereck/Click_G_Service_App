import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

const DeliveryNavigationScreen = () => {
  const navigation = useNavigation<any>();
  const [arrived, setArrived] = useState(false);

  const customer = {
    name: 'Rajesh Kumar',
    site: 'Anna Nagar Construction Site',
    address: '21/A, Anna Nagar 2nd Main, Near Metro Pillar 140, Bengaluru',
    phone: '+919876543210',
    item: 'Cement Bags (10 bags • 500 kg)',
    notes: 'Please call before unloading gate 2',
  };

  const handleCall = () => {
    Linking.openURL(`tel:${customer.phone}`).catch(() => {
      showNotification(`Calling ${customer.name}...`, 'info');
    });
  };

  const handleOpenMaps = () => {
    const url = `geo:0,0?q=${encodeURIComponent(`${customer.site}, ${customer.address}`)}`;
    showNotification('Opening Google Maps navigation...', 'info');
    Linking.openURL(url).catch(() => {
      showNotification('Google Maps launched', 'info');
    });
  };

  const handleArrived = () => {
    setArrived(true);
    showNotification('Arrived at customer site!', 'success');
    setTimeout(() => {
      navigation.navigate('DeliveryConfirmation');
    }, 400);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-base font-bold text-slate-900">Navigate to Site</Text>
            <Text className="text-[11px] text-slate-500">Order #CG2048</Text>
          </View>
        </View>

        <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
          <Text className="text-xs font-bold text-emerald-800">In Transit</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 sm:px-5"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        
        {/* Map / Route Visualizer Placeholder Card */}
        <View className="bg-emerald-900/90 rounded-2xl p-5 mb-4 shadow-sm overflow-hidden relative">
          {/* Subtle Grid / Route Path Graphic */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-emerald-700 items-center justify-center mr-2.5">
                <Icon name="navigation" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-xs font-semibold text-emerald-200 uppercase">Live Route</Text>
                <Text className="text-sm font-bold text-white">Speed 38 km/h</Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-600 flex-row items-center"
              activeOpacity={0.8}
              onPress={handleOpenMaps}>
              <Icon name="google-maps" size={16} color="#A7F3D0" style={{ marginRight: 4 }} />
              <Text className="text-xs font-bold text-emerald-100">Open Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Large Distance & ETA banner */}
          <View className="flex-row items-center justify-between bg-emerald-950/60 rounded-xl p-3.5 border border-emerald-700/50">
            <View className="flex-row items-center">
              <Icon name="map-marker-distance" size={24} color="#6EE7B7" style={{ marginRight: 10 }} />
              <View>
                <Text className="text-[11px] text-emerald-300">Remaining Distance</Text>
                <Text className="text-xl font-black text-white">4.5 km</Text>
              </View>
            </View>

            <View className="h-8 w-px bg-emerald-700/50" />

            <View className="flex-row items-center">
              <Icon name="clock-outline" size={24} color="#6EE7B7" style={{ marginRight: 10 }} />
              <View>
                <Text className="text-[11px] text-emerald-300">Estimated Arrival</Text>
                <Text className="text-xl font-black text-white">18 min</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer & Destination Card */}
        <View className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Destination Drop-off
              </Text>
              <Text className="text-base font-bold text-slate-900 mt-0.5">
                {customer.site}
              </Text>
              <Text className="text-xs font-semibold text-slate-700 mt-0.5">
                Contact: {customer.name}
              </Text>
            </View>

            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center"
              activeOpacity={0.7}
              onPress={handleCall}>
              <Icon name="phone" size={20} color="#07522C" />
            </TouchableOpacity>
          </View>

          {/* Full Address */}
          <View className="flex-row items-start bg-slate-50 border border-slate-100 rounded-xl p-3 mb-3">
            <Icon name="map-marker" size={16} color="#07522C" style={{ marginRight: 6, marginTop: 1 }} />
            <Text className="text-xs text-slate-600 flex-1 leading-relaxed">
              {customer.address}
            </Text>
          </View>

          {/* Delivery Item Note */}
          <View className="flex-row items-center bg-[#EDF6EF] border border-[#D1EAD9] rounded-xl p-3">
            <Icon name="package-variant" size={16} color="#07522C" style={{ marginRight: 8 }} />
            <View className="flex-1">
              <Text className="text-xs font-bold text-brand-green">{customer.item}</Text>
              <Text className="text-[11px] text-slate-600 mt-0.5">{customer.notes}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Waypoint Status List */}
        <Text className="text-sm font-bold text-slate-900 mb-3">Batch Waypoint Schedule</Text>
        <View className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          {/* Step 1: Warehouse */}
          <View className="flex-row items-start mb-4">
            <View className="w-6 h-6 rounded-full bg-emerald-100 items-center justify-center mr-3">
              <Icon name="check" size={14} color="#07522C" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-slate-900">Cloud Warehouse (Pickup)</Text>
              <Text className="text-[11px] text-emerald-700 font-semibold">Completed at 10:15 AM</Text>
            </View>
          </View>

          {/* Step 2: Anna Nagar (Active) */}
          <View className="flex-row items-start mb-4">
            <View className="w-6 h-6 rounded-full bg-brand-green items-center justify-center mr-3">
              <Icon name="arrow-right" size={14} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-brand-green">
                Stop 02: Anna Nagar Site (Active Delivery)
              </Text>
              <Text className="text-[11px] text-slate-500 font-medium">ETA 10:45 AM • ₹250</Text>
            </View>
          </View>

          {/* Step 3: Indiranagar (Upcoming) */}
          <View className="flex-row items-start">
            <View className="w-6 h-6 rounded-full bg-slate-100 items-center justify-center mr-3 border border-slate-300">
              <Text className="text-[11px] font-bold text-slate-500">3</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-slate-600">
                Stop 03: Indiranagar Site (Next)
              </Text>
              <Text className="text-[11px] text-slate-400">ETA 11:15 AM • ₹350</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Footer */}
      <View className="px-4 py-3 bg-white border-t border-slate-100 shadow-md">
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center flex-row shadow-sm"
          activeOpacity={0.85}
          onPress={handleArrived}>
          <Text className="text-white font-bold text-base mr-2">Arrived at Site</Text>
          <Icon name="map-marker-check" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryNavigationScreen;
