import {
  PlayerData,
  CompanionData,
  CompanionSettings,
  CompanionGrowthLogEntry,
  CompanionEvolutionType,
  CompanionRarity,
} from '../types';
import { generateCompanionFromEgg } from './companionGenerator';
import { COMPANION_PERSONALITIES, COMPANION_SPECIES } from '../data/companionParts';

export function getInitialCompanionSettings(): CompanionSettings {
  return {
    partnerAnimationEnabled: true,
    partnerDialogueEnabled: true,
    shortenGrowthAnimation: false,
  };
}

/**
 * Ensures player object has valid companion & companionSettings fields with full schema compatibility
 */
export function ensureCompanionData(player: PlayerData): PlayerData {
  let updatedCompanion = player.companion;

  if (!updatedCompanion || !updatedCompanion.companionId) {
    // Generate fresh companion from default egg
    updatedCompanion = generateCompanionFromEgg('egg_fluffy', `kq_seed_init_${Date.now()}`);
  } else {
    // Backwards compatibility check for missing fields in existing data
    const seed = updatedCompanion.generationSeed || `seed_${updatedCompanion.companionId}`;
    const eggType = updatedCompanion.chosenEggType || 'egg_fluffy';

    const fallback = generateCompanionFromEgg(
      eggType,
      seed,
      updatedCompanion.name
    );

    updatedCompanion = {
      ...fallback,
      ...updatedCompanion, // Retain existing name, level, exp, bond, stage, etc.
      generationSeed: updatedCompanion.generationSeed || seed,
      chosenEggType: updatedCompanion.chosenEggType || eggType,
      attribute: updatedCompanion.attribute || fallback.attribute,
      personality: updatedCompanion.personality || fallback.personality,
      birthRarity: updatedCompanion.birthRarity || fallback.birthRarity,
      currentRarity: updatedCompanion.currentRarity || fallback.currentRarity,
      appearance: {
        ...fallback.appearance,
        ...(updatedCompanion.appearance || {}),
      },
      progressTraits: updatedCompanion.progressTraits || fallback.progressTraits,
      evolutionType: updatedCompanion.evolutionType || fallback.evolutionType,
      unlockedAccessories: updatedCompanion.unlockedAccessories || ['adv_hat'],
      zukanDiscoveredSpecies: Array.from(
        new Set([...(updatedCompanion.zukanDiscoveredSpecies || []), updatedCompanion.speciesId || fallback.speciesId])
      ),
      zukanDiscoveredAttributes: Array.from(
        new Set([...(updatedCompanion.zukanDiscoveredAttributes || []), updatedCompanion.attribute || fallback.attribute])
      ),
      zukanDiscoveredPatterns: Array.from(
        new Set([...(updatedCompanion.zukanDiscoveredPatterns || []), updatedCompanion.appearance?.patternType || fallback.appearance.patternType])
      ),
    };
  }

  const updatedSettings = player.companionSettings || getInitialCompanionSettings();
  const foodCount = player.foodItemsCount ?? 3;

  return {
    ...player,
    companion: updatedCompanion,
    companionSettings: updatedSettings,
    foodItemsCount: foodCount,
  };
}

export interface AddKnowledgeEnergyResult {
  updatedPlayer: PlayerData;
  energyGained: number;
  newTotalEnergy: number;
  canTriggerHatching: boolean;
  canTriggerChildGrowth: boolean;
}

/**
 * Adds Knowledge Energy to the companion and checks hatching/growth triggers
 */
export function addKnowledgeEnergy(
  playerInput: PlayerData,
  amount: number,
  sourceReason: string
): AddKnowledgeEnergyResult {
  const player = ensureCompanionData(playerInput);
  const comp = player.companion!;

  const currentEnergy = comp.growthExp || 0;
  const newEnergy = currentEnergy + amount;
  const newLevel = Math.floor(newEnergy / 30) + 1;

  // Check hatching condition: Energy >= 50 and stage === 'egg'
  const canTriggerHatching = comp.stage === 'egg' && newEnergy >= 50;

  // Check child growth condition
  const uniqueClearedCount = Object.values(player.questionProgress || {}).filter((q) => q.isFirstCleared).length;
  const reviewCount = (player.reviewedConcepts || []).length + (player.reviewSession?.isCompleted ? 1 : 0);

  const canTriggerChildGrowth =
    comp.stage === 'hatched' &&
    newEnergy >= 150 &&
    uniqueClearedCount >= 10 &&
    reviewCount >= 1;

  const updatedCompanion: CompanionData = {
    ...comp,
    growthExp: newEnergy,
    level: newLevel,
  };

  const updatedPlayer: PlayerData = {
    ...player,
    companion: updatedCompanion,
  };

  return {
    updatedPlayer,
    energyGained: amount,
    newTotalEnergy: newEnergy,
    canTriggerHatching,
    canTriggerChildGrowth,
  };
}

