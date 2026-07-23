import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LevelUpResult } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Icon } from './Icon';
import { fontSizes, radius, spacing } from '@/constants/theme';
import { Button } from './Button';

interface LevelUpModalProps {
  result: LevelUpResult | null;
  onDismiss: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ result, onDismiss }) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (result) {
      scaleAnim.setValue(0.4);
      rotateAnim.setValue(0);
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [result, scaleAnim, rotateAnim]);

  if (!result) return null;

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Modal visible={!!result} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, { backgroundColor: theme.card, transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            style={styles.badgeCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Icon name="star" size={44} color="#FFFFFF" />
            </Animated.View>
          </LinearGradient>

          <Text style={[styles.levelUpText, { color: theme.textPrimary }]}>Level Up!</Text>
          <Text style={[styles.levelNumber, { color: theme.primary }]}>Level {result.newLevel}</Text>

          {result.didRankUp && (
            <View style={[styles.rankBanner, { backgroundColor: result.newRank.color + '22', borderColor: result.newRank.color }]}>
              <Icon name={result.newRank.icon as any} size={18} color={result.newRank.color} />
              <Text style={[styles.rankText, { color: result.newRank.color }]}>
                New Rank Unlocked: {result.newRank.name}
              </Text>
            </View>
          )}

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your dedication is paying off. Keep completing quests to grow stronger.
          </Text>

          <Button label="Continue" onPress={onDismiss} fullWidth />
        </Animated.View>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 340,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    zIndex: 10,
  },
  badgeCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  levelUpText: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
  },
  levelNumber: {
    fontSize: fontSizes.xxxl,
    fontWeight: '900',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  rankBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  rankText: {
    fontWeight: '700',
    fontSize: fontSizes.sm,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: fontSizes.sm,
    marginBottom: spacing.lg,
  },
});

export default LevelUpModal;
