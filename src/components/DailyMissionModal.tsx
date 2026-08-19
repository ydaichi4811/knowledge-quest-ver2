import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData } from '../types';
import { HeroCharacter } from './game/HeroCharacter';
import { BuddyCharacter } from './game/BuddyCharacter';
import { claimDailyMissionReward, ensureDailyMissions } from '../services/dailyMissionService';
import { savePlayerData } from '../services/gameStorage';
import { CheckCircle, Sparkles, X, Gift } from 'lucide-react';

interface DailyMissionModalProps {
  player: PlayerData;
  onUpdatePlayer: (updated: PlayerData) => void;
  onClose: () => void;
}

export const DailyMissionModal: React.FC<DailyMissionModalProps> = ({
  player: initialPlayer,
  onUpdatePlayer,
  onClose,
}) => {
  const player = ensureDailyMissions(initialPlayer);
  const missions = player.dailyMissions || [];
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lock body scroll and register Escape key listener
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

  const handleClaim = (missionId: string) => {
    const res = claimDailyMissionReward(player, missionId);
    if (res.success) {
      savePlayerData(res.updatedPlayer);
      onUpdatePlayer(res.updatedPlayer);
      setToastMessage(res.rewardMessage);

      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    }
  };

  const completedCount = missions.filter((m) => m.isCompleted).length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl max-h-[92vh] book-notebook-card text-slate-100 flex flex-col overflow-hidden shadow-2xl rounded-2xl"
      >
        {/* Responsive Header: Compact Character Plate, Full-Width Title & Controls */}
        <div className="border-b border-amber-500/30 p-3 sm:p-4 shrink-0 bg-slate-900/95 z-10 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 min-w-0">
            {/* Left/Top Section: Character Plate + Title & Desc */}
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
              {/* Compact Character Card (25~30% smaller: w-10 / 46px, scale-0.42, no cutoffs) */}
              <div className="flex items-center justify-center gap-0.5 shrink-0 bg-slate-950/80 p-0.5 sm:p-1 rounded-lg border border-amber-500/30 shadow-inner w-[40px] sm:w-[46px] overflow-hidden self-start">
                <div className="scale-[0.42] origin-center -m-4 flex items-center justify-center">
                  <HeroCharacter player={player} size="xs" />
                </div>
                <div className="scale-[0.42] origin-center -m-4 flex items-center justify-center">
                  <BuddyCharacter player={player} size="xs" />
                </div>
              </div>

              {/* Title & Description Area (flex-1 min-w-0) */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap sm:flex-nowrap">
                  <h2
                    className="text-base sm:text-lg font-black text-amber-200 tracking-tight"
                    style={{
                      whiteSpace: 'normal',
                      wordBreak: 'keep-all',
                      overflowWrap: 'anywhere',
                      lineHeight: 1.35,
                      minWidth: 0,
                      display: 'block',
                    }}
                  >
                    今日のデイリーミッション
                  </h2>
                  <span className="sm:hidden px-2 py-0.5 bg-amber-950 border border-amber-500/50 rounded-md text-[10px] font-extrabold text-amber-300 whitespace-nowrap shadow-sm shrink-0">
                    {completedCount}/3 達成
                  </span>
                </div>
                <p
                  className="text-[11px] sm:text-xs text-slate-300 mt-1"
                  style={{
                    whiteSpace: 'normal',
                    wordBreak: 'keep-all',
                    overflowWrap: 'anywhere',
                    lineHeight: 1.35,
                    minWidth: 0,
                    display: 'block',
                  }}
                >
                  毎日深夜0時に更新！無理なく楽しく学習と相棒のお世話を続けよう！
                </p>
              </div>
            </div>

            {/* Right Section: Badge (desktop) & Close Button */}
            <div className="flex items-center sm:flex-col justify-between sm:justify-end sm:items-end gap-2 shrink-0 pt-1 sm:pt-0 border-t border-amber-500/20 sm:border-t-0">
              <span className="hidden sm:inline-block px-2.5 py-1 bg-amber-950 border border-amber-500/50 rounded-md text-[11px] font-extrabold text-amber-300 whitespace-nowrap shadow-sm">
                {completedCount}/3 達成
              </span>
              <button
                type="button"
                onClick={onClose}
                className="btn-book-brown text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[38px] min-w-[44px] justify-center ml-auto sm:ml-0"
                aria-label="閉じる"
              >
                <X className="w-4 h-4" /> <span>閉じる</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 overscroll-contain">
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 rounded-2xl text-xs font-bold text-emerald-200 flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission Cards */}
          <div className="space-y-3.5">
            {missions.map((m) => {
              const percent = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));

              return (
                <div
                  key={m.missionId}
                  className={`p-3.5 sm:p-5 rounded-2xl border transition-all flex flex-col gap-2.5 w-full min-w-0 ${
                    m.rewardClaimed
                      ? 'bg-slate-900/50 border-slate-800 opacity-60'
                      : m.isCompleted
                      ? 'bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border-indigo-400/80 shadow-lg shadow-indigo-950/40'
                      : 'bg-slate-900/80 border-slate-700/80'
                  }`}
                >
                  {/* Icon & Title Container */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="text-2xl sm:text-3xl p-2 bg-slate-950/80 rounded-2xl border border-amber-500/30 shrink-0 shadow-inner">
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="text-sm sm:text-base font-black text-amber-100 leading-snug"
                          style={{ wordBreak: 'normal', overflowWrap: 'anywhere', whiteSpace: 'normal' }}
                        >
                          {m.title}
                        </h3>
                        {m.isCompleted && !m.rewardClaimed && (
                          <span className="px-2 py-0.5 bg-amber-500/30 border border-amber-400/60 rounded-md text-[10px] sm:text-xs text-amber-300 font-extrabold animate-bounce whitespace-nowrap">
                            達成！
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs text-slate-300 leading-relaxed mt-1"
                        style={{ wordBreak: 'normal', overflowWrap: 'anywhere', whiteSpace: 'normal' }}
                      >
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {/* Reward Badge */}
                  <div className="flex items-center justify-between p-2 sm:p-2.5 bg-slate-950/60 rounded-xl border border-indigo-500/20 text-xs">
                    <span className="text-indigo-300 font-bold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>獲得報酬</span>
                    </span>
                    <span className="font-black text-amber-300 text-xs sm:text-sm">
                      {m.reward?.label || '各種報酬'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] sm:text-xs text-slate-300 font-bold">
                      <span>進捗状況</span>
                      <span className="font-mono">
                        {m.currentValue} / {m.targetValue} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className={`h-full transition-all duration-500 ${
                          m.isCompleted
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                            : 'bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="pt-1 flex justify-end">
                    {m.rewardClaimed ? (
                      <button
                        disabled
                        className="btn-book-green opacity-75 text-xs py-1.5 sm:py-2 px-4 cursor-not-allowed flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>報酬受け取り済み</span>
                      </button>
                    ) : m.isCompleted ? (
                      <button
                        onClick={() => handleClaim(m.missionId)}
                        className="btn-book-yellow text-xs sm:text-sm py-2 px-5 flex items-center gap-1.5 animate-pulse cursor-pointer shadow-lg font-black"
                      >
                        <Gift className="w-4 h-4" />
                        <span>報酬を受け取る！</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="btn-book-orange opacity-60 text-xs py-1.5 sm:py-2 px-4 cursor-not-allowed"
                      >
                        挑戦中...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-3 sm:p-4 border-t border-amber-500/30 shrink-0 bg-slate-900/95 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-300 z-10">
          <span className="text-center sm:text-left">※ミッションを達成できなくてもペナルティは一切ありません</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-book-brown text-xs py-1.5 px-4 w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <X className="w-4 h-4" /> <span>閉じる</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

