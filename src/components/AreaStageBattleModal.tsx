import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerData, LearningQuestion, ReviewSessionData } from '../types';
import {
  AreaStageDef,
  getRandomQuestionsForStage,
  HERO_SKILLS,
  COMPANION_SKILLS,
  SPECIAL_COOP_SKILL,
  HeroSkillDef,
  CompanionSkillDef,
  SpecialCoopSkillDef,
} from '../data/stageData';
import { EnemyCharacter } from './EnemyCharacter';
import { SkillEffectOverlay } from './SkillEffectOverlay';
import { HeroCharacter } from './HeroCharacter';
import { BuddyCharacter } from './BuddyCharacter';
import { FuriganaText } from './FuriganaText';
import { processQuestionAnswer } from '../services/rewardService';
import { savePlayerData } from '../services/gameStorage';
import { addKnowledgeEnergy } from '../services/companionService';
import { addInventoryItem } from '../services/itemAndRoomService';
import { determineReviewTargetSkill } from '../services/skillService';

interface AreaStageBattleModalProps {
  stageDef: AreaStageDef;
  player: PlayerData;
  onPlayerUpdate: (updated: PlayerData) => void;
  onClose: () => void;
  onOpenFoundationReview?: (reviewData: ReviewSessionData) => void;
}

export const AreaStageBattleModal: React.FC<AreaStageBattleModalProps> = ({
  stageDef,
  player,
  onPlayerUpdate,
  onClose,
  onOpenFoundationReview,
}) => {
  // Battle state
  const [questions, setQuestions] = useState<LearningQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [barriersLeft, setBarriersLeft] = useState<number>(stageDef.isBossStage ? (stageDef.bossBarrierCount || 5) : 5);
  const [correctCount, setCorrectCount] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  // Selected Option & Feedback
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Animation states
  const [isEnemyHit, setIsEnemyHit] = useState(false);
  const [activeSkill, setActiveSkill] = useState<{
    skill: HeroSkillDef | CompanionSkillDef | SpecialCoopSkillDef;
    type: 'hero' | 'companion' | 'special_coop';
  } | null>(null);

  // Battle Finished State
  const [isBattleFinished, setIsBattleFinished] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState<{
    exp: number;
    points: number;
    energy: number;
    itemsGained: string[];
    isNewBest: boolean;
    stars: number;
    isFirstClear: boolean;
    isPerfectClear: boolean;
    memorialCard?: string;
  } | null>(null);

  const battleSettings = player.battleSettings || {
    battleAnimationEnabled: true,
    showSkillNames: true,
    shortenBossAnimation: false,
  };

  // Initialize questions on mount
  useEffect(() => {
    const qList = getRandomQuestionsForStage(stageDef);
    setQuestions(qList);
    setBarriersLeft(stageDef.isBossStage ? (stageDef.bossBarrierCount || 5) : 5);
  }, [stageDef]);

  const currentQ = questions[currentIndex];
  const activeEnemy = stageDef.enemies[currentIndex % stageDef.enemies.length];

  // Handle submitting an answer
  const handleAnswerSelect = (index: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === currentQ.correctAnswerIndex;
    setIsCorrect(correct);

    if (correct) {
      // Correct answer logic
      const newCorrectCount = correctCount + 1;
      const newConsecutive = consecutiveCorrect + 1;
      setCorrectCount(newCorrectCount);
      setConsecutiveCorrect(newConsecutive);

      // Break 1 barrier
      setBarriersLeft((prev) => Math.max(0, prev - 1));

      // Trigger enemy hit animation
      if (battleSettings.battleAnimationEnabled) {
        setIsEnemyHit(true);
        setTimeout(() => setIsEnemyHit(false), 500);

        // Check for Special Coop Skill in Boss Battle (3 consecutive correct)
        if (stageDef.isBossStage && newConsecutive >= 3 && newConsecutive % 3 === 0) {
          setActiveSkill({
            skill: SPECIAL_COOP_SKILL,
            type: 'special_coop',
          });
        } else {
          // Pick Hero or Companion Skill randomly
          const useHeroSkill = Math.random() < 0.5;
          if (useHeroSkill) {
            const randomHeroSkill = HERO_SKILLS[Math.floor(Math.random() * HERO_SKILLS.length)];
            setActiveSkill({ skill: randomHeroSkill, type: 'hero' });
          } else {
            const randomCompSkill = COMPANION_SKILLS[Math.floor(Math.random() * COMPANION_SKILLS.length)];
            setActiveSkill({ skill: randomCompSkill, type: 'companion' });
          }
        }

        // Hide skill effect overlay after 1.5s
        setTimeout(() => {
          setActiveSkill(null);
        }, 1500);
      }

      // Process question rewards via reward service
      const res = processQuestionAnswer({
        player,
        question: currentQ,
        isCorrect: true,
        hintUsed: showHint,
      });

      onPlayerUpdate(res.updatedPlayer);
      savePlayerData(res.updatedPlayer);
    } else {
      // Incorrect answer logic
      setConsecutiveCorrect(0);

      // Register incorrect attempt in player progress
      const res = processQuestionAnswer({
        player,
        question: currentQ,
        isCorrect: false,
        hintUsed: showHint,
      });

      onPlayerUpdate(res.updatedPlayer);
      savePlayerData(res.updatedPlayer);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      // Battle finished
      finishBattle();
    }
  };

  // Retry current question on incorrect
  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
  };

  // Foundation Review trigger
  const handleFoundationReviewClick = () => {
    if (!currentQ || !onOpenFoundationReview) return;
    const reviewRes = determineReviewTargetSkill(currentQ, player);

    const reviewSession: ReviewSessionData = {
      sourceQuestionId: currentQ.id,
      sourceSkillId: currentQ.skillId,
      reviewSkillId: reviewRes?.targetSkill.skillId || 'kuku',
      reviewQuestionIds: reviewRes?.targetSkill.relatedQuestionIds || [],
      currentReviewIndex: 0,
      correctCount: 0,
      startedAt: new Date().toISOString(),
      isCompleted: false,
      returnedToSource: false,
    };

    onOpenFoundationReview(reviewSession);
  };

  // Finish Battle and Calculate Stage Progress & Rewards
  const finishBattle = () => {
    setIsBattleFinished(true);

    const totalQ = stageDef.totalQuestions;
    const reqClear = stageDef.requiredClearCount;
    const isCleared = correctCount >= reqClear;
    const isPerfectClear = correctCount === totalQ;

    // Calculate stars
    let stars = 0;
    if (correctCount >= 5) stars = 3;
    else if (correctCount >= 4) stars = 2;
    else if (correctCount >= 3) stars = 1;

    // Check existing progress
    const prevStageProgress = player.stageProgress?.[stageDef.stageId] || {
      stageId: stageDef.stageId,
      isUnlocked: true,
      attemptCount: 0,
      bestCorrectCount: 0,
      bestStars: 0,
      isCleared: false,
      isPerfectCleared: false,
      firstClearRewardClaimed: false,
      perfectClearRewardClaimed: false,
    };

    const isFirstClear = isCleared && !prevStageProgress.isCleared;
    const isNewBest = correctCount > prevStageProgress.bestCorrectCount;

    let totalExpGained = 0;
    let totalPointsGained = 0;
    let totalEnergyGained = 0;
    const itemsGainedList: string[] = [];
    let memorialCardName: string | undefined = undefined;

    let updatedPlayer = { ...player };

    // Update Stage Progress Record
    const newStageProgress = {
      ...prevStageProgress,
      attemptCount: prevStageProgress.attemptCount + 1,
      bestCorrectCount: Math.max(prevStageProgress.bestCorrectCount, correctCount),
      bestStars: Math.max(prevStageProgress.bestStars, stars),
      isCleared: prevStageProgress.isCleared || isCleared,
      isPerfectCleared: prevStageProgress.isPerfectCleared || isPerfectClear,
      lastPlayedAt: new Date().toISOString(),
      firstClearedAt: prevStageProgress.firstClearedAt || (isCleared ? new Date().toISOString() : undefined),
    };

    // Unlock Next Stage if cleared!
    const stageProgressMap = { ...(updatedPlayer.stageProgress || {}) };
    stageProgressMap[stageDef.stageId] = newStageProgress;

    if (isCleared) {
      // Find next stage and unlock
      if (stageDef.stageId === 'stage_area_1' && stageProgressMap['stage_area_2']) {
        stageProgressMap['stage_area_2'] = { ...stageProgressMap['stage_area_2'], isUnlocked: true };
      } else if (stageDef.stageId === 'stage_area_2' && stageProgressMap['stage_area_3']) {
        stageProgressMap['stage_area_3'] = { ...stageProgressMap['stage_area_3'], isUnlocked: true };
      } else if (stageDef.stageId === 'stage_area_3' && stageProgressMap['stage_area_boss']) {
        stageProgressMap['stage_area_boss'] = { ...stageProgressMap['stage_area_boss'], isUnlocked: true };
      }
    }

    updatedPlayer.stageProgress = stageProgressMap;

    // Award First Clear Rewards ONLY IF first time clearing!
    if (isCleared && !prevStageProgress.firstClearRewardClaimed) {
      newStageProgress.firstClearRewardClaimed = true;

      // Add Knowledge Energy
      const keAmount = stageDef.firstClearRewards.knowledgeEnergy;
      totalEnergyGained += keAmount;
      const keRes = addKnowledgeEnergy(updatedPlayer, keAmount, 'ステージ初クリア');
      updatedPlayer = keRes.updatedPlayer;

      // Add Items / Wallpapers / Titles / Badges
      stageDef.firstClearRewards.items.forEach((reward) => {
        itemsGainedList.push(`${reward.icon} ${reward.name}`);

        if (reward.type === 'item') {
          updatedPlayer = addInventoryItem(updatedPlayer, reward.id, reward.count);
        } else if (reward.type === 'wallpaper' || reward.type === 'floor' || reward.type === 'decoration') {
          const room = updatedPlayer.companionRoom || {
            roomThemeId: 'hajimari',
            wallpaperId: 'wall_default',
            floorId: 'floor_default',
            bedId: 'bed_default',
            deskId: 'desk_default',
            shelfId: 'shelf_default',
            lightId: 'light_default',
            plantId: 'plant_default',
            decorationIds: [],
            windowViewId: 'window_default',
            unlockedRoomItemIds: [],
            lastUpdatedAt: new Date().toISOString(),
          };
          if (!room.unlockedRoomItemIds.includes(reward.id)) {
            room.unlockedRoomItemIds.push(reward.id);
          }
          updatedPlayer.companionRoom = room;
        } else if (reward.type === 'title') {
          const titles = updatedPlayer.unlockedTitles || [];
          if (!titles.includes(reward.name)) {
            updatedPlayer.unlockedTitles = [...titles, reward.name];
          }
        }
      });
    }

    // Award Perfect Clear Rewards in Boss Stage
    if (isPerfectClear && stageDef.perfectClearRewards && !prevStageProgress.perfectClearRewardClaimed) {
      newStageProgress.perfectClearRewardClaimed = true;
      memorialCardName = stageDef.perfectClearRewards.cardTitle;
      const cards = updatedPlayer.unlockedCards || [];
      if (!cards.includes(stageDef.perfectClearRewards.cardId)) {
        updatedPlayer.unlockedCards = [...cards, stageDef.perfectClearRewards.cardId];
      }
    }

    // Save final player data
    onPlayerUpdate(updatedPlayer);
    savePlayerData(updatedPlayer);

    setEarnedRewards({
      exp: totalExpGained,
      points: totalPointsGained,
      energy: totalEnergyGained,
      itemsGained: itemsGainedList,
      isNewBest,
      stars,
      isFirstClear,
      isPerfectClear,
      memorialCard: memorialCardName,
    });

    if (isCleared) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl text-center text-slate-200">
          ステージデータを読み込んでいます...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-slate-900/95 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative my-auto max-h-[96vh]"
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl p-2 bg-slate-800/80 rounded-2xl border border-amber-500/30">
              {stageDef.isBossStage ? '🏰' : '🗺️'}
            </span>
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-amber-400 tracking-wider">
                アレア地方 面積クエスト
              </div>
              <h2 className="text-base sm:text-xl font-black text-amber-100 flex items-center gap-2">
                <span>{stageDef.name}</span>
                <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                  ({stageDef.subtitle})
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Question Progress Indicator */}
            <div className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
              第 <span className="text-sm font-black text-white">{currentIndex + 1}</span> / {stageDef.totalQuestions} 問
            </div>

            {/* Exit button */}
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-bold"
            >
              ✕ 撤退
            </button>
          </div>
        </div>

        {/* Skill Visual Overlay */}
        {activeSkill && (
          <SkillEffectOverlay
            skill={activeSkill.skill}
            performerType={activeSkill.type}
            showSkillName={battleSettings.showSkillNames}
          />
        )}

        {/* Main Stage Arena Body */}
        {!isBattleFinished ? (
          <div className="p-3 sm:p-6 flex flex-col gap-4 overflow-y-auto">
            {/* Arena Top: Hero & Companion vs Enemy & Barriers */}
            <div className="bg-gradient-to-b from-slate-950/80 to-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative">
              {/* Left Side: Hero & Companion */}
              <div className="flex items-center justify-around sm:justify-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-cyan-300 mb-1">
                    {player.name}
                  </span>
                  <div className="w-20 h-20 sm:w-24 sm:h-24">
                    <HeroCharacter
                      player={player}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="text-xl text-amber-400/50 font-black">+</div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-emerald-300 mb-1">
                    {player.companion?.name || player.partner.name}
                  </span>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                    <BuddyCharacter player={player} companion={player.companion} size="sm" />
                  </div>
                </div>
              </div>

              {/* Right Side: Enemy & Knowledge Barrier Gauge */}
              <div className="flex flex-col items-center justify-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800 relative">
                {/* Knowledge Barrier Gauge Header */}
                <div className="w-full flex items-center justify-between mb-2 px-2">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                    🛡️ 知識バリアゲージ
                  </span>
                  <span className="text-xs font-black text-white">
                    残り {barriersLeft} 個
                  </span>
                </div>

                {/* Barrier Icons Row */}
                <div className="flex items-center gap-2 mb-3">
                  {Array.from({ length: stageDef.isBossStage ? (stageDef.bossBarrierCount || 5) : 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        scale: i < barriersLeft ? 1 : 0.7,
                        opacity: i < barriersLeft ? 1 : 0.25,
                      }}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg shadow-md border ${
                        i < barriersLeft
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-300 text-white animate-pulse'
                          : 'bg-slate-800 border-slate-700 text-slate-600'
                      }`}
                    >
                      {i < barriersLeft ? '🛡️' : '💥'}
                    </motion.div>
                  ))}
                </div>

                {/* Enemy Avatar & Name */}
                <div className="flex flex-col items-center">
                  <EnemyCharacter
                    type={activeEnemy.type}
                    accentColor={activeEnemy.accentColor}
                    isHit={isEnemyHit}
                    size="normal"
                  />
                  <div className="mt-1 text-center">
                    <span className="text-sm font-black text-amber-200">
                      {activeEnemy.name}
                    </span>
                    <p className="text-[10px] text-slate-400 max-w-xs leading-tight">
                      {activeEnemy.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Display Card */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <span className="text-xs font-bold text-amber-400 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                  <FuriganaText text={currentQ?.unitName || stageDef.subtitle} />
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Topic: {currentQ?.topic}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
                <FuriganaText text={currentQ?.questionText || ''} readings={currentQ?.readings} />
              </h3>

              {/* Diagram SVG if available */}
              {currentQ?.diagramSvg && (
                <div
                  className="p-3 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center max-w-md mx-auto my-1"
                  dangerouslySetInnerHTML={{ __html: currentQ.diagramSvg }}
                />
              )}

              {/* Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {currentQ?.options.map((option, idx) => {
                  let btnStyle = 'bg-slate-900/80 border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-slate-100';

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswerIndex) {
                      btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white font-black ring-2 ring-emerald-400';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-600/90 border-rose-400 text-white font-black';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50';
                    }
                  }

                  const optionReadings = currentQ?.optionsReadings ? currentQ.optionsReadings[idx] : undefined;

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left font-bold text-sm sm:text-base flex items-center gap-3 shadow-md h-auto min-h-[3.5rem] ${btnStyle}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-slate-950/60 border border-slate-700 flex items-center justify-center text-xs font-black text-amber-300 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1"><FuriganaText text={option} readings={optionReadings} /></span>
                    </button>
                  );
                })}
              </div>

              {/* Hint Box */}
              {showHint && currentQ?.hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium flex items-start gap-2"
                >
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="font-bold text-amber-300">ヒント：</span>
                    {currentQ.hint}
                  </div>
                </motion.div>
              )}

              {/* Correct / Incorrect Feedback Area */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg ${
                    isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100'
                      : 'bg-indigo-950/80 border-indigo-500/50 text-indigo-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{isCorrect ? '🎉' : '💬'}</span>
                    <div>
                      <div className="text-sm font-black text-amber-200">
                        {isCorrect
                          ? '正解！バリアを1つ壊したよ！'
                          : 'まだバリアは残っているよ。一緒に考えよう！'}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {isCorrect ? currentQ?.explanation : 'ヒントを確認するか、もう一度挑戦してみよう！'}
                      </p>
                    </div>
                  </div>

                  {/* Actions depending on answer state */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    {isCorrect ? (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <span>次の問題へ</span>
                        <span>➔</span>
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleRetryQuestion}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          🔄 もう一度考える
                        </button>
                        {!showHint && (
                          <button
                            onClick={() => setShowHint(true)}
                            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-200 transition-all cursor-pointer"
                          >
                            💡 ヒントを見る
                          </button>
                        )}
                        <button
                          onClick={handleFoundationReviewClick}
                          className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-200 transition-all cursor-pointer"
                        >
                          📖 基礎を復習する
                        </button>
                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          次へ進む ➔
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Bottom control buttons if not answered */}
              {!isAnswered && (
                <div className="flex items-center justify-between gap-2 pt-2 text-xs">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>💡</span>
                    <span>{showHint ? 'ヒントを隠す' : 'ヒントを見る'}</span>
                  </button>

                  <button
                    onClick={handleFoundationReviewClick}
                    className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>📖</span>
                    <span>基礎を復習する</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Battle Finish Result View */
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center gap-6 my-auto">
            {correctCount >= stageDef.requiredClearCount ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🏆</div>
                <div className="text-xs font-black text-amber-400 tracking-widest uppercase">
                  STAGE CLEAR!
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-amber-100 mt-1">
                  {stageDef.name} クリア！
                </h2>

                {/* Stars Display */}
                <div className="flex items-center gap-2 my-4">
                  {[1, 2, 3].map((starIdx) => (
                    <span
                      key={starIdx}
                      className={`text-4xl ${
                        starIdx <= (earnedRewards?.stars || 0)
                          ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110'
                          : 'text-slate-700'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="px-4 py-2 bg-slate-800/90 rounded-2xl border border-slate-700 text-sm font-bold text-slate-200 mb-4">
                  正解数: <span className="text-amber-300 font-black text-lg">{correctCount}</span> / {stageDef.totalQuestions} 問
                </div>

                {/* Rewards Box */}
                {earnedRewards?.isFirstClear && (
                  <div className="w-full max-w-md p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-indigo-900/40 border border-amber-500/40 text-left my-2 shadow-xl">
                    <div className="text-xs font-black text-amber-300 flex items-center gap-1 mb-2">
                      🎁 初回ステージクリア報酬獲得！
                    </div>

                    <ul className="text-xs text-amber-100 font-bold space-y-1.5">
                      {earnedRewards.energy > 0 && (
                        <li className="flex items-center gap-2">
                          <span>✨</span>
                          <span>知識エネルギー ＋{earnedRewards.energy}</span>
                        </li>
                      )}
                      {earnedRewards.itemsGained.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span>📦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {earnedRewards?.memorialCard && (
                  <div className="w-full max-w-md p-4 rounded-2xl bg-gradient-to-r from-fuchsia-600/30 to-amber-600/30 border border-fuchsia-400 text-left my-2 shadow-2xl">
                    <div className="text-xs font-black text-fuchsia-300">
                      🃏 完全クリア限定記念カード獲得！
                    </div>
                    <div className="text-sm font-black text-white mt-1">
                      {earnedRewards.memorialCard}
                    </div>
                  </div>
                )}

                {!earnedRewards?.isFirstClear && (
                  <p className="text-xs text-slate-400 mb-2">
                    （※再挑戦のため、初回限定報酬は獲得済みです）
                  </p>
                )}
              </motion.div>
            ) : (
              /* Stage Clear Failed View */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center max-w-md"
              >
                <div className="text-6xl mb-2">🌱</div>
                <h2 className="text-2xl font-black text-amber-200">
                  もう少し知識を集めよう！
                </h2>
                <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
                  正解数は {correctCount} / {stageDef.totalQuestions} 問でした。
                  クリアには 3問以上の正解が必要です。基礎の力を蓄えてもう一度挑戦してみよう！
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <button
                    onClick={handleFoundationReviewClick}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>📖</span>
                    <span>基礎を復習する</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsBattleFinished(false);
                      setCurrentIndex(0);
                      setCorrectCount(0);
                      setBarriersLeft(stageDef.isBossStage ? (stageDef.bossBarrierCount || 5) : 5);
                      setSelectedOption(null);
                      setIsAnswered(false);
                      setIsCorrect(null);
                      setQuestions(getRandomQuestionsForStage(stageDef));
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>🔄</span>
                    <span>もう一度挑戦する</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black text-sm transition-all cursor-pointer shadow-lg mt-2"
            >
              ステージマップに戻る ➔
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
