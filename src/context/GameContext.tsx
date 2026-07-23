import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  Achievement,
  Character,
  CategoryStat,
  LevelUpResult,
  Quest,
  QuestInput,
  Streak,
} from '@/types';
import {
  createQuest as dbCreateQuest,
  deleteQuest as dbDeleteQuest,
  getAllQuests,
  setQuestCompleted,
  updateQuest as dbUpdateQuest,
  getCategoryBreakdown,
  getCompletedQuestsCount,
} from '@/database/questsRepo';
import { getCharacter, incrementStat, decrementStat, updateCharacterXpAndLevel } from '@/database/characterRepo';
import { getAllStreaks, setStreak } from '@/database/streaksRepo';
import { getAllAchievements } from '@/database/achievementsRepo';
import { upsertDailyLog } from '@/database/logsRepo';
import { initDatabase } from '@/database/db';
import { applyXpGain, revertXpGain } from '@/utils/leveling';
import { bumpStreak } from '@/utils/streaks';
import { evaluateAchievements } from '@/utils/achievementChecker';
import { todayStr } from '@/utils/dates';
import { getCategoryMeta, STAT_POINTS } from '@/constants/gameData';

interface GameContextValue {
  isLoading: boolean;
  quests: Quest[];
  character: Character;
  streaks: Streak[];
  achievements: Achievement[];
  categoryStats: CategoryStat[];
  totalCompleted: number;
  pendingLevelUp: LevelUpResult | null;
  pendingNewAchievements: Achievement[];
  clearLevelUpNotice: () => void;
  clearAchievementNotice: () => void;
  addQuest: (input: QuestInput) => void;
  editQuest: (id: string, input: QuestInput) => void;
  removeQuest: (id: string) => void;
  completeQuest: (id: string) => void;
  uncompleteQuest: (id: string) => void;
  refreshAll: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpResult | null>(null);
  const [pendingNewAchievements, setPendingNewAchievements] = useState<Achievement[]>([]);

  const refreshAll = useCallback(() => {
    setQuests(getAllQuests());
    setCharacter(getCharacter());
    setStreaks(getAllStreaks());
    setAchievements(getAllAchievements());
    setCategoryStats(getCategoryBreakdown());
    setTotalCompleted(getCompletedQuestsCount());
  }, []);

  useEffect(() => {
    initDatabase();
    refreshAll();
    setIsLoading(false);
  }, [refreshAll]);

  const addQuest = useCallback(
    (input: QuestInput) => {
      dbCreateQuest(input);
      refreshAll();
    },
    [refreshAll]
  );

  const editQuest = useCallback(
    (id: string, input: QuestInput) => {
      dbUpdateQuest(id, input);
      refreshAll();
    },
    [refreshAll]
  );

  const removeQuest = useCallback(
    (id: string) => {
      dbDeleteQuest(id);
      refreshAll();
    },
    [refreshAll]
  );

  const completeQuest = useCallback(
    (id: string) => {
      const quest = quests.find((q) => q.id === id);
      if (!quest || quest.completed || !character) return;

      setQuestCompleted(id, true);

      // XP & Level
      const { character: updatedChar, result } = applyXpGain(character, quest.xpReward);
      updateCharacterXpAndLevel(updatedChar.level, updatedChar.currentXp, updatedChar.totalXp);

      // Stats
      const meta = getCategoryMeta(quest.category);
      incrementStat(meta.statKey, STAT_POINTS[quest.difficulty]);

      // Streaks: daily (overall activity) + overall + category-specific
      const today = todayStr();
      const dailyStreak = bumpStreak(streaks.find((s) => s.type === 'daily')!);
      setStreak('daily', dailyStreak.current, dailyStreak.best, dailyStreak.lastActiveDate);

      const overallStreak = bumpStreak(streaks.find((s) => s.type === 'overall')!);
      setStreak('overall', overallStreak.current, overallStreak.best, overallStreak.lastActiveDate);

      if (quest.category === 'Study' || quest.category === 'Reading') {
        const studyStreak = bumpStreak(streaks.find((s) => s.type === 'study')!);
        setStreak('study', studyStreak.current, studyStreak.best, studyStreak.lastActiveDate);
      }
      if (quest.category === 'Fitness' || quest.category === 'Health') {
        const workoutStreak = bumpStreak(streaks.find((s) => s.type === 'workout')!);
        setStreak('workout', workoutStreak.current, workoutStreak.best, workoutStreak.lastActiveDate);
      }

      // Daily log
      upsertDailyLog(today, 1, quest.xpReward);

      // Achievements
      const newlyUnlocked = evaluateAchievements({ level: updatedChar.level });

      if (result.didLevelUp) {
        setPendingLevelUp(result);
      }
      if (newlyUnlocked.length > 0) {
        setPendingNewAchievements((prev) => [...prev, ...newlyUnlocked]);
      }

      refreshAll();
    },
    [quests, character, streaks, refreshAll]
  );

  const uncompleteQuest = useCallback(
    (id: string) => {
      const quest = quests.find((q) => q.id === id);
      if (!quest || !quest.completed || !character) return;

      setQuestCompleted(id, false);

      const revertedChar = revertXpGain(character, quest.xpReward);
      updateCharacterXpAndLevel(revertedChar.level, revertedChar.currentXp, revertedChar.totalXp);

      const meta = getCategoryMeta(quest.category);
      decrementStat(meta.statKey, STAT_POINTS[quest.difficulty]);

      const today = todayStr();
      upsertDailyLog(today, -1, -quest.xpReward);

      refreshAll();
    },
    [quests, character, refreshAll]
  );

  const clearLevelUpNotice = useCallback(() => setPendingLevelUp(null), []);
  const clearAchievementNotice = useCallback(() => setPendingNewAchievements([]), []);

  const value = useMemo<GameContextValue | null>(() => {
    if (!character) return null;
    return {
      isLoading,
      quests,
      character,
      streaks,
      achievements,
      categoryStats,
      totalCompleted,
      pendingLevelUp,
      pendingNewAchievements,
      clearLevelUpNotice,
      clearAchievementNotice,
      addQuest,
      editQuest,
      removeQuest,
      completeQuest,
      uncompleteQuest,
      refreshAll,
    };
  }, [
    isLoading,
    quests,
    character,
    streaks,
    achievements,
    categoryStats,
    totalCompleted,
    pendingLevelUp,
    pendingNewAchievements,
    clearLevelUpNotice,
    clearAchievementNotice,
    addQuest,
    editQuest,
    removeQuest,
    completeQuest,
    uncompleteQuest,
    refreshAll,
  ]);

  if (isLoading || !value) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0B1E', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#7C4DFF" />
      </View>
    );
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider (and after DB init)');
  return ctx;
};

export const useGameOptional = (): GameContextValue | undefined => useContext(GameContext);
