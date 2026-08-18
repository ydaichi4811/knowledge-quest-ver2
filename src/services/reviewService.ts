import {
  PlayerData,
  AnswerHistoryRecord,
  ReviewCandidateItem,
  ReviewStatus,
  UnitMasteryStatus,
  LearningQuestion,
  MathQuestion,
  QuestionProgressData,
} from '../types';
import { ALL_LEARNING_QUESTIONS } from '../data/questionsData';

/**
 * 苦手判定・単元学習状況の判定設定（定数化：要件32）
 */
export const UNIT_MASTERY_CONFIG = {
  MIN_ATTEMPTS_FOR_DIAGNOSIS: 2, // 2問題未満の場合は「練習中/順調」として扱い、強引に苦手としない（要件33）
  MASTERED_ACCURACY_THRESHOLD: 0.85, // 正答率85%以上
  GOOD_ACCURACY_THRESHOLD: 0.70, // 正答率70%以上
  ALMOST_ACCURACY_THRESHOLD: 0.50, // 正答率50%以上
  MAX_HINT_PENALTY_WEIGHT: 0.1, // ヒント多用による調整重み
  TIME_SLOW_THRESHOLD_SECONDS: 45, // 1問題平均45秒以上は検討中と判断
};

/**
 * 段階的ヒントの共通安全フォールバック（要件21）
 */
export const SAFE_COMMON_HINTS = [
  '問題文の大切な言葉（数字や聞かれていること）に注目してみよう！',
  '図や式に表して、分かっていることを整理してみよう！',
  '小さな数に置き換えたり、解き方の順番をたしかめてみよう！',
];

/**
 * 安全な問題データフォールバック (要件11)
 */
export function getSafeQuestionData(questionId: string): LearningQuestion {
  const found = ALL_LEARNING_QUESTIONS.find((q) => q.id === questionId);
  if (found) return found;

  // 存在しない古いデータの場合の安全なフォールバック
  return {
    id: questionId || 'unknown_q',
    grade: 3,
    subject: 'math',
    unitId: 'unknown_unit',
    unitName: '算数の問題',
    topic: '復習問題',
    difficulty: 'normal',
    questionText: '問題の読み込み中にエラーが発生しました。次の問題へ進みましょう。',
    options: ['選択肢1', '選択肢2', '選択肢3', '選択肢4'],
    correctAnswerIndex: 0,
    explanation: 'この問題の解説はありません。',
    hint: '落ち着いて考えよう！',
    hints: SAFE_COMMON_HINTS,
    expReward: 10,
    pointReward: 5,
  };
}

/**
 * 今日の日付文字列 (YYYY-MM-DD) を取得
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 1. 解答履歴の記録 (要件1〜5)
 * 個人情報を重複保存せず、二重保存を防止しながら解答ログを生成します。
 */
export function createAnswerHistoryRecord(params: {
  questionId: string;
  stageId?: string;
  subject?: string;
  grade?: number;
  unitId?: string;
  unitName?: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  hintCount: number;
  attemptCount: number;
  timeSpentSeconds: number;
  isFirstTryCorrect: boolean;
}): AnswerHistoryRecord {
  const now = new Date();
  const timestamp = now.toISOString();

  // 二重保存防止のためのユニークID (問題ID + タイムスタンプ + ランダム)
  const id = `ans_${params.questionId}_${now.getTime()}_${Math.random().toString(36).substring(2, 6)}`;

  return {
    id,
    questionId: params.questionId,
    stageId: params.stageId || 'general_stage',
    subject: params.subject || 'math',
    grade: params.grade || 3,
    unitId: params.unitId || 'general_unit',
    unitName: params.unitName || '算数単元',
    isCorrect: params.isCorrect,
    userAnswer: params.userAnswer || '',
    correctAnswer: params.correctAnswer || '',
    hintCount: Math.min(3, Math.max(0, params.hintCount || 0)),
    attemptCount: params.attemptCount || 1,
    timestamp,
    timeSpentSeconds: Math.max(1, params.timeSpentSeconds || 5),
    isFirstTryCorrect: params.isFirstTryCorrect,
  };
}

