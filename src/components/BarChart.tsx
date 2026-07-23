import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/constants/theme';

export interface BarChartDatum {
  label: string;
  value: number;
  highlight?: boolean;
}

interface BarChartProps {
  data: BarChartDatum[];
  height?: number;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 120, color }) => {
  const { theme } = useTheme();
  const barColor = color ?? theme.primary;
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <View style={[styles.container, { height: height + 30 }]}>
      {data.map((d, i) => {
        const barHeight = Math.max(3, (d.value / max) * height);
        return (
          <View key={i} style={styles.barCol}>
            {d.value > 0 && (
              <Text style={[styles.valueLabel, { color: theme.textMuted }]}>{d.value}</Text>
            )}
            <View
              style={[
                styles.bar,
                {
                  height: barHeight,
                  backgroundColor: d.highlight ? barColor : barColor + '55',
                },
              ]}
            />
            <Text style={[styles.xLabel, { color: theme.textMuted }]} numberOfLines={1}>
              {d.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '55%',
    borderRadius: radius.sm,
    minHeight: 3,
  },
  xLabel: {
    marginTop: spacing.xs,
    fontSize: 10,
    fontWeight: '600',
  },
  valueLabel: {
    fontSize: 10,
    marginBottom: 2,
    fontWeight: '600',
  },
});

export default BarChart;
