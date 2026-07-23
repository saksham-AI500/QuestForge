import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing, fontSizes } from '@/constants/theme';
import { Icon, IconName } from './Icon';

interface Option<T extends string> {
  key: T;
  label: string;
  color: string;
  icon?: IconName;
}

interface SegmentedPickerProps<T extends string> {
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
  scrollable?: boolean;
}

export function SegmentedPicker<T extends string>({
  options,
  selected,
  onSelect,
  scrollable,
}: SegmentedPickerProps<T>) {
  const { theme } = useTheme();

  const content = (
    <View style={styles.row}>
      {options.map((opt) => {
        const isSelected = opt.key === selected;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onSelect(opt.key)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? opt.color + '2A' : theme.cardAlt,
                borderColor: isSelected ? opt.color : theme.border,
              },
            ]}
          >
            {opt.icon && <Icon name={opt.icon} size={14} color={isSelected ? opt.color : theme.textMuted} />}
            <Text style={[styles.label, { color: isSelected ? opt.color : theme.textSecondary }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {content}
      </ScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
});

export default SegmentedPicker;
