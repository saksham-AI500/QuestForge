import { getDb } from './db';
import { Character, StatKey } from '@/types';

const rowToCharacter = (row: any): Character => ({
  id: row.id,
  level: row.level,
  currentXp: row.currentXp,
  totalXp: row.totalXp,
  stats: {
    strength: row.strength,
    knowledge: row.knowledge,
    programming: row.programming,
    health: row.health,
    focus: row.focus,
    discipline: row.discipline,
  },
});

export const getCharacter = (): Character => {
  const db = getDb();
  const row = db.getFirstSync<any>('SELECT * FROM character WHERE id = 1;');
  if (!row) {
    throw new Error('Character not initialized');
  }
  return rowToCharacter(row);
};

export const updateCharacterXpAndLevel = (level: number, currentXp: number, totalXp: number): void => {
  const db = getDb();
  db.runSync('UPDATE character SET level = ?, currentXp = ?, totalXp = ? WHERE id = 1;', [level, currentXp, totalXp]);
};

export const incrementStat = (statKey: StatKey, amount: number): void => {
  const db = getDb();
  db.runSync(`UPDATE character SET ${statKey} = ${statKey} + ? WHERE id = 1;`, [amount]);
};

export const decrementStat = (statKey: StatKey, amount: number): void => {
  const db = getDb();
  db.runSync(`UPDATE character SET ${statKey} = MAX(0, ${statKey} - ?) WHERE id = 1;`, [amount]);
};