/**
 * Handles companion naming during hatching event
 */
export function setCompanionNameAndHatch(
  playerInput: PlayerData,
  newName: string
): PlayerData {
  const player = ensureCompanionData(playerInput);
  const comp = player.companion!;
  const speciesInfo = COMPANION_SPECIES[comp.speciesId] || COMPANION_SPECIES.mokoru;
  const cleanedName = newName.trim().substring(0, 8) || speciesInfo.name;
  const todayStr = new Date().toISOString().split('T')[0];

  const newLog: CompanionGrowthLogEntry = {
    id: `log_hatched_${Date.now()}`,
    type: 'hatched',
    title: '相棒が誕生！',
    description: `${speciesInfo.eggName}から「${cleanedName}」が生まれました！一緒にマスリア王国を冒険しよう！`,
    date: todayStr,
    icon: '✨',
    cardBadge: '誕生記念',
  };

  const updatedCompanion: CompanionData = {
    ...comp,
    name: cleanedName,
    stage: 'hatched',
    hatchedAt: new Date().toISOString(),
    unlockedActions: ['pet', 'feed', 'play', 'talk'],
    growthLogs: [newLog, ...(comp.growthLogs || [])],
    zukanDiscoveredSpecies: Array.from(new Set([...(comp.zukanDiscoveredSpecies || []), comp.speciesId])),
    zukanDiscoveredAttributes: Array.from(new Set([...(comp.zukanDiscoveredAttributes || []), comp.attribute])),
  };

  return {
    ...player,
    companion: updatedCompanion,
  };
}

/**
 * Handles evolving companion to Child (幼体) stage
 */
export function evolveCompanionToChild(playerInput: PlayerData): PlayerData {
  const player = ensureCompanionData(playerInput);
  const comp = player.companion!;
  const todayStr = new Date().toISOString().split('T')[0];

  const newLog: CompanionGrowthLogEntry = {
    id: `log_child_${Date.now()}`,
    type: 'grown_child',
    title: '幼体へ成長！',
    description: 'たくさんの知識と挑戦によって、相棒がたくましく成長しました！',
    date: todayStr,
    icon: '🌟',
    cardBadge: '成長記念',
  };

  const updatedCompanion: CompanionData = {
    ...comp,
    stage: 'child',
    grownChildAt: new Date().toISOString(),
    growthLogs: [newLog, ...(comp.growthLogs || [])],
  };

  return {
    ...player,
    companion: updatedCompanion,
  };
}

/**
 * Calculates highest trait to determine Evolution Type (進化傾向)
 */
export function calculateEvolutionType(comp: CompanionData): CompanionEvolutionType {
  const traits = comp.progressTraits || {
    insightPoints: 0,
    effortPoints: 0,
    adventurePoints: 0,
    bondPoints: 0,
    couragePoints: 0,
  };

  const traitEntries: { type: CompanionEvolutionType; val: number }[] = [
    { type: 'hirameki', val: traits.insightPoints },
    { type: 'doryoku', val: traits.effortPoints },
    { type: 'bouken', val: traits.adventurePoints },
    { type: 'kizuna', val: traits.bondPoints },
    { type: 'yuuki', val: traits.couragePoints },
  ];

  traitEntries.sort((a, b) => b.val - a.val);
  return traitEntries[0].type;
}

/**
 * Updates progress traits (insight, effort, adventure, bond, courage) and checks evolution type
 */
export function updateProgressTrait(
  playerInput: PlayerData,
  traitKey: 'insightPoints' | 'effortPoints' | 'adventurePoints' | 'bondPoints' | 'couragePoints',
  delta: number = 1
): PlayerData {
  const player = ensureCompanionData(playerInput);
  const comp = player.companion!;

  const traits = comp.progressTraits || {
    insightPoints: 0,
    effortPoints: 0,
    adventurePoints: 0,
    bondPoints: 0,
    couragePoints: 0,
  };

  const newTraits = {
    ...traits,
    [traitKey]: traits[traitKey] + delta,
  };

  const updatedComp: CompanionData = {
    ...comp,
    progressTraits: newTraits,
  };

  updatedComp.evolutionType = calculateEvolutionType(updatedComp);

  return {
    ...player,
    companion: updatedComp,
  };
}

/**
 * Rarity Upgrade Requirements check
 */
