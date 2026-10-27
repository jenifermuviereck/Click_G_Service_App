import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';

interface BottomNavBarProps {
  currentTab?: 'Home' | 'Jobs' | 'Earnings' | 'Profile';
  onTabChange?: (tab: 'Home' | 'Jobs' | 'Earnings' | 'Profile') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab = 'Home', onTabChange }) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const tabs: Array<{
    name: 'Home' | 'Jobs' | 'Earnings' | 'Profile';
    label: string;
    icon: string;
    activeIcon: string;
    route: string;
  }> = [
    { name: 'Home', label: 'Home', icon: 'home-variant-outline', activeIcon: 'home-variant', route: 'Home' },
    { name: 'Jobs', label: 'Jobs', icon: 'briefcase-outline', activeIcon: 'briefcase', route: 'MyJobs' },
    { name: 'Earnings', label: 'Earnings', icon: 'credit-card-outline', activeIcon: 'credit-card', route: 'Earnings' },
    { name: 'Profile', label: 'Profile', icon: 'account-outline', activeIcon: 'account', route: 'Profile' },
  ];

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 6) }}
      className="bg-white border-t border-brand-border">
      <View className="flex-row h-14 sm:h-16 items-center justify-around px-2">
        {tabs.map(tab => {
          const isActive = currentTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              className="items-center justify-center flex-1 py-1.5"
              activeOpacity={0.7}
              onPress={() => {
                if (onTabChange) {
                  onTabChange(tab.name);
                } else if (!isActive) {
                  navigation.navigate(tab.route);
                }
              }}>
              <Icon
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? '#07522C' : '#98A2B3'}
              />
              <Text
                className={`text-[11px] sm:text-xs mt-1 ${
                  isActive ? 'text-brand-green font-bold' : 'text-slate-400 font-medium'
                }`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavBar;
