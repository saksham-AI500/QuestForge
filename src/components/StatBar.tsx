import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { fontSizes, radius, spacing } from '@/constants/theme';
import { Icon, IconName } from './Icon';

interface StatBarProps {
  label: string;
  icon: IconName;
  value: number;
  color: string;
  maxForScale?: number;
}

export const StatBar: React.FC<StatBarProps> = ({ label, icon, value, color, maxForScale = 100 }) => {
  const { theme } = useTheme();
  const ratio = Math.min(1, value / maxForScale);

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Icon name={icon} size={16} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>
          <Text style={[styles.value, { color: theme.textSecondary }]}>{value}</Text>
        </View>
        <View style={[styles.track, { backgroundColor: theme.cardAlt }]}>
          <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  value: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default StatBar;
