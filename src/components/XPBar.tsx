import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSizes } from '@/constants/theme';

interface XPBarProps {
  ratio: number; // 0 - 1
  height?: number;
  showLabel?: boolean;
  current?: number;
  needed?: number;
}

export const XPBar: React.FC<XPBarProps> = ({ ratio, height = 14, showLabel, current, needed }) => {
  const { theme } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.min(1, Math.max(0, ratio)),
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [ratio, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View>
      <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: theme.cardAlt }]}>
        <Animated.View style={{ width: widthInterpolated, height: '100%', borderRadius: height / 2, overflow: 'hidden' }}>
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      {showLabel && current !== undefined && needed !== undefined && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {current} / {needed} XP
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  label: {
    marginTop: spacing.xs,
    fontSize: fontSizes.xs,
    fontWeight: '500',
  },
});

export default XPBar;
