import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData, RegionInfo, QuestStage } from '../types';
import { REGIONS_DATA } from '../data/regions';
import {
  Lock,
  ChevronRight,
  ArrowLeft,
  Crown,
  X,
  Flag,
  Swords,
  Award,
  CheckCircle2,
  AlertCircle,
  Compass,
} from 'lucide-react';

import { PretestEntranceCard } from './PretestEntranceCard';
import { FuriganaText } from './FuriganaText';

interface MapScreenProps {
  player: PlayerData;
  onBackToHome: () => void;
  onStartQuest: (regionId: string, stageId: string, stageInfo?: QuestStage) => void;
  onOpenPretest?: () => void;
}

// ステージごとの出現モンスター・詳細補足データ（安全な絵文字＋Lucide代替付き）
const STAGE_EXTRA_INFO: Record<
  string,
  { enemyName: string; enemyIcon: string; questionCountText: string; timeEstimate: string }
> = {
  area_stage_1: {
    enemyName: '四角スライム',
    enemyIcon: '🟩',
    questionCountText: '全 5 問',
    timeEstimate: '約 4 分',
  },
  area_stage_2: {
    enemyName: 'パラレルウッド',
    enemyIcon: '🪵',
    questionCountText: '全 5 問',
    timeEstimate: '約 4 分',
  },
  area_stage_3: {
    enemyName: 'トライアハーピー',
    enemyIcon: '🦅',
    questionCountText: '全 5 問',
    timeEstimate: '約 4 分',
  },
  area_stage_4: {
    enemyName: 'トラペゴーレム',
    enemyIcon: '🗿',
    questionCountText: '全 5 問',
    timeEstimate: '約 5 分',
  },
  area_stage_5: {
    enemyName: '【中ボス】ダイヤナイト',
    enemyIcon: '⚔️💎',
    questionCountText: '全 6 問',
    timeEstimate: '約 6 分',
  },
  area_stage_6: {
    enemyName: '【大ボス】面積魔王コンポジ王',
    enemyIcon: '👹🏰',
    questionCountText: '全 7 問',
    timeEstimate: '約 8 分',
  },
  // 他地方フォールバック用
  ratio_stage_1: { enemyName: '割合商人ゴブリン', enemyIcon: '👺', questionCountText: '全 5 問', timeEstimate: '約 5 分' },
  ratio_stage_2: { enemyName: 'パーセント魔導士', enemyIcon: '🧙‍♂️', questionCountText: '全 6 問', timeEstimate: '約 6 分' },
  volume_stage_1: { enemyName: 'キューブドラゴン', enemyIcon: '🐉', questionCountText: '全 5 問', timeEstimate: '約 5 分' },
  fraction_stage_1: { enemyName: '通分フェニックス', enemyIcon: '🦅✨', questionCountText: '全 5 問', timeEstimate: '約 5 分' },
};

