import {
  PlayerData,
  GameMode,
  AvatarOption,
  PartnerType,
  ClassroomId,
  PartnerData,
  CharacterCustomizationData,
  PlayerStats,
  LevelUpDetail,
  ExperienceGrantResult,
} from '../types';
import { ensureCompanionData } from './companionService';
import { ensureItemAndRoomData } from './itemAndRoomService';
import { ensureDailyMissions } from './dailyMissionService';
import { ensureStageProgress } from '../data/stageData';

const STORAGE_KEY = 'knowledge_quest_save_data_v1';

export const PLAYER_LEVEL_CONFIG = {
  MAX_LEVEL: 50,
  INITIAL_LEVEL: 1,
  INITIAL_STATS: {
    maxHp: 100,
    attack: 10,
    defense: 8,
  },
  STAT_GROWTH_PER_LEVEL: {
    maxHp: 10,
    attack: 2,
    defense: 1,
  },
  MAX_STATS: {
    maxHp: 9999,
    attack: 999,
    defense: 999,
  },
} as const;

/**
 * Calculates EXP required for next level (integer rounded)
 */
export function getRequiredExpForLevel(level: number): number {
  if (level >= PLAYER_LEVEL_CONFIG.MAX_LEVEL) return 0;
  if (!level || isNaN(level) || level <= 0) level = 1;

  const earlyExpMap: Record<number, number> = {
    1: 100,
    2: 150,
    3: 220,
    4: 300,
  };

  if (earlyExpMap[level] !== undefined) {
    return earlyExpMap[level];
  }

  const calc = Math.round(300 + (level - 4) * 100 + Math.pow(level - 4, 1.45) * 15);
  return Math.max(10, Math.min(999999, isNaN(calc) ? 100 : calc));
}

/**
 * Computes baseStats and computedStats for hero based on level
 */
export function computePlayerStats(level: number): { baseStats: PlayerStats; computedStats: PlayerStats } {
  const safeLevel = Math.max(1, Math.min(PLAYER_LEVEL_CONFIG.MAX_LEVEL, Math.floor(level || 1)));
  const lvlOffset = safeLevel - 1;

  const maxHp = Math.min(
    PLAYER_LEVEL_CONFIG.MAX_STATS.maxHp,
    Math.max(1, PLAYER_LEVEL_CONFIG.INITIAL_STATS.maxHp + PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.maxHp * lvlOffset)
  );
  const attack = Math.min(
    PLAYER_LEVEL_CONFIG.MAX_STATS.attack,
    Math.max(1, PLAYER_LEVEL_CONFIG.INITIAL_STATS.attack + PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.attack * lvlOffset)
  );
  const defense = Math.min(
    PLAYER_LEVEL_CONFIG.MAX_STATS.defense,
    Math.max(1, PLAYER_LEVEL_CONFIG.INITIAL_STATS.defense + PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.defense * lvlOffset)
  );

  const stats: PlayerStats = { maxHp, attack, defense };
  return {
    baseStats: { ...stats },
    computedStats: { ...stats },
  };
}

export const DEFAULT_CHARACTER: CharacterCustomizationData = {
  characterId: 'hero_adventurer_01',
  hairStyle: 'default_spiky',
  hairColor: 'brown',
  skinTone: 'fair',
  outfitId: 'math_adventurer_blue',
  weaponId: 'knowledge_compass',
  accessoryId: 'mini_cape',
  petId: 'none',
  animationEnabled: true,
};

export const PARTNER_DEFAULTS: Record<PartnerType, Omit<PartnerData, 'level' | 'exp' | 'maxExp' | 'happiness' | 'satiety' | 'stage'>> = {
  dragon: {
    id: 'flame_dragon',
    name: 'マグノン',
    type: 'dragon',
    element: '火',
    avatarIcon: '🔥',
    stats: { hp: 120, maxHp: 120, atk: 25, def: 18, speed: 15 },
  },
  fox: {
    id: 'leaf_fox',
    name: 'リーフォン',
    type: 'fox',
    element: '草',
    avatarIcon: '🍃',
    stats: { hp: 100, maxHp: 100, atk: 20, def: 20, speed: 25 },
  },
  golem: {
    id: 'crystal_turtle',
    name: 'アクアガメ',
    type: 'golem',
    element: '水',
    avatarIcon: '💧',
    stats: { hp: 140, maxHp: 140, atk: 18, def: 28, speed: 10 },
  },
};

