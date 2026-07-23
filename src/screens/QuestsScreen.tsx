import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { spacing, radius, fontSizes } from '@/constants/theme';
import { CATEGORIES } from '@/constants/gameData';
import { QuestCard } from '@/components/QuestCard';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Icon } from '@/components/Icon';
import { RootStackParamList } from '@/navigation/types';
import { QuestCategory } from '@/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

type FilterMode = 'all' | 'active' | 'completed';

export const QuestsScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { quests, completeQuest, uncompleteQuest, removeQuest } = useGame();

  const [filterMode, setFilterMode] = useState<FilterMode>('active');
  const [categoryFilter, setCategoryFilter] = useState<QuestCategory | 'All'>('All');

  const filtered = useMemo(() => {
    return quests.filter((q) => {
      if (filterMode === 'active' && q.completed) return false;
      if (filterMode === 'completed' && !q.completed) return false;
      if (categoryFilter !== 'All' && q.category !== categoryFilter) return false;
      return true;
    });
  }, [quests, filterMode, categoryFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
      >
        <ScreenHeader title="Quests" subtitle={`${filtered.length} shown`} rightIcon="plus" onRightPress={() => navigation.navigate('QuestForm', undefined)} />

        <View style={styles.filterRow}>
          {(['active', 'completed', 'all'] as FilterMode[]).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setFilterMode(mode)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filterMode === mode ? theme.primary : theme.cardAlt,
                  borderColor: filterMode === mode ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={[styles.filterText, { color: filterMode === mode ? '#FFFFFF' : theme.textSecondary }]}>
                {mode === 'all' ? 'All' : mode === 'active' ? 'Active' : 'Completed'}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
          <View style={styles.catRow}>
            <Pressable
              onPress={() => setCategoryFilter('All')}
              style={[
                styles.catChip,
                {
                  backgroundColor: categoryFilter === 'All' ? theme.primary + '22' : theme.cardAlt,
                  borderColor: categoryFilter === 'All' ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={[styles.catText, { color: categoryFilter === 'All' ? theme.primary : theme.textSecondary }]}>All</Text>
            </Pressable>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.key}
                onPress={() => setCategoryFilter(c.key)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: categoryFilter === c.key ? c.color + '22' : theme.cardAlt,
                    borderColor: categoryFilter === c.key ? c.color : theme.border,
                  },
                ]}
              >
                <Icon name={c.icon as any} size={12} color={categoryFilter === c.key ? c.color : theme.textMuted} />
                <Text style={[styles.catText, { color: categoryFilter === c.key ? c.color : theme.textSecondary }]}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {filtered.length === 0 ? (
          <EmptyState icon="list" title="No quests found" subtitle="Try adjusting your filters or add a new quest." />
        ) : (
          filtered.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              onToggleComplete={(id) => (q.completed ? uncompleteQuest(id) : completeQuest(id))}
              onPress={(quest) => navigation.navigate('QuestForm', { questId: quest.id })}
              onDelete={removeQuest}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  filterText: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  catRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  catText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
});

export default QuestsScreen;