export const MapScreen: React.FC<MapScreenProps> = ({
  player,
  onBackToHome,
  onStartQuest,
  onOpenPretest,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('grade5_current');
  const [activeStageModal, setActiveStageModal] = useState<QuestStage | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const selectedRegion =
    REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];

  // 地域解放判定
  const isRegionUnlocked = (region: RegionInfo) => {
    return (
      player.unlockedRegions?.includes(region.id) ||
      player.level >= region.requiredLevel
    );
  };

  // ステージクリア判定
  const isStageCleared = (stageId: string) => {
    if (player.completedQuests?.includes(stageId)) return true;
    if (player.stageProgress?.[stageId]?.isCleared) return true;
    return false;
  };

  // 完全クリア（パーフェクト）判定
  const isStagePerfect = (stageId: string) => {
    if (player.stageProgress?.[stageId]?.isPerfectCleared) return true;
    if ((player.stageProgress?.[stageId]?.bestStars || 0) >= 3) return true;
    return false;
  };

  // ステージ解放判定（1つ目のステージは地域解放で解禁、2つ目以降は前ステージクリアが条件）
  const isStageUnlocked = (stage: QuestStage, region: RegionInfo) => {
    if (!isRegionUnlocked(region)) return false;
    if (!stage.requiredStageId) return true;
    return isStageCleared(stage.requiredStageId);
  };

  // 現在最初挑戦可能な「おすすめ」ステージIDを取得
  const getRecommendedStageId = (region: RegionInfo) => {
    if (!isRegionUnlocked(region)) return null;
    for (const st of region.stages) {
      if (!isStageCleared(st.id)) {
        if (isStageUnlocked(st, region)) return st.id;
      }
    }
    // 全てクリア済みの場合は最後のステージ
    return region.stages[region.stages.length - 1]?.id || null;
  };

  const recommendedStageId = getRecommendedStageId(selectedRegion);

  // ステージクリック時の処理
  const handleStageClick = (stage: QuestStage) => {
    if (isStageUnlocked(stage, selectedRegion)) {
      setActiveStageModal(stage);
      setLockedNotice(null);
    } else {
      let reqName = '前のステージ';
      if (stage.requiredStageId) {
        const reqStage = selectedRegion.stages.find((s) => s.id === stage.requiredStageId);
        if (reqStage) reqName = `「${reqStage.title}」`;
      }
      setLockedNotice(
        `🔒 このステージはまだ閉ざされています！\n${reqName} をクリアすると進めるようになるよ。`
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 pb-28">
      {/* ========================================================= */}
      {/* HEADER BAR: Map Navigation & Title */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl relative overflow-hidden bg-slate-900/90 border-2 border-amber-500/60"
      >
        <button
          onClick={onBackToHome}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-amber-200 hover:text-white bg-slate-950/80 px-4 py-2.5 rounded-xl border border-amber-500/50 transition-all cursor-pointer shadow hover:scale-102 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span><FuriganaText text="ホームへ戻る" /></span>
        </button>

        <div className="text-center">
          <h2 className="font-black text-lg sm:text-2xl text-amber-300 font-cinzel flex items-center justify-center gap-2">
            <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
            <span><FuriganaText text="マスリア王国 冒険マップ" /></span>
          </h2>
          <p className="text-[11px] sm:text-xs text-emerald-400 font-bold mt-0.5">
            <FuriganaText text="数理の試練を乗り越えて、試練のロードを進もう！" />
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-amber-500/40 text-xs shrink-0">
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-slate-300 font-bold">レベル:</span>
          <span className="font-black text-amber-300">Lv.{player.level}</span>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* REGION SELECTION TABS */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {REGIONS_DATA.map((region) => {
          const unlocked = isRegionUnlocked(region);
          const isSelected = selectedRegionId === region.id;

          return (
            <button
              key={region.id}
              onClick={() => {
                setSelectedRegionId(region.id);
                setLockedNotice(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 border-2 shadow-md ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-102'
                  : unlocked
                  ? 'bg-slate-900/90 text-slate-200 border-emerald-500/60 hover:bg-slate-800'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 opacity-70 hover:opacity-90'
              }`}
            >
              <span className="text-base">{unlocked ? region.badgeIcon : '🔒'}</span>
              <span>{region.name}</span>
              {!unlocked && (
                <span className="text-[10px] bg-slate-950/80 px-2 py-0.5 rounded-md text-amber-300/80 border border-slate-700">
                  Lv.{region.requiredLevel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Unlocked / Locked Banner Notice */}
      {lockedNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-950/90 border-2 border-amber-500/80 p-3 rounded-2xl text-amber-200 text-xs sm:text-sm font-extrabold flex items-center justify-between gap-2 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="whitespace-pre-line">{lockedNotice}</span>
          </div>
          <button
            onClick={() => setLockedNotice(null)}
            className="p-1 text-amber-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* RPG ADVENTURE MAP BOARD CANVAS (Fantasy Parchment Style) */}
      {/* ========================================================= */}
      <div className="relative game-card p-4 sm:p-8 overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 border-3 border-amber-500/70 shadow-[0_15px_35px_rgba(0,0,0,0.8)] min-h-[560px] flex flex-col justify-between">
        {/* Background Environment Aesthetics */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#34d399_1.5px,transparent_1.5px)] [background-size:28px_28px]" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Region Title Banner */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/80 p-3 sm:p-4 rounded-2xl border-2 border-amber-500/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex items-center justify-center text-2xl shadow shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                {selectedRegion.badgeIcon}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-xl text-amber-300 font-cinzel">
                  {selectedRegion.name}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {selectedRegion.mathCategory}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedRegion.description}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-amber-200/90 font-bold shrink-0 self-end sm:self-center bg-slate-900/90 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <span>完成度: </span>
            <span className="text-amber-400 font-black text-sm">
              {selectedRegion.stages.filter((s) => isStageCleared(s.id)).length} /{' '}
              {selectedRegion.stages.length} クエスト
            </span>
          </div>
        </div>

        {/* Region Unlocked vs Locked Check */}
        {isRegionUnlocked(selectedRegion) ? (
          <div className="relative z-10 my-8 w-full max-w-4xl mx-auto">
            {/* ========================================================= */}
            {/* Winding Road / Stage Path (Town -> Stages -> Boss) */}
            {/* ========================================================= */}
            
            {/* 1. STARTING TOWN NODE */}
            <div className="flex justify-center mb-6">
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-600 to-slate-900 p-1 shadow-lg flex items-center justify-center text-3xl border-2 border-amber-300">
                  <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                    🏡
                  </div>
                </div>
                <span className="mt-1 px-3 py-1 rounded-full bg-slate-950/90 text-amber-300 text-xs font-black border border-amber-500/50 shadow">
                  マスリア冒険拠点
                </span>
              </div>
            </div>

            {/* Connecting Line from Town to Stage 1 */}
            <div className="w-1.5 h-8 mx-auto bg-gradient-to-b from-amber-400 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

            {/* 2. STAGES ROAD TRAIL (Zigzag RPG Layout) */}
            <div className="space-y-8 relative">
              {selectedRegion.stages.map((stage, idx) => {
                const cleared = isStageCleared(stage.id);
                const perfect = isStagePerfect(stage.id);
                const unlocked = isStageUnlocked(stage, selectedRegion);
                const isRecommended = recommendedStageId === stage.id;
                const isBoss = idx === selectedRegion.stages.length - 1;
                const isMidBoss = idx === Math.floor(selectedRegion.stages.length / 2) && selectedRegion.stages.length > 3;

                // Alternate left, right, center for organic RPG map trail feel
                const aligns = ['justify-start', 'justify-end', 'justify-center', 'justify-start', 'justify-end'];
                const alignClass = aligns[idx % aligns.length];

                return (
                  <React.Fragment key={stage.id}>
                    <div className={`flex ${alignClass} px-2 sm:px-8 relative`}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStageClick(stage)}
                        className={`relative cursor-pointer group flex items-center gap-3 p-3.5 sm:p-4 rounded-3xl border-3 transition-all max-w-xs sm:max-w-md w-full shadow-xl ${
                          isBoss
                            ? 'bg-gradient-to-r from-red-950/90 via-slate-950/90 to-red-950/90 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-105'
                            : isMidBoss
                            ? 'bg-gradient-to-r from-amber-950/90 via-slate-950/90 to-amber-950/90 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                            : unlocked
                            ? cleared
                              ? 'bg-slate-900/95 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                              : 'bg-slate-900/90 border-amber-400/80 hover:border-amber-300'
                            : 'bg-slate-950/80 border-slate-800 opacity-65 grayscale-[50%]'
                        }`}
                      >
                        {/* Recommended / Current Location Hero/Buddy Marker */}
                        {isRecommended && (
                          <div className="absolute -top-4 -right-2 z-30 flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg border border-amber-200 animate-bounce">
                            <span>バディの推薦 🐾</span>
                          </div>
                        )}

                        {/* Node Icon Badge */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-inner transition-transform ${
                              isBoss
                                ? 'bg-gradient-to-br from-red-600 to-rose-950 border-red-300 text-white animate-pulse'
                                : isMidBoss
                                ? 'bg-gradient-to-br from-amber-500 to-amber-900 border-amber-300 text-white'
                                : unlocked
                                ? cleared
                                  ? 'bg-gradient-to-br from-emerald-500 to-teal-800 border-emerald-300 text-white'
                                  : 'bg-gradient-to-br from-amber-500 to-amber-700 border-amber-300 text-slate-950'
                                : 'bg-slate-900 border-slate-700 text-slate-500'
                            }`}
                          >
                            {!unlocked ? (
                              <Lock className="w-7 h-7 text-slate-500" />
                            ) : isBoss ? (
                              '🏰'
                            ) : isMidBoss ? (
                              '💎'
                            ) : (
                              stage.topic.includes('平行')
                                ? '🌲'
                                : stage.topic.includes('三角')
                                ? '⛰️'
                                : stage.topic.includes('台形')
                                ? '🛡️'
                                : '📐'
                            )}
                          </div>

                          {/* Cleared Status Icon overlay */}
                          {unlocked && (
                            <div className="absolute -bottom-1 -right-1 z-20">
                              {perfect ? (
                                <div className="bg-amber-400 text-slate-950 p-1 rounded-full shadow border border-amber-200" title="完全クリア">
                                  <Crown className="w-4 h-4 fill-amber-950" />
                                </div>
                              ) : cleared ? (
                                <div className="bg-emerald-500 text-slate-950 p-1 rounded-full shadow border border-emerald-200" title="クリア済み">
                                  <Flag className="w-4 h-4 fill-slate-950" />
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>

                        {/* Stage Details */}
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 border border-amber-500/30">
                              STAGE {idx + 1}
                            </span>
                            {isBoss && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-600 text-white border border-red-300 animate-pulse">
                                BOSS
                              </span>
                            )}
                            {isMidBoss && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-600 text-white border border-amber-300">
                                中ボス
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold ml-auto">
                              {stage.difficulty}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm sm:text-base text-slate-100 truncate mt-1 group-hover:text-amber-300 transition-colors">
                            {stage.title}
                          </h4>

                          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                            {stage.topic}
                          </p>

                          <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-400 mt-1">
                            <span>+{stage.expReward} EXP</span>
                            <span>+{stage.pointsReward} KQ pt</span>
                          </div>
                        </div>

                        {/* Chevron Action Arrow */}
                        <div className="shrink-0 text-amber-400 group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Connecting Trail Line between nodes */}
                    {idx < selectedRegion.stages.length - 1 && (
                      <div className="w-full flex justify-center my-1">
                        <div
                          className={`w-1.5 h-7 rounded-full transition-colors ${
                            cleared
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                              : 'bg-slate-800 border-l border-r border-slate-700'
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : (
          /* Locked Region Placeholder */
          <div className="relative z-10 my-12 p-8 text-center space-y-4 bg-slate-950/90 rounded-3xl border-2 border-slate-800 max-w-md mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center mx-auto text-4xl shadow">
              🔒
            </div>
            <div>
              <h4 className="font-black text-lg text-slate-200 font-cinzel">
                {selectedRegion.name} （閉ざされた領域）
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                この地域の知識の扉を開くには、プレイヤーレベル{' '}
                <strong className="text-amber-300 font-black">
                  Lv.{selectedRegion.requiredLevel}
                </strong>{' '}
                が必要です。
              </p>
            </div>
            <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 text-emerald-300 text-xs font-bold leading-relaxed">
              💡 「アレア地方」の図形問題に挑戦して、EXPを稼ぎレベルアップを目指そう！
            </div>
          </div>
        )}

        {/* Optional Pretest Entrance Component integration */}
        {selectedRegion.id === 'area' && isRegionUnlocked(selectedRegion) && (
          <div className="relative z-10 mt-6 pt-4 border-t border-amber-500/30">
            <PretestEntranceCard
              player={player}
              unitId="area"
              onOpenPretest={() => {
                if (onOpenPretest) onOpenPretest();
              }}
            />
          </div>
        )}

        {/* Legend Footer */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/90 p-3 rounded-2xl border border-amber-500/30">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <Flag className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> クリア済み
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 完全クリア
            </span>
            <span className="flex items-center gap-1 text-slate-400 font-bold">
              <Lock className="w-3.5 h-3.5" /> 未解放
            </span>
          </div>
          <span className="text-[11px] text-amber-200/80 font-bold">
            ※ ステージを選択するとクエスト詳細が表示されます
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL DIALOG: STAGE DETAILS & QUEST ENTRANCE */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeStageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="game-card w-full max-w-lg p-5 sm:p-6 space-y-4 relative bg-slate-900 border-4 border-amber-400 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-3xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStageModal(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-950/80 rounded-full border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Stage Title Header */}
              <div className="flex items-start gap-3 border-b border-amber-500/30 pb-4 pr-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 flex items-center justify-center text-3xl shadow shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    {activeStageModal.topic.includes('平行')
                      ? '🌲'
                      : activeStageModal.topic.includes('三角')
                      ? '⛰️'
                      : activeStageModal.topic.includes('台形')
                      ? '🛡️'
                      : '📐'}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-slate-950">
                      {activeStageModal.difficulty}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {selectedRegion.name}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-amber-200 mt-1">
                    {activeStageModal.title}
                  </h3>
                </div>
              </div>

              {/* Description & Learning Topics */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-slate-200 leading-relaxed">
                  <FuriganaText text={activeStageModal.description} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-amber-500/20">
                    <span className="text-[10px] text-amber-300 font-bold block">学習トピック:</span>
                    <span className="font-extrabold text-slate-100">{activeStageModal.topic}</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-amber-500/20">
                    <span className="text-[10px] text-amber-300 font-bold block">問題目安 / 所要時間:</span>
                    <span className="font-extrabold text-slate-100">
                      {STAGE_EXTRA_INFO[activeStageModal.id]?.questionCountText || '全 5 問'} (
                      {STAGE_EXTRA_INFO[activeStageModal.id]?.timeEstimate || '約 4 分'})
                    </span>
                  </div>
                </div>

                {/* Enemy Info Card */}
                <div className="bg-slate-950/90 p-3 rounded-2xl border border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {STAGE_EXTRA_INFO[activeStageModal.id]?.enemyIcon || '👾'}
                    </span>
                    <div>
                      <span className="text-[10px] text-rose-300 font-bold block">出現モンスター:</span>
                      <span className="font-black text-slate-100">
                        {STAGE_EXTRA_INFO[activeStageModal.id]?.enemyName || '算数怪獣'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-1 rounded-lg font-bold">
                    属性: 幾何学
                  </span>
                </div>

                {/* Quest Reward Info */}
                <div className="bg-slate-950/90 p-3 rounded-2xl border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-400" /> 獲得予定報酬:
                  </span>
                  <div className="flex items-center gap-3 font-black text-amber-300">
                    <span>+{activeStageModal.expReward} EXP</span>
                    <span>+{activeStageModal.pointsReward} KQ pt 🪙</span>
                  </div>
                </div>

                {/* Clear Status Indicator */}
                <div className="flex items-center justify-between text-xs px-2 pt-1">
                  <span className="text-slate-400 font-bold">現在のステータス:</span>
                  {isStagePerfect(activeStageModal.id) ? (
                    <span className="text-amber-300 font-black flex items-center gap-1">
                      <Crown className="w-4 h-4 fill-amber-400 text-amber-400" /> 完全クリア済み (👑 3/3★)
                    </span>
                  ) : isStageCleared(activeStageModal.id) ? (
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> クリア済み (⭐)
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold">⚔️ 未クリア (挑戦可能)</span>
                  )}
                </div>
              </div>

              {/* Start Quest Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const st = activeStageModal;
                    setActiveStageModal(null);
                    onStartQuest(selectedRegion.id, st.id, st);
                  }}
                  className="btn-royal-gold w-full py-3.5 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(245,158,11,0.5)] border-2 border-amber-300 cursor-pointer hover:scale-102 transition-all"
                >
                  <Swords className="w-5 h-5 text-slate-950 fill-slate-950" />
                  <span>【 ⚔️ このクエストに挑戦する 】</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

