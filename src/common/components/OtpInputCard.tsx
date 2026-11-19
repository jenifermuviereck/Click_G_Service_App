import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Icon from '../../components/Icon';

interface OtpInputCardProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  placeholder?: string;
  maxLength?: number;
}

const OtpInputCard: React.FC<OtpInputCardProps> = ({
  label,
  value,
  onChangeText,
  helperText,
  placeholder = 'Enter 4-digit OTP',
  maxLength = 6,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-xs font-semibold text-slate-700 mb-1.5">{label}</Text>
      <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 focus:border-brand-green">
        <Icon name="numeric" size={22} color="#64748B" style={{ marginRight: 10 }} />
        <TextInput
          className="flex-1 text-base font-bold text-slate-900 tracking-widest py-2"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          maxLength={maxLength}
        />
      </View>
      {helperText ? (
        <Text className="text-[11px] text-slate-400 mt-1">{helperText}</Text>
      ) : null}
    </View>
  );
};

export default OtpInputCard;
