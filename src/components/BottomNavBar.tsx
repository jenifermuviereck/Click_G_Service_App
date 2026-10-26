import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from './Icon';

interface BottomNavBarProps {
  currentTab?: 'Home' | 'Jobs' | 'Earnings' | 'Profile';
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab = 'Home' }) => {
  const navigation = useNavigation<any>();

  const tabs = [
    { name: 'Home', label: 'Home', icon: 'home-variant-outline', activeIcon: 'home-variant', route: 'Home' },
    { name: 'Jobs', label: 'Jobs', icon: 'briefcase-outline', activeIcon: 'briefcase', route: 'MyJobs' },
    { name: 'Earnings', label: 'Earnings', icon: 'credit-card-outline', activeIcon: 'credit-card', route: 'Earnings' },
    { name: 'Profile', label: 'Profile', icon: 'account-outline', activeIcon: 'account', route: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => {
              if (!isActive) {
                navigation.navigate(tab.route);
              }
            }}>
            <Icon
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? '#07522C' : '#98A2B3'}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#98A2B3',
    marginTop: 3,
  },
  activeTabLabel: {
    color: '#07522C',
    fontWeight: '700',
  },
});

export default BottomNavBar;