/**
 * Sanitizes and fills missing fields in loaded player data for backward compatibility
 */
function sanitizePlayerData(data: any): PlayerData {
  const rawLevel = Math.max(1, Math.min(PLAYER_LEVEL_CONFIG.MAX_LEVEL, Math.floor(data.level || 1)));
  const rawExp = Math.max(0, Math.floor(data.exp ?? data.currentExp ?? data.experience ?? 0));
  const rawTotalExp = Math.max(0, Math.floor(data.totalExp ?? 0));

  const { baseStats, computedStats } = computePlayerStats(rawLevel);

  const basePlayer: PlayerData = {
    playerId: data.playerId || `user_${Math.random().toString(36).substring(2, 9)}`,
    classId: data.classId || 'class_5a',
    studentNumber: Number.isInteger(data.studentNumber) ? data.studentNumber : undefined,
    classroomLabel: data.classroomLabel,
    name: data.name || '算数勇者',
    nickname: data.nickname || data.name || '算数勇者',
    privacySetting: data.privacySetting || 'class',
    mode: data.mode || 'adventure',
    furiganaMode: data.furiganaMode || 'difficult',
    avatar: data.avatar || 'hero',
    character: {
      ...DEFAULT_CHARACTER,
      ...(data.character || {}),
    },
    level: rawLevel,
    exp: rawLevel >= PLAYER_LEVEL_CONFIG.MAX_LEVEL ? 0 : rawExp,
    currentExp: rawLevel >= PLAYER_LEVEL_CONFIG.MAX_LEVEL ? 0 : rawExp,
    totalExp: rawTotalExp,
    maxExp: rawLevel >= PLAYER_LEVEL_CONFIG.MAX_LEVEL ? 0 : getRequiredExpForLevel(rawLevel),
    points: data.points ?? 100,
    baseStats: data.baseStats || baseStats,
    computedStats: data.computedStats || computedStats,
    partner: data.partner || PARTNER_DEFAULTS.fox,
    companion: data.companion,
    companionSettings: data.companionSettings,
    battleSettings: data.battleSettings,
    stageProgress: data.stageProgress || {},
    unlockedCards: data.unlockedCards || [],
    foodItemsCount: data.foodItemsCount,
    inventory: data.inventory || {},
    gachaCollection: data.gachaCollection || {},
    itemUsageHistory: data.itemUsageHistory || [],
    companionRoom: data.companionRoom,
    dailyMissions: data.dailyMissions,
    companionEncyclopedia: data.companionEncyclopedia,
    claimedRewardIds: data.claimedRewardIds || [],
    lastDailyMissionDate: data.lastDailyMissionDate,
    hasSeenDailyPopupToday: data.hasSeenDailyPopupToday,
    unlockedRegions: data.unlockedRegions || ['area'],
    completedQuests: data.completedQuests || [],
    totalAnswered: data.totalAnswered || 0,
    correctAnswered: data.correctAnswered || 0,
    currentStreak: data.currentStreak || 0,
    studyDaysCount: data.studyDaysCount || 1,
    unitProgress: data.unitProgress || {},
    questionProgress: data.questionProgress || {},
    skillProgress: data.skillProgress || {},
    pretestProgress: data.pretestProgress || {},
    reviewSession: data.reviewSession || null,
    weakConcepts: data.weakConcepts || [],
    reviewedConcepts: data.reviewedConcepts || [],
    answerHistory: data.answerHistory || [],
    reviewItems: data.reviewItems || {},
    reviewRewardHistory: data.reviewRewardHistory || {},
    unlockedTitles: data.unlockedTitles || ['見習い冒険者'],
    lastStudyDate: data.lastStudyDate || new Date().toISOString().split('T')[0],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  const withCompanion = ensureCompanionData(basePlayer);
  const withItemsAndRoom = ensureItemAndRoomData(withCompanion);
  const withMissions = ensureDailyMissions(withItemsAndRoom);
  return ensureStageProgress(withMissions);
}

/**
 * Loads player data from localStorage
 */
export function loadPlayerData(): PlayerData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return sanitizePlayerData(parsed);
  } catch (e) {
    console.error('Failed to parse save data from localStorage:', e);
    return null;
  }
}

type SaveListener = (data: PlayerData) => void;
let saveListener: SaveListener | null = null;

export function registerSaveListener(listener: SaveListener) {
  saveListener = listener;
}

