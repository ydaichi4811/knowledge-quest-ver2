import {
  PlayerData,
  DailyMission,
  DailyMissionType,
  DailyMissionReward,
} from '../types';
import { ensureItemAndRoomData, addInventoryItem } from './itemAndRoomService';
import { addKnowledgeEnergy } from './companionService';

export interface MissionTemplate {
  type: DailyMissionType;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  isEasy: boolean;
  reward: DailyMissionReward;
}

export const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    type: 'talk_companion_1',
    title: '相棒に声をかけよう',
    description: '相棒のお部屋で相棒に1回声をかけてコミュニケーションを取ろう！',
    icon: '💬',
    targetValue: 1,
    isEasy: true,
    reward: { bond: 5, points: 20, itemId: 'kizuna_milk', itemQuantity: 1, label: 'きずなのミルク×1, 20pt' },
  },
  {
    type: 'first_clear_1',
    title: '新しい問題に挑戦！',
    description: 'まだクリアしていない新しい問題を1問正解しよう！',
    icon: '✨',
    targetValue: 1,
    isEasy: true,
    reward: { energy: 20, points: 30, itemId: 'knowledge_fruit', itemQuantity: 1, label: '知識の実×1, 20エネルギー' },
  },
  {
    type: 'answer_3',
    title: '問題に3問チャレンジ',
    description: 'どんな単元でもOK！問題を3問解いてみよう！',
    icon: '✏️',
    targetValue: 3,
    isEasy: false,
    reward: { energy: 30, points: 40, itemId: 'hirameki_candy', itemQuantity: 1, label: 'ひらめきキャンディ×1, 40pt' },
  },
  {
    type: 'foundation_review_1',
    title: '基礎復習で土台づくり',
    description: 'つまずき基礎復習を1回完了して知識をしっかり固めよう！',
    icon: '📚',
    targetValue: 1,
    isEasy: false,
    reward: { energy: 25, points: 35, itemId: 'courage_cookie', itemQuantity: 1, label: '勇気のクッキー×1, 35pt' },
  },
  {
    type: 'retry_incorrect_1',
    title: '間違えた問題への再挑戦',
    description: '過去に間違えた問題に再挑戦して克服しよう！',
    icon: '🛡️',
    targetValue: 1,
    isEasy: false,
    reward: { energy: 30, points: 50, itemId: 'courage_cookie', itemQuantity: 1, label: '勇気のクッキー×1, 50pt' },
  },
  {
    type: 'different_unit_1',
    title: '別の単元へ大冒険',
    description: 'いつもと違う単元の問題に1問回答してみよう！',
    icon: '🧭',
    targetValue: 1,
    isEasy: false,
    reward: { energy: 35, points: 40, itemId: 'star_fragment', itemQuantity: 1, label: '星のかけら×1, 40pt' },
  },
  {
    type: 'play_companion_1',
    title: '相棒となかよく遊ぼう',
    description: 'お部屋で相棒となでなでやあそびを1回して絆を深めよう！',
    icon: '🎾',
    targetValue: 1,
    isEasy: true,
    reward: { bond: 5, points: 25, itemId: 'kizuna_milk', itemQuantity: 1, label: 'きずなのミルク×1, 25pt' },
  },
  {
    type: 'study_10min',
    title: '10分間集中して学習',
    description: '今日合計10分間（または問題5問回答）集中して学習に取り組もう！',
    icon: '⏱️',
    targetValue: 5,
    isEasy: false,
    reward: { energy: 40, points: 60, itemId: 'evolution_dew', itemQuantity: 1, label: '進化のしずく×1, 60pt' },
  },
];

/**
 * Deterministically generates 3 daily missions for a given date YYYY-MM-DD
 */
export function generateMissionsForDate(dateStr: string): DailyMission[] {
  // Convert date string into seed number
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed << 5) - seed + dateStr.charCodeAt(i);
    seed |= 0;
  }
  const absSeed = Math.abs(seed);

  // Separate easy and standard candidates
  const easyCandidates = MISSION_TEMPLATES.filter((m) => m.isEasy);
  const otherCandidates = MISSION_TEMPLATES.filter((m) => !m.isEasy);

  // Pick 1 easy mission
  const easyIndex = absSeed % easyCandidates.length;
  const pickedEasy = easyCandidates[easyIndex];

  // Pick 2 other missions
  const otherIndex1 = (absSeed + 1) % otherCandidates.length;
  let otherIndex2 = (absSeed + 3) % otherCandidates.length;
  if (otherIndex2 === otherIndex1) {
    otherIndex2 = (otherIndex1 + 1) % otherCandidates.length;
  }

  const picked1 = otherCandidates[otherIndex1];
  const picked2 = otherCandidates[otherIndex2];

  const selectedTemplates = [pickedEasy, picked1, picked2];

  return selectedTemplates.map((template, idx) => ({
    date: dateStr,
    missionId: `mission_${dateStr}_${template.type}_${idx}`,
    type: template.type,
    title: template.title,
    description: template.description,
    icon: template.icon,
    targetValue: template.targetValue,
    currentValue: 0,
    isCompleted: false,
    rewardClaimed: false,
    reward: template.reward,
  }));
}

