import React from 'react';
import { View, Text, Image } from 'react-native';
import Icon from './Icon';

interface ClickGLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

const ClickGLogo: React.FC<ClickGLogoProps> = ({ size = 'medium' }) => {
  const isSmall = size === 'small';

  if (isSmall) {
    return (
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-lg bg-brand-green items-center justify-center mr-1.5">
          <Icon name="truck-fast" size={16} color="#FFFFFF" />
        </View>
        <Text className="text-xl font-extrabold text-brand-green">Click</Text>
        <Text className="text-2xl font-extrabold text-amber-600 -mt-0.5">g</Text>
      </View>
    );
  }

  // Proportional sizing matching Figma design (~108px x 130px for large, ~85px x 102px for medium)
  const width = size === 'large' ? 108 : 88;
  const height = size === 'large' ? 130 : 106;

  return (
    <View className="items-center justify-center">
      <Image
        source={require('../assets/clickg_logo.png')}
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
};

export default ClickGLogo;