/**
 * 2. 間違えた問題の管理 & 復習ステータス更新 (要件6〜11)
 * 1回の正解だけで苦手記録を完全に削除せず、段階的に管理します。
 * 日付をまたいだ正解で「マスター」へ昇格。
 */
export function updateReviewCandidateItem(
  existingItem: ReviewCandidateItem | undefined,
  record: AnswerHistoryRecord
): ReviewCandidateItem {
  const today = getTodayDateString();
  const isCorrect = record.isCorrect;

  const currentAttempt = (existingItem?.attemptCount || 0) + 1;
  const currentCorrect = (existingItem?.correctCount || 0) + (isCorrect ? 1 : 0);
  const currentIncorrect = (existingItem?.incorrectCount || 0) + (isCorrect ? 0 : 1);
  const consecutiveCorrect = isCorrect ? (existingItem?.consecutiveCorrect || 0) + 1 : 0;

  // 日付管理（マルチデイ・マスター判定用）
  const previousDates = existingItem?.lastCorrectDates || [];
  const updatedCorrectDates = isCorrect && !previousDates.includes(today)
    ? [...previousDates, today]
    : previousDates;

  const totalTime = (existingItem?.totalTimeSpentSeconds || 0) + record.timeSpentSeconds;
  const avgTime = Math.round(totalTime / currentAttempt);

  const maxHintCount = Math.max(existingItem?.maxHintCount || 0, record.hintCount);

  // 段階的復習ステータスの判定 (未復習 -> 練習中 -> あと少し -> クリア -> マスター)
  let newStatus: ReviewStatus = existingItem?.status || 'unreviewed';

  if (!isCorrect) {
    // 不正解の場合は復習候補として保存
    // 過去に正解したことが無ければ「未復習(unreviewed)」、一度でも正解済みなら「練習中(practicing)」
    newStatus = currentCorrect === 0 ? 'unreviewed' : 'practicing';
  } else {
    // 正解した場合の段階的ステップアップ
    if (updatedCorrectDates.length >= 2 && consecutiveCorrect >= 2) {
      // 複数日かつ連続正解2回以上でのみ「マスター」
      newStatus = 'mastered';
    } else if (consecutiveCorrect >= 2 || (currentCorrect > currentIncorrect && updatedCorrectDates.length >= 2)) {
      newStatus = 'completed';
    } else if (consecutiveCorrect === 1) {
      newStatus = 'almost';
    } else {
      newStatus = 'practicing';
    }
  }

  return {
    questionId: record.questionId,
    unitId: record.unitId,
    subject: record.subject,
    grade: record.grade,
    status: newStatus,
    attemptCount: currentAttempt,
    correctCount: currentCorrect,
    incorrectCount: currentIncorrect,
    consecutiveCorrect,
    lastHintCount: record.hintCount,
    maxHintCount,
    totalTimeSpentSeconds: totalTime,
    averageTimeSpentSeconds: avgTime,
    lastAnsweredAt: record.timestamp,
    lastIncorrectAt: !isCorrect ? record.timestamp : existingItem?.lastIncorrectAt,
    lastReviewedAt: record.timestamp,
    masteredAt: newStatus === 'mastered' ? (existingItem?.masteredAt || record.timestamp) : undefined,
    lastCorrectDates: updatedCorrectDates,
  };
}

/**
 * プレイヤーデータに解答記録と復習候補の更新を一括適用する
 * (書き込み頻度抑制 & ローカル同期対応)
 */
