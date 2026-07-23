import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { spacing, radius, fontSizes } from '@/constants/theme';
import { CATEGORIES, DIFFICULTIES, XP_VALUES } from '@/constants/gameData';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { SegmentedPicker } from '@/components/SegmentedPicker';
import { RootStackParamList } from '@/navigation/types';
import { QuestCategory, QuestDifficulty } from '@/types';
import { toDateStr, todayStr } from '@/utils/dates';

type FormRoute = RouteProp<RootStackParamList, 'QuestForm'>;

export const QuestFormScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<FormRoute>();
  const questId = route.params?.questId;

  const { quests, addQuest, editQuest, removeQuest } = useGame();
  const existingQuest = useMemo(() => quests.find((q) => q.id === questId), [quests, questId]);
  const isEditing = !!existingQuest;

  const [title, setTitle] = useState(existingQuest?.title ?? '');
  const [notes, setNotes] = useState(existingQuest?.notes ?? '');
  const [category, setCategory] = useState<QuestCategory>(existingQuest?.category ?? 'Personal');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>(existingQuest?.difficulty ?? 'Easy');
  const [hasDueDate, setHasDueDate] = useState(!!existingQuest?.dueDate);
  const [dueDate, setDueDate] = useState(existingQuest?.dueDate ?? todayStr());
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError('Give your quest a title');
      return;
    }

    const input = {
      title: trimmed,
      notes: notes.trim() ? notes.trim() : null,
      category,
      difficulty,
      dueDate: hasDueDate ? dueDate : null,
    };

    if (isEditing && existingQuest) {
      editQuest(existingQuest.id, input);
    } else {
      addQuest(input);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existingQuest) return;
    Alert.alert('Delete Quest', 'This cannot be undone. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeQuest(existingQuest.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Icon name="chevron-left" size={26} color={theme.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            {isEditing ? 'Edit Quest' : 'New Quest'}
          </Text>
          {isEditing ? (
            <Pressable onPress={handleDelete} hitSlop={10}>
              <Icon name="trash" size={22} color={theme.danger} />
            </Pressable>
          ) : (
            <View style={{ width: 22 }} />
          )}
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
        <TextInput
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            if (titleError) setTitleError(null);
          }}
          placeholder="e.g. Finish chapter 4 of algorithms book"
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            { color: theme.textPrimary, backgroundColor: theme.card, borderColor: titleError ? theme.danger : theme.border },
          ]}
        />
        {titleError && <Text style={[styles.errorText, { color: theme.danger }]}>{titleError}</Text>}

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: spacing.lg }]}>Category</Text>
        <SegmentedPicker
          options={CATEGORIES.map((c) => ({ key: c.key, label: c.label, color: c.color, icon: c.icon as any }))}
          selected={category}
          onSelect={setCategory}
        />

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: spacing.lg }]}>Difficulty</Text>
        <SegmentedPicker
          options={DIFFICULTIES.map((d) => ({ key: d.key, label: `${d.label} (+${XP_VALUES[d.key]} XP)`, color: d.color }))}
          selected={difficulty}
          onSelect={setDifficulty}
        />

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: spacing.lg }]}>Notes (optional)</Text>
        <TextInput
          value={notes ?? ''}
          onChangeText={setNotes}
          placeholder="Add any extra details..."
          placeholderTextColor={theme.textMuted}
          multiline
          numberOfLines={4}
          style={[
            styles.input,
            styles.textArea,
            { color: theme.textPrimary, backgroundColor: theme.card, borderColor: theme.border },
          ]}
        />

        <View style={[styles.dueDateHeader, { marginTop: spacing.lg }]}>
          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 0 }]}>Due Date (optional)</Text>
          <Pressable
            onPress={() => setHasDueDate((v) => !v)}
            style={[
              styles.toggle,
              { backgroundColor: hasDueDate ? theme.primary : theme.cardAlt, borderColor: hasDueDate ? theme.primary : theme.border },
            ]}
          >
            <Text style={{ color: hasDueDate ? '#FFFFFF' : theme.textSecondary, fontSize: fontSizes.xs, fontWeight: '700' }}>
              {hasDueDate ? 'Enabled' : 'Disabled'}
            </Text>
          </Pressable>
        </View>

        {hasDueDate && (
          <View style={styles.dateRow}>
            {[0, 1, 2, 3, 7].map((offset) => {
              const d = toDateStr(new Date(Date.now() + offset * 86400000));
              const selected = dueDate === d;
              const label = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : `+${offset}d`;
              return (
                <Pressable
                  key={offset}
                  onPress={() => setDueDate(d)}
                  style={[
                    styles.dateChip,
                    { backgroundColor: selected ? theme.primary + '22' : theme.cardAlt, borderColor: selected ? theme.primary : theme.border },
                  ]}
                >
                  <Text style={{ color: selected ? theme.primary : theme.textSecondary, fontSize: fontSizes.xs, fontWeight: '700' }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Button label={isEditing ? 'Save Changes' : 'Create Quest'} onPress={handleSave} fullWidth style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  dueDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dateChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});

export default QuestFormScreen;
