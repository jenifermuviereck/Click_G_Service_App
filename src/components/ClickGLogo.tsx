import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';

interface ClickGLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

const ClickGLogo: React.FC<ClickGLogoProps> = ({ size = 'medium', showTagline = true }) => {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <View style={styles.container}>
      {/* Delivery Boy Mascot Illustration */}
      {!isSmall && (
        <View style={styles.mascotWrapper}>
          {/* Mascot Head & Cap */}
          <View style={styles.mascotCap}>
            <View style={styles.capVisor} />
          </View>
          <View style={styles.mascotFace}>
            <View style={styles.mascotEye} />
            <View style={styles.mascotSmile} />
          </View>
          {/* Mascot Body & Package */}
          <View style={styles.mascotBody}>
            <View style={styles.yellowShirt}>
              <View style={styles.greenSleeve} />
            </View>
            {/* Package held in arms */}
            <View style={styles.greenPackage}>
              <View style={styles.packageRoof} />
              <View style={styles.packageWindow} />
            </View>
          </View>
          {/* Running Legs */}
          <View style={styles.mascotLegs}>
            <View style={[styles.leg, styles.legFront]} />
            <View style={[styles.leg, styles.legBack]} />
          </View>
        </View>
      )}

      {/* Brand Text: Clickg */}
      <View style={styles.brandRow}>
        {isSmall && (
          <View style={styles.smallIconBadge}>
            <Icon name="truck-fast" size={16} color="#FFFFFF" />
          </View>
        )}
        <Text style={[styles.clickText, isSmall && styles.clickTextSmall]}>Click</Text>
        <Text style={[styles.gText, isSmall && styles.gTextSmall]}>g</Text>
      </View>

      {/* Stopwatch & Speed lines under 'g' */}
      {!isSmall && (
        <View style={styles.speedLineWrapper}>
          <Icon name="timer-outline" size={14} color="#F59E0B" style={styles.timerIcon} />
          <View style={styles.speedDashes} />
        </View>
      )}

      {/* Tagline */}
      {showTagline && !isSmall && (
        <View style={styles.taglineWrapper}>
          <Text style={styles.urlText}>www.clickg.com</Text>
          <View style={styles.deliveryRow}>
            <Icon name="clock-fast" size={10} color="#D97706" style={{ marginRight: 2 }} />
            <Text style={styles.fastDeliveryText}>FAST HOME DELIVERY</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotWrapper: {
    width: 90,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  mascotCap: {
    width: 32,
    height: 18,
    backgroundColor: '#07522C',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 5,
    position: 'relative',
  },
  capVisor: {
    position: 'absolute',
    right: -8,
    bottom: 0,
    width: 14,
    height: 6,
    backgroundColor: '#07522C',
    borderTopRightRadius: 6,
  },
  mascotFace: {
    width: 26,
    height: 24,
    backgroundColor: '#FED7AA',
    borderRadius: 13,
    marginTop: -4,
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  mascotEye: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E293B',
    position: 'absolute',
    top: 7,
    right: 7,
  },
  mascotSmile: {
    width: 8,
    height: 4,
    borderBottomWidth: 1.5,
    borderColor: '#EA580C',
    borderRadius: 4,
    position: 'absolute',
    bottom: 5,
    right: 6,
  },
  mascotBody: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
    marginTop: -4,
  },
  yellowShirt: {
    width: 22,
    height: 26,
    backgroundColor: '#FACC15',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#EAB308',
  },
  greenSleeve: {
    width: 7,
    height: 12,
    backgroundColor: '#07522C',
    borderRadius: 3,
    position: 'absolute',
    right: -2,
    top: 2,
  },
  greenPackage: {
    width: 28,
    height: 24,
    backgroundColor: '#054424',
    borderRadius: 4,
    marginLeft: 2,
    borderWidth: 1,
    borderColor: '#022B16',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  packageRoof: {
    position: 'absolute',
    top: -5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#07522C',
  },
  packageWindow: {
    width: 8,
    height: 8,
    backgroundColor: '#FEF08A',
    borderRadius: 1,
  },
  mascotLegs: {
    flexDirection: 'row',
    width: 32,
    justifyContent: 'space-between',
    zIndex: 2,
    marginTop: -2,
  },
  leg: {
    width: 6,
    height: 14,
    backgroundColor: '#07522C',
    borderRadius: 3,
  },
  legFront: {
    transform: [{ rotate: '-25deg' }],
  },
  legBack: {
    transform: [{ rotate: '25deg' }],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  smallIconBadge: {
    backgroundColor: '#07522C',
    borderRadius: 6,
    padding: 3,
    marginRight: 6,
  },
  clickText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#07522C',
    letterSpacing: -1,
  },
  clickTextSmall: {
    fontSize: 20,
    fontWeight: '800',
  },
  gText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#F59E0B',
    marginLeft: -1,
  },
  gTextSmall: {
    fontSize: 22,
    fontWeight: '800',
  },
  speedLineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 4,
  },
  timerIcon: {
    marginRight: 3,
  },
  speedDashes: {
    width: 28,
    height: 2,
    backgroundColor: '#F59E0B',
    borderRadius: 1,
  },
  taglineWrapper: {
    alignItems: 'center',
  },
  urlText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  fastDeliveryText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 1.2,
  },
});

export default ClickGLogo;
