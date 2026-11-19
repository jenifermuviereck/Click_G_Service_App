import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../../components/Icon';

export interface PhotoProofSlot {
  key: string;
  title: string;
  activeTitle?: string;
  icon?: string;
  isAdded: boolean;
  onToggle: () => void;
}

interface PhotoProofSectionProps {
  heading?: string;
  slots: PhotoProofSlot[];
}

const PhotoProofSection: React.FC<PhotoProofSectionProps> = ({
  heading = 'Proof of Work / Delivery',
  slots,
}) => {
  return (
    <View className="mb-5">
      {heading ? (
        <Text className="text-sm font-bold text-slate-900 mb-3">{heading}</Text>
      ) : null}

      <View className="flex-row gap-3">
        {slots.map(slot => (
          <TouchableOpacity
            key={slot.key}
            className={`flex-1 border rounded-2xl p-4 items-center justify-center ${
              slot.isAdded
                ? 'border-emerald-300 bg-emerald-50/40'
                : 'border-dashed border-slate-300 bg-slate-50'
            }`}
            activeOpacity={0.8}
            onPress={slot.onToggle}>
            <View
              className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                slot.isAdded ? 'bg-brand-green' : 'bg-slate-200'
              }`}>
              <Icon
                name={slot.isAdded ? 'check' : slot.icon || 'camera-outline'}
                size={22}
                color={slot.isAdded ? '#FFFFFF' : '#475467'}
              />
            </View>
            <Text className="text-xs font-bold text-slate-800 text-center">
              {slot.isAdded ? slot.activeTitle || `${slot.title} ✓` : slot.title}
            </Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">
              {slot.isAdded ? 'Tap to change' : 'Take photo'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PhotoProofSection;
