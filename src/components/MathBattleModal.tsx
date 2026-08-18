import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerData, LearningQuestion, QuestStage, ReviewSessionData } from '../types';
import { ALL_LEARNING_QUESTIONS, getQuestionsBySkill, getPrerequisiteQuestions } from '../data/questionsData';
import { REGIONS_DATA } from '../data/regions';
import { getSkillById } from '../data/skillsData';
import { addExpAndPoints, savePlayerData } from '../services/gameStorage';
import { processQuestionAnswer, ProcessAnswerResult } from '../services/rewardService';
import { verifyMultipleChoiceAnswer, saveAnswerResult } from '../services/answerVerificationService';
import { determineReviewTargetSkill, recordSkillAnswer, ReviewTargetResult } from '../services/skillService';
import { applyAnswerRecordToPlayer, getGraduatedHint } from '../services/reviewService';
import { getStructuredHintsForQuestion, getStructuredExplanationForQuestion } from '../data/hintsAndExplanations';
import { checkStageClearNpcEncounter, NpcCompanionInfo } from '../services/encyclopediaService';
import { NpcEncounterModal } from './NpcEncounterModal';
import { HeroCharacter } from './HeroCharacter';
import { EnemyCharacter } from './EnemyCharacter';
import { BuddyCharacter } from './BuddyCharacter';
import { KnowledgeCrest } from './KnowledgeCrest';
import { FuriganaText } from './FuriganaText';
import {
  Swords,
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Zap,
  RotateCcw,
  TreePine,
  ShieldAlert,
  Award,
  Crown,
  BookOpen,
  Heart,
  Flame,
  Volume2,
  BookMarked,
  Shield,
  Target,
  Wand2,
  Info,
  Package,
  Pause,
  Menu as MenuIcon,
  Book,
} from 'lucide-react';

function QuestionDiagram({ question }: { question: LearningQuestion }) {
  const isTriangle = question.questionText.includes('三角形') || question.unitId?.includes('triangle');
  const isParallel = question.questionText.includes('平行四辺形') || question.unitId?.includes('parallel');
  const isSquare = question.questionText.includes('正方形') || question.unitId?.includes('square');
  const isAreaRectangle = !isTriangle && !isParallel && (
    question.questionText.includes('長方形') ||
    question.unitId?.includes('rectangle') ||
    isSquare
  );
  const dimensions = [...question.questionText.matchAll(/(\\d+)\\s*cm/g)].map((match) => match[1]);
  const firstDimension = dimensions[0] || '?';
  const secondDimension = isSquare ? firstDimension : (dimensions[1] || '?');

  if (isAreaRectangle) {
    return (
      <div className="w-full flex flex-col items-center justify-center my-2 p-2.5 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-xl shadow-inner">
        <div className="relative w-44 sm:w-56 h-24 sm:h-28 border-2 border-slate-700 bg-amber-100/70 rounded flex items-center justify-center shadow-sm">
          {/* Top dimension label */}
          <span className="absolute -top-6 text-xs sm:text-sm font-black text-slate-900 font-mono bg-amber-200/90 px-2 py-0.5 rounded border border-amber-400">
            {firstDimension}cm
          </span>
          {/* Right dimension label */}
          <span className="absolute -right-10 text-xs sm:text-sm font-black text-slate-900 font-mono bg-amber-200/90 px-2 py-0.5 rounded border border-amber-400">
            {secondDimension}cm
          </span>
          <span className="text-xs text-slate-600 font-extrabold">面積 = ? ㎠</span>
        </div>
      </div>
    );
  }

  if (isTriangle) {
    return (
      <div className="w-full flex flex-col items-center justify-center my-2 p-2 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-xl shadow-inner">
        <svg className="w-48 h-24" viewBox="0 0 100 70">
          <polygon points="10,60 90,60 50,10" fill="#fde68a" stroke="#334155" strokeWidth="2.5" />
          <line x1="50" y1="10" x2="50" y2="60" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
          <text x="50" y="68" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#1e293b">底辺 {firstDimension}cm</text>
          <text x="54" y="38" fontSize="8" fontWeight="bold" fill="#dc2626">高さ {secondDimension}cm</text>
        </svg>
      </div>
    );
  }

  if (isParallel) {
    return (
      <div className="w-full flex flex-col items-center justify-center my-2 p-2 bg-amber-50/90 border-2 border-dashed border-amber-300 rounded-xl shadow-inner">
        <svg className="w-48 h-24" viewBox="0 0 110 70">
          <polygon points="25,15 100,15 75,60 0,60" fill="#fde68a" stroke="#334155" strokeWidth="2.5" />
          <line x1="25" y1="15" x2="25" y2="60" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
          <text x="38" y="68" fontSize="8" textAnchor="middle" fontWeight="bold" fill="#1e293b">底辺 {firstDimension}cm</text>
          <text x="30" y="38" fontSize="8" fontWeight="bold" fill="#dc2626">高さ {secondDimension}cm</text>
        </svg>
      </div>
    );
  }

  return null;
}

interface MathBattleModalProps {
  player: PlayerData;
  stageId: string;
  stageInfo?: QuestStage;
  targetUnitId?: string;
  targetSkillId?: string;
  onClose: () => void;
  onPlayerUpdate: (updatedPlayer: PlayerData) => void;
  onRetryQuest?: () => void;
  onNextQuest?: () => void;
  onReturnToMap?: () => void;
  onReturnToHome?: () => void;
}

export interface RewardDetailInfo {
  result: ProcessAnswerResult;
  prevExp: number;
  prevPoints: number;
  newExp: number;
  newPoints: number;
}

// =========================================================
// RPG バトル設定パラメータ・倍率定数 (BATTLE CONFIG)
// =========================================================
export const BATTLE_CONFIG = {
  MIN_DAMAGE: 10,
  BASE_DAMAGE_RATIO: 0.25,
  MAX_COMBO_MULT: 2.0,
  BREAK_DAMAGE_MULT: 1.5,
  ULTIMATE_DAMAGE_MULT: 2.5,
  BREAK_DURATION_TURNS: 2,
  MAX_CHARGE: 100,
  MAX_BREAK: 100,
};

// =========================================================
// ランク計算ルール & 閾値定数 (RANK THRESHOLDS)
// 後から条件変更が容易なように定数化
// =========================================================
export const RANK_THRESHOLDS = {
  S: { minAccuracy: 95, requireNoHint: true },
  A: { minAccuracy: 90 },
  B: { minAccuracy: 80 },
  // C: それ未満
};

// ランク計算場所 (calculateQuestRank)
export function calculateQuestRank(accuracy: number, usedAnyHint: boolean): 'S' | 'A' | 'B' | 'C' {
  if (accuracy >= RANK_THRESHOLDS.S.minAccuracy && (!RANK_THRESHOLDS.S.requireNoHint || !usedAnyHint)) {
    return 'S';
  }
  if (accuracy >= RANK_THRESHOLDS.A.minAccuracy) {
    return 'A';
  }
  if (accuracy >= RANK_THRESHOLDS.B.minAccuracy) {
    return 'B';
  }
  return 'C';
}

// =========================================================
// 報酬計算設定 (REWARD CONFIG)
// =========================================================
export const REWARD_CONFIG = {
  BASE_EXP_PER_CORRECT: 30,
  BASE_COINS_PER_CORRECT: 20,
  RANK_MULTIPLIERS: {
    S: 1.5,
    A: 1.3,
    B: 1.1,
    C: 1.0,
  },
  RANK_GEMS: {
    S: 5,
    A: 3,
    B: 2,
    C: 1,
  },
  FIRST_CLEAR_EXP_BONUS: 50,
  FIRST_CLEAR_COINS_BONUS: 50,
  FIRST_CLEAR_GEMS_BONUS: 5,
  PERFECT_CLEAR_EXP_BONUS: 40,
  PERFECT_CLEAR_COINS_BONUS: 40,
  PERFECT_CLEAR_GEMS_BONUS: 5,
  PARTNER_EXP_BASE: 25,
};

export interface QuestRewardResult {
  expGained: number;
  coinsGained: number;
  gemsGained: number;
  itemsGained: Array<{ name: string; icon: string; count: number }>;
  partnerExpGained: number;
}

