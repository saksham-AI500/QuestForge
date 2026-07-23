import { getDb } from './db';
import { Quest, QuestCategory, QuestInput } from '@/types';
import { XP_VALUES } from '@/constants/gameData';

const rowToQuest = (row: any): Quest => ({
  id: row.id,
  title: row.title,
  notes: row.notes,
  category: row.category,
  difficulty: row.difficulty,
  xpReward: row.xpReward,
  dueDate: row.dueDate,
  completed: !!row.completed,
  completedAt: row.completedAt,
  createdAt: row.createdAt,
});

const genId = (): string => `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const getAllQuests = (): Quest[] => {
  const db = getDb();
  const rows = db.getAllSync<any>('SELECT * FROM quests ORDER BY completed ASC, createdAt DESC;');
  return rows.map(rowToQuest);
};

export const getQuestById = (id: string): Quest | null => {
  const db = getDb();
  const row = db.getFirstSync<any>('SELECT * FROM quests WHERE id = ?;', [id]);
  return row ? rowToQuest(row) : null;
};

export const createQuest = (input: QuestInput): Quest => {
  const db = getDb();
  const id = genId();
  const createdAt = new Date().toISOString();
  const xpReward = XP_VALUES[input.difficulty];

  db.runSync(
    `INSERT INTO quests (id, title, notes, category, difficulty, xpReward, dueDate, completed, completedAt, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL, ?);`,
    [id, input.title, input.notes, input.category, input.difficulty, xpReward, input.dueDate, createdAt]
  );

  return {
    id,
    title: input.title,
    notes: input.notes,
    category: input.category,
    difficulty: input.difficulty,
    xpReward,
    dueDate: input.dueDate,
    completed: false,
    completedAt: null,
    createdAt,
  };
};

export const updateQuest = (id: string, input: QuestInput): void => {
  const db = getDb();
  const xpReward = XP_VALUES[input.difficulty];
  db.runSync(
    `UPDATE quests SET title = ?, notes = ?, category = ?, difficulty = ?, xpReward = ?, dueDate = ? WHERE id = ?;`,
    [input.title, input.notes, input.category, input.difficulty, xpReward, input.dueDate, id]
  );
};

export const deleteQuest = (id: string): void => {
  const db = getDb();
  db.runSync('DELETE FROM quests WHERE id = ?;', [id]);
};

export const setQuestCompleted = (id: string, completed: boolean): void => {
  const db = getDb();
  const completedAt = completed ? new Date().toISOString() : null;
  db.runSync('UPDATE quests SET completed = ?, completedAt = ? WHERE id = ?;', [completed ? 1 : 0, completedAt, id]);
};

export const getCompletedQuestsCount = (): number => {
  const db = getDb();
  const row = db.getFirstSync<{ c: number }>('SELECT COUNT(*) as c FROM quests WHERE completed = 1;');
  return row?.c ?? 0;
};

export const getCompletedCountByCategory = (category: QuestCategory): number => {
  const db = getDb();
  const row = db.getFirstSync<{ c: number }>(
    'SELECT COUNT(*) as c FROM quests WHERE completed = 1 AND category = ?;',
    [category]
  );
  return row?.c ?? 0;
};

export const getCategoryBreakdown = (): { category: QuestCategory; completed: number; xp: number }[] => {
  const db = getDb();
  const rows = db.getAllSync<{ category: QuestCategory; completed: number; xp: number }>(
    `SELECT category, COUNT(*) as completed, SUM(xpReward) as xp
     FROM quests WHERE completed = 1 GROUP BY category;`
  );
  return rows;
};

export const getQuestsCompletedBetween = (startIso: string, endIso: string): Quest[] => {
  const db = getDb();
  const rows = db.getAllSync<any>(
    `SELECT * FROM quests WHERE completed = 1 AND completedAt >= ? AND completedAt <= ? ORDER BY completedAt ASC;`,
    [startIso, endIso]
  );
  return rows.map(rowToQuest);
};

export const getTodaysQuests = (todayDateStr: string): Quest[] => {
  const db = getDb();
  // Quests due today, or with no due date and not completed, or completed today
  const rows = db.getAllSync<any>(
    `SELECT * FROM quests
     WHERE dueDate = ?
        OR (dueDate IS NULL AND completed = 0)
        OR (completed = 1 AND substr(completedAt, 1, 10) = ?)
     ORDER BY completed ASC, createdAt DESC;`,
    [todayDateStr, todayDateStr]
  );
  return rows.map(rowToQuest);
};
