import * as SQLite from 'expo-sqlite';
import { ACHIEVEMENT_DEFS } from '@/constants/gameData';

const DB_NAME = 'questforge.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDb = (): SQLite.SQLiteDatabase => {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
  }
  return dbInstance;
};

let initialized = false;

export const initDatabase = (): void => {
  if (initialized) return;
  initialized = true;
  const db = getDb();

  db.execSync('PRAGMA journal_mode = WAL;');
  db.execSync('PRAGMA foreign_keys = ON;');

  db.execSync(`
    CREATE TABLE IF NOT EXISTS quests (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      xpReward INTEGER NOT NULL,
      dueDate TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      completedAt TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS character (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      level INTEGER NOT NULL DEFAULT 1,
      currentXp INTEGER NOT NULL DEFAULT 0,
      totalXp INTEGER NOT NULL DEFAULT 0,
      strength INTEGER NOT NULL DEFAULT 0,
      knowledge INTEGER NOT NULL DEFAULT 0,
      programming INTEGER NOT NULL DEFAULT 0,
      health INTEGER NOT NULL DEFAULT 0,
      focus INTEGER NOT NULL DEFAULT 0,
      discipline INTEGER NOT NULL DEFAULT 0
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS streaks (
      type TEXT PRIMARY KEY NOT NULL,
      current INTEGER NOT NULL DEFAULT 0,
      best INTEGER NOT NULL DEFAULT 0,
      lastActiveDate TEXT
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY NOT NULL,
      unlocked INTEGER NOT NULL DEFAULT 0,
      unlockedAt TEXT
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS daily_logs (
      date TEXT PRIMARY KEY NOT NULL,
      questsCompleted INTEGER NOT NULL DEFAULT 0,
      xpEarned INTEGER NOT NULL DEFAULT 0
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // Seed singleton character row if missing
  const existingChar = db.getFirstSync<{ id: number }>('SELECT id FROM character WHERE id = 1;');
  if (!existingChar) {
    db.runSync(
      `INSERT INTO character (id, level, currentXp, totalXp, strength, knowledge, programming, health, focus, discipline)
       VALUES (1, 1, 0, 0, 0, 0, 0, 0, 0, 0);`
    );
  }

  // Seed streak rows if missing
  const streakTypes = ['daily', 'study', 'workout', 'overall'];
  for (const type of streakTypes) {
    const existing = db.getFirstSync<{ type: string }>('SELECT type FROM streaks WHERE type = ?;', [type]);
    if (!existing) {
      db.runSync('INSERT INTO streaks (type, current, best, lastActiveDate) VALUES (?, 0, 0, NULL);', [type]);
    }
  }

  // Seed achievement rows if missing
  for (const def of ACHIEVEMENT_DEFS) {
    const existing = db.getFirstSync<{ id: string }>('SELECT id FROM achievements WHERE id = ?;', [def.id]);
    if (!existing) {
      db.runSync('INSERT INTO achievements (id, unlocked, unlockedAt) VALUES (?, 0, NULL);', [def.id]);
    }
  }
};
