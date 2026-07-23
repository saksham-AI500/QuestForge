import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { spacing, radius, fontSizes } from '@/constants/theme';
import { AchievementCard } from '@/components/AchievementCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';

export const AchievementsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { achievements } = useGame();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const grouped = useMemo(() => {
    const groups: Record<string, typeof achievements> = {
      quests: [],
      streaks: [],
      level: [],
      category: [],
    };
    achievements.forEach((a) => {
      groups[a.category]?.push(a);
    });
    return groups;
  }, [achievements]);

  const sectionLabels: Record<string, string> = {
    quests: 'Quest Milestones',
    streaks: 'Streak Milestones',
    level: 'Level Milestones',
    category: 'Category Mastery',
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
        <ScreenHeader title="Achievements" subtitle={`${unlockedCount} of ${achievements.length} unlocked`} />

        <Card style={styles.summaryCard} elevated>
          <View style={[styles.summaryIcon, { backgroundColor: theme.primary + '26' }]}>
            <Icon name="award" size={26} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
              {unlockedCount} / {achievements.length} Unlocked
            </Text>
            <View style={[styles.progressTrack, { backgroundColor: theme.cardAlt }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(unlockedCount / achievements.length) * 100}%`, backgroundColor: theme.primary },
                ]}
              />
            </View>
          </View>
        </Card>

        {Object.entries(grouped).map(([key, list]) =>
          list.length === 0 ? null : (
            <View key={key} style={{ marginTop: spacing.lg }}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{sectionLabels[key]}</Text>
              {list.map((a) => (
                <AchievementCard key={a.id} achievement={a} />
              ))}
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
});

export default AchievementsScreen;
