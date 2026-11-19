import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

const DeliveryRequestScreen = () => {
  const navigation = useNavigation<any>();
  const [isAccepted, setIsAccepted] = useState(false);

  const deliveries = [
    {
      id: 'DEL-01',
      title: 'Cement Bags',
      subtitle: '10 bags • 500 kg',
      site: 'Anna Nagar Construction Site',
      address: '21/A, Anna Nagar 2nd Main, Bengaluru',
      amount: '₹250',
      eta: '20 mins',
      distance: '4.5 km',
      icon: 'sack',
    },
    {
      id: 'DEL-02',
      title: 'Asian Paints - 8 buckets',
      subtitle: 'Premium Emulsion White',
      site: 'Indiranagar Residential Site',
      address: '104, 12th Cross, Indiranagar',
      amount: '₹350',
      eta: '30 mins',
      distance: '6.2 km',
      icon: 'format-paint',
    },
    {
      id: 'DEL-03',
      title: 'Interior Paint - 15 buckets',
      subtitle: 'Royal Luxury Primer & Paint',
      site: 'Koramangala Commercial Site',
      address: '42, 80 Feet Rd, 4th Block, Koramangala',
      amount: '₹650',
      eta: '45 mins',
      distance: '7.5 km',
      icon: 'palette-outline',
    },
  ];

  const handleAccept = () => {
    setIsAccepted(true);
    showNotification('Batch Delivery #CG2048 Accepted!', 'success');
    // Navigate to Pickup Stops screen
    setTimeout(() => {
      navigation.navigate('PickupStops');
    }, 600);
  };

  const handleReject = () => {
    showNotification('Order rejected', 'info');
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-slate-900 ml-2">Delivery Request</Text>
        </View>

        <TouchableOpacity className="p-2" activeOpacity={0.7}>
          <Icon name="bell-outline" size={22} color="#475467" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 sm:px-5"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        
        {/* Order Header Card */}
        <View className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Text className="text-lg font-black text-slate-900 tracking-tight mr-2">#CG2048</Text>
              <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-[11px] font-bold text-emerald-800">New Request</Text>
              </View>
            </View>

            <View className="items-end">
              <Text className="text-xs text-slate-500 font-medium">Total Earnings</Text>
              <Text className="text-xl font-black text-brand-green">₹1,250</Text>
            </View>
          </View>

          {/* Tags */}
          <View className="flex-row items-center gap-2 mt-1">
            <View className="flex-row items-center bg-slate-100 px-2.5 py-1 rounded-lg">
              <Icon name="warehouse" size={14} color="#475467" style={{ marginRight: 4 }} />
              <Text className="text-xs font-semibold text-slate-700">1 Pickup</Text>
            </View>
            <View className="flex-row items-center bg-slate-100 px-2.5 py-1 rounded-lg">
              <Icon name="truck-delivery-outline" size={14} color="#475467" style={{ marginRight: 4 }} />
              <Text className="text-xs font-semibold text-slate-700">3 Deliveries</Text>
            </View>
            <View className="flex-row items-center bg-slate-100 px-2.5 py-1 rounded-lg">
              <Icon name="map-marker-distance" size={14} color="#475467" style={{ marginRight: 4 }} />
              <Text className="text-xs font-semibold text-slate-700">18.2 km</Text>
            </View>
          </View>
        </View>

        {/* Route Preview Graphic Card */}
        <View className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Icon name="navigation-variant" size={18} color="#07522C" style={{ marginRight: 6 }} />
              <Text className="text-xs font-bold text-emerald-900">Estimated Route</Text>
            </View>
            <Text className="text-xs font-extrabold text-brand-green">8.5 km • 35 Minutes</Text>
          </View>

          {/* Visual Route Timeline / Waypoint Steps */}
          <View className="space-y-4">
            {/* Pickup Node */}
            <View className="flex-row items-start">
              <View className="items-center mr-3 mt-0.5">
                <View className="w-6 h-6 rounded-full bg-brand-green items-center justify-center">
                  <Icon name="arrow-up" size={14} color="#FFFFFF" />
                </View>
                <View className="w-0.5 h-10 bg-emerald-300 my-0.5" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Pickup</Text>
                  <Text className="text-[11px] text-slate-500">Stop 01</Text>
                </View>
                <Text className="text-sm font-extrabold text-slate-900">Cloud Warehouse</Text>
                <Text className="text-xs text-slate-500" numberOfLines={1}>
                  Plot 12, Industrial Area, 2nd Main Rd
                </Text>
              </View>
            </View>

            {/* Drop Node */}
            <View className="flex-row items-start">
              <View className="items-center mr-3 mt-0.5">
                <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center">
                  <Icon name="map-marker" size={14} color="#FFFFFF" />
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-bold text-red-600 uppercase tracking-wide">Drop Multi-Destination</Text>
                  <Text className="text-[11px] text-slate-500">Stops 02 - 04</Text>
                </View>
                <Text className="text-sm font-extrabold text-slate-900">Anna Nagar Construction Site</Text>
                <Text className="text-xs text-slate-500" numberOfLines={1}>
                  + 2 other destinations in Bengaluru
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section: Products & Destinations */}
        <Text className="text-sm font-bold text-slate-900 mb-3">Products & Destinations</Text>
        
        {deliveries.map((item, idx) => (
          <View
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-start flex-1 mr-2">
                <View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center mr-3 border border-slate-200">
                  <Icon name={item.icon} size={20} color="#07522C" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900">{item.title}</Text>
                  <Text className="text-xs text-slate-500 mt-0.5">{item.subtitle}</Text>
                  <View className="flex-row items-center mt-2">
                    <Icon name="map-marker-outline" size={14} color="#64748B" style={{ marginRight: 3 }} />
                    <Text className="text-xs font-medium text-slate-700 flex-1" numberOfLines={1}>
                      {item.site}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-sm font-black text-brand-green">{item.amount}</Text>
                <Text className="text-[11px] text-slate-400 mt-0.5">{item.eta}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Action Footer */}
      <View className="px-4 py-3 bg-white border-t border-slate-100 shadow-md">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="w-28 h-12 border border-red-300 rounded-xl items-center justify-center bg-white"
            activeOpacity={0.75}
            onPress={handleReject}>
            <Text className="text-red-600 font-bold text-sm">Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 h-12 bg-brand-green rounded-xl items-center justify-center flex-row shadow-sm"
            activeOpacity={0.85}
            onPress={handleAccept}>
            <Text className="text-white font-bold text-sm mr-1.5">
              Accept All Deliveries
            </Text>
            <Icon name="check" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryRequestScreen;
