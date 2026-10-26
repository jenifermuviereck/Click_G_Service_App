import React from 'react';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#667085', style }) => {
  return <MCI name={name} size={size} color={color} style={style} />;
};

export default Icon;
