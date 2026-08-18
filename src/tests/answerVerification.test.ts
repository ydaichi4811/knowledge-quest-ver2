import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerData, LearningQuestion } from '../types';
import { createInitialPlayer } from '../services/gameStorage';
import {
  normalizeAnswerText,
  compareAnswers,
  validateAnswerInput,
  verifyMultipleChoiceAnswer,
  createInitialQuizState,
  saveAnswerResult,
  QuizSessionState,
} from '../services/answerVerificationService';
import { processQuestionAnswer } from '../services/rewardService';

describe('クイズ答え合わせ・判定・報酬重複防止テスト (Quiz Answer Verification & 4-Choice Suite)', () => {
  let player: PlayerData;
  let testQuestion: LearningQuestion;

  beforeEach(() => {
    localStorage.clear();
    player = createInitialPlayer('答え合わせテスト勇者');
    testQuestion = {
      id: 'q_test_verification_01',
      grade: 2,
      subject: 'math',
      unitId: 'unit_multiplication',
      unitName: '九九の計算',
      topic: '九九',
      difficulty: 'normal',
      questionText: '6 × 7 はいくつですか？',
      options: ['36', '42', '48', '54'],
      correctAnswerIndex: 1, // '42'
      explanation: '6 × 7 = 42 です。',
      hint: '6を7回足してみよう。',
      expReward: 40,
      pointReward: 30,
    };
  });

  // 1. 4択問題未選択チェック
  it('① 選択肢未選択（null）で回答確定した場合、「答えをえらんでください」注意メッセージが返されること', () => {
    const verification = verifyMultipleChoiceAnswer({
      selectedIndex: null,
      correctIndex: testQuestion.correctAnswerIndex,
      choices: testQuestion.options,
    });

    expect(verification.isValid).toBe(false);
    expect(verification.isCorrect).toBe(false);
    expect(verification.warningMessage).toBe('答えをえらんでください');
  });

  // 2. 4択問題の正解判定
  it('② 正解の選択肢インデックスを選択した際、isCorrect: true と判定されること', () => {
    const verification = verifyMultipleChoiceAnswer({
      selectedIndex: 1, // '42'
      correctIndex: testQuestion.correctAnswerIndex,
      choices: testQuestion.options,
    });

    expect(verification.isValid).toBe(true);
    expect(verification.isCorrect).toBe(true);
    expect(verification.selectedChoiceText).toBe('42');
    expect(verification.correctChoiceText).toBe('42');
    expect(verification.warningMessage).toBeNull();
  });

  // 3. 4択問題の不正解判定
  it('③ 誤った選択肢インデックスを選択した際、isCorrect: false と判定されること', () => {
    const verification = verifyMultipleChoiceAnswer({
      selectedIndex: 0, // '36'
      correctIndex: testQuestion.correctAnswerIndex,
      choices: testQuestion.options,
    });

    expect(verification.isValid).toBe(true);
    expect(verification.isCorrect).toBe(false);
    expect(verification.selectedChoiceText).toBe('36');
    expect(verification.correctChoiceText).toBe('42');
  });

  // 4. 正解時に報酬が1回だけ付与される
  it('④ 正解時に報酬が1回だけ付与され、連打や重複付与が防止されること', () => {
    let state = createInitialQuizState(testQuestion.id);

    // 1st Correct Answer evaluation
    state.attemptCount += 1;
    state.isAnswered = true;
    state.isCorrect = true;

    // Process reward
    const rewardRes1 = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: true,
      hintUsed: false,
      isFirstTryForQuestionInSession: true,
    });

    state.rewardGranted = true;
    player = rewardRes1.updatedPlayer;

    expect(rewardRes1.expGained).toBeGreaterThan(0);
    expect(rewardRes1.pointsGained).toBeGreaterThan(0);
    expect(rewardRes1.rewardCategory).toBe('first_clear');

    // Attempting to claim reward again for the same question state
    const rewardRes2 = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: true,
      hintUsed: false,
      isFirstTryForQuestionInSession: false,
    });

    expect(rewardRes2.expGained).toBe(0);
    expect(rewardRes2.pointsGained).toBe(0);
    expect(rewardRes2.rewardCategory).toBe('review_repeated');
  });

  // 5. 不正解では報酬が付与されない
  it('⑤ 不正解時は経験値やポイントなどの報酬が付与されないこと', () => {
    const wrongRes = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: false,
      hintUsed: false,
    });

    expect(wrongRes.expGained).toBe(0);
    expect(wrongRes.pointsGained).toBe(0);
    expect(wrongRes.knowledgeEnergyGained).toBe(0);
    expect(wrongRes.rewardCategory).toBe('incorrect_attempt');
  });

  // 6. 不正解後に再回答して正解できる
  it('⑥ 不正解後に再回答して正解でき、試行回数(attemptCount)が加算されること', () => {
    let state = createInitialQuizState(testQuestion.id);

    // First attempt: Incorrect
    state.attemptCount += 1;
    state.isAnswered = true;
    state.isCorrect = false;

    const res1 = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: false,
      hintUsed: false,
    });
    player = res1.updatedPlayer;

    // Second attempt: Reset answer state & attempt again
    state.selectedOptionIndex = 1; // Correct choice
    state.attemptCount += 1;
    state.isCorrect = true;

    const res2 = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: true,
      hintUsed: false,
      isFirstTryForQuestionInSession: false,
    });
    player = res2.updatedPlayer;

    expect(res2.rewardCategory).toBe('first_clear'); // Main clear reward granted on 2nd attempt
    expect(res2.expGained).toBeGreaterThan(0);
    expect(player.questionProgress[testQuestion.id].correctCount).toBe(1);
    expect(player.questionProgress[testQuestion.id].attemptCount).toBe(2);
  });

  // 7. 回答ボタンを連打しても報酬が重複しない
  it('⑦ 回答ボタン連打や多重クリック時に報酬が二重加算されないこと', () => {
    const initialPoints = player.points;

    // Simulate 3 rapid calls for the same first clear answer
    const res1 = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: true,
      hintUsed: false,
    });

    player = res1.updatedPlayer;
    const pointsAfter1 = player.points;
    const expAfter1 = player.exp;

    // 2nd rapid click
    const res2 = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: true,
      hintUsed: false,
    });
    player = res2.updatedPlayer;

    // 3rd rapid click
    const res3 = processQuestionAnswer({
      player,
      question: testQuestion,
      isCorrect: true,
      hintUsed: false,
    });

    expect(pointsAfter1).toBeGreaterThan(initialPoints);
    expect(res2.pointsGained).toBe(0);
    expect(res3.pointsGained).toBe(0);
    expect(res3.updatedPlayer.points).toBe(pointsAfter1);
    expect(res3.updatedPlayer.exp).toBe(expAfter1);
  });

  // 8. 次の問題で状態がリセットされる
  it('⑧ 次の問題に進む際にクイズの回答状態（isAnswered, isCorrect, rewardGrantedなど）が初期化されること', () => {
    let state = createInitialQuizState('q1');
    state.userAnswer = '42';
    state.selectedOptionIndex = 1;
    state.isAnswered = true;
    state.isCorrect = true;
    state.rewardGranted = true;
    state.showHint = true;
    state.showExplanation = true;
    state.attemptCount = 2;

    // Reset for Next Question 'q2'
    const newState = createInitialQuizState('q2');

    expect(newState.questionId).toBe('q2');
    expect(newState.userAnswer).toBe('');
    expect(newState.selectedOptionIndex).toBeNull();
    expect(newState.isAnswered).toBe(false);
    expect(newState.isCorrect).toBe(false);
    expect(newState.rewardGranted).toBe(false);
    expect(newState.showHint).toBe(false);
    expect(newState.showExplanation).toBe(false);
    expect(newState.attemptCount).toBe(0);
    expect(newState.warningMessage).toBeNull();
  });

  // 9. 4択学習履歴保存 saveAnswerResult
  it('⑨ saveAnswerResult を呼び出した際、問題ID・単元・選択肢インデックス・正誤・タイムスタンプが安全に保存されること', () => {
    const { updatedPlayer, answerRecord } = saveAnswerResult({
      player,
      question: testQuestion,
      userAnswer: '42',
      correctAnswer: '42',
      isCorrect: true,
      selectedChoiceIndex: 1,
      selectedChoiceText: '42',
      correctChoiceIndex: 1,
      correctChoiceText: '42',
      hintCount: 0,
      attemptCount: 1,
      timeSpentSeconds: 12,
    });

    expect(answerRecord.questionId).toBe(testQuestion.id);
    expect(answerRecord.unitId).toBe(testQuestion.unitId);
    expect(answerRecord.isCorrect).toBe(true);
    expect(answerRecord.selectedChoiceIndex).toBe(1);
    expect(answerRecord.selectedChoiceText).toBe('42');
    expect(answerRecord.correctChoiceIndex).toBe(1);
    expect(answerRecord.correctChoiceText).toBe('42');
    expect(answerRecord.timestamp).toBeDefined();

    expect(updatedPlayer.answerHistory?.length).toBeGreaterThan(0);
    expect(updatedPlayer.answerHistory?.[0].id).toBe(answerRecord.id);
  });

  // 10. 将来の記述式用テキスト正規化ユーティリティの動作確認
  it('⑩ 記述式入力用ヘルパー（全角半角正規化・数値判定）が正しく動作すること', () => {
    expect(normalizeAnswerText('４２')).toBe('42');
    expect(compareAnswers('42', '42.0').isCorrect).toBe(true);
    expect(validateAnswerInput('').isValid).toBe(false);
  });
});
