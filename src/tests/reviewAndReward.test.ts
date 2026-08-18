import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerData, LearningQuestion } from '../types';
import { processQuestionAnswer } from '../services/rewardService';
import { createInitialPlayer } from '../services/gameStorage';
import { ALL_LEARNING_QUESTIONS } from '../data/questionsData';

describe('復習・報酬・問題データシステムテスト', () => {
  let player: PlayerData;
  let sampleQuestion: LearningQuestion;

  beforeEach(() => {
    player = createInitialPlayer('テスト復習者');
    sampleQuestion = ALL_LEARNING_QUESTIONS[0] || {
      id: 'q_test_01',
      grade: 2,
      subject: 'math',
      unitId: 'unit_test',
      unitName: 'テスト単元',
      topic: 'トピック',
      difficulty: 'normal',
      questionText: 'テスト問題',
      options: ['1', '2', '3', '4'],
      correctAnswerIndex: 0,
      explanation: '解説テスト',
      hint: 'ヒントテスト',
      expReward: 20,
      pointReward: 10,
    };
  });

  // ⑥ 復習状態遷移
  it('⑥ 問題解答時の問題進行状況（正解数・不正解数・クリア状態）が記録更新されること', () => {
    const res1 = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
    });

    const qProg1 = res1.updatedPlayer.questionProgress?.[sampleQuestion.id];
    expect(qProg1).toBeDefined();
    expect(qProg1?.correctCount).toBe(1);
    expect(qProg1?.attemptCount).toBe(1);
    expect(qProg1?.isFirstCleared).toBe(true);

    // 2回目回答
    const res2 = processQuestionAnswer({
      player: res1.updatedPlayer,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
    });

    const qProg2 = res2.updatedPlayer.questionProgress?.[sampleQuestion.id];
    expect(qProg2?.correctCount).toBe(2);
    expect(qProg2?.attemptCount).toBe(2);
  });

  // ⑦ 同日報酬制限 & 減額
  it('⑦ 周回・復習回答時の報酬率調整が適用されること', () => {
    // 1回目 (初回クリア): 100% 報酬
    const firstRes = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
    });
    expect(firstRes.rewardCategory).toBe('first_clear');
    expect(firstRes.rewardRatePercent).toBe(100);
    expect(firstRes.expGained).toBeGreaterThan(0);

    // 同日2回目 (復習・周回): 報酬率が調整されるか制限されること
    const secondRes = processQuestionAnswer({
      player: firstRes.updatedPlayer,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
    });
    expect(secondRes.rewardRatePercent).toBeLessThan(100);
  });

  // ⑧ 報酬0処理
  it('⑧ 不正解時は経験値・ポイント獲得量が0であること', () => {
    const wrongRes = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: false,
      hintUsed: true,
    });

    expect(wrongRes.expGained).toBe(0);
    expect(wrongRes.pointsGained).toBe(0);
    expect(wrongRes.rewardCategory).toBe('incorrect_attempt');
    expect(wrongRes.leveledUp).toBe(false);
  });

  // ⑨ 正解時のEXP・KQ更新前後の正確な追跡とデータの整合性
  it('⑨ 未クリア問題の正解でEXPとKQが確実に加算され、更新前後の数値差分と獲得量が一致すること', () => {
    const prevExp = player.exp;
    const prevPoints = player.points;

    const res = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
    });

    const newExp = res.updatedPlayer.exp;
    const newPoints = res.updatedPlayer.points;

    expect(newExp).toBe(prevExp + res.expGained);
    expect(newPoints).toBe(prevPoints + res.pointsGained);
    expect(res.expGained).toBeGreaterThan(0);
    expect(res.pointsGained).toBeGreaterThan(0);
  });

  // ⑩ 連打・同日再クリア時に報酬が重複加算されず、原因メッセージが提示されること
  it('⑩ 同一問題の同日再解答（連打・周回）で2回目はEXP・KQが+0になり重複付与されないこと', () => {
    const res1 = processQuestionAnswer({
      player,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
    });

    const expAfter1 = res1.updatedPlayer.exp;
    const pointsAfter1 = res1.updatedPlayer.points;

    const res2 = processQuestionAnswer({
      player: res1.updatedPlayer,
      question: sampleQuestion,
      isCorrect: true,
      hintUsed: false,
    });

    expect(res2.expGained).toBe(0);
    expect(res2.pointsGained).toBe(0);
    expect(res2.updatedPlayer.exp).toBe(expAfter1);
    expect(res2.updatedPlayer.points).toBe(pointsAfter1);
    expect(res2.rewardCategory).toBe('review_repeated');
  });

  // ⑮ 問題ID重複
  it('⑮ ALL_LEARNING_QUESTIONS に重複する問題IDが存在しないこと', () => {
    const idSet = new Set<string>();
    const duplicates: string[] = [];

    ALL_LEARNING_QUESTIONS.forEach((q) => {
      if (idSet.has(q.id)) {
        duplicates.push(q.id);
      }
      idSet.add(q.id);
    });

    expect(duplicates).toEqual([]);
    expect(ALL_LEARNING_QUESTIONS.length).toBeGreaterThan(0);
  });
});