export function applyAnswerRecordToPlayer(
  player: PlayerData,
  params: {
    questionId: string;
    stageId?: string;
    subject?: string;
    grade?: number;
    unitId?: string;
    unitName?: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    hintCount: number;
    attemptCount: number;
    timeSpentSeconds: number;
    isFirstTryCorrect: boolean;
  }
): {
  updatedPlayer: PlayerData;
  record: AnswerHistoryRecord;
  reviewItem: ReviewCandidateItem;
  isStatusUpgradedToMaster: boolean;
} {
  const record = createAnswerHistoryRecord(params);

  // 既存の復習アイテムを取得・更新
  const existingReviewItems = player.reviewItems || {};
  const currentReviewItem = existingReviewItems[params.questionId];

  const wasMaster = currentReviewItem?.status === 'mastered';
  const updatedReviewItem = updateReviewCandidateItem(currentReviewItem, record);
  const isStatusUpgradedToMaster = !wasMaster && updatedReviewItem.status === 'mastered';

  // 二重ログ保存防止: 最新100件までの履歴を保持
  const existingHistory = player.answerHistory || [];
  const updatedHistory = [record, ...existingHistory].slice(0, 100);

  // questionProgress の更新
  const existingQProgress: QuestionProgressData = player.questionProgress?.[params.questionId] || {
    questionId: params.questionId,
    attemptCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastAnsweredAt: record.timestamp,
    isFirstCleared: false,
    hintUsed: false,
    earnedMainReward: false,
  };

  const updatedQProgress: QuestionProgressData = {
    ...existingQProgress,
    attemptCount: existingQProgress.attemptCount + 1,
    correctCount: existingQProgress.correctCount + (params.isCorrect ? 1 : 0),
    incorrectCount: existingQProgress.incorrectCount + (params.isCorrect ? 0 : 1),
    lastAnsweredAt: record.timestamp,
    isFirstCleared: existingQProgress.isFirstCleared || existingQProgress.earnedMainReward || (params.isCorrect && params.isFirstTryCorrect && existingQProgress.earnedMainReward),
    hintUsed: existingQProgress.hintUsed || params.hintCount > 0,
    consecutiveCorrect: updatedReviewItem.consecutiveCorrect,
    reviewStatus: updatedReviewItem.status,
  };

  const updatedReviewItems = {
    ...existingReviewItems,
    [params.questionId]: updatedReviewItem,
  };

  // 弱点単元（weakConcepts）の自動管理
  let updatedWeakConcepts = [...(player.weakConcepts || [])];
  if (!params.isCorrect && params.unitId && !updatedWeakConcepts.includes(params.unitId)) {
    updatedWeakConcepts.push(params.unitId);
  } else if (params.isCorrect && params.unitId && updatedReviewItem.status === 'mastered') {
    // マスターした単元のうち全問題がマスターに達していれば弱点から除外
    const unitQuestions = ALL_LEARNING_QUESTIONS.filter((q) => q.unitId === params.unitId);
    const allMastered = unitQuestions.length > 0 && unitQuestions.every((q) => updatedReviewItems[q.id]?.status === 'mastered');
    if (allMastered) {
      updatedWeakConcepts = updatedWeakConcepts.filter((u) => u !== params.unitId);
    }
  }

  const updatedPlayer: PlayerData = {
    ...player,
    answerHistory: updatedHistory,
    reviewItems: updatedReviewItems,
    questionProgress: {
      ...(player.questionProgress || {}),
      [params.questionId]: updatedQProgress,
    },
    weakConcepts: updatedWeakConcepts,
    totalAnswered: (player.totalAnswered || 0) + 1,
    correctAnswered: (player.correctAnswered || 0) + (params.isCorrect ? 1 : 0),
    currentStreak: params.isCorrect ? (player.currentStreak || 0) + 1 : 0,
    updatedAt: record.timestamp,
  };

  return {
    updatedPlayer,
    record,
    reviewItem: updatedReviewItem,
    isStatusUpgradedToMaster,
  };
}

/**
 * 3. 復習クエストの出題選定 (要件12〜16)
 * 優先度ルール:
 * 1. 最近間違えた問題
 * 2. 複数回間違えた問題
 * 3. ヒントを多く使った問題
 * 4. 正解までに時間がかかった問題
 * 5. 長期間復習していない問題
 */
