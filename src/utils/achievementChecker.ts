import { getAllAchievements, unlockAchievement } from '@/database/achievementsRepo';
import { getCompletedQuestsCount, getCompletedCountByCategory } from '@/database/questsRepo';
import { getAllStreaks } from '@/database/streaksRepo';
import { Achievement } from '@/types';

interface CheckContext {
  level: number;
}

/**
 * Evaluates all achievement conditions against current DB state and unlocks
 * any newly-earned ones. Returns the list of achievements newly unlocked this call.
 */
export const evaluateAchievements = (ctx: CheckContext): Achievement[] => {
  const before = getAllAchievements();
  const beforeUnlocked = new Set(before.filter((a) => a.unlocked).map((a) => a.id));

  const totalCompleted = getCompletedQuestsCount();
  const streaks = getAllStreaks();
  const dailyStreak = streaks.find((s) => s.type === 'daily')?.current ?? 0;

  const checks: { id: string; met: boolean }[] = [
    { id: 'first_quest', met: totalCompleted >= 1 },
    { id: 'quests_10', met: totalCompleted >= 10 },
    { id: 'quests_50', met: totalCompleted >= 50 },
    { id: 'quests_100', met: totalCompleted >= 100 },
    { id: 'quests_250', met: totalCompleted >= 250 },
    { id: 'streak_7', met: dailyStreak >= 7 },
    { id: 'streak_30', met: dailyStreak >= 30 },
    { id: 'streak_100', met: dailyStreak >= 100 },
    { id: 'level_5', met: ctx.level >= 5 },
    { id: 'level_10', met: ctx.level >= 10 },
    { id: 'level_25', met: ctx.level >= 25 },
    { id: 'level_50', met: ctx.level >= 50 },
    { id: 'category_study', met: getCompletedCountByCategory('Study') >= 20 },
    { id: 'category_coding', met: getCompletedCountByCategory('Coding') >= 20 },
    { id: 'category_fitness', met: getCompletedCountByCategory('Fitness') >= 20 },
    { id: 'category_reading', met: getCompletedCountByCategory('Reading') >= 20 },
  ];

  for (const check of checks) {
    if (check.met && !beforeUnlocked.has(check.id)) {
      unlockAchievement(check.id);
    }
  }

  const after = getAllAchievements();
  return after.filter((a) => a.unlocked && !beforeUnlocked.has(a.id));
};