/**
 * Saves player data to localStorage and triggers registered cloud save hooks
 */
export function savePlayerData(data: PlayerData): boolean {
  console.log(`⑥ [savePlayerData] Called. player.name=${data.name}, EXP=${data.exp}, KQ=${data.points}`);
  try {
    data.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (saveListener) {
      saveListener(data);
    }
    return true;
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
    return false;
  }
}

/**
 * Checks if save data exists
 */
export function hasSaveData(): boolean {
  return loadPlayerData() !== null;
}

/**
 * Clears/Resets save data from localStorage
 */
export function resetPlayerData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove save data:', e);
  }
}

import { generateCompanionFromEgg } from './companionGenerator';

/**
 * Factory for creating a brand new Player Profile
 */
export function createInitialPlayer(
  name: string,
  mode: GameMode = 'adventure',
  avatar: AvatarOption = 'hero',
  partnerType: PartnerType = 'fox',
  eggType: string = 'egg_fluffy',
  classroomId: ClassroomId = 'class_1',
  studentNumber: number = 1
): PlayerData {
  const basePartner = PARTNER_DEFAULTS[partnerType];
  const partnerData: PartnerData = {
    ...basePartner,
    level: 1,
    exp: 0,
    maxExp: 100,
    happiness: 80,
    satiety: 80,
    stage: 1,
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const trimmedName = name.trim().slice(0, 10);

  const initialCompanion = generateCompanionFromEgg(eggType, `kq_init_seed_${Date.now()}`);

  const initialStats = computePlayerStats(1);

  const newPlayer: PlayerData = {
    playerId: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    classId: classroomId,
    studentNumber: Math.max(1, Math.min(40, Math.floor(studentNumber))),
    classroomLabel: classroomId === 'class_1' ? '1組' : classroomId === 'class_2' ? '2組' : '3組',
    name: trimmedName,
    nickname: trimmedName,
    privacySetting: 'class',
    mode,
    avatar,
    character: DEFAULT_CHARACTER,
    level: 1,
    exp: 0,
    currentExp: 0,
    totalExp: 0,
    maxExp: getRequiredExpForLevel(1),
    points: 100, // Initial welcome bonus
    baseStats: initialStats.baseStats,
    computedStats: initialStats.computedStats,
    partner: partnerData,
    companion: initialCompanion,
    companionSettings: {
      partnerAnimationEnabled: true,
      partnerDialogueEnabled: true,
      shortenGrowthAnimation: false,
    },
    foodItemsCount: 3,
    unlockedRegions: ['area'], // Area region starts unlocked
    completedQuests: [],
    totalAnswered: 0,
    correctAnswered: 0,
    currentStreak: 0,
    studyDaysCount: 1,
    unitProgress: {},
    questionProgress: {},
    skillProgress: {},
    reviewSession: null,
    weakConcepts: [],
    reviewedConcepts: [],
    unlockedTitles: ['見習い冒険者'],
    lastStudyDate: todayStr,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // A brand-new profile must contain the same complete schema as a loaded one.
  // Otherwise the first visit to inventory, missions, or the companion room
  // appears empty until the page is reloaded.
  const initializedPlayer = ensureStageProgress(
    ensureDailyMissions(ensureItemAndRoomData(newPlayer))
  );
  savePlayerData(initializedPlayer);
  return initializedPlayer;
}

/**
 * Common Experience Granting System for Hero
 * - Multi-level jumps
 * - Carries over excess EXP
 * - Enforces MAX_LEVEL 50
 * - Calculates stat diffs
 * - Avoids double addition
 */
export function addPlayerExperience(
  player: PlayerData,
  gainedExp: number,
  gainedPoints: number = 0
): ExperienceGrantResult {
  const safeGainedExp = Math.max(0, Math.floor(gainedExp || 0));
  const safeGainedPoints = Math.max(0, Math.floor(gainedPoints || 0));

  console.log(`③ [addExpAndPoints] Called. player.name=${player.name}, before EXP=${player.exp}, before KQ=${player.points}, gainedExp=${safeGainedExp}, gainedPoints=${safeGainedPoints}`);

  let oldLevel = Math.max(1, Math.min(PLAYER_LEVEL_CONFIG.MAX_LEVEL, Math.floor(player.level || 1)));
  let currentLevel = oldLevel;
  let currentExp = Math.max(0, Math.floor(player.exp ?? player.currentExp ?? 0));
  let totalExp = Math.max(0, Math.floor((player.totalExp || 0) + safeGainedExp));
  let points = Math.max(0, Math.floor((player.points || 0) + safeGainedPoints));

  let remainingGainedExp = safeGainedExp;
  let levelUpCount = 0;
  const levelUpDetails: LevelUpDetail[] = [];

  if (safeGainedExp > 0 && currentLevel < PLAYER_LEVEL_CONFIG.MAX_LEVEL) {
    let loopGuard = 0;
    while (remainingGainedExp > 0 && currentLevel < PLAYER_LEVEL_CONFIG.MAX_LEVEL && loopGuard < 100) {
      loopGuard++;
      const reqExp = getRequiredExpForLevel(currentLevel);
      const neededForNext = reqExp - currentExp;

      if (remainingGainedExp >= neededForNext) {
        remainingGainedExp -= neededForNext;
        currentExp = 0;
        const fromLvl = currentLevel;
        currentLevel += 1;
        levelUpCount += 1;

        const statGains = {
          maxHp: PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.maxHp,
          attack: PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.attack,
          defense: PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.defense,
        };

        levelUpDetails.push({
          fromLevel: fromLvl,
          toLevel: currentLevel,
          reqExp,
          statGains,
        });
      } else {
        currentExp += remainingGainedExp;
        remainingGainedExp = 0;
      }
    }
  }

  if (currentLevel >= PLAYER_LEVEL_CONFIG.MAX_LEVEL) {
    currentLevel = PLAYER_LEVEL_CONFIG.MAX_LEVEL;
    currentExp = 0;
  }

  const { baseStats, computedStats } = computePlayerStats(currentLevel);
  const oldStats = computePlayerStats(oldLevel).baseStats;

  const statDiff: PlayerStats = {
    maxHp: baseStats.maxHp - oldStats.maxHp,
    attack: baseStats.attack - oldStats.attack,
    defense: baseStats.defense - oldStats.defense,
  };

  const maxExp = currentLevel >= PLAYER_LEVEL_CONFIG.MAX_LEVEL ? 0 : getRequiredExpForLevel(currentLevel);

  // Partner growth alignment
  const partner = player.partner ? { ...player.partner, stats: player.partner.stats ? { ...player.partner.stats } : undefined } : undefined;
  if (levelUpCount > 0 && partner && partner.stats) {
    partner.level = (partner.level || 1) + levelUpCount;
    partner.stats.maxHp = (partner.stats.maxHp || 100) + 15 * levelUpCount;
    partner.stats.hp = partner.stats.maxHp;
    partner.stats.atk = (partner.stats.atk || 20) + 4 * levelUpCount;
    partner.stats.def = (partner.stats.def || 15) + 4 * levelUpCount;
    partner.stats.speed = (partner.stats.speed || 12) + 2 * levelUpCount;

    if (partner.level >= 5 && partner.stage === 1) {
      partner.stage = 2;
    } else if (partner.level >= 10 && partner.stage === 2) {
      partner.stage = 3;
    }
  }

  const updatedPlayer: PlayerData = {
    ...player,
    level: currentLevel,
    exp: currentExp,
    currentExp,
    totalExp,
    maxExp,
    points,
    baseStats,
    computedStats,
    partner,
    updatedAt: new Date().toISOString(),
  };

  console.log(`④/⑤ [addExpAndPoints] Values updated. player.name=${updatedPlayer.name}, after EXP=${updatedPlayer.exp}, after KQ=${updatedPlayer.points}`);

  savePlayerData(updatedPlayer);

  return {
    updatedPlayer,
    oldLevel,
    newLevel: currentLevel,
    gainedExp: safeGainedExp,
    levelUpCount,
    levelUpDetails,
    currentExp,
    maxExp,
    statDiff,
    leveledUp: levelUpCount > 0,
  };
}

/**
 * Backward-compatible helper to update player EXP and Level
 */
export function addExpAndPoints(
  player: PlayerData,
  gainedExp: number,
  gainedPoints: number = 0
): { updatedPlayer: PlayerData; leveledUp: boolean; expResult: ExperienceGrantResult } {
  const expResult = addPlayerExperience(player, gainedExp, gainedPoints);
  return {
    updatedPlayer: expResult.updatedPlayer,
    leveledUp: expResult.leveledUp,
    expResult,
  };
}

