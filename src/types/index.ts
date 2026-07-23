export type QuestCategory =
  | 'Study'
  | 'Coding'
  | 'Fitness'
  | 'Reading'
  | 'Health'
  | 'Work'
  | 'Personal'
  | 'Custom';

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Quest {
  id: string;
  title: string;
  notes: string | null;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  dueDate: string | null; // ISO date string
  completed: boolean;
  completedAt: string | null; // ISO datetime string
  createdAt: string; // ISO datetime string
}

export type QuestInput = Omit<Quest, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'xpReward'>;

export type StatKey =
  | 'strength'
  | 'knowledge'
  | 'programming'
  | 'health'
  | 'focus'
  | 'discipline';

export interface CharacterStats {
  strength: number;
  knowledge: number;
  programming: number;
  health: number;
  focus: number;
  discipline: number;
}

export interface Character {
  id: number;
  level: number;
  currentXp: number; // XP accumulated toward the current level
  totalXp: number; // Lifetime XP
  stats: CharacterStats;
}

export type RankName =
  | 'Novice'
  | 'Explorer'
  | 'Warrior'
  | 'Elite'
  | 'Master'
  | 'Legend'
  | 'Ascendant';

export interface Rank {
  name: RankName;
  minLevel: number;
  color: string;
  icon: string;
}

export type StreakType = 'daily' | 'study' | 'workout' | 'overall';

export interface Streak {
  type: StreakType;
  current: number;
  best: number;
  lastActiveDate: string | null; // ISO date (yyyy-MM-dd)
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  category: 'quests' | 'streaks' | 'level' | 'category';
}

export interface DailyLog {
  date: string; // yyyy-MM-dd
  questsCompleted: number;
  xpEarned: number;
}

export interface CategoryStat {
  category: QuestCategory;
  completed: number;
  xp: number;
}

export type ThemeMode = 'dark' | 'light';

export interface AppSettings {
  themeMode: ThemeMode;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // HH:mm
  streakReminderEnabled: boolean;
}

export interface LevelUpResult {
  didLevelUp: boolean;
  newLevel: number;
  previousLevel: number;
  newRank: Rank;
  previousRank: Rank;
  didRankUp: boolean;
}
