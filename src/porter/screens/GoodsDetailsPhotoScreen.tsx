import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

/**
 * Screen 09 - Goods Details & Photo Upload
 * Shows:
 *  - Title: "Check the goods" / "Shop B"
 *  - GOODS CATEGORY card: Furniture, instructions, Expected quantity: 2
 *  - Goods photos (2 sample package thumbnails)
 *  - Camera & Gallery buttons
 *  - Continue to quantity CTA
 */
const GoodsDetailsPhotoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300',
  ]);

  const handleAddPhoto = () => {
    showNotification('Photo captured successfully', 'success');
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
        <Text className="text-base font-semibold text-slate-800">Goods & photos</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">Check the goods</Text>
        <Text className="text-sm font-bold text-emerald-800 mt-0.5">Shop B</Text>

        {/* Goods Category Card */}
        <View className="mt-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            GOODS CATEGORY
          </Text>
          <Text className="text-base font-bold text-slate-900 mt-1">Furniture</Text>
          <Text className="text-xs text-slate-500 mt-1 leading-relaxed">
            2 packed furniture pieces.{'\n'}Keep dry; do not stack.
          </Text>

          <View className="mt-4 pt-3 border-t border-slate-50 flex-row items-center justify-between">
            <Text className="text-xs text-slate-500">Expected quantity</Text>
            <Text className="text-base font-black text-[#07522C]">2</Text>
          </View>
        </View>

        {/* Goods Photos Section */}
        <View className="mt-5">
          <Text className="text-base font-bold text-slate-900">Goods photos</Text>
          <Text className="text-xs text-slate-500 mt-0.5 mb-3">
            Capture packaging and visible condition.
          </Text>

          {/* Photo Thumbnails */}
          <View className="flex-row gap-3">
            {photos.map((uri, idx) => (
              <View
                key={idx}
                className="w-28 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 shadow-sm">
                <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
              </View>
            ))}
          </View>

          {/* Action Buttons: Camera & Gallery */}
          <View className="flex-row gap-3 mt-3.5">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-emerald-50 border border-emerald-200"
              activeOpacity={0.7}
              onPress={handleAddPhoto}>
              <Icon name="camera-outline" size={18} color="#07522C" />
              <Text className="text-xs font-bold text-emerald-900 ml-2">Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-emerald-50 border border-emerald-200"
              activeOpacity={0.7}
              onPress={handleAddPhoto}>
              <Icon name="image-outline" size={18} color="#07522C" />
              <Text className="text-xs font-bold text-emerald-900 ml-2">Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

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
          onPress={() => navigation.navigate('ConfirmQuantity')}>
          <Text className="text-base font-bold text-white tracking-wide">Continue to quantity</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GoodsDetailsPhotoScreen;