/**
 * Ensures player has today's active daily missions
 */
export function ensureDailyMissions(playerInput: PlayerData): PlayerData {
  const player = ensureItemAndRoomData(playerInput);
  const todayStr = new Date().toISOString().split('T')[0];

  // Check if player already has active missions for today
  if (
    player.dailyMissions &&
    player.dailyMissions.length === 3 &&
    player.lastDailyMissionDate === todayStr
  ) {
    return player; // Same day, keep exact existing mission progress!
  }

  // New day or missing missions -> generate deterministic missions for today
  const newMissions = generateMissionsForDate(todayStr);

  return {
    ...player,
    dailyMissions: newMissions,
    lastDailyMissionDate: todayStr,
  };
}

/**
 * Updates daily mission progress based on user actions
 */
export function updateDailyMissionProgress(
  playerInput: PlayerData,
  actionType: DailyMissionType,
  increment: number = 1
): PlayerData {
  let player = ensureDailyMissions(playerInput);
  const missions = player.dailyMissions || [];

  let changed = false;

  const updatedMissions = missions.map((m) => {
    if (m.type === actionType) {
      const newCurrent = Math.min(m.targetValue, m.currentValue + increment);
      const isCompleted = newCurrent >= m.targetValue;
      if (newCurrent !== m.currentValue || isCompleted !== m.isCompleted) {
        changed = true;
        return {
          ...m,
          currentValue: newCurrent,
          isCompleted,
        };
      }
    }
    return m;
  });

  if (!changed) return player;

  return {
    ...player,
    dailyMissions: updatedMissions,
  };
}

/**
 * Claims reward for a completed daily mission with duplicate prevention
 */
export function claimDailyMissionReward(
  playerInput: PlayerData,
  missionId: string
): { updatedPlayer: PlayerData; success: boolean; rewardMessage: string } {
  let player = ensureDailyMissions(playerInput);
  const missions = player.dailyMissions || [];
  const targetMission = missions.find((m) => m.missionId === missionId);

  if (!targetMission) {
    return { updatedPlayer: player, success: false, rewardMessage: 'ミッションが見つかりません。' };
  }

  if (!targetMission.isCompleted) {
    return { updatedPlayer: player, success: false, rewardMessage: 'ミッションが未達成です。' };
  }

  if (targetMission.rewardClaimed) {
    return { updatedPlayer: player, success: false, rewardMessage: '既に報酬を受け取り済みです。' };
  }

  // Unique reward ID for duplicate claim prevention
  const rewardId = `daily_reward_${targetMission.missionId}`;
  if (player.claimedRewardIds?.includes(rewardId)) {
    return { updatedPlayer: player, success: false, rewardMessage: '既に報酬を受け取り済みです。' };
  }

  const reward = targetMission.reward;
  const messages: string[] = [];

  // Apply rewards
  let updatedPlayer = { ...player };

  if (reward.points) {
    updatedPlayer.points = (updatedPlayer.points || 0) + reward.points;
    messages.push(`${reward.points} ポイント`);
  }

  if (reward.energy) {
    const energyRes = addKnowledgeEnergy(updatedPlayer, reward.energy, 'daily_mission');
    updatedPlayer = energyRes.updatedPlayer;
    messages.push(`${reward.energy} 成長エネルギー`);
  }

  if (reward.bond && updatedPlayer.companion) {
    updatedPlayer.companion = {
      ...updatedPlayer.companion,
      bond: Math.min(100, (updatedPlayer.companion.bond || 0) + reward.bond),
    };
    messages.push(`きずな +${reward.bond}`);
  }

  if (reward.itemId && reward.itemQuantity) {
    const itemRes = addInventoryItem(updatedPlayer, reward.itemId, reward.itemQuantity, `item_m_${missionId}`);
    updatedPlayer = itemRes.updatedPlayer;
    const itemLabel = itemRes.item?.name || '育成アイテム';
    messages.push(`${itemLabel} ×${reward.itemQuantity}`);
  }

  // Mark mission as claimed
  const updatedMissions = missions.map((m) => {
    if (m.missionId === missionId) {
      return { ...m, rewardClaimed: true };
    }
    return m;
  });

  const updatedClaimedIds = [...(updatedPlayer.claimedRewardIds || []), rewardId];

  updatedPlayer = {
    ...updatedPlayer,
    dailyMissions: updatedMissions,
    claimedRewardIds: updatedClaimedIds,
  };

  const rewardSummary = messages.length > 0 ? messages.join('、') : '報酬';

  return {
    updatedPlayer,
    success: true,
    rewardMessage: `デイリーミッションクリア！ [ ${rewardSummary} ] を獲得しました！`,
  };
}
