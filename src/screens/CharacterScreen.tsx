import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { spacing, radius, fontSizes } from '@/constants/theme';
import { RANKS, STAT_LABELS, getRankForLevel } from '@/constants/gameData';
import { getXpProgress } from '@/utils/leveling';

import { Card } from '@/components/Card';
import { XPBar } from '@/components/XPBar';
import { StatBar } from '@/components/StatBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Icon } from '@/components/Icon';
import { StatKey } from '@/types';

export const CharacterScreen: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { character } = useGame();

  const rank = getRankForLevel(character.level);
  const { needed, ratio } = getXpProgress(character);

  const statEntries = Object.entries(character.stats) as [StatKey, number][];
  const maxStatValue = Math.max(20, ...statEntries.map(([, v]) => v));
  const roundedMax = Math.ceil(maxStatValue / 10) * 10;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
        <ScreenHeader title="Character" subtitle="Your growth, visualized" />

        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={[styles.avatarCircle, { borderColor: 'rgba(255,255,255,0.4)' }]}>
            <Icon name={rank.icon as any} size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.heroLevel}>Level {character.level}</Text>
          <Text style={styles.heroRank}>{rank.name}</Text>
          <View style={{ width: '100%', marginTop: spacing.md }}>
            <XPBar ratio={ratio} height={10} />
            <Text style={styles.xpText}>{character.currentXp} / {needed} XP to next level</Text>
          </View>
        </LinearGradient>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Stats</Text>
        <Card style={{ marginBottom: spacing.lg }}>
          {statEntries.map(([key, value]) => (
            <StatBar
              key={key}
              label={STAT_LABELS[key].label}
              icon={STAT_LABELS[key].icon as any}
              value={value}
              color={STAT_LABELS[key].color}
              maxForScale={roundedMax}
            />
          ))}
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Rank Progression</Text>
        <Card>
          {RANKS.map((r, idx) => {
            const achieved = character.level >= r.minLevel;
            const isCurrent = r.name === rank.name;
            return (
              <View
                key={r.name}
                style={[
                  styles.rankRow,
                  idx < RANKS.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.rankIconWrap,
                    { backgroundColor: achieved ? r.color + '26' : theme.cardAlt, borderColor: isCurrent ? r.color : 'transparent' },
                  ]}
                >
                  <Icon name={r.icon as any} size={18} color={achieved ? r.color : theme.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rankName, { color: achieved ? theme.textPrimary : theme.textMuted }]}>{r.name}</Text>
                  <Text style={[styles.rankReq, { color: theme.textMuted }]}>Requires Level {r.minLevel}</Text>
                </View>
                {isCurrent && (
                  <View style={[styles.currentTag, { backgroundColor: r.color + '22' }]}>
                    <Text style={{ color: r.color, fontSize: 10, fontWeight: '800' }}>CURRENT</Text>
                  </View>
                )}
                {achieved && !isCurrent && <Icon name="check" size={16} color={theme.success} />}
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroLevel: {
    color: '#FFFFFF',
    fontSize: fontSizes.xxl,
    fontWeight: '900',
  },
  heroRank: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginTop: 2,
  },
  xpText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rankIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankName: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  rankReq: {
    fontSize: 11,
    marginTop: 1,
  },
  currentTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
  },
});

export default CharacterScreen;
