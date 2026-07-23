import { getDb } from './db';
import { DailyLog } from '@/types';

export const upsertDailyLog = (date: string, questsDelta: number, xpDelta: number): void => {
  const db = getDb();
  const existing = db.getFirstSync<any>('SELECT * FROM daily_logs WHERE date = ?;', [date]);
  if (existing) {
    db.runSync('UPDATE daily_logs SET questsCompleted = questsCompleted + ?, xpEarned = xpEarned + ? WHERE date = ?;', [
      questsDelta,
      xpDelta,
      date,
    ]);
  } else {
    db.runSync('INSERT INTO daily_logs (date, questsCompleted, xpEarned) VALUES (?, ?, ?);', [
      date,
      Math.max(0, questsDelta),
      Math.max(0, xpDelta),
    ]);
  }
};

export const getLogsBetween = (startDate: string, endDate: string): DailyLog[] => {
  const db = getDb();
  const rows = db.getAllSync<DailyLog>(
    'SELECT * FROM daily_logs WHERE date >= ? AND date <= ? ORDER BY date ASC;',
    [startDate, endDate]
  );
  return rows;
};

export const getSetting = (key: string): string | null => {
  const db = getDb();
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM settings WHERE key = ?;', [key]);
  return row?.value ?? null;
};

export const setSetting = (key: string, value: string): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ key: string }>('SELECT key FROM settings WHERE key = ?;', [key]);
  if (existing) {
    db.runSync('UPDATE settings SET value = ? WHERE key = ?;', [value, key]);
  } else {
    db.runSync('INSERT INTO settings (key, value) VALUES (?, ?);', [key, value]);
  }
};