export function selectReviewQuestions(
  player: PlayerData,
  options?: {
    targetUnitId?: string;
    limit?: number; // 3〜10問
  }
): {
  questions: LearningQuestion[];
  isSupplemented: boolean; // 復習候補が少なく既習問題を追加したか
  totalCandidatesCount: number;
} {
  const limit = Math.max(3, Math.min(10, options?.limit || 5));
  const reviewItems = player.reviewItems || {};

  // マスター以外の復習候補アイテム（マスターでも最近ミスしたものは含む）
  let candidates = Object.values(reviewItems).filter((item) => {
    if (options?.targetUnitId && item.unitId !== options.targetUnitId) return false;
    // 'mastered' であっても未復習や間違えがある場合は対象にできるが、基本はマスター未満を優先
    return item.status !== 'mastered' || item.incorrectCount > 0;
  });

  // 優先出題順のスコアリング計算 (数値が大きいほど優先度高)
  const now = Date.now();
  candidates.sort((a, b) => {
    const timeSinceIncorrectA = a.lastIncorrectAt ? now - new Date(a.lastIncorrectAt).getTime() : 9999999999;
    const timeSinceIncorrectB = b.lastIncorrectAt ? now - new Date(b.lastIncorrectAt).getTime() : 9999999999;

    // 1. 最近間違えた問題 (時間が短いほど優先)
    const recentScoreA = timeSinceIncorrectA < 86400000 * 3 ? 50 : 0;
    const recentScoreB = timeSinceIncorrectB < 86400000 * 3 ? 50 : 0;

    // 2. 複数回間違えた問題
    const incorrectScoreA = a.incorrectCount * 20;
    const incorrectScoreB = b.incorrectCount * 20;

    // 3. ヒントを多く使った問題
    const hintScoreA = a.maxHintCount * 15;
    const hintScoreB = b.maxHintCount * 15;

    // 4. 正解までに時間がかかった問題
    const timeSpentScoreA = Math.min(30, Math.floor(a.averageTimeSpentSeconds / 2));
    const timeSpentScoreB = Math.min(30, Math.floor(b.averageTimeSpentSeconds / 2));

    // 5. 長期間復習していない問題
    const timeSinceReviewedA = a.lastReviewedAt ? now - new Date(a.lastReviewedAt).getTime() : 9999999999;
    const timeSinceReviewedB = b.lastReviewedAt ? now - new Date(b.lastReviewedAt).getTime() : 9999999999;
    const unreviewedScoreA = timeSinceReviewedA > 86400000 * 7 ? 25 : 0;
    const unreviewedScoreB = timeSinceReviewedB > 86400000 * 7 ? 25 : 0;

    const totalA = recentScoreA + incorrectScoreA + hintScoreA + timeSpentScoreA + unreviewedScoreA;
    const totalB = recentScoreB + incorrectScoreB + hintScoreB + timeSpentScoreB + unreviewedScoreB;

    return totalB - totalA;
  });

  const selectedQuestionIds = candidates.map((c) => c.questionId);
  let questions: LearningQuestion[] = selectedQuestionIds
    .map((qId) => getSafeQuestionData(qId))
    .filter((q) => q.id !== 'unknown_q');

  let isSupplemented = false;

  // 復習候補が目標数に満たない場合、関連する既習問題・同単元問題から補充 (要件15)
  if (questions.length < limit) {
    isSupplemented = questions.length > 0;
    const existingIds = new Set(questions.map((q) => q.id));

    // 同単元または全体から回答済み/回答機会のある問題を追加
    const supplementalPool = ALL_LEARNING_QUESTIONS.filter((q) => {
      if (existingIds.has(q.id)) return false;
      if (options?.targetUnitId && q.unitId !== options.targetUnitId) return false;
      return true;
    });

    for (const sq of supplementalPool) {
      if (questions.length >= limit) break;
      questions.push(sq);
      existingIds.add(sq.id);
    }
  }

  return {
    questions: questions.slice(0, limit),
    isSupplemented,
    totalCandidatesCount: candidates.length,
  };
}

/**
 * 4. 段階的ヒントの取得 (要件18〜24)
 * 最大3段階のヒントを取得。ヒントデータが無い場合は共通安全ヒントを提供。
 */
