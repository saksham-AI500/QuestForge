import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Icon } from './Icon';
import { radius, spacing, fontSizes } from '@/constants/theme';
import { Achievement } from '@/types';
import { formatDateTime } from '@/utils/dates';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { theme } = useTheme();
  const locked = !achievement.unlocked;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: locked ? theme.border : theme.primary + '55',
          opacity: locked ? 0.55 : 1,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: locked ? theme.cardAlt : theme.primary + '26' }]}>
        <Icon name={achievement.icon as any} size={22} color={locked ? theme.textMuted : theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{achievement.title}</Text>
        <Text style={[styles.desc, { color: theme.textSecondary }]}>{achievement.description}</Text>
        {achievement.unlocked && achievement.unlockedAt && (
          <Text style={[styles.date, { color: theme.textMuted }]}>Unlocked {formatDateTime(achievement.unlockedAt)}</Text>
        )}
      </View>
      {locked && <Icon name="shield" size={16} color={theme.textMuted} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  desc: {
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default AchievementCard;
