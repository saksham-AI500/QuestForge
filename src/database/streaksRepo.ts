import { getDb } from './db';
import { Streak, StreakType } from '@/types';

const rowToStreak = (row: any): Streak => ({
  type: row.type,
  current: row.current,
  best: row.best,
  lastActiveDate: row.lastActiveDate,
});

export const getAllStreaks = (): Streak[] => {
  const db = getDb();
  const rows = db.getAllSync<any>('SELECT * FROM streaks;');
  return rows.map(rowToStreak);
};

export const getStreak = (type: StreakType): Streak => {
  const db = getDb();
  const row = db.getFirstSync<any>('SELECT * FROM streaks WHERE type = ?;', [type]);
  if (!row) throw new Error(`Streak ${type} not initialized`);
  return rowToStreak(row);
};

export const setStreak = (type: StreakType, current: number, best: number, lastActiveDate: string | null): void => {
  const db = getDb();
  db.runSync('UPDATE streaks SET current = ?, best = ?, lastActiveDate = ? WHERE type = ?;', [
    current,
    best,
    lastActiveDate,
    type,
  ]);
};
