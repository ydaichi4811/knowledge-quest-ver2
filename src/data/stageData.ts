import { LearningQuestion, PlayerData } from '../types';
import { ALL_LEARNING_QUESTIONS } from './questionsData';

export interface EnemyDef {
  id: string;
  name: string;
  description: string;
  type: 'moya' | 'golem' | 'sprite' | 'guard' | 'bat' | 'sankaku' | 'boss_trapezoid';
  accentColor: string;
}

export interface StageRewardItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  type: 'item' | 'wallpaper' | 'floor' | 'decoration' | 'title' | 'badge' | 'card';
  description: string;
}

export interface AreaStageDef {
  stageId: string;
  regionId: string;
  name: string;
  subtitle: string;
  description: string;
  unitId: string;
  learningTopics: string[];
  questionPoolIds: string[];
  requiredClearCount: number; // 3
  totalQuestions: number;     // 5
  enemies: EnemyDef[];
  isBossStage?: boolean;
  bossBarrierCount?: number;   // 5
  unlockConditionText?: string;
  requiredStageId?: string;
  firstClearRewards: {
    knowledgeEnergy: number;
    items: StageRewardItem[];
  };
  perfectClearRewards?: {
    cardId: string;
    cardTitle: string;
    cardDescription: string;
    cardIcon: string;
  };
  mapPosition: { x: number; y: number };
}

export interface HeroSkillDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  effectType: 'slash' | 'shot' | 'break';
}

export interface CompanionSkillDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  effectType: 'spark' | 'wind' | 'charge';
}

export interface SpecialCoopSkillDef {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
}

export const HERO_SKILLS: HeroSkillDef[] = [
  {
    id: 'hero_skill_1',
    name: 'ナレッジスラッシュ',
    description: '知識の刃で図形バリアを切り裂く技！',
    icon: '⚔️',
    effectType: 'slash',
  },
  {
    id: 'hero_skill_2',
    name: 'ひらめきショット',
    description: '閃きの光を放ち知識の障害を打ち払う！',
    icon: '✨',
    effectType: 'shot',
  },
  {
    id: 'hero_skill_3',
    name: '公式ブレイク',
    description: '公式の力で完璧にバリアを解体する！',
    icon: '📐',
    effectType: 'break',
  },
];

export const COMPANION_SKILLS: CompanionSkillDef[] = [
  {
    id: 'comp_skill_1',
    name: 'きずなスパーク',
    description: '相棒との絆が輝きバリアを撃破する！',
    icon: '💖',
    effectType: 'spark',
  },
  {
    id: 'comp_skill_2',
    name: '知識の風',
    description: '知恵の風を吹き荒れさせて知識のモヤを晴らす！',
    icon: '🍃',
    effectType: 'wind',
  },
  {
    id: 'comp_skill_3',
    name: '勇気チャージ',
    description: '溢れる勇気でバリアを突き崩す！',
    icon: '⚡',
    effectType: 'charge',
  },
];

export const SPECIAL_COOP_SKILL: SpecialCoopSkillDef = {
  id: 'special_coop_knowledge_unite',
  name: 'ナレッジ・ユナイト',
  subtitle: '主人公 × 相棒 奇跡の協力技',
  description: '主人公と相棒の心と知識が一つになり、図形エネルギーが全開になる！',
  icon: '🌟',
};

