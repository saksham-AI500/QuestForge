import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Icon } from './Icon';
import { radius, spacing, fontSizes } from '@/constants/theme';
import { Streak } from '@/types';
import { getEffectiveStreakCount } from '@/utils/streaks';

interface StreakCardProps {
  streak: Streak;
  label: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak, label }) => {
  const { theme } = useTheme();
  const effective = getEffectiveStreakCount(streak);
  const isActive = effective > 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: isActive ? theme.accent + '26' : theme.cardAlt }]}>
        <Icon name="flame" size={20} color={isActive ? theme.accent : theme.textMuted} />
      </View>
      <Text style={[styles.count, { color: theme.textPrimary }]}>{effective}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.best, { color: theme.textMuted }]}>Best: {streak.best}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  count: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  best: {
    fontSize: 10,
    marginTop: 2,
  },
});

export default StreakCard;
