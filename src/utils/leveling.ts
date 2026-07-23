import { Character, LevelUpResult } from '@/types';
import { getRankForLevel, xpRequiredForLevel } from '@/constants/gameData';

/**
 * Applies an XP gain to a character, resolving any level-ups (potentially multiple
 * at once for large XP awards), and returns the updated character plus level-up info.
 */
export const applyXpGain = (
  character: Character,
  xpGained: number
): { character: Character; result: LevelUpResult } => {
  let level = character.level;
  let currentXp = character.currentXp + xpGained;
  const totalXp = character.totalXp + xpGained;
  const previousLevel = character.level;

  let needed = xpRequiredForLevel(level);
  while (currentXp >= needed) {
    currentXp -= needed;
    level += 1;
    needed = xpRequiredForLevel(level);
  }

  const previousRank = getRankForLevel(previousLevel);
  const newRank = getRankForLevel(level);

  const updatedCharacter: Character = {
    ...character,
    level,
    currentXp,
    totalXp,
  };

  const result: LevelUpResult = {
    didLevelUp: level > previousLevel,
    newLevel: level,
    previousLevel,
    newRank,
    previousRank,
    didRankUp: newRank.name !== previousRank.name,
  };

  return { character: updatedCharacter, result };
};

/**
 * Reverses an XP gain (used when un-completing a quest), clamping at level 1 / 0 xp.
 */
export const revertXpGain = (character: Character, xpToRemove: number): Character => {
  let level = character.level;
  let currentXp = character.currentXp - xpToRemove;
  let totalXp = Math.max(0, character.totalXp - xpToRemove);

  while (currentXp < 0 && level > 1) {
    level -= 1;
    currentXp += xpRequiredForLevel(level);
  }

  if (currentXp < 0) currentXp = 0;

  return { ...character, level, currentXp, totalXp };
};

export const getXpProgress = (character: Character): { needed: number; ratio: number } => {
  const needed = xpRequiredForLevel(character.level);
  const ratio = Math.min(1, Math.max(0, character.currentXp / needed));
  return { needed, ratio };
};
