import { PlayerData, LearningQuestion, QuestionProgressData, UnitProgressData } from '../types';
import { ALL_LEARNING_QUESTIONS } from '../data/questionsData';
import { addExpAndPoints } from './gameStorage';
import { addKnowledgeEnergy } from './companionService';
import { addInventoryItem } from './itemAndRoomService';
import { updateDailyMissionProgress } from './dailyMissionService';

export interface ProcessAnswerOptions {
  player: PlayerData;
  question: LearningQuestion;
  isCorrect: boolean;
  hintUsed: boolean;
  foundationReviewed?: boolean;
  isFirstTryForQuestionInSession?: boolean; // True if answered correctly on 1st attempt in current battle session
}

export interface ProcessAnswerResult {
  updatedPlayer: PlayerData;
  expGained: number;
  pointsGained: number;
  knowledgeEnergyGained: number;
  leveledUp: boolean;
  rewardCategory: 'first_clear' | 'review_daily' | 'review_repeated' | 'incorrect_attempt';
  rewardRatePercent: number;
  titleMessage: string;
  subMessages: string[];
  unitBonusGranted: boolean;
  unitBonusMessage?: string;
  canTriggerHatching?: boolean;
  canTriggerChildGrowth?: boolean;
  itemRewardMessage?: string;
}

/**
 * Calculates and applies question rewards & unit completion bonuses according to strict game rules.
 */