// 報酬計算場所 (calculateQuestRewards)
export function calculateQuestRewards({
  correctCount,
  rank,
  isFirstClear,
  isPerfectClear,
  stageInfo,
}: {
  correctCount: number;
  rank: 'S' | 'A' | 'B' | 'C';
  isFirstClear: boolean;
  isPerfectClear: boolean;
  stageInfo?: QuestStage;
}): QuestRewardResult {
  const baseExp = stageInfo?.expReward || correctCount * REWARD_CONFIG.BASE_EXP_PER_CORRECT;
  const baseCoins = stageInfo?.pointsReward || correctCount * REWARD_CONFIG.BASE_COINS_PER_CORRECT;
  const rankMult = REWARD_CONFIG.RANK_MULTIPLIERS[rank];

  // 経験値計算場所
  let expGained = Math.floor(baseExp * rankMult);
  let coinsGained = Math.floor(baseCoins * rankMult);
  let gemsGained = REWARD_CONFIG.RANK_GEMS[rank];

  if (isFirstClear) {
    expGained += REWARD_CONFIG.FIRST_CLEAR_EXP_BONUS;
    coinsGained += REWARD_CONFIG.FIRST_CLEAR_COINS_BONUS;
    gemsGained += REWARD_CONFIG.FIRST_CLEAR_GEMS_BONUS;
  }

  if (isPerfectClear) {
    expGained += REWARD_CONFIG.PERFECT_CLEAR_EXP_BONUS;
    coinsGained += REWARD_CONFIG.PERFECT_CLEAR_COINS_BONUS;
    gemsGained += REWARD_CONFIG.PERFECT_CLEAR_GEMS_BONUS;
  }

  const partnerExpGained = REWARD_CONFIG.PARTNER_EXP_BASE + (rank === 'S' ? 15 : rank === 'A' ? 10 : 5);

  const itemsGained: Array<{ name: string; icon: string; count: number }> = [];
  if (isPerfectClear || rank === 'S') {
    itemsGained.push({ name: '知識の黄金ビスケット', icon: '🍪', count: 1 });
  } else if (rank === 'A' || rank === 'B') {
    itemsGained.push({ name: '回復アメ玉', icon: '🍬', count: 1 });
  }

  return {
    expGained,
    coinsGained,
    gemsGained,
    itemsGained,
    partnerExpGained,
  };
}

// ヘルパー: タイマーフォーマット (分:秒)
function formatElapsedTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ヘルパー: レベル別称号取得
export function getTitleForLevel(level: number): string {
  if (level >= 20) return '👑 伝説の算数マスター';
  if (level >= 15) return '🌌 知識の大賢者';
  if (level >= 10) return '⚔️ 数学の勇者';
  if (level >= 7) return '🛡️ ひらめき騎士';
  if (level >= 5) return '📜 見習い魔導士';
  if (level >= 3) return '🌱 チャレンジ冒険者';
  return '🐣 はじまりの探求者';
}

// カウントアップ数値アニメーション
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const duration = 1000;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      setDisplayValue(Math.floor(easeProgress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
      }
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span>{displayValue}</span>;
}

// コンボ倍率ルール
export function getComboMultiplier(combo: number): { mult: number; label: string } {
  if (combo >= 8) return { mult: 2.0, label: '8 COMBO! スーパーコンボ (2.0倍)' };
  if (combo >= 5) return { mult: 1.5, label: '5 COMBO! ハイパーコンボ (1.5倍)' };
  if (combo >= 3) return { mult: 1.2, label: '3 COMBO! コンボアップ (1.2倍)' };
  if (combo >= 1) return { mult: 1.0, label: '通常コンボ (1.0倍)' };
  return { mult: 1.0, label: '1.0倍' };
}

// 敵モンスター情報マッピング
interface EnemyData {
  name: string;
  icon: string;
  maxHp: number;
  element: string;
  isBoss: boolean;
  flavorText: string;
}

const STAGE_ENEMIES: Record<string, EnemyData> = {
  area_stage_1: {
    name: '四角スライム',
    icon: '🟩',
    maxHp: 100,
    element: '図形',
    isBoss: false,
    flavorText: '長方形と正方形の面積公式を好むプルプル魔物。',
  },
  area_stage_2: {
    name: 'パラレルウッド',
    icon: '🪵',
    maxHp: 120,
    element: '図形',
    isBoss: false,
    flavorText: '平行な2直線に守られた古代の木型モンスター。',
  },
  area_stage_3: {
    name: 'トライアハーピー',
    icon: '🦅',
    maxHp: 140,
    element: '図形',
    isBoss: false,
    flavorText: '「底辺×高さ÷2」の風を巻き起こす翼持つ魔物。',
  },
  area_stage_4: {
    name: 'トラペゴーレム',
    icon: '🗿',
    maxHp: 160,
    element: '図形',
    isBoss: false,
    flavorText: '上底と下底の重厚なシールドを持つ岩石兵器。',
  },
  area_stage_5: {
    name: 'ダイヤナイト',
    icon: '⚔️💎',
    maxHp: 200,
    element: '図形',
    isBoss: true,
    flavorText: '【中ボス】対角線が直交する菱形の鋭き騎士！',
  },
  area_stage_6: {
    name: '面積魔王コンポジ王',
    icon: '👹🏰',
    maxHp: 300,
    element: '図形魔導',
    isBoss: true,
    flavorText: '【大ボス】複合図形の迷宮を統べるマスリア王国の宿敵！',
  },
};

const DEFAULT_ENEMY: EnemyData = {
  name: '算数怪獣マスマシン',
  icon: '👾',
  maxHp: 150,
  element: '数理',
  isBoss: false,
  flavorText: '正しい計算の知識でのみ突破できる数理の守護者。',
};

// ことばナビ用辞典データ
const KOTOBA_NAV_DICTIONARY: Record<string, string> = {
  底辺: '図形の土台となる辺のこと。高さと直角（90度）に交わる辺を基準にするよ。',
  高さ: '底辺から垂直（90度）に伸びた一番高いところまでの長さのことだよ。',
  平行: 'どこまで伸ばしても絶対に交わらない2本の直線の関係のことだよ。',
  対角線: '向かい合う頂点をまっすぐ結んだ線のことだよ。',
  上底: '台形の上側にある平行な辺のことだよ。',
  下底: '台形の下側にある平行な辺のことだよ。',
  複合図形: '長方形や三角形など、いくつかの図形が組み合わさった形のことだよ。',
  面積: '図形や場所の広さを表す大きさのことだよ（単位: cm² や m²）。',
};

