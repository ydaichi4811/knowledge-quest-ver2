import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData, ReviewSessionData } from '../types';
import { AREA_STAGES, AreaStageDef, LOCKED_MAP_PREVIEWS, getAreaStageById } from '../data/stageData';
import { AreaStageBattleModal } from './AreaStageBattleModal';
import { FuriganaText } from './FuriganaText';

import { PretestEntranceCard } from './PretestEntranceCard';

interface AreaStageMapModalProps {
  player: PlayerData;
  onPlayerUpdate: (updated: PlayerData) => void;
  onClose: () => void;
  onOpenFoundationReview?: (reviewData: ReviewSessionData) => void;
  onOpenPretest?: () => void;
}

export const AreaStageMapModal: React.FC<AreaStageMapModalProps> = ({
  player,
  onPlayerUpdate,
  onClose,
  onOpenFoundationReview,
  onOpenPretest,
}) => {
  const [selectedStage, setSelectedStage] = useState<AreaStageDef | null>(null);
  const [activeBattleStage, setActiveBattleStage] = useState<AreaStageDef | null>(null);

  // Lock body scroll and handle Escape key
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

  const stageProgressMap = player.stageProgress || {};

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
        className="w-full max-w-6xl max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-32px)] bg-slate-900/95 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-slate-100"
      >
        {/* Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              🗺️
            </span>
            <div>
              <div className="text-xs font-bold text-amber-400"><FuriganaText text="5年生算数「面積」エリア" /></div>
              <h2 className="text-lg sm:text-2xl font-black text-amber-100">
                <FuriganaText text="アレア地方 冒険マップ" />
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label="閉じる"
          >
            ✕ <FuriganaText text="閉じる" />
          </button>
        </div>

        {/* Map Canvas / Grid Container */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 flex flex-col items-center relative">
          {/* Subtitle Banner */}
          <div className="mb-6 px-5 py-2.5 rounded-full bg-slate-950/80 border border-amber-500/30 text-xs sm:text-sm font-bold text-amber-200 text-center shadow-inner">
            <FuriganaText text="🌿 各ステージをクリアして「知識バリア」を打ち払い、公式マスターを目指そう！" />
          </div>

          {/* Map Grid */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            {AREA_STAGES.map((stage, idx) => {
              const progress = stageProgressMap[stage.stageId] || {
                stageId: stage.stageId,
                isUnlocked: idx === 0,
                attemptCount: 0,
                bestCorrectCount: 0,
                bestStars: 0,
                isCleared: false,
                isPerfectCleared: false,
                firstClearRewardClaimed: false,
                perfectClearRewardClaimed: false,
              };

              const isUnlocked = progress.isUnlocked;
              const isCleared = progress.isCleared;
              const stars = progress.bestStars;

              return (
                <motion.div
                  key={stage.stageId}
                  whileHover={isUnlocked ? { scale: 1.03 } : {}}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xl ${
                    stage.isBossStage
                      ? isUnlocked
                        ? 'bg-gradient-to-br from-purple-950/90 via-slate-900 to-amber-950/80 border-amber-400/80 ring-2 ring-amber-400/40'
                        : 'bg-slate-900/60 border-slate-800 opacity-60'
                      : isUnlocked
                      ? isCleared
                        ? 'bg-slate-800/90 border-amber-400/50 hover:border-amber-400'
                        : 'bg-slate-800/90 border-cyan-500/50 hover:border-cyan-400'
                      : 'bg-slate-950/50 border-slate-800 opacity-60'
                  }`}
                >
                  {/* Boss Badge ribbon */}
                  {stage.isBossStage && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-2xl uppercase tracking-wider">
                      BOSS STAGE
                    </div>
                  )}

                  {/* Stage Icon & Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-3xl p-2.5 bg-slate-950/80 rounded-2xl border border-slate-700/80 shadow-inner">
                        {stage.isBossStage ? '🏰' : idx === 0 ? '🌱' : idx === 1 ? '🌲' : '🏔️'}
                      </span>
                      {/* Star Ratings */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <span
                            key={s}
                            className={`text-lg ${
                              s <= stars
                                ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                                : 'text-slate-700'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-amber-100">
                      {stage.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-400/90 mt-0.5">
                      {stage.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  {/* Unlock Status / Score */}
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    {isUnlocked ? (
                      <div className="text-slate-300 font-bold">
                        {isCleared ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            ✓ クリア (最高 {progress.bestCorrectCount}/5問)
                          </span>
                        ) : (
                          <span className="text-cyan-300">未クリア (挑戦可)</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-500 font-bold flex items-center gap-1">
                        🔒 {stage.unlockConditionText || '前のステージをクリアで解放'}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={!isUnlocked}
                    onClick={() => setSelectedStage(stage)}
                    className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                      isUnlocked
                        ? stage.isBossStage
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{isUnlocked ? '⚔️ 挑戦する' : '🔒 ロック中'}</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Pre-test Bonus Mission Card */}
          <div className="w-full max-w-4xl mt-8">
            <PretestEntranceCard
              player={player}
              unitId="area"
              onOpenPretest={() => {
                if (onOpenPretest) onOpenPretest();
              }}
            />
          </div>

          {/* Future Locked Stages Preview Banner */}
          <div className="w-full max-w-4xl mt-8 pt-6 border-t border-slate-800">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center sm:text-left">
              🔒 将来開放予定の領域（プレビュー）
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60">
              {LOCKED_MAP_PREVIEWS.map((preview) => (
                <div
                  key={preview.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-slate-900 rounded-xl">🔒</span>
                    <div>
                      <div className="text-sm font-bold text-slate-300">{preview.name}</div>
                      <div className="text-[11px] text-slate-500">{preview.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500/80 px-2.5 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                    アップデート準備中
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stage Detail / Intro Dialog */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase">
                  STAGE DETAILS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-amber-100 mt-0.5">
                  {selectedStage.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              {selectedStage.description}
            </p>

            {/* Learning Topics */}
            <div>
              <div className="text-xs font-bold text-amber-300 mb-1.5">📚 学習テーマ：</div>
              <div className="flex flex-wrap gap-2">
                {selectedStage.learningTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
                  >
                    ✓ {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Stage Rewards Info */}
            <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-amber-400 mb-1">🎁 初回クリア報酬：</div>
              <div className="text-xs text-slate-300 space-y-1 font-medium">
                <div>・ 知識エネルギー ＋{selectedStage.firstClearRewards.knowledgeEnergy}</div>
                {selectedStage.firstClearRewards.items.map((item, i) => (
                  <div key={i}>
                    ・ {item.icon} {item.name} ({item.description})
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedStage(null)}
                className="w-1/3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  setActiveBattleStage(selectedStage);
                  setSelectedStage(null);
                }}
                className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>⚔️ 冒険を開始する！</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Battle Modal Overlay */}
      {activeBattleStage && (
        <AreaStageBattleModal
          stageDef={activeBattleStage}
          player={player}
          onPlayerUpdate={onPlayerUpdate}
          onClose={() => setActiveBattleStage(null)}
          onOpenFoundationReview={onOpenFoundationReview}
        />
      )}
    </div>
  );
};
