import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { spacing, radius, fontSizes } from '@/constants/theme';
import { getCategoryMeta } from '@/constants/gameData';
import { getLastNDates, getWeekdayLabel, toDateStr } from '@/utils/dates';
import { getLogsBetween } from '@/database/logsRepo';

import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { BarChart, BarChartDatum } from '@/components/BarChart';
import { Icon } from '@/components/Icon';

type RangeMode = 'week' | 'month';

export const ProgressScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { character, totalCompleted, categoryStats } = useGame();

  const [rangeMode, setRangeMode] = useState<RangeMode>('week');

  const chartData: BarChartDatum[] = useMemo(() => {
    const days = rangeMode === 'week' ? 7 : 30;
    const dates = getLastNDates(days);
    const start = dates[0];
    const end = dates[dates.length - 1];
    const logs = getLogsBetween(start, end);
    const logMap = new Map(logs.map((l) => [l.date, l]));

    if (rangeMode === 'week') {
      return dates.map((d) => ({
        label: getWeekdayLabel(d),
        value: logMap.get(d)?.questsCompleted ?? 0,
        highlight: d === toDateStr(new Date()),
      }));
    }

    // Monthly: bucket into 5-6 week-groups for readability
    const buckets: BarChartDatum[] = [];
    for (let i = 0; i < dates.length; i += 5) {
      const slice = dates.slice(i, i + 5);
      const sum = slice.reduce((acc, d) => acc + (logMap.get(d)?.questsCompleted ?? 0), 0);
      buckets.push({ label: `${i + 1}-${Math.min(i + 5, dates.length)}`, value: sum });
    }
    return buckets;
  }, [rangeMode]);

  const totalXpChart = useMemo(() => {
    const days = 7;
    const dates = getLastNDates(days);
    const logs = getLogsBetween(dates[0], dates[dates.length - 1]);
    const logMap = new Map(logs.map((l) => [l.date, l]));
    return dates.map((d) => ({
      label: getWeekdayLabel(d),
      value: logMap.get(d)?.xpEarned ?? 0,
      highlight: d === toDateStr(new Date()),
    }));
  }, []);

  const maxCategory = Math.max(1, ...categoryStats.map((c) => c.completed));

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
        <ScreenHeader title="Progress" subtitle="Your journey in numbers" />

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Icon name="zap" size={20} color={theme.accent} />
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{character.totalXp}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total XP</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Icon name="check-circle" size={20} color={theme.success} />
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{totalCompleted}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Quests Done</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Icon name="trending-up" size={20} color={theme.primary} />
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{character.level}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Level</Text>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quests Completed</Text>
          <View style={styles.toggleRow}>
            {(['week', 'month'] as RangeMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setRangeMode(mode)}
                style={[
                  styles.toggleChip,
                  { backgroundColor: rangeMode === mode ? theme.primary : theme.cardAlt, borderColor: rangeMode === mode ? theme.primary : theme.border },
                ]}
              >
                <Text style={{ color: rangeMode === mode ? '#FFFFFF' : theme.textSecondary, fontSize: fontSizes.xs, fontWeight: '700' }}>
                  {mode === 'week' ? 'Weekly' : 'Monthly'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Card style={{ marginBottom: spacing.xl }}>
          <BarChart data={chartData} color={theme.primary} />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>XP Earned (Last 7 Days)</Text>
        <Card style={{ marginBottom: spacing.xl }}>
          <BarChart data={totalXpChart} color={theme.secondary} />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Category Breakdown</Text>
        <Card>
          {categoryStats.length === 0 ? (
            <Text style={{ color: theme.textMuted, fontSize: fontSizes.sm }}>
              Complete quests to see your category breakdown here.
            </Text>
          ) : (
            categoryStats
              .slice()
              .sort((a, b) => b.completed - a.completed)
              .map((stat) => {
                const meta = getCategoryMeta(stat.category);
                const ratio = stat.completed / maxCategory;
                return (
                  <View key={stat.category} style={styles.categoryRow}>
                    <View style={[styles.categoryIcon, { backgroundColor: meta.color + '22' }]}>
                      <Icon name={meta.icon as any} size={16} color={meta.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.categoryLabelRow}>
                        <Text style={[styles.categoryLabel, { color: theme.textPrimary }]}>{meta.label}</Text>
                        <Text style={[styles.categoryCount, { color: theme.textSecondary }]}>
                          {stat.completed} · {stat.xp} XP
                        </Text>
                      </View>
                      <View style={[styles.categoryTrack, { backgroundColor: theme.cardAlt }]}>
                        <View style={[styles.categoryFill, { width: `${ratio * 100}%`, backgroundColor: meta.color }]} />
                      </View>
                    </View>
                  </View>
                );
              })
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
  },
  summaryValue: {
    fontSize: fontSizes.lg,
    fontWeight: '800',
  },
  summaryLabel: {
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
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  toggleChip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: fontSizes.xs,
  },
  categoryTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProgressScreen;