export const MathBattleModal: React.FC<MathBattleModalProps> = ({
  player,
  stageId,
  stageInfo,
  targetUnitId,
  targetSkillId,
  onClose,
  onPlayerUpdate,
  onRetryQuest,
  onNextQuest,
  onReturnToMap,
  onReturnToHome,
}) => {
  console.log(`⑨/⑩ [MathBattleModal Render] player.name=${player.name}, current EXP=${player.exp}, current KQ=${player.points}`);
  const resolvedStageInfo = stageInfo || REGIONS_DATA
    .flatMap((region) => region.stages)
    .find((stage) => stage.id === stageId);
  // Select main questions matching targetSkillId, targetUnitId, or stageId
  const mainQuestions = ALL_LEARNING_QUESTIONS.filter((q) => {
    if (targetSkillId) return q.skillId === targetSkillId;
    if (targetUnitId) return q.unitId === targetUnitId || q.skillId === targetUnitId;
    if (stageId === 'area_stage_1') return q.unitId === 'area_5_rectangle';
    if (stageId === 'area_stage_2') return q.unitId === 'area_5_parallel';
    if (stageId === 'area_stage_3') return q.unitId === 'area_5_triangle';
    if (stageId === 'area_stage_4') return q.unitId === 'area_5_trapezoid';
    if (stageId === 'area_stage_5') return q.unitId === 'area_5_rhombus';
    if (stageId === 'area_stage_6') return q.unitId === 'area_5_composite';
    return q.grade === 5;
  });

  const [questions, setQuestions] = useState<LearningQuestion[]>(
    mainQuestions.length > 0 ? mainQuestions : ALL_LEARNING_QUESTIONS.filter((q) => q.grade === 5)
  );

  const enemyInfo = STAGE_ENEMIES[stageId] || DEFAULT_ENEMY;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  // RPG Battle System States (Safely Initialized)
  const [comboCount, setComboCount] = useState(0);
  const [chargeGauge, setChargeGauge] = useState(0); // 知識チャージ 0-100%
  const [enemyHp, setEnemyHp] = useState(enemyInfo.maxHp);
  const [breakGauge, setBreakGauge] = useState(0); // 0-100%
  const [isEnemyBroken, setIsEnemyBroken] = useState<boolean>(false);
  const [breakTurnsLeft, setBreakTurnsLeft] = useState<number>(0);
  const [isUltimateActivated, setIsUltimateActivated] = useState<boolean>(false);

  // FX & Banner States
  const [damagePopup, setDamagePopup] = useState<{ amount: number; isCritical: boolean; label?: string } | null>(null);
  const [attackEffect, setAttackEffect] = useState<boolean>(false);
  const [enemyHitEffect, setEnemyHitEffect] = useState<boolean>(false);
  const [comboBanner, setComboBanner] = useState<string | null>(null);

  // Child-friendly Tutorial Dialog State
  const [tutorialModal, setTutorialModal] = useState<{
    type: 'combo' | 'break' | 'charge';
    title: string;
    description: string;
  } | null>(null);
  const [hasSeenTutorials, setHasSeenTutorials] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('kq_battle_tutorials_seen');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // Hint & Kotoba Navi States
  const [hintLevel, setHintLevel] = useState<number>(0); // 0:なし, 1:段階1, 2:段階2, 3:段階3
  const [showKotobaNaviModal, setShowKotobaNaviModal] = useState<boolean>(false);
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [showPauseMenu, setShowPauseMenu] = useState<boolean>(false);
  const [heroHp, setHeroHp] = useState<number>(120);
  const maxHeroHp = 120;
  const [buddyHp, setBuddyHp] = useState<number>(80);
  const maxBuddyHp = 80;
  const [showDetailedExplanation, setShowDetailedExplanation] = useState<boolean>(false);
  const [isSavedForLaterReview, setIsSavedForLaterReview] = useState<boolean>(false);
  const [masteredNotification, setMasteredNotification] = useState<string | null>(null);
  const questionStartTimeRef = React.useRef<number>(Date.now());

  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attemptCountForCurrentQ, setAttemptCountForCurrentQ] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Knowledge Tree Foundation Review Mode States
  const [isFoundationReviewMode, setIsFoundationReviewMode] = useState(false);
  const [reviewTargetInfo, setReviewTargetInfo] = useState<ReviewTargetResult | null>(null);
  const [foundationQuestions, setFoundationQuestions] = useState<LearningQuestion[]>([]);
  const [foundationIndex, setFoundationIndex] = useState(0);
  const [foundationCorrectCount, setFoundationCorrectCount] = useState(0);
  const [isReviewFinished, setIsReviewFinished] = useState(false);

  // Banner message when returning to source question
  const [foundationBannerMessage, setFoundationBannerMessage] = useState<string | null>(null);
  const [hasCompletedFoundationForCurrentQ, setHasCompletedFoundationForCurrentQ] = useState(false);

  // Reward Feedback Result
  const [lastRewardResult, setLastRewardResult] = useState<ProcessAnswerResult | null>(null);
  const [lastRewardInfo, setLastRewardInfo] = useState<RewardDetailInfo | null>(null);

  // Session Overall Stats
  const startTimeRef = React.useRef<number>(Date.now());
  const [maxCombo, setMaxCombo] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [ultimateCount, setUltimateCount] = useState(0);
  const [usedAnyHint, setUsedAnyHint] = useState(false);

  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [totalSessionExp, setTotalSessionExp] = useState(0);
  const [totalSessionPoints, setTotalSessionPoints] = useState(0);
  const [isBattleFinished, setIsBattleFinished] = useState(false);
  const [levelUpOccurred, setLevelUpOccurred] = useState(false);
  const [npcEncounter, setNpcEncounter] = useState<{ npc: NpcCompanionInfo; isNewDiscovery: boolean } | null>(null);

  // Result Detailed Summary State
  const [resultSummary, setResultSummary] = useState<{
    isCleared: boolean;
    rank: 'S' | 'A' | 'B' | 'C';
    elapsedTimeSeconds: number;
    accuracy: number;
    correctCount: number;
    totalQuestions: number;
    maxCombo: number;
    breakCount: number;
    ultimateCount: number;
    usedAnyHint: boolean;
    isFirstClear: boolean;
    isPerfectClear: boolean;
    expGained: number;
    coinsGained: number;
    gemsGained: number;
    itemsGained: Array<{ name: string; icon: string; count: number }>;
    partnerExpGained: number;
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    newTitle?: string;
    statUpText?: string;
  } | null>(null);

  // Trigger Tutorial Helper
  const triggerTutorial = (type: 'combo' | 'break' | 'charge', title: string, description: string) => {
    if (!hasSeenTutorials[type]) {
      setTutorialModal({ type, title, description });
      const updated = { ...hasSeenTutorials, [type]: true };
      setHasSeenTutorials(updated);
      try {
        localStorage.setItem('kq_battle_tutorials_seen', JSON.stringify(updated));
      } catch (e) {
        /* safe fallback */
      }
    }
  };

  const currentQ = isFoundationReviewMode
    ? foundationQuestions[foundationIndex]
    : questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(idx);
    setWarningMessage(null);
  };

  const handleStepHint = () => {
    setUsedAnyHint(true);
    setHintLevel((prev) => Math.min(3, prev + 1));
  };

  // 必殺技発動ボタン
  const handleActivateUltimate = () => {
    if (chargeGauge < BATTLE_CONFIG.MAX_CHARGE || isUltimateActivated || isAnswerSubmitted) return;
    setIsUltimateActivated(true);
    setUltimateCount((prev) => prev + 1);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  // =========================================================
  // 回答確定処理 (handleSubmitAnswer) - 統一計算順序
  // =========================================================
  const handleSubmitAnswer = () => {
    console.log(`① [handleSubmitAnswer] Called. player.name=${player.name}, EXP=${player.exp}, KQ=${player.points}, selectedAnswerIndex=${selectedAnswerIndex}`);
    // 4択問題未選択の検証
    const verification = verifyMultipleChoiceAnswer({
      selectedIndex: selectedAnswerIndex,
      correctIndex: currentQ.correctAnswerIndex,
      choices: currentQ.options,
    });

    if (!verification.isValid) {
      console.warn('① [handleSubmitAnswer] Answer not selected - returning early:', verification.warningMessage);
      setWarningMessage(verification.warningMessage);
      return;
    }

    if (isAnswerSubmitted) return;

    setWarningMessage(null);
    const correct = verification.isCorrect;
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    const newAttemptCount = attemptCountForCurrentQ + 1;
    setAttemptCountForCurrentQ(newAttemptCount);

    if (correct) {
      // 1. コンボ数の更新
      const newCombo = comboCount + 1;
      setComboCount(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      // コンボマイルストーン演出トリガー
      if (newCombo === 3) {
        setComboBanner('🔥 3 COMBO！ 攻撃力 1.2倍 アップ！');
        triggerTutorial('combo', 'コンボ機能', 'れんぞく正解で、こうげきが強くなるよ！');
      } else if (newCombo === 5) {
        setComboBanner('⚡ 5 COMBO！ ハイパーコンボ 1.5倍！');
      } else if (newCombo >= 8 && newCombo % 3 === 2) {
        setComboBanner('🌟 8 COMBO！ 超極大パワー 2.0倍！');
      } else {
        setComboBanner(null);
      }

      // 2. ブレイク値の計算・更新
      let currentBreakValue = breakGauge;
      let nextIsBroken = isEnemyBroken;
      let nextTurnsLeft = breakTurnsLeft;

      if (isEnemyBroken) {
        // ブレイク継続中: ターン消化
        nextTurnsLeft = Math.max(0, breakTurnsLeft - 1);
        if (nextTurnsLeft === 0) {
          nextIsBroken = false;
          currentBreakValue = 0;
        }
      } else {
        // 通常時: ブレイク蓄積 (+25% base + combo/no-hint bonus)
        const breakAdd = (enemyInfo.isBoss ? 20 : 25) + (newCombo >= 3 ? 10 : 0) + (hintLevel === 0 ? 5 : 0);
        currentBreakValue = Math.min(BATTLE_CONFIG.MAX_BREAK, currentBreakValue + breakAdd);
        if (currentBreakValue >= BATTLE_CONFIG.MAX_BREAK) {
          nextIsBroken = true;
          nextTurnsLeft = BATTLE_CONFIG.BREAK_DURATION_TURNS;
          setBreakCount((prev) => prev + 1);
          triggerTutorial('break', 'ブレイク発生！', '正解を続けて、敵の守りをくずしたよ！次の2回の攻撃ダメージが1.5倍！');
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
        }
      }

      setBreakGauge(currentBreakValue);
      setIsEnemyBroken(nextIsBroken);
      setBreakTurnsLeft(nextTurnsLeft);

      // 3. 知識チャージの計算・更新
      const chargeAdd = (hintLevel === 0 ? 25 : 15) + (newCombo >= 3 ? 10 : 0);
      const newCharge = Math.min(BATTLE_CONFIG.MAX_CHARGE, chargeGauge + chargeAdd);
      setChargeGauge(newCharge);
      if (newCharge >= BATTLE_CONFIG.MAX_CHARGE) {
        triggerTutorial('charge', '知識チャージMAX！', '正解してゲージがたまったよ！【必殺技】ボタンを押して特大ダメージを狙おう！');
      }

      // =========================================================
      // 【4. 統一ダメージ計算式】
      // 基本ダメージ × 難易度補正 × コンボ倍率 × ブレイク倍率 × 必殺技倍率
      // =========================================================
      const baseDmg = Math.max(20, Math.floor(enemyInfo.maxHp / Math.max(questions.length, 1)));
      const difficultyMult = currentQ.grade >= 5 ? 1.1 : 1.0;
      const comboMult = getComboMultiplier(newCombo).mult;
      const breakMult = isEnemyBroken ? BATTLE_CONFIG.BREAK_DAMAGE_MULT : 1.0;
      const ultimateMult = isUltimateActivated ? BATTLE_CONFIG.ULTIMATE_DAMAGE_MULT : 1.0;

      const calculatedDamage = Math.floor(
        baseDmg * difficultyMult * comboMult * breakMult * ultimateMult
      );
      const finalDamage = Math.max(BATTLE_CONFIG.MIN_DAMAGE, calculatedDamage);

      // 必殺技消費
      if (isUltimateActivated) {
        setChargeGauge(0);
        setIsUltimateActivated(false);
      }

      // ポップアップ・演出トリガー
      setDamagePopup({
        amount: finalDamage,
        isCritical: isUltimateActivated || comboMult >= 1.5 || isEnemyBroken,
        label: isUltimateActivated
          ? '💥 必殺奥義！'
          : isEnemyBroken
          ? '⚡ BREAK HIT!'
          : comboMult >= 1.5
          ? '🔥 CRITICAL!'
          : undefined,
      });

      setEnemyHitEffect(true);
      setAttackEffect(true);
      setTimeout(() => {
        setEnemyHitEffect(false);
        setAttackEffect(false);
      }, 600);

      // 敵HP削り（0未満にならない保証）
      setEnemyHp((prev) => Math.max(0, prev - finalDamage));
    } else {
      // 不正解処理: コンボ0リセット、チャージ少量減算（失敗を恐れさせない-5%）
      setComboCount(0);
      setComboBanner(null);
      setChargeGauge((prev) => Math.max(0, prev - 5));
      setIsUltimateActivated(false); // 必殺技構え解除
      setDamagePopup(null);
    }

    // 解答履歴と復習状況の記録 (要件1〜11, 22, 43, 48)
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const selectedText = selectedAnswerIndex !== null ? currentQ.options[selectedAnswerIndex] || '' : '';
    const correctText = currentQ.options[currentQ.correctAnswerIndex] || '';

    const { updatedPlayer: playerWithAnswerHistory } = saveAnswerResult({
      player,
      question: currentQ,
      userAnswer: selectedText,
      correctAnswer: correctText,
      isCorrect: correct,
      selectedChoiceIndex: selectedAnswerIndex,
      selectedChoiceText: selectedText,
      correctChoiceIndex: currentQ.correctAnswerIndex,
      correctChoiceText: correctText,
      hintCount: hintLevel,
      usedHint: hintLevel > 0,
      attemptCount: newAttemptCount,
      timeSpentSeconds: timeSpent,
    });

    const answerLogResult = applyAnswerRecordToPlayer(playerWithAnswerHistory, {
      questionId: currentQ.id,
      stageId,
      subject: currentQ.subject || 'math',
      grade: currentQ.grade || 3,
      unitId: currentQ.unitId || 'area_5_rectangle',
      unitName: currentQ.unitName,
      isCorrect: correct,
      userAnswer: selectedText,
      correctAnswer: correctText,
      hintCount: hintLevel,
      attemptCount: newAttemptCount,
      timeSpentSeconds: timeSpent,
      isFirstTryCorrect: correct && newAttemptCount === 1 && hintLevel === 0,
    });

    if (answerLogResult.isStatusUpgradedToMaster) {
      setMasteredNotification(`✨ 「${currentQ.unitName || '問題'}」をマスターしたよ！できるようになったね！`);
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    }

    if (isFoundationReviewMode) {
      // Record skill answer progress in player record
      const reviewSkillId = reviewTargetInfo?.targetSkill.skillId || currentQ.skillId || 'kuku';
      let updatedP = recordSkillAnswer(answerLogResult.updatedPlayer, reviewSkillId, currentQ.id, correct);

      if (correct) {
        setFoundationCorrectCount((prev) => prev + 1);
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.7 },
        });
      }

      onPlayerUpdate(updatedP);
    } else {
      // Main Question Reward Calculation
      const prevExp = answerLogResult.updatedPlayer.exp || 0;
      const prevPoints = answerLogResult.updatedPlayer.points || 0;

      const rewardRes = processQuestionAnswer({
        player: answerLogResult.updatedPlayer,
        question: currentQ,
        isCorrect: correct,
        hintUsed: hintLevel > 0,
        foundationReviewed: hasCompletedFoundationForCurrentQ,
        isFirstTryForQuestionInSession: attemptCountForCurrentQ === 0,
      });

      const newExp = rewardRes.updatedPlayer.exp || 0;
      const newPoints = rewardRes.updatedPlayer.points || 0;

      setLastRewardResult(rewardRes);
      setLastRewardInfo({
        result: rewardRes,
        prevExp,
        prevPoints,
        newExp,
        newPoints,
      });

      if (correct) {
        setSessionCorrectCount((prev) => prev + 1);
        setTotalSessionExp((prev) => prev + rewardRes.expGained);
        setTotalSessionPoints((prev) => prev + rewardRes.pointsGained);

        if (rewardRes.leveledUp) {
          setLevelUpOccurred(true);
        }

        console.log(`⑦ [MathBattleModal -> onPlayerUpdate] Calling onPlayerUpdate. player.name=${rewardRes.updatedPlayer.name}, EXP=${rewardRes.updatedPlayer.exp}, KQ=${rewardRes.updatedPlayer.points}`);
        onPlayerUpdate(rewardRes.updatedPlayer);

        confetti({
          particleCount: rewardRes.rewardCategory === 'first_clear' ? 60 : 30,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        console.log(`⑦ [MathBattleModal -> onPlayerUpdate] Incorrect case. player.name=${rewardRes.updatedPlayer.name}, EXP=${rewardRes.updatedPlayer.exp}, KQ=${rewardRes.updatedPlayer.points}`);
        onPlayerUpdate(rewardRes.updatedPlayer);
      }
    }
  };

  // Launch Foundation Review Mode (基礎を復習する)
  const handleStartFoundationReview = () => {
    const targetInfo = determineReviewTargetSkill(currentQ, player);
    if (!targetInfo) return;

    const reviewSkillId = targetInfo.targetSkill.skillId;
    let reviewQList = getQuestionsBySkill(reviewSkillId);

    if (reviewQList.length === 0) {
      reviewQList = getPrerequisiteQuestions(reviewSkillId, 3);
    } else if (reviewQList.length < 3) {
      const extra = getPrerequisiteQuestions('kuku', 3 - reviewQList.length);
      reviewQList = [...reviewQList, ...extra];
    }
    reviewQList = reviewQList.slice(0, 3);

    // Build active review session record for local persistence
    const newSession: ReviewSessionData = {
      sourceQuestionId: currentQ.id,
      sourceSkillId: currentQ.skillId,
      reviewSkillId: reviewSkillId,
      reviewQuestionIds: reviewQList.map((q) => q.id),
      currentReviewIndex: 0,
      correctCount: 0,
      startedAt: new Date().toISOString(),
      isCompleted: false,
      returnedToSource: false,
    };

    const updatedP: PlayerData = {
      ...player,
      reviewSession: newSession,
    };

    onPlayerUpdate(updatedP);
    savePlayerData(updatedP);

    setReviewTargetInfo(targetInfo);
    setFoundationQuestions(reviewQList);
    setFoundationIndex(0);
    setFoundationCorrectCount(0);
    setIsReviewFinished(false);
    setIsFoundationReviewMode(true);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setHintLevel(0);
    setLastRewardResult(null);
    setLastRewardInfo(null);
  };

  // Retry the current question
  const handleRetryQuestion = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setHintLevel(0);
    setShowDetailedExplanation(false);
    setIsSavedForLaterReview(false);
    setLastRewardResult(null);
    setLastRewardInfo(null);
    questionStartTimeRef.current = Date.now();
  };

  // 「あとで復習する」ボタンクリック時の確実保存処理 (要件28, 29)
  const handleMarkForReview = () => {
    setIsSavedForLaterReview(true);
    const answerLogResult = applyAnswerRecordToPlayer(player, {
      questionId: currentQ.id,
      stageId,
      subject: currentQ.subject || 'math',
      grade: currentQ.grade || 3,
      unitId: currentQ.unitId || 'area_5_rectangle',
      unitName: currentQ.unitName,
      isCorrect: false,
      userAnswer: selectedAnswerIndex !== null ? currentQ.options[selectedAnswerIndex] || '' : 'あとで復習',
      correctAnswer: currentQ.options[currentQ.correctAnswerIndex] || '',
      hintCount: hintLevel,
      attemptCount: attemptCountForCurrentQ,
      timeSpentSeconds: Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000)),
      isFirstTryCorrect: false,
    });
    onPlayerUpdate(answerLogResult.updatedPlayer);
  };

  // Advance through review or main questions
  const handleNextQuestion = () => {
    questionStartTimeRef.current = Date.now();
    setShowDetailedExplanation(false);
    setIsSavedForLaterReview(false);

    if (isFoundationReviewMode) {
      if (foundationIndex + 1 < foundationQuestions.length) {
        setFoundationIndex((prev) => prev + 1);
        setSelectedAnswerIndex(null);
        setIsAnswerSubmitted(false);
        setHintLevel(0);
        setLastRewardResult(null);
        setLastRewardInfo(null);
      } else {
        // Finish 3-question foundation review session
        setIsReviewFinished(true);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 },
        });
      }
    } else {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswerIndex(null);
        setIsAnswerSubmitted(false);
        setHintLevel(0);
        setLastRewardResult(null);
        setLastRewardInfo(null);
        setFoundationBannerMessage(null);
        setAttemptCountForCurrentQ(0);
        setHasCompletedFoundationForCurrentQ(false);
      } else {
        finishBattle();
      }
    }
  };

  // Return to original question after completing or quitting foundation review
  const handleReturnToSourceQuestion = () => {
    const reviewSkillId = reviewTargetInfo?.targetSkill.skillId || 'kuku';
    const updatedRev = Array.from(new Set([...player.reviewedConcepts, reviewSkillId]));
    const updatedWeak = player.weakConcepts.filter((id) => id !== currentQ.unitId);

    // Give completion bonus
    const { updatedPlayer } = addExpAndPoints(
      {
        ...player,
        reviewedConcepts: updatedRev,
        weakConcepts: updatedWeak,
        reviewSession: player.reviewSession
          ? { ...player.reviewSession, isCompleted: true, returnedToSource: true }
          : null,
      },
      25,
      15
    );

    onPlayerUpdate(updatedPlayer);
    savePlayerData(updatedPlayer);

    setIsFoundationReviewMode(false);
    setIsReviewFinished(false);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setHintLevel(0);
    setLastRewardResult(null);
    setHasCompletedFoundationForCurrentQ(true);
    setFoundationBannerMessage(
      '🌱 基礎を取り戻しました！復習した努力で、元の問題に正解すると100%満額ボーナスを獲得できます！'
    );
  };

  // Repeat another 3 review questions
  const handleRepeatReview = () => {
    if (!reviewTargetInfo) return;
    const reviewSkillId = reviewTargetInfo.targetSkill.skillId;
    let reviewQList = getQuestionsBySkill(reviewSkillId);
    if (reviewQList.length < 3) {
      reviewQList = getPrerequisiteQuestions(reviewSkillId, 3);
    }
    setFoundationQuestions(reviewQList.slice(0, 3));
    setFoundationIndex(0);
    setFoundationCorrectCount(0);
    setIsReviewFinished(false);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setHintLevel(0);
  };

  // クエスト全体の再挑戦（リトライ）
  const handleRetryQuestTotal = () => {
    setIsBattleFinished(false);
    setCurrentIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setHintLevel(0);
    setComboCount(0);
    setMaxCombo(0);
    setBreakGauge(0);
    setBreakCount(0);
    setChargeGauge(0);
    setUltimateCount(0);
    setIsEnemyBroken(false);
    setBreakTurnsLeft(0);
    setIsUltimateActivated(false);
    setEnemyHp(enemyInfo.maxHp);
    setSessionCorrectCount(0);
    setTotalSessionExp(0);
    setTotalSessionPoints(0);
    setUsedAnyHint(false);
    setResultSummary(null);
    setLevelUpOccurred(false);
    startTimeRef.current = Date.now();
    if (onRetryQuest) {
      onRetryQuest();
    }
  };

  const finishBattle = () => {
    const elapsedTimeSeconds = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));
    const totalQ = questions.length;
    const accuracy = totalQ > 0 ? Math.round((sessionCorrectCount / totalQ) * 100) : 0;

    // ランク計算場所
    const rank = calculateQuestRank(accuracy, usedAnyHint);

    // 初回クリア判定場所
    const isFirstClear = Boolean(
      stageId &&
        !player.completedQuests?.includes(stageId) &&
        !player.stageProgress?.[stageId]?.isCleared
    );

    // 完全クリア判定場所
    const isPerfectClear = sessionCorrectCount === totalQ && !usedAnyHint;

    // 報酬計算場所
    const rewardData = calculateQuestRewards({
      correctCount: sessionCorrectCount,
      rank,
      isFirstClear,
      isPerfectClear,
      stageInfo: resolvedStageInfo,
    });

    // レベルアップ & 経験値加算 (経験値計算場所)
    const oldLevel = player.level;
    const newExpTotal = player.exp + rewardData.expGained;
    let newLevel = oldLevel;
    let newMaxExp = player.maxExp;
    let currentExp = newExpTotal;

    while (currentExp >= newMaxExp) {
      currentExp -= newMaxExp;
      newLevel += 1;
      newMaxExp = Math.floor(newMaxExp * 1.25);
    }

    const leveledUp = newLevel > oldLevel;
    const newTitle = getTitleForLevel(newLevel);
    const unlockedTitles = Array.from(new Set([...(player.unlockedTitles || []), newTitle]));

    // バディ/コンパニオン成長加算
    let updatedCompanion = player.companion;
    if (updatedCompanion) {
      updatedCompanion = {
        ...updatedCompanion,
        growthExp: (updatedCompanion.growthExp || 0) + rewardData.partnerExpGained,
        bond: Math.min(100, (updatedCompanion.bond || 0) + 2),
      };
    }

    // ステージ進行度の更新
    const updatedStageProgress = { ...(player.stageProgress || {}) };
    if (stageId) {
      const existingProgress = updatedStageProgress[stageId] || {
        stageId,
        isUnlocked: true,
        attemptCount: 0,
        bestCorrectCount: 0,
        bestStars: 0,
        isCleared: false,
        isPerfectCleared: false,
        firstClearRewardClaimed: false,
        perfectClearRewardClaimed: false,
      };

      updatedStageProgress[stageId] = {
        ...existingProgress,
        attemptCount: existingProgress.attemptCount + 1,
        bestCorrectCount: Math.max(existingProgress.bestCorrectCount, sessionCorrectCount),
        bestStars: Math.max(
          existingProgress.bestStars,
          rank === 'S' ? 3 : rank === 'A' ? 2 : rank === 'B' ? 1 : 0
        ),
        isCleared: true,
        isPerfectCleared: existingProgress.isPerfectCleared || isPerfectClear,
        firstClearedAt: existingProgress.firstClearedAt || new Date().toISOString(),
        lastPlayedAt: new Date().toISOString(),
      };
    }

    const updatedCompletedQuests = stageId
      ? Array.from(new Set([...(player.completedQuests || []), stageId]))
      : player.completedQuests;

    const updatedPlayer: PlayerData = {
      ...player,
      level: newLevel,
      exp: currentExp,
      maxExp: newMaxExp,
      points: (player.points || 0) + rewardData.coinsGained,
      completedQuests: updatedCompletedQuests,
      stageProgress: updatedStageProgress,
      unlockedTitles,
      companion: updatedCompanion,
      updatedAt: new Date().toISOString(),
    };

    onPlayerUpdate(updatedPlayer);
    savePlayerData(updatedPlayer);

    // NPC 遭遇判定
    const encounterRes = checkStageClearNpcEncounter(updatedPlayer);
    if (encounterRes.encounteredNpc) {
      onPlayerUpdate(encounterRes.updatedPlayer);
      savePlayerData(encounterRes.updatedPlayer);
      setNpcEncounter({
        npc: encounterRes.encounteredNpc,
        isNewDiscovery: encounterRes.isNewDiscovery,
      });
    }

    setLevelUpOccurred(leveledUp);
    setResultSummary({
      isCleared: sessionCorrectCount > 0,
      rank,
      elapsedTimeSeconds,
      accuracy,
      correctCount: sessionCorrectCount,
      totalQuestions: totalQ,
      maxCombo,
      breakCount,
      ultimateCount,
      usedAnyHint,
      isFirstClear,
      isPerfectClear,
      expGained: rewardData.expGained,
      coinsGained: rewardData.coinsGained,
      gemsGained: rewardData.gemsGained,
      itemsGained: rewardData.itemsGained,
      partnerExpGained: rewardData.partnerExpGained,
      leveledUp,
      oldLevel,
      newLevel,
      newTitle,
      statUpText: leveledUp ? `❤️ 最大HP +10  ⚔️ 攻撃力 +5  ⚡ チャージ効率 +5%` : undefined,
    });

    setIsBattleFinished(true);

    confetti({
      particleCount: isPerfectClear ? 160 : isFirstClear ? 120 : 80,
      spread: 90,
      origin: { y: 0.4 },
    });
  };

  // Hero character expression
  let heroExpression: 'idle' | 'happy' | 'thinking' | 'levelup' = 'idle';
  if (isBattleFinished) {
    heroExpression = levelUpOccurred ? 'levelup' : 'happy';
  } else if (isAnswerSubmitted) {
    heroExpression = isCorrect ? 'happy' : 'thinking';
  }

  // 自動言葉検索用キーワードの抽出
  const currentKotobaList = Object.keys(KOTOBA_NAV_DICTIONARY).filter((word) =>
    currentQ.questionText.includes(word) || currentQ.explanation.includes(word)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl game-card p-3 sm:p-6 relative border-4 border-amber-400/90 shadow-[0_25px_60px_rgba(0,0,0,0.95)] my-auto bg-slate-900 rounded-3xl overflow-hidden pb-16"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white bg-slate-950/90 p-2 rounded-full border border-slate-700 transition-all cursor-pointer z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {!isBattleFinished ? (
          !isReviewFinished ? (
            <div className="space-y-3 sm:space-y-4 relative">
              {/* ========================================================= */}
              {/* 1. TOP HEADER BAR: Stage Info, HP Bars, Menu & Pause */}
              {/* ========================================================= */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-2xl border-2 border-amber-500/40 shadow-md">
                {/* Left: Stage Title & Hero/Buddy HP Bars */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  {/* Stage Badge */}
                  <div className="btn-book-blue px-3.5 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow">
                    <Swords className="w-4 h-4 text-sky-200 shrink-0" />
                    <span>
                      {isFoundationReviewMode
                        ? '🌱 基礎復習バトル'
                        : resolvedStageInfo?.title || '算数クエスト'}
                    </span>
                  </div>

                  {/* Hero HP Bar */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-emerald-500/40 shadow-inner text-xs font-bold">
                    <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0 animate-pulse" />
                    <span className="text-slate-300">HP</span>
                    <span className="text-emerald-300 font-mono font-black">{heroHp}/{maxHeroHp}</span>
                    <div className="w-16 sm:w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700 ml-1">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(heroHp / maxHeroHp) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Buddy HP Bar */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-sky-500/40 shadow-inner text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-slate-300">バディ</span>
                    <span className="text-sky-300 font-mono font-black">{buddyHp}/{maxBuddyHp}</span>
                    <div className="w-14 sm:w-16 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700 ml-1">
                      <div
                        className="bg-sky-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(buddyHp / maxBuddyHp) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Menu & Pause RPG Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPauseMenu(true)}
                    className="btn-book-yellow px-3 py-1.5 text-xs font-black flex items-center gap-1 shadow cursor-pointer active:scale-95 transition-transform"
                  >
                    <MenuIcon className="w-4 h-4" />
                    <span>メニュー</span>
                  </button>
                  <button
                    onClick={() => setShowPauseMenu(true)}
                    className="btn-book-blue px-3 py-1.5 text-xs font-black flex items-center gap-1 shadow cursor-pointer active:scale-95 transition-transform"
                  >
                    <Pause className="w-4 h-4" />
                    <span>一時停止</span>
                  </button>
                </div>
              </div>

              {/* Combo & Booster Banners */}
              {comboBanner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-xs sm:text-sm font-black text-center rounded-2xl shadow-lg border border-amber-300 animate-pulse"
                >
                  {comboBanner}
                </motion.div>
              )}

              {/* ========================================================= */}
              {/* 2. MAIN BATTLE ARENA (RPG Landscape + Ring Notebook Card) */}
              {/* ========================================================= */}
              <div className="relative rounded-3xl p-3 sm:p-5 border-4 border-amber-700/60 shadow-2xl overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-600 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between">
                
                {/* Grass Hill Background Graphic Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-emerald-700/80 rounded-b-2xl border-t-4 border-emerald-500/80 pointer-events-none" />

                {/* Top Enemy Appearance Notification Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 mx-auto bg-slate-950/90 border-2 border-amber-400 text-amber-200 px-6 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-xl flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>{enemyInfo.name} があらわれた！</span>
                </motion.div>

                {/* Battle Stage Grid Layout (Left: Hero & Buddy | Center: Ring Notebook Problem Card | Right: Enemy) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 relative z-10 my-auto items-stretch">
                  
                  {/* LEFT COLUMN: Hero & Buddy Character */}
                  <div className="lg:col-span-3 flex flex-row lg:flex-col items-center justify-between lg:justify-end gap-3 p-2">
                    {/* Hero Character Frame */}
                    <div className="flex flex-col items-center relative">
                      {/* Combo Counter Plate above Hero */}
                      <div className="mb-1 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-amber-200 shadow animate-pulse">
                        🔥 {comboCount} COMBO!
                      </div>

                      <motion.div
                        animate={attackEffect ? { x: [0, 60, 0] } : { y: [0, -4, 0] }}
                        transition={{ duration: attackEffect ? 0.3 : 2.5, repeat: attackEffect ? 0 : Infinity }}
                        className="relative"
                      >
                        <HeroCharacter
                          player={player}
                          expression={heroExpression}
                          size="md"
                        />
                      </motion.div>

                      {/* Hero Grass Platform */}
                      <div className="w-24 sm:w-32 h-4 bg-emerald-900/60 rounded-full blur-xs border border-emerald-400/50 -mt-2" />
                    </div>

                    {/* Left-Bottom Buddy Pet Character */}
                    <div className="flex flex-col items-center relative">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative"
                      >
                        <BuddyCharacter
                          player={player}
                          size="sm"
                          showSparkles
                        />
                      </motion.div>
                      <div className="w-16 h-3 bg-emerald-950/70 rounded-full blur-xs -mt-1" />
                    </div>
                  </div>

                  {/* CENTER COLUMN: Ring Notebook Problem Card (リングノート風問題カード) */}
                  <div className="lg:col-span-6 flex flex-col justify-center">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="book-notebook-card p-4 sm:p-5 relative shadow-2xl rounded-3xl border-2 border-amber-800/40"
                    >
                      {/* Notebook Ring Spirals on Left Edge */}
                      <div className="absolute -left-3 top-4 bottom-4 flex flex-col justify-between z-20 pointer-events-none">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-slate-300 border-2 border-slate-600 shadow-md transform -rotate-12"
                          />
                        ))}
                      </div>

                      {/* Top Right Bookmark Ribbon */}
                      <div className="absolute -top-1 right-6 w-7 h-10 bg-sky-600 border-b-4 border-r-4 border-sky-800 rounded-b shadow-md flex items-end justify-center pb-1 z-20">
                        <span className="text-[10px] text-white font-black">🔖</span>
                      </div>

                      {/* Problem Header inside Notebook */}
                      <div className="flex items-center justify-between border-b-2 border-amber-800/20 pb-2 mb-3 pl-3">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sky-900 text-lg sm:text-xl font-cinzel">
                            問題 {isFoundationReviewMode ? foundationIndex + 1 : currentIndex + 1} / {questions.length}
                          </span>
                        </div>

                        {/* Grade & Unit Badge */}
                        <span className="book-badge-blue text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                          {currentQ.grade}年生 算数 {currentQ.topic || '図形'}
                        </span>
                      </div>

                      {/* Main Question Text */}
                      <div className="pl-3 space-y-2">
                        <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed tracking-wide">
                          <FuriganaText text={currentQ.questionText} readings={currentQ.readings} />
                        </p>

                        {/* Geometry SVG Diagram Area */}
                        <QuestionDiagram question={currentQ} />

                        {/* Step Hint Display if active */}
                        {hintLevel > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-amber-100/90 border-2 border-amber-400 rounded-2xl text-xs text-amber-950 font-bold space-y-1 shadow-inner"
                          >
                            <span className="text-amber-900 font-black">💡 ヒント ({hintLevel}/3):</span>
                            <p className="leading-snug">
                              <FuriganaText text={getGraduatedHint(currentQ, hintLevel - 1).hintText} />
                            </p>
                          </motion.div>
                        )}

                        {/* 4-Choice Option Buttons (Ring notebook card style) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {currentQ.options.map((option, idx) => {
                            const isSelected = selectedAnswerIndex === idx;
                            let btnClasses =
                              'bg-white/95 border-amber-700/30 hover:bg-amber-100/80 text-slate-900 shadow-sm';

                            if (isAnswerSubmitted) {
                              if (idx === currentQ.correctAnswerIndex) {
                                btnClasses =
                                  'bg-emerald-100 border-emerald-600 text-emerald-950 font-black ring-2 ring-emerald-500 shadow-md';
                              } else if (isSelected) {
                                btnClasses = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                              }
                            } else if (isSelected) {
                              btnClasses =
                                'bg-sky-100 border-sky-600 text-sky-950 ring-2 ring-sky-400 font-black shadow-md';
                            }

                            const circles = ['①', '②', '③', '④'];
                            return (
                              <button
                                key={idx}
                                disabled={isAnswerSubmitted}
                                onClick={() => handleSelectOption(idx)}
                                className={`p-3 rounded-2xl border-2 text-left text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 ${btnClasses}`}
                              >
                                <span className="w-7 h-7 rounded-full bg-amber-200/80 border border-amber-500/50 flex items-center justify-center text-amber-950 font-black text-sm shrink-0">
                                  {circles[idx]}
                                </span>
                                <span className="flex-1 leading-snug">
                                  <FuriganaText text={option} />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Feedback & Structured Explanation Area */}
                      {isAnswerSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-3 p-3.5 rounded-2xl border-2 space-y-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md'
                              : 'bg-rose-50 border-rose-400 text-rose-950 shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between font-black text-sm">
                            <span className="flex items-center gap-1.5">
                              {isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                  <span>正解！こうげきヒット！</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5 text-rose-600" />
                                  <span>ざんねん！もういちど考えてみよう！</span>
                                </>
                              )}
                            </span>

                            {!isCorrect && (
                              <button
                                onClick={handleRetryQuestion}
                                className="btn-book-yellow px-2.5 py-1 text-xs font-black shadow"
                              >
                                再挑戦 🔄
                              </button>
                            )}
                          </div>

                          <p className="text-xs leading-relaxed font-semibold text-slate-800">
                            <FuriganaText text={currentQ.explanation} />
                          </p>
                        </motion.div>
                      )}

                      {/* Submit / Next Question Action Buttons */}
                      <div className="mt-4 pt-2 border-t border-amber-800/20 flex justify-end pl-3">
                        {!isAnswerSubmitted ? (
                          <button
                            onClick={handleSubmitAnswer}
                            className="btn-book-yellow w-full sm:w-auto px-7 py-3 text-base font-black shadow-lg cursor-pointer active:scale-95 transition-transform"
                          >
                            けってい（答える）
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="btn-book-green w-full sm:w-auto px-7 py-3 text-base font-black flex items-center justify-center gap-1.5 shadow-lg cursor-pointer active:scale-95 transition-transform"
                          >
                            <span>つぎの問題へ</span>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* RIGHT COLUMN: Enemy Monster Character */}
                  <div className="lg:col-span-3 flex flex-col items-center justify-end p-2 relative">
                    {/* Enemy HP Badge & Bar above head */}
                    <div className="w-full bg-slate-950/80 p-2 rounded-2xl border border-red-500/50 shadow-lg text-center space-y-1 mb-2">
                      <div className="flex items-center justify-between text-xs font-black text-red-300">
                        <span>{enemyInfo.name}</span>
                        <span>HP {enemyHp}/{enemyInfo.maxHp}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="bg-red-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(enemyHp / enemyInfo.maxHp) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Enemy Monster Avatar */}
                    <motion.div
                      animate={
                        enemyHitEffect
                          ? { x: [-10, 10, -10, 10, 0], filter: ['brightness(2)', 'brightness(1)'] }
                          : { y: [0, -6, 0] }
                      }
                      transition={{ duration: enemyHitEffect ? 0.4 : 3, repeat: enemyHitEffect ? 0 : Infinity }}
                      className="relative my-2"
                    >
                      <EnemyCharacter
                        type="ogre_blue"
                        isHit={enemyHitEffect}
                        isDefeated={enemyHp <= 0}
                        size="large"
                      />

                      {/* Damage Popup Floater */}
                      <AnimatePresence>
                        {damagePopup && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -40, scale: 1.3 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 font-black text-2xl sm:text-3xl text-rose-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] whitespace-nowrap z-30"
                          >
                            💥 -{damagePopup.amount}!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Enemy Platform Base */}
                    <div className="w-32 sm:w-40 h-5 bg-emerald-950/80 rounded-full blur-xs border border-emerald-600/50 -mt-2" />
                  </div>

                </div>

                {/* ========================================================= */}
                {/* 3. BOTTOM COMMAND BAR (5 RPG Commands Notebook Plate) */}
                {/* ========================================================= */}
                <div className="relative z-10 mt-3 pt-2">
                  <div className="book-notebook-card p-2 sm:p-3 rounded-2xl border-2 border-amber-800/40 shadow-xl flex items-center justify-around gap-1 sm:gap-2">
                    {/* Command 1: 問題 */}
                    <button
                      onClick={() => {
                        /* Focus Problem Card */
                      }}
                      className="book-icon-plate p-2 sm:p-2.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all flex-1 max-w-[90px]"
                    >
                      <Book className="w-5 h-5 sm:w-6 sm:h-6 text-sky-800" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-900">問題</span>
                    </button>

                    {/* Command 2: ヒント */}
                    <button
                      onClick={handleStepHint}
                      className="book-icon-plate p-2 sm:p-2.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all flex-1 max-w-[90px]"
                    >
                      <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-900">ヒント</span>
                    </button>

                    {/* Command 3: メモ */}
                    <button
                      onClick={() => setShowKotobaNaviModal(true)}
                      className="book-icon-plate p-2 sm:p-2.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all flex-1 max-w-[90px]"
                    >
                      <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-purple-800" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-900">メモ</span>
                    </button>

                    {/* Command 4: アイテム */}
                    <button
                      onClick={() => setShowItemModal(true)}
                      className="book-icon-plate p-2 sm:p-2.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all flex-1 max-w-[90px]"
                    >
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-orange-700" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-900">アイテム</span>
                    </button>

                    {/* Command 5: メニュー */}
                    <button
                      onClick={() => setShowPauseMenu(true)}
                      className="book-icon-plate p-2 sm:p-2.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all flex-1 max-w-[90px]"
                    >
                      <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-900">メニュー</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* ========================================================= */}
              {/* MODALS: ITEM DRAWER & PAUSE MENU */}
              {/* ========================================================= */}
              {/* Item Drawer Modal */}
              {showItemModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                  <div className="book-notebook-card p-5 rounded-3xl max-w-md w-full border-4 border-amber-800/60 shadow-2xl relative space-y-4">
                    <button
                      onClick={() => setShowItemModal(false)}
                      className="btn-book-red absolute top-3 right-3 px-2.5 py-1 text-xs font-black"
                    >
                      ✕
                    </button>
                    <h3 className="text-lg font-black text-slate-900 border-b-2 border-amber-800/20 pb-2">
                      🎒 もちもの（アイテム）
                    </h3>
                    <div className="space-y-2.5">
                      <div
                        onClick={() => {
                          setHeroHp((h) => Math.min(maxHeroHp, h + 40));
                          setBuddyHp((b) => Math.min(maxBuddyHp, b + 30));
                          setShowItemModal(false);
                        }}
                        className="p-3 bg-white/90 border-2 border-amber-700/30 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-100/80 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🍬</span>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900">回復アメ玉</div>
                            <div className="text-[11px] text-slate-600 font-medium">HPとバディHPを大きく回復する</div>
                          </div>
                        </div>
                        <span className="btn-book-yellow px-3 py-1 text-xs font-black">つかう</span>
                      </div>

                      <div
                        onClick={() => {
                          setChargeGauge((c) => Math.min(100, c + 50));
                          setShowItemModal(false);
                        }}
                        className="p-3 bg-white/90 border-2 border-amber-700/30 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-100/80 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🍪</span>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900">知識の黄金ビスケット</div>
                            <div className="text-[11px] text-slate-600 font-medium">必殺パワー（チャージ）+50%</div>
                          </div>
                        </div>
                        <span className="btn-book-yellow px-3 py-1 text-xs font-black">つかう</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pause / Menu Modal */}
              {showPauseMenu && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                  <div className="book-notebook-card p-6 rounded-3xl max-w-sm w-full border-4 border-amber-800/60 shadow-2xl space-y-4 text-center">
                    <h3 className="text-xl font-black text-slate-900 border-b-2 border-amber-800/20 pb-2">
                      ⏸️ 一時停止メニュー
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowPauseMenu(false)}
                        className="btn-book-blue w-full py-3 text-sm font-black shadow cursor-pointer"
                      >
                        バトルを再開する ⚔️
                      </button>
                      <button
                        onClick={() => {
                          setShowPauseMenu(false);
                          setCurrentIndex(0);
                          setEnemyHp(enemyInfo.maxHp);
                        }}
                        className="btn-book-yellow w-full py-3 text-sm font-black shadow cursor-pointer"
                      >
                        最初からやり直す 🔄
                      </button>
                      <button
                        onClick={onClose}
                        className="btn-book-red w-full py-3 text-sm font-black shadow cursor-pointer"
                      >
                        マップへ戻る 🚪
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Review Session Finish Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-5"
            >
              <div className="text-5xl">
                {foundationCorrectCount === 3
                  ? '👑'
                  : foundationCorrectCount === 2
                  ? '✨'
                  : '🌱'}
              </div>

              <div className="space-y-1">
                <h3 className="font-cinzel text-2xl font-black text-amber-300">
                  {foundationCorrectCount === 3
                    ? '🎉 基礎マスター！'
                    : foundationCorrectCount === 2
                    ? '✨ あと少し！'
                    : '💪 もう少し基礎を練習すると強くなれます！'}
                </h3>
                <p className="text-xs text-emerald-300 font-semibold max-w-md mx-auto">
                  {foundationCorrectCount === 3
                    ? '素晴らしい！基礎の力を完全に取り戻しました。元の問題へ戻って挑戦しよう！'
                    : foundationCorrectCount === 2
                    ? '基礎の力が湧いてきました！元の問題で力を試してみよう！'
                    : '焦らなくて大丈夫。もう一度練習するか、元の問題に挑戦しよう！'}
                </p>
              </div>

              <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 max-w-sm mx-auto space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>復習問題の正解数</span>
                  <span className="font-extrabold text-amber-300">
                    {foundationCorrectCount} / 3 問
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>復習完了ボーナス</span>
                  <span className="font-extrabold text-emerald-400">+25 EXP / +15 KQ</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRepeatReview}
                  className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl text-xs font-bold cursor-pointer"
                >
                  🔄 もう3問練習する
                </button>

                <button
                  onClick={handleReturnToSourceQuestion}
                  className="w-full sm:w-auto btn-gold px-8 py-3.5 rounded-2xl text-sm font-black shadow-lg cursor-pointer"
                >
                  ⚔️ 元の問題へ戻る
                </button>
              </div>
            </motion.div>
          )
        ) : (
          /* Main Battle Finish Victory Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-3xl mx-auto"
          >
            {/* 1. クリアバナー・特殊バッジ */}
            <div className="space-y-2 relative">
              {/* 完全クリアバッジ */}
              {resultSummary?.isPerfectClear && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg border-2 border-amber-200 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>★ 完全クリア ★ (PERFECT CLEAR!)</span>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </motion.div>
              )}

              {/* 初回クリアバッジ */}
              {resultSummary?.isFirstClear && !resultSummary?.isPerfectClear && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg border-2 border-emerald-200"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>🎉 初回クリア達成！</span>
                </motion.div>
              )}

              <div className="flex items-center justify-center gap-4">
                {/* ランクエンブレム */}
                <div className="relative">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-black shadow-2xl border-4 ${
                    resultSummary?.rank === 'S'
                      ? 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 text-slate-950 border-amber-200 ring-4 ring-amber-400/50'
                      : resultSummary?.rank === 'A'
                      ? 'bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-700 text-white border-purple-300 ring-4 ring-purple-400/40'
                      : resultSummary?.rank === 'B'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-blue-300'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-300'
                  }`}>
                    {resultSummary?.rank || 'S'}
                  </div>
                  {resultSummary?.rank === 'S' && (
                    <Crown className="w-7 h-7 text-amber-300 absolute -top-3 -right-3 drop-shadow animate-bounce" />
                  )}
                </div>

                <div className="text-left">
                  <h3 className="font-cinzel text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 drop-shadow">
                    {resultSummary?.isCleared ? 'QUEST CLEAR! 👑' : 'CHALLENGE FINISHED'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-300 font-bold flex items-center gap-1.5 mt-0.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>ランク {resultSummary?.rank} 獲得！マスリア王国の平和を守った！</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. キャラクター & レベルアップバナー */}
            <div className="flex items-center justify-center gap-4">
              <HeroCharacter
                player={player}
                expression={heroExpression || 'happy'}
                size="md"
              />
            </div>

            {/* レベルアップ演出パネル */}
            {resultSummary?.leveledUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-950 border-2 border-amber-400 rounded-2xl p-3 sm:p-4 text-amber-200 space-y-2 shadow-xl animate-pulse"
              >
                <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-black text-amber-300">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>🎉 LEVEL UP! レベルが {resultSummary.oldLevel} ➔ {resultSummary.newLevel} に上がりました！</span>
                </div>
                {resultSummary.newTitle && (
                  <div className="text-xs font-black text-emerald-300">
                    新称号獲得: 【{resultSummary.newTitle}】
                  </div>
                )}
                {resultSummary.statUpText && (
                  <div className="text-[11px] sm:text-xs font-bold text-slate-200">
                    ステータス上昇: {resultSummary.statUpText}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. クリア結果詳細グリッド */}
            <div className="bg-slate-950/90 p-4 rounded-3xl border-2 border-amber-500/40 shadow-inner space-y-3">
              <div className="text-xs font-black text-amber-300 flex items-center gap-1 border-b border-amber-500/20 pb-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span>■ クリア結果詳細 (BATTLE RECORD)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-bold">クリア時間</span>
                  <span className="font-extrabold text-amber-300 text-sm sm:text-base">
                    ⏱️ {formatElapsedTime(resultSummary?.elapsedTimeSeconds || 0)}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-bold">正答率 (正解数)</span>
                  <span className="font-extrabold text-emerald-400 text-sm sm:text-base">
                    🎯 {resultSummary?.accuracy}% ({resultSummary?.correctCount}/{resultSummary?.totalQuestions})
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-bold">最大コンボ</span>
                  <span className="font-extrabold text-orange-400 text-sm sm:text-base">
                    🔥 {resultSummary?.maxCombo} COMBO
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-bold">ブレイク / 必殺技</span>
                  <span className="font-extrabold text-teal-300 text-xs sm:text-sm">
                    ⚡ {resultSummary?.breakCount}回 / 💥 {resultSummary?.ultimateCount}回
                  </span>
                </div>
              </div>
            </div>

            {/* 4. 獲得報酬セクション (カウントアップアニメーション付き) */}
            <div className="bg-slate-950/90 p-4 rounded-3xl border-2 border-amber-500/40 shadow-inner space-y-3">
              <div className="text-xs font-black text-amber-300 flex items-center justify-between border-b border-amber-500/20 pb-1.5">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>■ 獲得報酬 (QUEST REWARDS)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                  ✨ 報酬アニメーション加算中
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {/* 経験値 */}
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-blue-500/30 text-left space-y-1">
                  <div className="text-[10px] text-blue-300 font-extrabold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>経験値 (EXP)</span>
                  </div>
                  <div className="text-lg font-black text-blue-300">
                    +<AnimatedNumber value={resultSummary?.expGained || 0} /> EXP
                  </div>
                </div>

                {/* コイン (KQ) */}
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-amber-500/30 text-left space-y-1">
                  <div className="text-[10px] text-amber-300 font-extrabold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>コイン (KQ)</span>
                  </div>
                  <div className="text-lg font-black text-amber-300">
                    +<AnimatedNumber value={resultSummary?.coinsGained || 0} /> KQ
                  </div>
                </div>

                {/* ジェム */}
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-purple-500/30 text-left space-y-1">
                  <div className="text-[10px] text-purple-300 font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>ジェム (Gems)</span>
                  </div>
                  <div className="text-lg font-black text-purple-300">
                    +<AnimatedNumber value={resultSummary?.gemsGained || 0} /> Gem
                  </div>
                </div>

                {/* バディ経験値 */}
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-emerald-500/30 text-left space-y-1">
                  <div className="text-[10px] text-emerald-300 font-extrabold flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>バディEXP</span>
                  </div>
                  <div className="text-lg font-black text-emerald-300">
                    +<AnimatedNumber value={resultSummary?.partnerExpGained || 0} /> EXP
                  </div>
                </div>
              </div>

              {/* アイテムドロップ */}
              {resultSummary?.itemsGained && resultSummary.itemsGained.length > 0 && (
                <div className="p-2.5 bg-slate-900 rounded-2xl border border-amber-500/30 text-xs flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    🎁 ドロップアイテム:
                  </span>
                  <div className="flex items-center gap-2">
                    {resultSummary.itemsGained.map((item, idx) => (
                      <span key={idx} className="bg-amber-500/20 text-amber-200 border border-amber-400/50 px-2.5 py-0.5 rounded-full font-black text-xs">
                        {item.icon} {item.name} ×{item.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. 報酬画面操作ボタン 4項目 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <button
                onClick={handleRetryQuestTotal}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-2 border-slate-700 hover:border-amber-400 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>もう一度挑戦</span>
              </button>

              <button
                onClick={onNextQuest || onClose}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-slate-950 border-2 border-emerald-300 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>次のクエスト</span>
              </button>

              <button
                onClick={onReturnToMap || onClose}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border-2 border-slate-700 hover:border-amber-400 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>マップへ戻る</span>
              </button>

              <button
                onClick={onReturnToHome || onClose}
                className="btn-gold py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-lg border-2 border-amber-300 transition-all"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                <span>ホームへ戻る</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* NPC Companion Encounter Overlay Modal */}
        {npcEncounter && (
          <NpcEncounterModal
            npc={npcEncounter.npc}
            isNewDiscovery={npcEncounter.isNewDiscovery}
            onOpenZukan={() => setNpcEncounter(null)}
            onClose={() => setNpcEncounter(null)}
          />
        )}

        {/* ========================================================= */}
        {/* KOTOBA NAVI (WORDS DICTIONARY) MODAL OVERLAY */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showKotobaNaviModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="game-card w-full max-w-md p-5 relative bg-slate-900 border-3 border-amber-400 shadow-2xl rounded-3xl space-y-4"
              >
                <button
                  onClick={() => setShowKotobaNaviModal(false)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 border-b border-amber-500/30 pb-3">
                  <BookMarked className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-base text-amber-300 font-cinzel">
                    ことばナビ 📖 算数用語辞典
                  </h3>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
                  {currentKotobaList.length > 0 ? (
                    currentKotobaList.map((word) => (
                      <div
                        key={word}
                        className="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 space-y-1"
                      >
                        <span className="font-black text-amber-300 text-sm block">
                          📌 {word}
                        </span>
                        <p className="text-slate-200 leading-relaxed font-semibold">
                          {KOTOBA_NAV_DICTIONARY[word]}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-400">
                      この問題に登録されている用語の解説を表示できます。
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowKotobaNaviModal(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow"
                >
                  とじる
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* CHILD-FRIENDLY BATTLE TUTORIAL POPUP MODAL */}
        {/* ========================================================= */}
        <AnimatePresence>
          {tutorialModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm bg-slate-900 border-4 border-amber-400 p-5 rounded-3xl text-center space-y-4 shadow-2xl relative"
              >
                <div className="w-12 h-12 bg-amber-400/20 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-400">
                  <Info className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-amber-300">
                    {tutorialModal.title}
                  </h3>
                  <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                    {tutorialModal.description}
                  </p>
                </div>

                <button
                  onClick={() => setTutorialModal(null)}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-2xl text-xs shadow cursor-pointer hover:brightness-110"
                >
                  わかった！⚔️
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
