import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../../components/Icon';

interface SuccessResultCardProps {
  title: string;
  subtitle: string;
  referenceLabel?: string;
  referenceValue?: string;
  primaryButtonText: string;
  onPrimaryPress: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  children?: React.ReactNode;
}

const SuccessResultCard: React.FC<SuccessResultCardProps> = ({
  title,
  subtitle,
  referenceLabel,
  referenceValue,
  primaryButtonText,
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
  children,
}) => {
  return (
    <View className="flex-1 justify-center items-center px-4">
      <View className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 items-center justify-center mb-5">
        <Icon name="check" size={44} color="#07522C" />
      </View>

      <Text className="text-2xl font-black text-slate-900 text-center mb-1.5">
        {title}
      </Text>
      <Text className="text-sm text-slate-500 text-center mb-6 px-4">
        {subtitle}
      </Text>

      {referenceLabel && referenceValue ? (
        <View className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-slate-500">{referenceLabel}</Text>
            <Text className="text-sm font-bold text-slate-900">{referenceValue}</Text>
          </View>
        </View>
      ) : null}

      {children}

      <View className="w-full gap-3 mt-4">
        <TouchableOpacity
          className="w-full h-12 bg-brand-green rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={onPrimaryPress}>
          <Text className="text-white font-bold text-base">{primaryButtonText}</Text>
        </TouchableOpacity>

        {secondaryButtonText && onSecondaryPress ? (
          <TouchableOpacity
            className="w-full h-12 border border-slate-200 rounded-xl items-center justify-center bg-white"
            activeOpacity={0.7}
            onPress={onSecondaryPress}>
            <Text className="text-slate-700 font-bold text-sm">{secondaryButtonText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default SuccessResultCard;
