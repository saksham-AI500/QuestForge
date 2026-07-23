import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Quest } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryMeta, DIFFICULTIES } from '@/constants/gameData';
import { Icon } from './Icon';
import { radius, spacing, fontSizes } from '@/constants/theme';
import { formatFriendlyDate, isOverdue } from '@/utils/dates';

interface QuestCardProps {
  quest: Quest;
  onToggleComplete: (id: string) => void;
  onPress: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onToggleComplete, onPress, onDelete }) => {
  const { theme } = useTheme();
  const categoryMeta = getCategoryMeta(quest.category);
  const difficultyMeta = DIFFICULTIES.find((d) => d.key === quest.difficulty)!;
  const overdue = !quest.completed && isOverdue(quest.dueDate);

  return (
    <Pressable
      onPress={() => onPress(quest)}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: overdue ? theme.danger + '55' : theme.border,
          opacity: quest.completed ? 0.6 : 1,
        },
      ]}
    >
      <Pressable
        onPress={() => onToggleComplete(quest.id)}
        hitSlop={10}
        style={[
          styles.checkbox,
          {
            borderColor: quest.completed ? theme.success : theme.textMuted,
            backgroundColor: quest.completed ? theme.success : 'transparent',
          },
        ]}
      >
        {quest.completed && <Icon name="check" size={14} color="#0F0B1E" strokeWidth={3} />}
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.title,
            { color: theme.textPrimary, textDecorationLine: quest.completed ? 'line-through' : 'none' },
          ]}
          numberOfLines={2}
        >
          {quest.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.pill, { backgroundColor: categoryMeta.color + '22' }]}>
            <Icon name={categoryMeta.icon as any} size={11} color={categoryMeta.color} />
            <Text style={[styles.pillText, { color: categoryMeta.color }]}>{categoryMeta.label}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: difficultyMeta.color + '22' }]}>
            <Text style={[styles.pillText, { color: difficultyMeta.color }]}>{difficultyMeta.label}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.pillText, { color: theme.primary }]}>+{quest.xpReward} XP</Text>
          </View>
        </View>

        {quest.dueDate && (
          <Text style={[styles.dueDate, { color: overdue ? theme.danger : theme.textMuted }]}>
            {overdue ? 'Overdue · ' : 'Due '}
            {formatFriendlyDate(quest.dueDate)}
          </Text>
        )}
      </View>

      <Pressable onPress={() => onDelete(quest.id)} hitSlop={10} style={styles.deleteBtn}>
        <Icon name="trash" size={16} color={theme.textMuted} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dueDate: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 4,
  },
});

export default QuestCard;
