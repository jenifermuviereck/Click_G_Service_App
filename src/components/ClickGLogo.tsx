import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from './Icon';

interface ClickGLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

const ClickGLogo: React.FC<ClickGLogoProps> = ({ size = 'medium' }) => {
  const isSmall = size === 'small';

  if (isSmall) {
    return (
      <View style={styles.smallContainer}>
        <View style={styles.smallIconBadge}>
          <Icon name="truck-fast" size={16} color="#FFFFFF" />
        </View>
        <Text style={styles.clickTextSmall}>Click</Text>
        <Text style={styles.gTextSmall}>g</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/clickg_logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 145,
    height: 175
    },
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#07522C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  clickTextSmall: {
    fontSize: 20,
    fontWeight: '800',
    color: '#07522C',
  },
  gTextSmall: {
    fontSize: 24,
    fontWeight: '800',
    color: '#D97706',
    marginTop: -2,
  },
});

export default ClickGLogo;
