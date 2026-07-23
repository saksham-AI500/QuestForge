import { Achievement, QuestCategory, QuestDifficulty, Rank, StatKey } from '@/types';

export const XP_VALUES: Record<QuestDifficulty, number> = {
  Easy: 20,
  Medium: 50,
  Hard: 100,
};

// Base XP required to go from level N to N+1 = BASE + (N-1) * INCREMENT, growing gently.
export const xpRequiredForLevel = (level: number): number => {
  const base = 100;
  const increment = 35;
  return Math.round(base + (level - 1) * increment + Math.pow(level - 1, 1.35) * 10);
};

export const RANKS: Rank[] = [
  { name: 'Novice', minLevel: 1, color: '#8D84A8', icon: 'seedling' },
  { name: 'Explorer', minLevel: 5, color: '#4ADE80', icon: 'compass' },
  { name: 'Warrior', minLevel: 10, color: '#FFB74D', icon: 'sword' },
  { name: 'Elite', minLevel: 18, color: '#00E5C7', icon: 'shield' },
  { name: 'Master', minLevel: 28, color: '#7C4DFF', icon: 'crown' },
  { name: 'Legend', minLevel: 40, color: '#FF5C7A', icon: 'flame' },
  { name: 'Ascendant', minLevel: 55, color: '#FFD700', icon: 'star' },
];

export const getRankForLevel = (level: number): Rank => {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLevel) current = r;
  }
  return current;
};

export const getNextRank = (level: number): Rank | null => {
  const currentIndex = RANKS.findIndex((r) => r.name === getRankForLevel(level).name);
  return RANKS[currentIndex + 1] ?? null;
};

export interface CategoryMeta {
  key: QuestCategory;
  label: string;
  icon: string;
  color: string;
  statKey: StatKey;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'Study', label: 'Study', icon: 'book-open', color: '#00E5C7', statKey: 'knowledge' },
  { key: 'Coding', label: 'Coding', icon: 'code', color: '#7C4DFF', statKey: 'programming' },
  { key: 'Fitness', label: 'Fitness', icon: 'dumbbell', color: '#FF5C7A', statKey: 'strength' },
  { key: 'Reading', label: 'Reading', icon: 'book', color: '#FFB74D', statKey: 'knowledge' },
  { key: 'Health', label: 'Health', icon: 'heart', color: '#4ADE80', statKey: 'health' },
  { key: 'Work', label: 'Work', icon: 'briefcase', color: '#3DA9FC', statKey: 'discipline' },
  { key: 'Personal', label: 'Personal', icon: 'user', color: '#FFD966', statKey: 'focus' },
  { key: 'Custom', label: 'Custom', icon: 'star', color: '#C792EA', statKey: 'discipline' },
];

export const getCategoryMeta = (category: QuestCategory): CategoryMeta =>
  CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[7];

export const DIFFICULTIES: { key: QuestDifficulty; label: string; color: string }[] = [
  { key: 'Easy', label: 'Easy', color: '#4ADE80' },
  { key: 'Medium', label: 'Medium', color: '#FFB74D' },
  { key: 'Hard', label: 'Hard', color: '#FF5C7A' },
];

// Stat points gained per completed quest, scaled by difficulty.
export const STAT_POINTS: Record<QuestDifficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 4,
};

export const STAT_LABELS: Record<StatKey, { label: string; icon: string; color: string }> = {
  strength: { label: 'Strength', icon: 'dumbbell', color: '#FF5C7A' },
  knowledge: { label: 'Knowledge', icon: 'book-open', color: '#00E5C7' },
  programming: { label: 'Programming', icon: 'code', color: '#7C4DFF' },
  health: { label: 'Health', icon: 'heart', color: '#4ADE80' },
  focus: { label: 'Focus', icon: 'target', color: '#FFD966' },
  discipline: { label: 'Discipline', icon: 'shield', color: '#3DA9FC' },
};

// Static achievement definitions. Unlock state is computed/stored in DB.
export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_quest', title: 'First Steps', description: 'Complete your very first quest', icon: 'flag', category: 'quests' },
  { id: 'quests_10', title: 'Getting Things Done', description: 'Complete 10 quests', icon: 'check-circle', category: 'quests' },
  { id: 'quests_50', title: 'Quest Veteran', description: 'Complete 50 quests', icon: 'award', category: 'quests' },
  { id: 'quests_100', title: 'Centurion', description: 'Complete 100 quests', icon: 'medal', category: 'quests' },
  { id: 'quests_250', title: 'Unstoppable', description: 'Complete 250 quests', icon: 'zap', category: 'quests' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Reach a 7-day streak', icon: 'flame', category: 'streaks' },
  { id: 'streak_30', title: 'Iron Will', description: 'Reach a 30-day streak', icon: 'flame', category: 'streaks' },
  { id: 'streak_100', title: 'Relentless', description: 'Reach a 100-day streak', icon: 'flame', category: 'streaks' },
  { id: 'level_5', title: 'Explorer Awakens', description: 'Reach level 5', icon: 'trending-up', category: 'level' },
  { id: 'level_10', title: 'Warrior Rising', description: 'Reach level 10', icon: 'trending-up', category: 'level' },
  { id: 'level_25', title: 'Elite Ascension', description: 'Reach level 25', icon: 'trending-up', category: 'level' },
  { id: 'level_50', title: 'Legendary Status', description: 'Reach level 50', icon: 'trending-up', category: 'level' },
  { id: 'category_study', title: 'Scholar', description: 'Complete 20 Study quests', icon: 'book-open', category: 'category' },
  { id: 'category_coding', title: 'Code Master', description: 'Complete 20 Coding quests', icon: 'code', category: 'category' },
  { id: 'category_fitness', title: 'Iron Body', description: 'Complete 20 Fitness quests', icon: 'dumbbell', category: 'category' },
  { id: 'category_reading', title: 'Bookworm', description: 'Complete 20 Reading quests', icon: 'book', category: 'category' },
];