export function getGraduatedHint(
  question: LearningQuestion | MathQuestion,
  stepIndex: number // 0, 1, 2 (ヒント1, ヒント2, ヒント3)
): {
  hintText: string;
  stepNumber: number;
  maxSteps: number;
  isCommonFallback: boolean;
} {
  const step = Math.max(0, Math.min(2, stepIndex));

  // 1. 段階的ヒント配列 hints が登録されている場合
  if (question.hints && Array.isArray(question.hints) && question.hints.length > 0) {
    const hintText = question.hints[step] || question.hints[question.hints.length - 1] || SAFE_COMMON_HINTS[step];
    return {
      hintText,
      stepNumber: Math.min(step + 1, question.hints.length),
      maxSteps: Math.min(3, question.hints.length),
      isCommonFallback: false,
    };
  }

  // 2. 単一の hint 文字列がある場合
  if (question.hint && question.hint.trim() !== '') {
    if (step === 0) {
      return {
        hintText: question.hint,
        stepNumber: 1,
        maxSteps: 3,
        isCommonFallback: false,
      };
    } else if (step === 1) {
      return {
        hintText: `【考え方のコツ】${SAFE_COMMON_HINTS[1]} (${question.hint})`,
        stepNumber: 2,
        maxSteps: 3,
        isCommonFallback: true,
      };
    } else {
      return {
        hintText: `【解き方のヒント】${SAFE_COMMON_HINTS[2]}`,
        stepNumber: 3,
        maxSteps: 3,
        isCommonFallback: true,
      };
    }
  }

  // 3. ヒントが全くない場合の共通安全ヒント (要件21)
  return {
    hintText: SAFE_COMMON_HINTS[step] || SAFE_COMMON_HINTS[0],
    stepNumber: step + 1,
    maxSteps: 3,
    isCommonFallback: true,
  };
}

/**
 * 5. 苦手単元・学習状況の判定 (要件30〜34)
 * 前向きな表示: 「得意」「順調」「あと少し」「練習中」
 */
export function calculateUnitMasteryStatus(
  player: PlayerData,
  unitId: string
): {
  status: UnitMasteryStatus;
  label: string;
  badgeBg: string;
  badgeTextColor: string;
  description: string;
  totalQuestions: number;
  masteredCount: number;
  accuracy: number;
} {
  const unitQuestions = ALL_LEARNING_QUESTIONS.filter((q) => q.unitId === unitId);
  const totalQuestions = unitQuestions.length;

  if (totalQuestions === 0) {
    return {
      status: 'practicing',
      label: '練習中',
      badgeBg: 'bg-blue-500/20 border-blue-400/40',
      badgeTextColor: 'text-blue-300',
      description: 'これから挑戦しよう！',
      totalQuestions: 0,
      masteredCount: 0,
      accuracy: 0,
    };
  }

  const reviewItems = player.reviewItems || {};
  let answeredCount = 0;
  let correctTotal = 0;
  let attemptTotal = 0;
  let masteredCount = 0;
  let hintUseCount = 0;

  unitQuestions.forEach((q) => {
    const item = reviewItems[q.id];
    if (item && item.attemptCount > 0) {
      answeredCount++;
      correctTotal += item.correctCount;
      attemptTotal += item.attemptCount;
      if (item.status === 'mastered') masteredCount++;
      hintUseCount += item.maxHintCount;
    }
  });

  const accuracy = attemptTotal > 0 ? correctTotal / attemptTotal : 0;

  // 問題数が少なすぎる（2問未満）場合はすぐに「苦手」と断定せず「練習中/順調」にする (要件33)
  let status: UnitMasteryStatus = 'practicing';
  let label = '練習中';
  let badgeBg = 'bg-slate-700/50 border-slate-500/40';
  let badgeTextColor = 'text-slate-200';
  let description = '少しずつ練習を重ねよう！';

  if (masteredCount === totalQuestions && totalQuestions > 0) {
    status = 'mastered';
    label = '得意 🌟';
    badgeBg = 'bg-amber-500/20 border-amber-400/50';
    badgeTextColor = 'text-amber-300';
    description = 'ばっちりマスターできたね！';
  } else if (accuracy >= UNIT_MASTERY_CONFIG.GOOD_ACCURACY_THRESHOLD && answeredCount >= Math.ceil(totalQuestions * 0.5)) {
    status = 'good';
    label = '順調 👍';
    badgeBg = 'bg-emerald-500/20 border-emerald-400/50';
    badgeTextColor = 'text-emerald-300';
    description = 'スムーズに理解できているよ！';
  } else if (accuracy >= UNIT_MASTERY_CONFIG.ALMOST_ACCURACY_THRESHOLD || masteredCount > 0) {
    status = 'almost';
    label = 'あと少し ✨';
    badgeBg = 'bg-sky-500/20 border-sky-400/50';
    badgeTextColor = 'text-sky-300';
    description = 'マスターまであと一歩！復習してみよう。';
  } else {
    status = 'practicing';
    label = '練習中 🌱';
    badgeBg = 'bg-indigo-500/20 border-indigo-400/50';
    badgeTextColor = 'text-indigo-300';
    description = 'ヒントを使いながらじっくり学ぼう！';
  }

  return {
    status,
    label,
    badgeBg,
    badgeTextColor,
    description,
    totalQuestions,
    masteredCount,
    accuracy: Math.round(accuracy * 100),
  };
}

