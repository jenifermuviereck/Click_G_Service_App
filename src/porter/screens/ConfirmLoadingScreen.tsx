import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

/**
 * Screen 11 - Loading Confirmation
 * Shows:
 *  - "Ready to leave?" / "Confirm everything is safely loaded."
 *  - Shop B card (Furniture · 2 packages, Confirmed quantity: 2)
 *  - Goods photos (truck load thumbnails)
 *  - Safety checkbox
 *  - Confirm loading CTA
 */
const ConfirmLoadingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [checked, setChecked] = useState(true);

  const handleConfirmLoading = () => {
    if (!checked) {
      showNotification('Please confirm all goods are safely loaded', 'error');
      return;
    }
    // Finished all 3 pickups! Moves to Screen 13 (All Pickups Completed)
    navigation.navigate('AllPickupsCompleted');
  };

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
        <Text className="text-base font-semibold text-slate-800">Confirm loading</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">Ready to leave?</Text>
        <Text className="text-xs text-slate-500 mt-1">Confirm everything is safely loaded.</Text>

        {/* Goods Summary Card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-base font-bold text-slate-900">Shop B</Text>
          <Text className="text-xs text-slate-500 mt-0.5">Furniture · 2 packages</Text>

          <View className="mt-4 pt-3 border-t border-slate-50 flex-row items-center justify-between">
            <Text className="text-xs text-slate-500">Confirmed quantity</Text>
            <Text className="text-base font-black text-[#07522C]">2</Text>
          </View>
        </View>

        {/* Goods Photos in Truck */}
        <View className="mt-5">
          <Text className="text-sm font-bold text-slate-800 mb-2.5">Goods photos</Text>
          <View className="flex-row gap-3">
            <View className="w-28 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 shadow-sm">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="w-28 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 shadow-sm">
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Checkbox Card */}
        <TouchableOpacity
          className="mt-6 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-start"
          activeOpacity={0.8}
          onPress={() => setChecked(!checked)}>
          <View
            className={`w-6 h-6 rounded-lg border items-center justify-center mr-3 mt-0.5 ${
              checked ? 'bg-[#07522C] border-[#07522C]' : 'bg-white border-slate-300'
            }`}>
            {checked && <Icon name="check" size={16} color="#FFFFFF" />}
          </View>
          <Text className="text-xs text-slate-700 font-medium leading-relaxed flex-1">
            I have loaded all goods safely and checked the package count.
          </Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Pickup 2 of 3 · 1 completed
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={handleConfirmLoading}>
          <Text className="text-base font-bold text-white tracking-wide">Confirm loading</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmLoadingScreen;
