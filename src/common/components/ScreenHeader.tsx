import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightElement?: ReactNode;
  borderBottom?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightElement,
  borderBottom = true,
}) => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 bg-white ${
        borderBottom ? 'border-b border-slate-100' : ''
      }`}>
      <View className="flex-row items-center flex-1 mr-2">
        {showBack && (
          <TouchableOpacity onPress={handleBack} className="p-1.5 -ml-1 mr-2.5" activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color="#07522C" />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-base font-bold text-slate-900" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-[11px] text-slate-500 mt-0.5" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightElement ? <View className="shrink-0">{rightElement}</View> : null}
    </View>
  );
};

export default ScreenHeader;
