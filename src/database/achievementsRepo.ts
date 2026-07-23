import { getDb } from './db';
import { Achievement } from '@/types';
import { ACHIEVEMENT_DEFS } from '@/constants/gameData';

export const getAllAchievements = (): Achievement[] => {
  const db = getDb();
  const rows = db.getAllSync<any>('SELECT * FROM achievements;');
  const stateMap = new Map(rows.map((r) => [r.id, r]));

  return ACHIEVEMENT_DEFS.map((def) => {
    const state = stateMap.get(def.id);
    return {
      ...def,
      unlocked: !!state?.unlocked,
      unlockedAt: state?.unlockedAt ?? null,
    };
  });
};

export const unlockAchievement = (id: string): void => {
  const db = getDb();
  const existing = db.getFirstSync<{ unlocked: number }>('SELECT unlocked FROM achievements WHERE id = ?;', [id]);
  if (existing && !existing.unlocked) {
    db.runSync('UPDATE achievements SET unlocked = 1, unlockedAt = ? WHERE id = ?;', [
      new Date().toISOString(),
      id,
    ]);
  }
};

export const getUnlockedIds = (): Set<string> => {
  const db = getDb();
  const rows = db.getAllSync<{ id: string }>('SELECT id FROM achievements WHERE unlocked = 1;');
  return new Set(rows.map((r) => r.id));
};
