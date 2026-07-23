import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Achievement } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Icon } from './Icon';
import { fontSizes, radius, spacing } from '@/constants/theme';

interface AchievementToastProps {
  achievements: Achievement[];
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievements, onDismiss }) => {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const translateY = useRef(new Animated.Value(-120)).current;

  const current = achievements[index];

  useEffect(() => {
    if (!current) return;
    Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      advance();
    }, 3200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const advance = () => {
    Animated.timing(translateY, { toValue: -120, duration: 250, useNativeDriver: true }).start(() => {
      if (index + 1 < achievements.length) {
        setIndex(index + 1);
      } else {
        setIndex(0);
        onDismiss();
      }
    });
  };

  if (!current) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.primary, transform: [{ translateY }] },
      ]}
    >
      <Pressable style={styles.row} onPress={advance}>
        <View style={[styles.iconWrap, { backgroundColor: theme.primary + '33' }]}>
          <Icon name={current.icon as any} size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.primary }]}>Achievement Unlocked</Text>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{current.title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    zIndex: 50,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default AchievementToast;