export const AREA_STAGES: AreaStageDef[] = [
  {
    stageId: 'stage_area_1',
    regionId: 'area',
    name: 'はじまりの草原',
    subtitle: '長方形と正方形のエリア',
    description: 'たて×横、1辺×1辺の基本公式を使って「知識のモヤ」を打ち払おう！',
    unitId: 'area_5_rectangle',
    learningTopics: ['長方形の面積公式', '正方形の面積公式'],
    questionPoolIds: [
      'area_stage_1_q1',
      'q_g5_rect_3',
      'q_g5_sq_2',
      'q_g4_1',
      'q_g4_2',
      'q_g5_rect_extra1',
      'q_g5_sq_extra1',
    ],
    requiredClearCount: 3,
    totalQuestions: 5,
    enemies: [
      {
        id: 'major_moya',
        name: 'メジャーモヤ',
        description: 'メジャー（巻尺）の模様をまとった知識のモヤ。正解してバリアを消そう！',
        type: 'moya',
        accentColor: '#38bdf8',
      },
      {
        id: 'square_golem',
        name: 'スクエアゴーレム',
        description: '方眼紙のマス目でできた可愛らしい図形のゴーレム。',
        type: 'golem',
        accentColor: '#34d399',
      },
    ],
    mapPosition: { x: 20, y: 72 },
    firstClearRewards: {
      knowledgeEnergy: 100,
      items: [
        {
          id: 'item_knowledge_fruit',
          name: '知識の実',
          icon: '🍎',
          count: 1,
          type: 'item',
          description: '相棒に与えると成長エネルギーが増える不思議な実。',
        },
        {
          id: 'room_wallpaper_prairie',
          name: '草原の壁紙',
          icon: '🌿',
          count: 1,
          type: 'wallpaper',
          description: '相棒の部屋をのどかな草原の雰囲気模様替えできる壁紙。',
        },
      ],
    },
  },
  {
    stageId: 'stage_area_2',
    regionId: 'area',
    name: 'パラレルの森',
    subtitle: '平行四辺形のエリア',
    description: '「底辺×高さ」を見極めて、斜めの線に惑わされずに進もう！',
    unitId: 'area_5_parallel',
    learningTopics: ['平行四辺形の面積公式', '底辺と高さの垂直関係'],
    questionPoolIds: [
      'area_stage_2_q1',
      'area_stage_2_q2',
      'q_g5_para_3',
      'q_g5_para_extra1',
      'q_g5_para_extra2',
    ],
    requiredClearCount: 3,
    totalQuestions: 5,
    requiredStageId: 'stage_area_1',
    unlockConditionText: 'はじまりの草原 クリアで解放',
    enemies: [
      {
        id: 'nanamenoko',
        name: 'ナナメノコ',
        description: '斜めの辺を自慢する平行四辺形の妖精。高さと混ざらないように注意！',
        type: 'sprite',
        accentColor: '#a855f7',
      },
      {
        id: 'parallel_guard',
        name: 'パラレルガード',
        description: '向かい合う2組の辺が平行な盾を持つ森の守護者。',
        type: 'guard',
        accentColor: '#10b981',
      },
    ],
    mapPosition: { x: 42, y: 52 },
    firstClearRewards: {
      knowledgeEnergy: 150,
      items: [
        {
          id: 'acc_leaf_crown',
          name: '若葉の冠',
          icon: '👑',
          count: 1,
          type: 'item',
          description: '相棒に着せられる可愛らしい若葉の冠。',
        },
        {
          id: 'room_floor_forest',
          name: '森の床',
          icon: '🪵',
          count: 1,
          type: 'floor',
          description: '木漏れ日が心地よい森の木目調フロア。',
        },
      ],
    },
  },
  {
    stageId: 'stage_area_3',
    regionId: 'area',
    name: 'トライアの谷',
    subtitle: '三角形のエリア',
    description: '「底辺×高さ÷2」の「÷2」を忘れずに！谷の試練を乗り越えよう。',
    unitId: 'area_5_triangle',
    learningTopics: ['三角形の面積公式', '÷2 の考え方'],
    questionPoolIds: [
      'area_stage_3_q1',
      'q_g5_tri_2',
      'q_g5_tri_extra1',
      'q_g5_tri_extra2',
    ],
    requiredClearCount: 3,
    totalQuestions: 5,
    requiredStageId: 'stage_area_2',
    unlockConditionText: 'パラレルの森 クリアで解放',
    enemies: [
      {
        id: 'tria_bat',
        name: 'トライアバット',
        description: '三角形の羽をはためかせて現れる谷のパトロール隊。',
        type: 'bat',
        accentColor: '#f43f5e',
      },
      {
        id: 'sankaku_guardian',
        name: 'さんかくの番人',
        description: '鋭い3つの角を持つ谷の古びた石像。',
        type: 'sankaku',
        accentColor: '#f59e0b',
      },
    ],
    mapPosition: { x: 65, y: 35 },
    firstClearRewards: {
      knowledgeEnergy: 200,
      items: [
        {
          id: 'item_star_shard',
          name: '星のかけら',
          icon: '⭐',
          count: 1,
          type: 'item',
          description: 'きらめく星の欠片。相棒の絆が深まる。',
        },
        {
          id: 'room_deco_triangle_flag',
          name: '三角旗の飾り',
          icon: '🚩',
          count: 1,
          type: 'decoration',
          description: '相棒の部屋に飾れるカラフルなフラッグガーランド。',
        },
      ],
    },
  },
  {
    stageId: 'stage_area_boss',
    regionId: 'area',
    name: 'トラペの丘',
    subtitle: '台形 & 面積の総合ボスエリア',
    description: '(上底＋下底)×高さ÷2 の公式とこれまでの面積知識を総動員して「トラペロード」に挑もう！',
    unitId: 'area_5_trapezoid',
    learningTopics: ['台形の面積公式', '面積の総合復習'],
    questionPoolIds: [
      'area_stage_4_q1',
      'q_g5_trap_2',
      'q_g5_trap_extra1',
      'q_g5_trap_extra2',
      'area_stage_1_q1',
      'area_stage_2_q1',
      'area_stage_3_q1',
      'area_stage_6_q1',
    ],
    requiredClearCount: 3,
    totalQuestions: 5,
    isBossStage: true,
    bossBarrierCount: 5,
    requiredStageId: 'stage_area_3',
    unlockConditionText: 'トライアの谷 クリアで解放',
    enemies: [
      {
        id: 'trape_lord',
        name: 'トラペロード',
        description: 'アレア地方の面積を司る王。5つの知識バリアで挑戦者を試す！',
        type: 'boss_trapezoid',
        accentColor: '#fbbf24',
      },
    ],
    mapPosition: { x: 88, y: 20 },
    firstClearRewards: {
      knowledgeEnergy: 300,
      items: [
        {
          id: 'item_evolution_drop',
          name: '進化のしずく',
          icon: '💧',
          count: 1,
          type: 'item',
          description: '神秘的な秘薬。相棒の進化を助ける特別な力。',
        },
        {
          id: 'badge_area_master',
          name: '面積マスターバッジ',
          icon: '🏅',
          count: 1,
          type: 'badge',
          description: 'アレア地方のすべての面積公式をマスターした証。',
        },
        {
          id: 'title_area_adventurer',
          name: 'アレア地方の冒険者',
          icon: '📜',
          count: 1,
          type: 'title',
          description: 'アレア地方を制覇した称号。プロフィールに装着できる！',
        },
      ],
    },
    perfectClearRewards: {
      cardId: 'card_area_master',
      cardTitle: 'アレア地方マスター記念カード',
      cardDescription: 'トラペの丘で全問正解を果たした真の面積マスターに贈られる記念カード！',
      cardIcon: '🃏',
    },
  },
];

