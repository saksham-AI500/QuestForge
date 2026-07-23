import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { spacing, fontSizes, radius } from '@/constants/theme';
import { getRankForLevel, getNextRank } from '@/constants/gameData';
import { getXpProgress } from '@/utils/leveling';
import { todayStr } from '@/utils/dates';

import { Card } from '@/components/Card';
import { XPBar } from '@/components/XPBar';
import { RankBadge } from '@/components/RankBadge';
import { StreakCard } from '@/components/StreakCard';
import { QuestCard } from '@/components/QuestCard';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { RootStackParamList } from '@/navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const DashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { character, quests, streaks, completeQuest, uncompleteQuest, removeQuest, totalCompleted } = useGame();

  const rank = getRankForLevel(character.level);
  const nextRank = getNextRank(character.level);
  const { needed, ratio } = getXpProgress(character);

  const today = todayStr();
  const todaysQuests = useMemo(() => {
    return quests.filter((q) => {
      if (q.completed) return q.completedAt?.slice(0, 10) === today;
      if (q.dueDate) return q.dueDate <= today;
      return true;
    });
  }, [quests, today]);

  const dailyStreak = streaks.find((s) => s.type === 'daily');
  const overallStreak = streaks.find((s) => s.type === 'overall');

  const completedToday = todaysQuests.filter((q) => q.completed).length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back</Text>
            <Text style={[styles.appName, { color: theme.textPrimary }]}>QuestForge</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            style={[styles.settingsBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
          >
            <Icon name="settings" size={20} color={theme.textPrimary} />
          </Pressable>
        </View>

        {/* Level Card */}
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.levelCard}
        >
          <View style={styles.levelCardTop}>
            <View>
              <Text style={styles.levelLabel}>CURRENT LEVEL</Text>
              <Text style={styles.levelValue}>{character.level}</Text>
            </View>
            <RankBadge rank={rank} size="md" />
          </View>
          <XPBar ratio={ratio} showLabel current={character.currentXp} needed={needed} height={12} />
          {nextRank && (
            <Text style={styles.nextRankText}>
              {nextRank.minLevel - character.level > 0
                ? `${nextRank.minLevel - character.level} levels to ${nextRank.name}`
                : `Next rank: ${nextRank.name}`}
            </Text>
          )}
        </LinearGradient>

        {/* Streaks */}
        <View style={styles.streakRow}>
          <StreakCard streak={dailyStreak ?? { type: 'daily', current: 0, best: 0, lastActiveDate: null }} label="Daily Streak" />
          <StreakCard streak={overallStreak ?? { type: 'overall', current: 0, best: 0, lastActiveDate: null }} label="Overall Streak" />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Icon name="check-circle" size={20} color={theme.success} />
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{totalCompleted}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Quests</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="zap" size={20} color={theme.accent} />
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{character.totalXp}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total XP</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="target" size={20} color={theme.secondary} />
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{completedToday}/{todaysQuests.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Today</Text>
          </Card>
        </View>

        {/* Today's Quests */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Today's Quests</Text>
          <Pressable onPress={() => navigation.navigate('QuestForm', undefined)} style={styles.quickAdd}>
            <Icon name="plus" size={16} color={theme.primary} />
            <Text style={[styles.quickAddText, { color: theme.primary }]}>Quick Add</Text>
          </Pressable>
        </View>

        {todaysQuests.length === 0 ? (
          <EmptyState
            icon="flag"
            title="No quests for today"
            subtitle="Add a quest to start earning XP and building your streak."
          />
        ) : (
          todaysQuests
            .slice()
            .sort((a, b) => Number(a.completed) - Number(b.completed))
            .map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onToggleComplete={(id) => (q.completed ? uncompleteQuest(id) : completeQuest(id))}
                onPress={(quest) => navigation.navigate('QuestForm', { questId: quest.id })}
                onDelete={removeQuest}
              />
            ))
        )}

        <Button
          label="Add New Quest"
          icon="plus"
          onPress={() => navigation.navigate('QuestForm', undefined)}
          fullWidth
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  appName: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
  },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  levelCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  levelLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  levelValue: {
    color: '#FFFFFF',
    fontSize: fontSizes.xxxl,
    fontWeight: '900',
  },
  nextRankText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSizes.xs,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  streakRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
  },
  statValue: {
    fontSize: fontSizes.lg,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickAddText: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
});

export default DashboardScreen;