export function processQuestionAnswer(options: ProcessAnswerOptions): ProcessAnswerResult {
  const {
    player,
    question,
    isCorrect,
    hintUsed,
    foundationReviewed = false,
    isFirstTryForQuestionInSession = true,
  } = options;

  console.log(`② [processQuestionAnswer] Called. player.name=${player.name}, input EXP=${player.exp}, input KQ=${player.points}, questionId=${question.id}, isCorrect=${isCorrect}`);

  const todayStr = new Date().toISOString().split('T')[0];
  const qId = question.id;
  const unitId = question.unitId;

  // Clone progress records
  const questionProgressMap: Record<string, QuestionProgressData> = { ...(player.questionProgress || {}) };
  const unitProgressMap: Record<string, UnitProgressData> = { ...(player.unitProgress || {}) };

  // Get or initialize question progress record
  const prevQProgress: QuestionProgressData = questionProgressMap[qId] || {
    questionId: qId,
    attemptCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastAnsweredAt: todayStr,
    isFirstCleared: false,
    hintUsed: false,
    earnedMainReward: false,
  };

  const attemptCount = prevQProgress.attemptCount + 1;
  let correctCount = prevQProgress.correctCount;
  let incorrectCount = prevQProgress.incorrectCount;

  if (isCorrect) {
    correctCount += 1;
  } else {
    incorrectCount += 1;
  }

  // Handle Incorrect Case
  if (!isCorrect) {
    const updatedQProgress: QuestionProgressData = {
      ...prevQProgress,
      attemptCount,
      incorrectCount,
      lastAnsweredAt: todayStr,
      hintUsed: prevQProgress.hintUsed || hintUsed,
    };
    questionProgressMap[qId] = updatedQProgress;

    const updatedPlayer: PlayerData = {
      ...player,
      questionProgress: questionProgressMap,
    };

    return {
      updatedPlayer,
      expGained: 0,
      pointsGained: 0,
      knowledgeEnergyGained: 0,
      leveledUp: false,
      rewardCategory: 'incorrect_attempt',
      rewardRatePercent: 0,
      titleMessage: '思考中...',
      subMessages: ['惜しい！もう一度問題を見直してみよう。'],
      unitBonusGranted: false,
    };
  }

  // ==========================================
  // CORRECT ANSWER - REWARD EVALUATION
  // ==========================================
  let expGained = 0;
  let pointsGained = 0;
  let knowledgeEnergyGained = 0;
  let rewardCategory: 'first_clear' | 'review_daily' | 'review_repeated' | 'incorrect_attempt' = 'first_clear';
  let rewardRatePercent = 100;
  let titleMessage = '';
  const subMessages: string[] = [];

  const baseExp = question.expReward || 40;
  const basePoints = question.pointReward || 30;

  // 初回クリア判定: 過去に主報酬(earnedMainReward)を受け取っておらず、かつ過去に正解記録(correctCount > 0)がない場合を初回クリアとみなす
  const isAlreadyMainCleared = Boolean(prevQProgress.earnedMainReward || (prevQProgress.isFirstCleared && prevQProgress.correctCount > 0));

  // Review Reward History Check
  const reviewRewardHistoryMap = { ...(player.reviewRewardHistory || {}) };
  const currentReviewHistory = reviewRewardHistoryMap[qId];
  const lastRewardDate = currentReviewHistory?.lastRewardDate || prevQProgress.lastReviewRewardDate;
  const alreadyRewardedToday = lastRewardDate === todayStr;

  if (!isAlreadyMainCleared) {
    // ----------------------------------------
    // FIRST TIME CLEARING THIS QUESTION!
    // ----------------------------------------
    rewardCategory = 'first_clear';

    // 一発正解（セッション内初回 & 過去試行なし & ヒント未使用）判定
    const isOneShotFirstTry = isFirstTryForQuestionInSession && prevQProgress.attemptCount === 0 && !hintUsed;

    if (foundationReviewed) {
      rewardRatePercent = 100;
      knowledgeEnergyGained = 10;
      titleMessage = '基礎を取り戻してクリア！';
      subMessages.push('基礎を復習した努力が力になりました！');
    } else if (hintUsed) {
      rewardRatePercent = 50;
      knowledgeEnergyGained = 8;
      titleMessage = 'ヒントを使ってクリア！';
      subMessages.push('初クリア基本報酬の50％を獲得！');
    } else if (isOneShotFirstTry) {
      rewardRatePercent = 100;
      knowledgeEnergyGained = 10;
      titleMessage = '一発正解！初クリア！';
      subMessages.push('初クリア基本報酬 100% 獲得！');
    } else {
      // 不正解後の再挑戦・リトライによる初クリア
      rewardRatePercent = 100;
      knowledgeEnergyGained = 10;
      titleMessage = 'あきらめずに挑戦して初クリア！';
      subMessages.push('初クリア基本報酬 100% 獲得！');
    }

    // 基本初回クリア報酬 (EXP + KQ 両方100%)
    expGained = Math.max(1, Math.round(baseExp * (rewardRatePercent / 100)));
    pointsGained = Math.max(1, Math.round(basePoints * (rewardRatePercent / 100)));

    // 一発正解ボーナスがある場合（追加付与）
    if (isOneShotFirstTry) {
      const bonusExp = Math.max(5, Math.round(baseExp * 0.25));
      const bonusPoints = Math.max(5, Math.round(basePoints * 0.25));
      expGained += bonusExp;
      pointsGained += bonusPoints;
      subMessages.push(`🎉 一発正解ボーナス (+${bonusExp} EXP / +${bonusPoints} KQ) 獲得！`);
    }

    subMessages.push(`獲得EXP：+${expGained}`);
    subMessages.push(`獲得KQ：+${pointsGained}`);
    subMessages.push(`知識エネルギーを +${knowledgeEnergyGained} 獲得！`);

    reviewRewardHistoryMap[qId] = {
      lastRewardDate: todayStr,
      totalRewardCount: (currentReviewHistory?.totalRewardCount || 0) + 1,
    };
  } else {
    // ----------------------------------------
    // QUESTION ALREADY CLEARED previously!
    // ----------------------------------------
    if (!alreadyRewardedToday) {
      rewardCategory = 'review_daily';
      rewardRatePercent = 20;

      // 復習時も EXP と KQ の両方を獲得（20%, min 2）
      expGained = Math.max(1, Math.round(baseExp * 0.2));
      pointsGained = Math.max(1, Math.round(basePoints * 0.2));
      knowledgeEnergyGained = 3; // Daily review gives minor knowledge energy

      titleMessage = '定着確認復習クリア！';
      subMessages.push(`復習EXP +${expGained} / 復習KQ +${pointsGained} 獲得！`);
      subMessages.push(`知識エネルギーを +${knowledgeEnergyGained} 獲得！`);

      reviewRewardHistoryMap[qId] = {
        lastRewardDate: todayStr,
        totalRewardCount: (currentReviewHistory?.totalRewardCount || 0) + 1,
      };
    } else {
      rewardCategory = 'review_repeated';
      rewardRatePercent = 0;

      expGained = 0;
      pointsGained = 0;
      knowledgeEnergyGained = 0; // REPEAT IN SAME DAY = 0 REWARD

      titleMessage = '本日の復習報酬獲得済み';
      subMessages.push('本日の復習報酬は獲得済みです。また明日挑戦すると定着確認報酬を受け取れます');
    }
  }

  // Update question progress
  const updatedQProgress: QuestionProgressData = {
    ...prevQProgress,
    attemptCount,
    correctCount,
    lastAnsweredAt: todayStr,
    isFirstCleared: true,
    earnedMainReward: true,
    firstClearedAt: prevQProgress.firstClearedAt || new Date().toISOString(),
    lastReviewRewardDate: todayStr,
    hintUsed: prevQProgress.hintUsed || hintUsed,
    bestResult: foundationReviewed
      ? 'foundation_reviewed'
      : hintUsed
      ? 'hint'
      : isFirstTryForQuestionInSession
      ? 'first_try'
      : 'retry',
  };
  questionProgressMap[qId] = updatedQProgress;

  // ----------------------------------------
  // UNIT CLEAR BONUS EVALUATION
  // ----------------------------------------
  let unitBonusGranted = false;
  let unitBonusMessage: string | undefined;

  const unitQuestions = ALL_LEARNING_QUESTIONS.filter((q) => q.unitId === unitId);
  const clearedUnitQuestions = unitQuestions.filter((q) => {
    const prog = questionProgressMap[q.id];
    return prog && (prog.isFirstCleared || prog.earnedMainReward);
  });

  const prevUnitProg: UnitProgressData = unitProgressMap[unitId] || {
    unitId,
    totalAttempted: 0,
    totalCorrect: 0,
    cleared: false,
    mastered: false,
    clearedQuestionIds: [],
    isUnitCompleted: false,
    unitRewardClaimed: false,
  };

  const clearedQuestionIds = [...new Set([...(prevUnitProg.clearedQuestionIds || []), qId])];
  const isUnitAllCleared = unitQuestions.length > 0 && clearedUnitQuestions.length === unitQuestions.length;

  let unitBonusExp = 0;
  let unitBonusPoints = 0;
  let unitKnowledgeEnergy = 0;

  if (isUnitAllCleared && !prevUnitProg.unitRewardClaimed) {
    unitBonusGranted = true;
    unitBonusExp = 100;
    unitBonusPoints = 50;
    unitKnowledgeEnergy = 30; // Unit clear bonus: +30 Knowledge Energy

    unitBonusMessage = `🎉 単元【${question.unitName}】全問制覇ボーナス！ (+100 EXP / +50 KQ / +30 知識エネルギー)`;

    unitProgressMap[unitId] = {
      ...prevUnitProg,
      unitId,
      cleared: true,
      mastered: true,
      clearedQuestionIds,
      isUnitCompleted: true,
      unitRewardClaimed: true,
      unitRewardClaimedAt: new Date().toISOString(),
    };
  } else {
    unitProgressMap[unitId] = {
      ...prevUnitProg,
      unitId,
      cleared: isUnitAllCleared,
      clearedQuestionIds,
    };
  }

  // Calculate final level and save updated player
  const totalExpToAdd = expGained + unitBonusExp;
  const totalPointsToAdd = pointsGained + unitBonusPoints;
  const totalEnergyToAdd = knowledgeEnergyGained + unitKnowledgeEnergy;

  let tempPlayer: PlayerData = {
    ...player,
    questionProgress: questionProgressMap,
    unitProgress: unitProgressMap,
    reviewRewardHistory: reviewRewardHistoryMap,
    foodItemsCount: (player.foodItemsCount || 0) + (rewardCategory === 'first_clear' ? 1 : 0),
  };

  // Grant Item Rewards (Nurturing Items)
  let itemRewardMessage: string | undefined;
  if (rewardCategory === 'first_clear') {
    const itemToAdd = foundationReviewed ? 'courage_cookie' : 'knowledge_fruit';
    const itemRes = addInventoryItem(tempPlayer, itemToAdd, 1, `q_first_clear_${qId}`);
    if (itemRes.success) {
      tempPlayer = itemRes.updatedPlayer;
      itemRewardMessage = itemRes.message;
      subMessages.push(`🎁 育成アイテム【${itemRes.item?.name}】を獲得！`);
    }
  }

  if (unitBonusGranted) {
    const itemRes = addInventoryItem(tempPlayer, 'star_fragment', 1, `unit_clear_star_${unitId}`);
    if (itemRes.success) {
      tempPlayer = itemRes.updatedPlayer;
      subMessages.push(`⭐ 育成アイテム【星のかけら】を獲得！`);
    }
  }

  // Update Daily Missions Progress
  tempPlayer = updateDailyMissionProgress(tempPlayer, 'answer_3', 1);
  if (rewardCategory === 'first_clear') {
    tempPlayer = updateDailyMissionProgress(tempPlayer, 'first_clear_1', 1);
  }
  if (foundationReviewed) {
    tempPlayer = updateDailyMissionProgress(tempPlayer, 'foundation_review_1', 1);
  }
  if (prevQProgress.incorrectCount > 0) {
    tempPlayer = updateDailyMissionProgress(tempPlayer, 'retry_incorrect_1', 1);
  }
  tempPlayer = updateDailyMissionProgress(tempPlayer, 'different_unit_1', 1);
  tempPlayer = updateDailyMissionProgress(tempPlayer, 'study_10min', 1);

  const { updatedPlayer: playerWithExp, leveledUp } = addExpAndPoints(
    tempPlayer,
    totalExpToAdd,
    totalPointsToAdd
  );

  // Apply Knowledge Energy to companion
  const energyResult = addKnowledgeEnergy(
    playerWithExp,
    totalEnergyToAdd,
    titleMessage
  );

  return {
    updatedPlayer: energyResult.updatedPlayer,
    expGained: totalExpToAdd,
    pointsGained: totalPointsToAdd,
    knowledgeEnergyGained: totalEnergyToAdd,
    leveledUp,
    rewardCategory,
    rewardRatePercent,
    titleMessage,
    subMessages,
    unitBonusGranted,
    unitBonusMessage,
    canTriggerHatching: energyResult.canTriggerHatching,
    canTriggerChildGrowth: energyResult.canTriggerChildGrowth,
    itemRewardMessage,
  };
}

