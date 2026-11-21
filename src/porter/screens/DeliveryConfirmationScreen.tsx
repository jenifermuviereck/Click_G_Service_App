import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

/**
 * Screen 17 - Delivery Confirmation
 * Shows:
 *  - "Check. Capture. Confirm."
 *  - Expected: 17 packages | Delivered: [-] 17 packages [+]
 *  - Delivery photo upload
 *  - Delivery condition list (Good condition, Partial delivery, Damaged / Missing)
 *  - Confirm delivery details CTA
 */
const DeliveryConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [deliveredCount, setDeliveredCount] = useState(17);
  const [condition, setCondition] = useState<'good' | 'partial' | 'damaged'>('good');
  const [hasPhoto, setHasPhoto] = useState(true);

  const handleAddPhoto = () => {
    setHasPhoto(true);
    showNotification('Delivery photo captured', 'success');
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
        <Text className="text-base font-semibold text-slate-800">Delivery confirmation</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">
          Check. Capture. Confirm.
        </Text>

        {/* Quantity Check Card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Expected
            </Text>
            <Text className="text-2xl font-black text-slate-900 mt-0.5">17</Text>
            <Text className="text-[10px] text-slate-400">packages</Text>
          </View>

          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
            <TouchableOpacity
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 items-center justify-center shadow-xs"
              activeOpacity={0.7}
              onPress={() => setDeliveredCount(Math.max(1, deliveredCount - 1))}>
              <Icon name="minus" size={18} color="#07522C" />
            </TouchableOpacity>

            <View className="px-3 items-center">
              <Text className="text-lg font-black text-slate-900">{deliveredCount}</Text>
              <Text className="text-[9px] text-slate-400">packages</Text>
            </View>

            <TouchableOpacity
              className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 items-center justify-center shadow-xs"
              activeOpacity={0.7}
              onPress={() => setDeliveredCount(deliveredCount + 1)}>
              <Icon name="plus" size={18} color="#07522C" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Photo Section */}
        <View className="mt-5">
          <Text className="text-sm font-bold text-slate-900 mb-2">Delivery photo</Text>
          <View className="flex-row gap-3">
            {hasPhoto && (
              <View className="w-28 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 shadow-sm">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}

            <TouchableOpacity
              className="w-24 h-24 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 items-center justify-center"
              activeOpacity={0.7}
              onPress={handleAddPhoto}>
              <Icon name="camera-plus-outline" size={24} color="#07522C" />
              <Text className="text-[10px] font-bold text-emerald-900 mt-1">Add photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Condition Section */}
        <View className="mt-5">
          <Text className="text-sm font-bold text-slate-900 mb-2.5">Delivery condition</Text>

          {/* Option 1: Good condition */}
          <TouchableOpacity
            className={`p-3.5 rounded-xl border mb-2.5 flex-row items-center justify-between ${
              condition === 'good'
                ? 'bg-emerald-50/80 border-emerald-300'
                : 'bg-white border-slate-200'
            }`}
            activeOpacity={0.7}
            onPress={() => setCondition('good')}>
            <View className="flex-row items-center">
              <Icon name="check-circle" size={18} color={condition === 'good' ? '#07522C' : '#94A3B8'} />
              <Text className="text-xs font-bold text-emerald-950 ml-2.5">Good condition</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#07522C" />
          </TouchableOpacity>

          {/* Option 2: Report partial delivery */}
          <TouchableOpacity
            className={`p-3.5 rounded-xl border mb-2.5 flex-row items-center justify-between ${
              condition === 'partial'
                ? 'bg-amber-50 border-amber-300'
                : 'bg-white border-slate-200'
            }`}
            activeOpacity={0.7}
            onPress={() => setCondition('partial')}>
            <View className="flex-row items-center">
              <Icon name="alert-circle-outline" size={18} color="#D97706" />
              <Text className="text-xs font-bold text-amber-900 ml-2.5">Report partial delivery</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#D97706" />
          </TouchableOpacity>

          {/* Option 3: Damaged / Missing goods */}
          <TouchableOpacity
            className={`p-3.5 rounded-xl border flex-row items-center justify-between ${
              condition === 'damaged'
                ? 'bg-red-50 border-red-300'
                : 'bg-white border-slate-200'
            }`}
            activeOpacity={0.7}
            onPress={() => setCondition('damaged')}>
            <View className="flex-row items-center">
              <Icon name="close-circle-outline" size={18} color="#EF4444" />
              <Text className="text-xs font-bold text-red-700 ml-2.5">Damaged / Missing goods</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Verify goods before receiver OTP
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={() => navigation.navigate('VerifyReceiver')}>
          <Text className="text-base font-bold text-white tracking-wide">
            Confirm delivery details
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryConfirmationScreen;
