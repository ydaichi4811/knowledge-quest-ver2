import { describe, it, expect } from 'vitest';
import { processQuestionAnswer } from '../services/rewardService';
import { createInitialPlayer } from '../services/gameStorage';
import { LearningQuestion } from '../types';

describe('初回クリアおよび報酬判定の自動テスト', () => {
  const sampleQuestion: LearningQuestion = {
    id: 'test_q_001',
    grade: 5,
    subject: 'math',
    unitId: 'unit_math_01',
    unitName: 'テスト単元',
    topic: 'テスト',
    difficulty: 'normal',
    questionText: '3 + 5 はいくつ？',
    options: ['6', '7', '8', '9'],
    correctAnswerIndex: 2,
    explanation: '3に5をたすと8になります。',
    hint: '3と5を合わせよう',
    expReward: 40,
    pointReward: 30,
  };

  it('1. 未クリア問題・1回目で正解：初回クリアEXP、初回クリアKQ、一発正解ボーナスを獲得すること', () => {
    const player = createInitialPlayer('テストユーザー');
    const result = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: true,
    });

    expect(result.expGained).toBeGreaterThanOrEqual(40);
    expect(result.pointsGained).toBeGreaterThanOrEqual(30);
    expect(result.rewardCategory).toBe('first_clear');
    expect(result.updatedPlayer.points).toBeGreaterThanOrEqual(38);
    expect(result.updatedPlayer.questionProgress['test_q_001'].earnedMainReward).toBe(true);
    expect(result.updatedPlayer.questionProgress['test_q_001'].isFirstCleared).toBe(true);
  });

  it('2. 未クリア問題・1回不正解後に正解：初回クリア基本報酬 (100% EXP, 100% KQ) を両方獲得すること', () => {
    let player = createInitialPlayer('テストユーザー');
    const initialPoints = player.points;

    // 1回目: 不正解
    const incorrectRes = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: false,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: false,
    });

    expect(incorrectRes.expGained).toBe(0);
    expect(incorrectRes.pointsGained).toBe(0);
    expect(incorrectRes.updatedPlayer.questionProgress['test_q_001'].attemptCount).toBe(1);
    expect(incorrectRes.updatedPlayer.questionProgress['test_q_001'].earnedMainReward).toBe(false);

    // 2回目: 再挑戦で正解
    const correctRes = processQuestionAnswer({
      player: incorrectRes.updatedPlayer,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: false,
    });

    // 基本報酬 100% (40 EXP, 30 KQ) が付与されること
    expect(correctRes.expGained).toBe(40);
    expect(correctRes.pointsGained).toBe(30);
    expect(correctRes.rewardCategory).toBe('first_clear');
    expect(correctRes.updatedPlayer.exp).toBe(40);
    expect(correctRes.updatedPlayer.points).toBe(initialPoints + 30);
    expect(correctRes.updatedPlayer.questionProgress['test_q_001'].earnedMainReward).toBe(true);
  });

  it('3. 未クリア問題・複数回不正解後に正解：何回不正解を挟んでも初回クリア報酬が100%獲得できること', () => {
    let player = createInitialPlayer('テストユーザー');

    // 3回連続不正解
    for (let i = 0; i < 3; i++) {
      const inc = processQuestionAnswer({
        player,
        question: sampleQuestion,
        isCorrect: false,
        hintUsed: false,
        foundationReviewed: false,
        isFirstTryForQuestionInSession: false,
      });
      player = inc.updatedPlayer;
    }

    expect(player.questionProgress['test_q_001'].attemptCount).toBe(3);
    expect(player.questionProgress['test_q_001'].earnedMainReward).toBe(false);

    // 4回目で正解
    const correctRes = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: false,
    });

    expect(correctRes.expGained).toBe(40);
    expect(correctRes.pointsGained).toBe(30);
    expect(correctRes.updatedPlayer.questionProgress['test_q_001'].earnedMainReward).toBe(true);
  });

  it('4. 不正解のみの場合：EXPもKQも一切加算されないこと', () => {
    const player = createInitialPlayer('テストユーザー');
    const initialPoints = player.points;
    const result = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: false,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: true,
    });

    expect(result.expGained).toBe(0);
    expect(result.pointsGained).toBe(0);
    expect(result.updatedPlayer.exp).toBe(0);
    expect(result.updatedPlayer.points).toBe(initialPoints);
  });

  it('5. 同一問題の同日再正解：報酬が重複せず 0 になること', () => {
    const player = createInitialPlayer('テストユーザー');

    // 初回正解
    const firstClearRes = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: true,
    });

    // 同日中に2回目の正解
    const secondClearRes = processQuestionAnswer({
      player: firstClearRes.updatedPlayer,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: false,
    });

    expect(secondClearRes.rewardCategory).toBe('review_repeated');
    expect(secondClearRes.expGained).toBe(0);
    expect(secondClearRes.pointsGained).toBe(0);
    expect(secondClearRes.titleMessage).toContain('本日の復習報酬獲得済み');
  });

  it('6. 既クリア問題を別日に復習正解：復習EXPと復習KQの両方が獲得できること', () => {
    const player = createInitialPlayer('テストユーザー');

    // 初回正解
    const firstClearRes = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: true,
    });

    // 最終報酬日付を昨日に書き換えて「別日復習」を再現
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const playerFromYesterday = {
      ...firstClearRes.updatedPlayer,
      reviewRewardHistory: {
        ...firstClearRes.updatedPlayer.reviewRewardHistory,
        [sampleQuestion.id]: {
          lastRewardDate: yesterday,
          totalRewardCount: 1,
        },
      },
    };

    const reviewRes = processQuestionAnswer({
      player: playerFromYesterday,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
      foundationReviewed: false,
      isFirstTryForQuestionInSession: false,
    });

    expect(reviewRes.rewardCategory).toBe('review_daily');
    // 復習報酬: 40 * 0.2 = 8 EXP, 30 * 0.2 = 6 KQ
    expect(reviewRes.expGained).toBe(8);
    expect(reviewRes.pointsGained).toBe(6);
  });

  it('7. 学習履歴の attemptCount が正しく保存されること', () => {
    let player = createInitialPlayer('テストユーザー');

    const res1 = processQuestionAnswer({ player, question: sampleQuestion, isCorrect: false, hintUsed: false });
    player = res1.updatedPlayer;
    expect(player.questionProgress[sampleQuestion.id].attemptCount).toBe(1);

    const res2 = processQuestionAnswer({ player, question: sampleQuestion, isCorrect: false, hintUsed: false });
    player = res2.updatedPlayer;
    expect(player.questionProgress[sampleQuestion.id].attemptCount).toBe(2);

    const res3 = processQuestionAnswer({ player, question: sampleQuestion, isCorrect: true, hintUsed: false });
    player = res3.updatedPlayer;
    expect(player.questionProgress[sampleQuestion.id].attemptCount).toBe(3);
  });
});
