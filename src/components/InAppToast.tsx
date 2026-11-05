import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { subscribeToast, ToastPayload } from '../common/utils/notification';

export const InAppToast: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentToast, setCurrentToast] = useState<ToastPayload | null>(null);
  const translateY = useRef(new Animated.Value(-150)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToast((toast: ToastPayload) => {
      setCurrentToast(toast);

      if (timerRef.current) clearTimeout(timerRef.current);

      // Slide in smoothly from top
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
        speed: 14,
      }).start();

      // Auto dismiss after 3.5 seconds
      timerRef.current = setTimeout(slideOut, toast.duration || 3500);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const slideOut = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(translateY, {
      toValue: -150,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setCurrentToast(null));
  };

  if (!currentToast) return null;

  const isError = currentToast.type === 'error';
  const isInfo = currentToast.type === 'info';
  const isWarning = currentToast.type === 'warning';

  let bgColor = '#07522C'; // Brand Emerald for success
  let iconName = 'check-circle';
  let borderColor = '#10B981';

  if (isError) {
    bgColor = '#991B1B'; // Deep Red
    iconName = 'alert-circle';
    borderColor = '#EF4444';
  } else if (isInfo) {
    bgColor = '#1E293B'; // Slate Dark
    iconName = 'information';
    borderColor = '#475569';
  } else if (isWarning) {
    bgColor = '#B45309'; // Amber
    iconName = 'alert';
    borderColor = '#F59E0B';
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          top: Math.max(insets.top, 16) + 6,
          transform: [{ translateY }],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={slideOut}
        style={[
          styles.container,
          { backgroundColor: bgColor, borderColor: borderColor },
        ]}>
        <View style={styles.iconBox}>
          <Icon name={iconName} size={20} color="#FFFFFF" />
        </View>

        <View style={styles.contentBox}>
          {currentToast.title ? (
            <Text style={styles.titleText} numberOfLines={1}>
              {currentToast.title}
            </Text>
          ) : null}
          <Text style={styles.messageText} numberOfLines={2}>
            {currentToast.message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={slideOut}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.closeBtn}>
          <Icon name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999999,
    elevation: 9999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  iconBox: {
    marginRight: 10,
  },
  contentBox: {
    flex: 1,
    paddingRight: 6,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  messageText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  closeBtn: {
    padding: 4,
    opacity: 0.85,
  },
});

export default InAppToast;