export interface RarityUpgradeRequirementStatus {
  canUpgrade: boolean;
  nextRarity?: CompanionRarity;
  requirementsSummary: string[];
}

export function checkRarityUpgradeRequirements(playerInput: PlayerData): RarityUpgradeRequirementStatus {
  const player = ensureCompanionData(playerInput);
  const comp = player.companion!;

  const currentRarity = comp.currentRarity || 'N';
  const uniqueCleared = Object.values(player.questionProgress || {}).filter((q) => q.isFirstCleared).length;
  const clearedUnits = Object.values(player.unitProgress || {}).filter((u) => u.cleared || u.mastered || u.isUnitCompleted).length;
  const reviewedConcepts = (player.reviewedConcepts || []).length;
  const retriedCleared = Object.values(player.questionProgress || {}).filter(
    (q) => q.incorrectCount > 0 && q.correctCount > 0
  ).length;

  if (currentRarity === 'N') {
    const qOk = uniqueCleared >= 20;
    const bondOk = comp.bond >= 30;
    return {
      canUpgrade: qOk && bondOk,
      nextRarity: 'R',
      requirementsSummary: [
        `異なる問題 20問初回クリア (${uniqueCleared}/20)`,
        `きずな度 30以上 (${comp.bond}/30)`,
      ],
    };
  } else if (currentRarity === 'R') {
    const qOk = uniqueCleared >= 50;
    const uOk = clearedUnits >= 2;
    const rOk = reviewedConcepts >= 3;
    return {
      canUpgrade: qOk && uOk && rOk,
      nextRarity: 'SR',
      requirementsSummary: [
        `異なる問題 50問初回クリア (${uniqueCleared}/50)`,
        `単元 2つ完全クリア (${clearedUnits}/2)`,
        `基礎復習 3回完了 (${reviewedConcepts}/3)`,
      ],
    };
  } else if (currentRarity === 'SR') {
    const qOk = uniqueCleared >= 100;
    const uOk = clearedUnits >= 5;
    const bondOk = comp.bond >= 100;
    const retryOk = retriedCleared >= 10;
    return {
      canUpgrade: qOk && uOk && bondOk && retryOk,
      nextRarity: 'UR',
      requirementsSummary: [
        `異なる問題 100問初回クリア (${uniqueCleared}/100)`,
        `単元 5つ完全クリア (${clearedUnits}/5)`,
        `きずな度 100以上 (${comp.bond}/100)`,
        `苦手問題への再挑戦クリア 10回 (${retriedCleared}/10)`,
      ],
    };
  }

  return {
    canUpgrade: false,
    requirementsSummary: ['最高レア度達成中！'],
  };
}

/**
 * Executes Rarity Upgrade (N->R, R->SR, SR->UR)
 */
export function executeRarityUpgrade(playerInput: PlayerData): PlayerData {
  const player = ensureCompanionData(playerInput);
  const comp = player.companion!;
  const req = checkRarityUpgradeRequirements(player);

  if (!req.canUpgrade || !req.nextRarity) return player;

  const nextRarity = req.nextRarity;
  const todayStr = new Date().toISOString().split('T')[0];

  // Upgrade Appearance with special parts according to new rarity
  const newAppearance = { ...comp.appearance };
  if (nextRarity === 'R') {
    newAppearance.patternType = newAppearance.patternType === 'none' ? 'stripes' : newAppearance.patternType;
    newAppearance.effectType = 'gentle_sparkles';
  } else if (nextRarity === 'SR') {
    newAppearance.hornType = newAppearance.hornType || 'crystal_horns';
    newAppearance.wingType = newAppearance.wingType || 'feather_wings';
    newAppearance.effectType = 'sparkles';
  } else if (nextRarity === 'UR') {
    newAppearance.hornType = 'small_crown';
    newAppearance.wingType = 'light_wings';
    newAppearance.effectType = 'aurora_cosmic';
  }

  const newLog: CompanionGrowthLogEntry = {
    id: `log_rarity_${Date.now()}`,
    type: 'rarity_upgraded',
    title: `レア度アップ！【${nextRarity}】へ到達！`,
    description: `日々のたゆまぬ知識の研鑽により、相棒がさらなる輝きを放つ【${nextRarity}】へと進化しました！`,
    date: todayStr,
    icon: '💎',
    cardBadge: `進化【${nextRarity}】`,
  };

  const updatedComp: CompanionData = {
    ...comp,
    currentRarity: nextRarity,
    rarityUpgraded: true,
    appearance: newAppearance,
    growthLogs: [newLog, ...(comp.growthLogs || [])],
  };

  return {
    ...player,
    companion: updatedComp,
  };
}