/**
 * 6. 復習クエスト開始前の案内情報 (要件17)
 */
export function getReviewQuestPreviewInfo(
  player: PlayerData,
  unitId?: string
): {
  unitTitle: string;
  questionCount: number;
  purposeText: string;
  estimatedExp: number;
  estimatedCoins: number;
} {
  const selected = selectReviewQuestions(player, { targetUnitId: unitId, limit: 5 });
  const count = selected.questions.length;

  let unitTitle = 'おすすめ復習ミックス';
  if (unitId) {
    const sample = ALL_LEARNING_QUESTIONS.find((q) => q.unitId === unitId);
    unitTitle = sample?.unitName || '単元復習';
  } else if (selected.questions.length > 0) {
    unitTitle = selected.questions[0].unitName || '苦手克服問題';
  }

  const estimatedExp = count * 12;
  const estimatedCoins = count * 8;

  return {
    unitTitle,
    questionCount: count,
    purposeText: '間違えたことのある問題をもう一度解いて、マスターを目指そう！',
    estimatedExp,
    estimatedCoins,
  };
}

/**
 * 7. 復習報酬の適正計算 (要件40〜44)
 * 連打・短時間重複周回の減額制御
 */
export function calculateReviewReward(
  question: LearningQuestion | MathQuestion,
  isCorrect: boolean,
  isMasteredUpgrade: boolean,
  lastAnsweredTimestamp?: string
): {
  exp: number;
  coins: number;
  companionExp: number;
  isRewardReduced: boolean;
} {
  if (!isCorrect) {
    return { exp: 3, coins: 2, companionExp: 2, isRewardReduced: false };
  }

  const baseExp = question.expReward || 15;
  const baseCoins = question.pointReward || 10;

  // 短時間周回（10分以内）は報酬を60%に調整して無限稼ぎを防止 (要件41)
  let scale = 0.8; // 復習は初回クリアの80%
  let isRewardReduced = false;

  if (lastAnsweredTimestamp) {
    const diffMs = Date.now() - new Date(lastAnsweredTimestamp).getTime();
    if (diffMs < 10 * 60 * 1000) {
      scale = 0.5;
      isRewardReduced = true;
    }
  }

  let exp = Math.max(5, Math.round(baseExp * scale));
  let coins = Math.max(4, Math.round(baseCoins * scale));
  let companionExp = Math.max(5, Math.round(10 * scale));

  // マスター昇格時のボーナスお祝い報酬
  if (isMasteredUpgrade) {
    exp += 20;
    coins += 15;
    companionExp += 15;
  }

  return { exp, coins, companionExp, isRewardReduced };
}
