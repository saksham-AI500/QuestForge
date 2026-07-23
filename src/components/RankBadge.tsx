import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rank } from '@/types';
import { Icon } from './Icon';
import { radius, spacing, fontSizes } from '@/constants/theme';

interface RankBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'md' }) => {
  const dims = { sm: 24, md: 32, lg: 48 }[size];
  const fontSize = { sm: fontSizes.xs, md: fontSizes.sm, lg: fontSizes.lg }[size];

  return (
    <View style={[styles.badge, { backgroundColor: rank.color + '26', borderColor: rank.color }]}>
      <View style={[styles.iconCircle, { width: dims, height: dims, borderRadius: dims / 2, backgroundColor: rank.color + '33' }]}>
        <Icon name={rank.icon as any} size={dims * 0.55} color={rank.color} />
      </View>
      <Text style={[styles.text, { color: rank.color, fontSize }]}>{rank.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
  },
});

export default RankBadge;
