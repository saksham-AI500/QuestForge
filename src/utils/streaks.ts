import { Streak } from '@/types';
import { daysBetween, todayStr } from './dates';

/**
 * Given the current streak state and "now" the user is completing a relevant quest,
 * computes the updated streak. If the last active date was today, streak is unchanged
 * (already counted). If yesterday, streak increments. Otherwise, streak resets to 1.
 */
export const bumpStreak = (streak: Streak): Streak => {
  const today = todayStr();

  if (streak.lastActiveDate === today) {
    // Already active today, no change
    return streak;
  }

  let newCurrent: number;
  if (streak.lastActiveDate) {
    const gap = daysBetween(streak.lastActiveDate, today);
    newCurrent = gap === 1 ? streak.current + 1 : 1;
  } else {
    newCurrent = 1;
  }

  return {
    ...streak,
    current: newCurrent,
    best: Math.max(streak.best, newCurrent),
    lastActiveDate: today,
  };
};

/**
 * Checks whether a streak should be considered broken (missed a day) as of "today",
 * without any new activity. Used for display purposes (e.g. showing 0 if lapsed).
 */
export const getEffectiveStreakCount = (streak: Streak): number => {
  if (!streak.lastActiveDate) return 0;
  const today = todayStr();
  if (streak.lastActiveDate === today) return streak.current;
  const gap = daysBetween(streak.lastActiveDate, today);
  if (gap <= 1) return streak.current; // still within grace (yesterday, not yet broken today)
  return 0; // missed at least one full day
};