export interface LockedMapPreview {
  id: string;
  name: string;
  subtitle: string;
  mapPosition: { x: number; y: number };
}

export const LOCKED_MAP_PREVIEWS: LockedMapPreview[] = [
  {
    id: 'future_diamond_ruins',
    name: 'ダイヤ遺跡',
    subtitle: 'ひし形と対角線の未知領域',
    mapPosition: { x: 70, y: 78 },
  },
  {
    id: 'future_composite_castle',
    name: 'コンポジット城',
    subtitle: '複合図形と立体への架け橋',
    mapPosition: { x: 90, y: 65 },
  },
];

/**
 * Helper to get Stage by ID
 */
export function getAreaStageById(stageId: string): AreaStageDef | undefined {
  return AREA_STAGES.find((s) => s.stageId === stageId);
}

/**
 * Gets 5 non-repeating questions for a stage from ALL_LEARNING_QUESTIONS
 */
export function getRandomQuestionsForStage(stageDef: AreaStageDef): LearningQuestion[] {
  const pool = ALL_LEARNING_QUESTIONS.filter((q) => stageDef.questionPoolIds.includes(q.id));
  
  // If pool is too small, fallback to matching unitId questions
  let source = pool;
  if (source.length < stageDef.totalQuestions) {
    const fallbackUnit = ALL_LEARNING_QUESTIONS.filter(
      (q) => q.unitId === stageDef.unitId || q.grade === 5
    );
    const combinedMap = new Map<string, LearningQuestion>();
    [...source, ...fallbackUnit].forEach((q) => combinedMap.set(q.id, q));
    source = Array.from(combinedMap.values());
  }

  // Shuffle array
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, stageDef.totalQuestions);
}

/**
 * Ensures stage progress exists on PlayerData and sets up defaults cleanly
 */
export function ensureStageProgress(player: PlayerData): PlayerData {
  const existingProgress = player.stageProgress || {};
  let updatedProgress = { ...existingProgress };
  let isChanged = false;

  AREA_STAGES.forEach((stage, idx) => {
    if (!updatedProgress[stage.stageId]) {
      // First stage is unlocked by default; others require previous stage clear
      const isUnlockedByDefault = idx === 0 || (stage.requiredStageId ? !!updatedProgress[stage.requiredStageId]?.isCleared : false);
      updatedProgress[stage.stageId] = {
        stageId: stage.stageId,
        isUnlocked: isUnlockedByDefault,
        attemptCount: 0,
        bestCorrectCount: 0,
        bestStars: 0,
        isCleared: false,
        isPerfectCleared: false,
        firstClearRewardClaimed: false,
        perfectClearRewardClaimed: false,
      };
      isChanged = true;
    } else {
      // Update unlock state based on prerequisites
      if (stage.requiredStageId && updatedProgress[stage.requiredStageId]?.isCleared && !updatedProgress[stage.stageId].isUnlocked) {
        updatedProgress[stage.stageId] = {
          ...updatedProgress[stage.stageId],
          isUnlocked: true,
        };
        isChanged = true;
      }
    }
  });

  const existingBattleSettings = player.battleSettings || {
    battleAnimationEnabled: true,
    showSkillNames: true,
    shortenBossAnimation: false,
  };

  if (!player.stageProgress || isChanged || !player.battleSettings) {
    return {
      ...player,
      stageProgress: updatedProgress,
      battleSettings: existingBattleSettings,
    };
  }

  return player;
}