export interface CareResult {
  updatedPlayer: PlayerData;
  rewardClaimed: boolean;
  bondGained: number;
  message: string;
  reactionExpression: 'happy' | 'normal' | 'thinking' | 'sleeping' | 'levelup';
}

/**
 * Care interaction (お世話) logic
 */
export function careCompanion(
  playerInput: PlayerData,
  actionType: 'polish' | 'talk_egg' | 'pet' | 'feed' | 'play' | 'talk'
): CareResult {
  let player = ensureCompanionData(playerInput);
  let comp = player.companion!;
  const todayStr = new Date().toISOString().split('T')[0];
  const lastDates = comp.lastCaredDates || {};

  let bondGained = 0;
  let rewardClaimed = false;
  let message = '';
  let reactionExpression: 'happy' | 'normal' | 'thinking' | 'sleeping' | 'levelup' = 'happy';

  const personalityData = COMPANION_PERSONALITIES[comp.personality] || COMPANION_PERSONALITIES.ganbariya;

  if (comp.stage === 'egg') {
    if (actionType === 'polish') {
      if (lastDates.petDate !== todayStr) {
        rewardClaimed = true;
        bondGained = 8;
        message = 'タマゴを磨いた！あたたかい知識の光がほんのり強くなったよ！';
      } else {
        message = 'タマゴはピカピカに輝いているよ！心が通じ合っている気がする。';
      }
    } else {
      if (lastDates.talkDate !== todayStr) {
        rewardClaimed = true;
        bondGained = 5;
        message = 'タマゴにやさしく声をかけた！中でコクコクと頷いた気がするよ。';
      } else {
        message = '「これからもよろしくね！」タマゴが愛おしく温かい。';
      }
    }
  } else {
    // Hatched or Child stage
    if (actionType === 'pet') {
      if (lastDates.petDate !== todayStr) {
        rewardClaimed = true;
        bondGained = 8;
        message = `「${comp.name}」を優しくなでた！${personalityData.careDialogues[0] || '嬉しそうに目を細めているよ！'}`;
      } else {
        message = `「${comp.name}」はなでられてとても気持ち良さそうだ♪`;
      }
    } else if (actionType === 'feed') {
      const foodLeft = player.foodItemsCount || 0;
      if (foodLeft <= 0) {
        return {
          updatedPlayer: player,
          rewardClaimed: false,
          bondGained: 0,
          message: 'おやつがありません！算数の問題や試練をクリアしておやつを獲得しよう！',
          reactionExpression: 'thinking',
        };
      }
      rewardClaimed = true;
      bondGained = 10;
      message = `知識のおやつをあげた！「${comp.name}」はパワー全開でおいしそうに食べた！`;
    } else if (actionType === 'play') {
      if (lastDates.playDate !== todayStr) {
        rewardClaimed = true;
        bondGained = 8;
        message = `「${comp.name}」と一緒に数字パズルで遊んだ！楽しそうだね！`;
      } else {
        message = `「${comp.name}」はまだまだ元気に飛び跳ねているよ！`;
      }
    } else {
      // talk
      if (lastDates.talkDate !== todayStr) {
        rewardClaimed = true;
        bondGained = 5;
        message = `「${comp.name}」と会話した！「${personalityData.normalDialogues[0]}」`;
      } else {
        const dialogs = personalityData.normalDialogues;
        message = `「${comp.name}」：${dialogs[Math.floor(Math.random() * dialogs.length)]}`;
      }
    }
  }

  const newBond = comp.bond + bondGained;
  const newFoodCount = actionType === 'feed' && rewardClaimed ? Math.max(0, (player.foodItemsCount || 0) - 1) : (player.foodItemsCount || 0);

  const newLastDates = {
    ...lastDates,
    petDate: (actionType === 'pet' || actionType === 'polish') && rewardClaimed ? todayStr : lastDates.petDate,
    playDate: actionType === 'play' && rewardClaimed ? todayStr : lastDates.playDate,
    talkDate: (actionType === 'talk' || actionType === 'talk_egg') && rewardClaimed ? todayStr : lastDates.talkDate,
  };

  const updatedCompanion: CompanionData = {
    ...comp,
    bond: newBond,
    lastInteractionAt: new Date().toISOString(),
    lastCaredDates: newLastDates,
  };

  // Add bond points to progress traits if reward claimed
  player = {
    ...player,
    companion: updatedCompanion,
    foodItemsCount: newFoodCount,
  };

  if (rewardClaimed) {
    player = updateProgressTrait(player, 'bondPoints', 1);
  }

  return {
    updatedPlayer: player,
    rewardClaimed,
    bondGained,
    message,
    reactionExpression,
  };
}
