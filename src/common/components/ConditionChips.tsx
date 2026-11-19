import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type PackageCondition = 'Good' | 'Damaged' | 'Missing';

interface ConditionChipsProps {
  heading?: string;
  selectedCondition: PackageCondition;
  onSelectCondition: (cond: PackageCondition) => void;
  options?: PackageCondition[];
}

const ConditionChips: React.FC<ConditionChipsProps> = ({
  heading = 'Condition *',
  selectedCondition,
  onSelectCondition,
  options = ['Good', 'Damaged', 'Missing'],
}) => {
  return (
    <View className="mb-5">
      {heading ? (
        <Text className="text-sm font-bold text-slate-900 mb-2.5">{heading}</Text>
      ) : null}

      <View className="flex-row gap-2.5">
        {options.map(cond => {
          const selected = selectedCondition === cond;
          return (
            <TouchableOpacity
              key={cond}
              className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${
                selected
                  ? 'bg-brand-green border-brand-green'
                  : 'bg-white border-slate-200'
              }`}
              activeOpacity={0.75}
              onPress={() => onSelectCondition(cond)}>
              <Text
                className={`text-xs font-bold ${
                  selected ? 'text-white' : 'text-slate-700'
                }`}>
                {cond}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ConditionChips;
