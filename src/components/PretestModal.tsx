import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData, PretestUnitProgress } from '../types';
import { AREA_PRETEST_QUESTIONS, PretestQuestion } from '../data/pretestQuestions';
import { getAreaStageById, AREA_STAGES } from '../data/stageData';
import { savePlayerData, addExpAndPoints } from '../services/gameStorage';
import { addKnowledgeEnergy } from '../services/companionService';
import { FuriganaText } from './FuriganaText';
import { BuddyCharacter } from './BuddyCharacter';

interface PretestModalProps {
  player: PlayerData;
  unitId?: string; // default 'area'
  onClose: () => void;
  onPlayerUpdate: (updated: PlayerData) => void;
  onNavigateToStage?: (stageId: string) => void;
}

export const isAreaPretestUnlocked = (player: PlayerData): boolean => {
  if (!player.stageProgress) return false;
  const areaStageIds = ['stage_area_1', 'stage_area_2', 'stage_area_3', 'stage_area_boss'];
  return areaStageIds.every((id) => player.stageProgress?.[id]?.isCleared);
};

export const PretestModal: React.FC<PretestModalProps> = ({
  player,
  unitId = 'area',
  onClose,
  onPlayerUpdate,
  onNavigateToStage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [resultSummary, setResultSummary] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
    categoryStats: Record<string, { total: number; correct: number }>;
    incorrectList: Array<{ question: PretestQuestion; userAnswer: string }>;
    scoreDiff: number;
    isNewBest: boolean;
    earnedFirstClear: boolean;
    earnedPerfectClear: boolean;
  } | null>(null);

  const questions = AREA_PRETEST_QUESTIONS;
  const currentQ = questions[currentIndex];
  const comp = player.companion;

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const updatedAnswers = { ...userAnswers, [currentIndex]: selectedOption };
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete test & calculate score
      finishTest(updatedAnswers);
    }
  };

  const finishTest = (finalAnswers: Record<number, string>) => {
    let score = 0;
    let correctCount = 0;
    const categoryStats: Record<string, { total: number; correct: number }> = {};
    const incorrectList: Array<{ question: PretestQuestion; userAnswer: string }> = [];

    questions.forEach((q, idx) => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { total: 0, correct: 0 };
      }
      categoryStats[q.category].total += 1;

      const ans = finalAnswers[idx];
      if (ans === q.correctAnswer) {
        score += q.points;
        correctCount += 1;
        categoryStats[q.category].correct += 1;
      } else {
        incorrectList.push({
          question: q,
          userAnswer: ans || '未回答',
        });
      }
    });

    const existingProgress: PretestUnitProgress = player.pretestProgress?.[unitId] || {
      unitId,
      attempts: 0,
      bestScore: 0,
      lastScore: 0,
      cleared: false,
      perfectCleared: false,
      firstClearRewardClaimed: false,
      perfectRewardClaimed: false,
    };

    const attempts = existingProgress.attempts + 1;
    const isNewBest = score > existingProgress.bestScore;
    const bestScore = Math.max(existingProgress.bestScore, score);
    const scoreDiff = attempts > 1 ? score - existingProgress.lastScore : 0;

    const cleared = existingProgress.cleared || score >= 80;
    const perfectCleared = existingProgress.perfectCleared || score === 100;

    let earnedFirstClear = false;
    let earnedPerfectClear = false;

    let updatedPlayer = { ...player };
    let pointsToAdd = 0;
    let expToAdd = 0;
    const newTitles = [...(player.unlockedTitles || [])];

    // Check First Clear Rewards (80+ score)
    let firstClearRewardClaimed = existingProgress.firstClearRewardClaimed;
    if (score >= 80 && !firstClearRewardClaimed) {
      earnedFirstClear = true;
      firstClearRewardClaimed = true;
      pointsToAdd += 100;
      expToAdd += 50;

      if (!newTitles.includes('面積チャレンジャー')) {
        newTitles.push('面積チャレンジャー');
      }

      // Add Knowledge Energy to Companion
      const keRes = addKnowledgeEnergy(updatedPlayer, 50, '面積プレテストクリア');
      updatedPlayer = keRes.updatedPlayer;
    }

    // Check Perfect Clear Rewards (100 score)
    let perfectRewardClaimed = existingProgress.perfectRewardClaimed;
    if (score === 100 && !perfectRewardClaimed) {
      earnedPerfectClear = true;
      perfectRewardClaimed = true;
      pointsToAdd += 100;

      if (!newTitles.includes('面積マスター')) {
        newTitles.push('面積マスター');
      }
    }

    if (pointsToAdd > 0 || expToAdd > 0) {
      const expRes = addExpAndPoints(updatedPlayer, expToAdd, pointsToAdd);
      updatedPlayer = expRes.updatedPlayer;
    }

    updatedPlayer.unlockedTitles = newTitles;

    const updatedPretestProgress: Record<string, PretestUnitProgress> = {
      ...(updatedPlayer.pretestProgress || {}),
      [unitId]: {
        unitId,
        attempts,
        bestScore,
        lastScore: score,
        cleared,
        perfectCleared,
        firstClearRewardClaimed,
        perfectRewardClaimed,
        lastAttemptedAt: new Date().toISOString(),
      },
    };

    updatedPlayer.pretestProgress = updatedPretestProgress;
    savePlayerData(updatedPlayer);
    onPlayerUpdate(updatedPlayer);

    setResultSummary({
      score,
      correctCount,
      totalQuestions: questions.length,
      categoryStats,
      incorrectList,
      scoreDiff,
      isNewBest,
      earnedFirstClear,
      earnedPerfectClear,
    });

    setIsFinished(true);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setIsFinished(false);
    setResultSummary(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-32px)] bg-amber-50/95 border-2 border-amber-600/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-slate-900"
      >
        {/* Royal Parchment Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-100 border-b border-amber-900 flex items-center justify-between shadow-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-amber-900/50 rounded-2xl border border-amber-500/30">
              📜
            </span>
            <div>
              <div className="text-[11px] font-bold text-amber-300">
                <FuriganaText text="王国からの特別依頼" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black font-cinzel text-amber-100">
                <FuriganaText text="面積マスタープレテスト" />
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-amber-900/60 hover:bg-amber-900 text-amber-200 border border-amber-600/50 text-xs font-bold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label="閉じる"
          >
            ✕ <FuriganaText text="閉じる" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain flex flex-col justify-between">
          {!isFinished ? (
            /* ================= TEST IN PROGRESS ================= */
            <div className="space-y-6">
              {/* Progress Bar & Stage Info */}
              <div className="bg-amber-100/80 border border-amber-300/80 p-3 sm:p-4 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black bg-amber-800 text-amber-100 px-3 py-1 rounded-full border border-amber-700">
                    <FuriganaText text={`第${currentIndex + 1}問 ／ 全${questions.length}問`} />
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    <FuriganaText text={`分野：${currentQ.category}`} />
                  </span>
                </div>

                <div className="w-32 sm:w-48 bg-amber-200 h-2.5 rounded-full overflow-hidden border border-amber-300">
                  <div
                    className="bg-amber-600 h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Companion Mascot Banner */}
              <div className="flex items-center gap-3 bg-amber-100/50 border border-amber-200 p-3 rounded-2xl">
                {comp && (
                  <BuddyCharacter
                    player={player}
                    companion={comp}
                    stage={comp.stage}
                    expression="thinking"
                    size="sm"
                    animationEnabled={true}
                  />
                )}
                <div className="text-xs font-bold text-amber-900">
                  <FuriganaText text={`「${comp?.name || '相棒'}」：テストは全10問！最後まで落ち着いて計算しよう！`} />
                </div>
              </div>

              {/* Question Card */}
              <div className="p-5 sm:p-6 bg-white rounded-2xl border-2 border-amber-200 shadow-md space-y-4">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-widest border-b border-amber-100 pb-1">
                  QUESTION {currentIndex + 1}
                </div>
                <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed">
                  <FuriganaText
                    text={currentQ.question}
                    readings={currentQ.readings}
                  />
                </h3>
              </div>

              {/* Choice Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.choices.map((choice, i) => {
                  const isSelected = selectedOption === choice;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(choice)}
                      className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400'
                          : 'bg-white hover:bg-amber-100/60 text-slate-800 border-amber-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {i + 1}
                        </span>
                        <FuriganaText text={choice} />
                      </span>
                      {isSelected && <span className="text-lg">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-2 flex justify-end">
                <button
                  disabled={!selectedOption}
                  onClick={handleNextQuestion}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base cursor-pointer shadow-lg transition-all flex items-center gap-2 ${
                    selectedOption
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 ring-2 ring-amber-400'
                      : 'bg-amber-200 text-amber-500 cursor-not-allowed'
                  }`}
                >
                  <span>
                    <FuriganaText text={currentIndex < questions.length - 1 ? '回答を確定して次へ ➔' : '回答を確定して結果を見る 📜'} />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= RESULT SCREEN ================= */
            resultSummary && (
              <div className="space-y-6">
                {/* Result Header Badge */}
                <div className="text-center p-6 bg-gradient-to-b from-amber-100 to-amber-200/80 rounded-3xl border-2 border-amber-400/80 shadow-md relative overflow-hidden">
                  <div className="inline-block px-4 py-1 bg-amber-800 text-amber-100 text-xs font-black rounded-full mb-2">
                    <FuriganaText text="採点結果" />
                  </div>

                  <div className="text-4xl sm:text-6xl font-black text-amber-900 tracking-tight my-1">
                    {resultSummary.score} <span className="text-2xl sm:text-3xl font-bold">点</span>
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                    <FuriganaText text={`正解数：10問中 ${resultSummary.correctCount}問 正解`} />
                  </div>

                  {/* Result Verdict Ribbon */}
                  <div className="mt-3">
                    {resultSummary.score === 100 ? (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm sm:text-base border border-amber-600 shadow-md animate-bounce">
                        🌟 <FuriganaText text="100点満点！パーフェクトクリア！王国の真の面積マスター！" />
                      </div>
                    ) : resultSummary.score >= 80 ? (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-black text-sm sm:text-base border border-emerald-700 shadow-md">
                        ✨ <FuriganaText text="合格！王国の面積マスターまであと少し！" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-700 text-amber-200 font-bold text-xs sm:text-sm border border-slate-600">
                        📖 <FuriganaText text="79点以下（未達成）。もう一度復習して再挑戦しよう！" />
                      </div>
                    )}
                  </div>

                  {/* Score Diff / Best score comparison */}
                  <div className="mt-4 pt-3 border-t border-amber-300/80 flex items-center justify-center gap-4 text-xs font-bold text-amber-900">
                    <div>
                      <FuriganaText text={`最高得点: ${player.pretestProgress?.[unitId]?.bestScore || resultSummary.score}点`} />
                    </div>
                    {resultSummary.scoreDiff !== 0 && (
                      <div className={resultSummary.scoreDiff > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        ({resultSummary.scoreDiff > 0 ? `前回から +${resultSummary.scoreDiff}点` : `前回から ${resultSummary.scoreDiff}点`})
                      </div>
                    )}
                  </div>
                </div>

                {/* Earned Rewards Notification */}
                {(resultSummary.earnedFirstClear || resultSummary.earnedPerfectClear) && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm border-2 border-amber-600 shadow-lg space-y-1">
                    <div className="flex items-center gap-2 text-base">
                      🎁 <FuriganaText text="初回クリア特典を獲得しました！" />
                    </div>
                    <div className="flex flex-wrap gap-3 font-extrabold pt-1">
                      {resultSummary.earnedFirstClear && (
                        <>
                          <span className="bg-amber-950 text-amber-300 px-3 py-1 rounded-full">
                            💎 <FuriganaText text="知識コイン +100" />
                          </span>
                          <span className="bg-amber-950 text-emerald-300 px-3 py-1 rounded-full">
                            🌱 <FuriganaText text="相棒EXP +50" />
                          </span>
                          <span className="bg-amber-950 text-amber-200 px-3 py-1 rounded-full">
                            📜 <FuriganaText text="称号「面積チャレンジャー」" />
                          </span>
                        </>
                      )}
                      {resultSummary.earnedPerfectClear && (
                        <>
                          <span className="bg-amber-950 text-amber-300 px-3 py-1 rounded-full">
                            💎 <FuriganaText text="知識コイン +100" />
                          </span>
                          <span className="bg-amber-950 text-amber-200 px-3 py-1 rounded-full">
                            👑 <FuriganaText text="称号「面積マスター」" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Breakdown */}
                <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
                  <h4 className="text-sm font-black text-amber-900 border-b border-amber-100 pb-2 flex items-center gap-2">
                    📊 <FuriganaText text="分野別の結果" />
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(resultSummary.categoryStats).map(([cat, statObj]) => {
                      const stat = statObj as { correct: number; total: number };
                      const isPerfect = stat.correct === stat.total;
                      const isGood = stat.correct >= Math.ceil(stat.total / 2);

                      return (
                        <div
                          key={cat}
                          className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              <FuriganaText text={cat} />
                            </div>
                            <div className="text-[11px] font-semibold text-slate-600">
                              <FuriganaText text={`${stat.total}問中 ${stat.correct}問正解`} />
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isPerfect
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isGood
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            <FuriganaText
                              text={
                                isPerfect
                                  ? 'よくできています'
                                  : isGood
                                  ? 'もう少し'
                                  : '復習がおすすめ'
                              }
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Incorrect Questions Review */}
                {resultSummary.incorrectList.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm space-y-4">
                    <h4 className="text-sm font-black text-rose-900 border-b border-rose-100 pb-2 flex items-center gap-2">
                      ❌ <FuriganaText text="間違えた問題の振り返り" /> ({resultSummary.incorrectList.length}問)
                    </h4>

                    <div className="space-y-4">
                      {resultSummary.incorrectList.map((item, idx) => {
                        const reviewStage = getAreaStageById(item.question.reviewStageId);
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2 text-xs"
                          >
                            <div className="font-bold text-slate-900 text-sm">
                              <FuriganaText text={item.question.question} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-semibold">
                              <div className="text-rose-700 bg-rose-100/80 p-2 rounded-lg border border-rose-200">
                                <FuriganaText text={`あなたの答え：${item.userAnswer}`} />
                              </div>
                              <div className="text-emerald-800 bg-emerald-100/80 p-2 rounded-lg border border-emerald-200">
                                <FuriganaText text={`正しい答え：${item.question.correctAnswer}`} />
                              </div>
                            </div>

                            <div className="text-slate-700 bg-white p-3 rounded-xl border border-amber-200 leading-relaxed">
                              💡 <span className="font-bold"><FuriganaText text="解説：" /></span>
                              <FuriganaText text={item.question.explanation} />
                            </div>

                            {reviewStage && (
                              <div className="pt-1 flex justify-end">
                                <button
                                  onClick={() => {
                                    onClose();
                                    if (onNavigateToStage) {
                                      onNavigateToStage(reviewStage.stageId);
                                    }
                                  }}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow cursor-pointer transition-all flex items-center gap-1.5"
                                >
                                  <span>⚔️ <FuriganaText text={`「${reviewStage.name}」で復習する`} /></span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleRetry}
                    className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-sm cursor-pointer shadow border border-amber-400 transition-all flex items-center justify-center gap-2"
                  >
                    🔄 <FuriganaText text="もう一度挑戦する" />
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 font-black text-sm cursor-pointer shadow-lg border border-amber-900 transition-all flex items-center justify-center gap-2"
                  >
                    🏠 <FuriganaText text="ホームへ戻る" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};
