import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData } from '../types';
import { PLAYER_LEVEL_CONFIG, computePlayerStats, getRequiredExpForLevel } from '../services/gameStorage';
import { HeroCharacter } from './HeroCharacter';
import { FuriganaText } from './FuriganaText';
import { Shield, Heart, Sword, ShieldAlert, Award, Zap, X, Sparkles } from 'lucide-react';

interface HeroStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerData;
}

export const HeroStatusModal: React.FC<HeroStatusModalProps> = ({ isOpen, onClose, player }) => {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const level = Math.max(1, Math.min(PLAYER_LEVEL_CONFIG.MAX_LEVEL, player.level || 1));
  const isMaxLevel = level >= PLAYER_LEVEL_CONFIG.MAX_LEVEL;
  const currentExp = isMaxLevel ? 0 : Math.max(0, player.exp || player.currentExp || 0);
  const maxExp = isMaxLevel ? 0 : (player.maxExp || getRequiredExpForLevel(level));

  const expRatio = maxExp > 0 ? Math.min(100, Math.max(0, Math.round((currentExp / maxExp) * 100))) : 100;
  const expRemaining = maxExp > 0 ? Math.max(0, maxExp - currentExp) : 0;

  const stats = player.computedStats || player.baseStats || computePlayerStats(level).computedStats;

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-32px)] bg-slate-900 border-4 border-amber-500/80 rounded-3xl text-slate-100 flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Fixed Header */}
          <div className="flex items-center justify-between border-b-2 border-amber-500/30 p-4 shrink-0 bg-slate-900/95 z-10">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-cinzel">
                <FuriganaText text="主人公ステータス" />
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all border border-slate-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
            {/* Character Main Profile Display */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30">
              {/* Hero Visual Avatar */}
              <div className="relative p-3 bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 rounded-2xl border-2 border-amber-400/80 shadow-inner flex items-center justify-center shrink-0">
                <HeroCharacter
                  player={player}
                  viewType="sd"
                  expression="idle"
                  size="md"
                />
                <span className="absolute -bottom-2 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 shadow">
                  Lv.{level}
                </span>
              </div>

              {/* Profile Information */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-amber-200">
                    {player.nickname || player.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
                    {isMaxLevel ? 'MAX' : `Lv.${level}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  <FuriganaText text="マスリア王国の知識冒険者" />
                </p>

                {/* Title & Crest badge */}
                <div className="pt-1 flex flex-wrap gap-1.5 justify-center sm:justify-start text-[11px] font-bold">
                  <span className="bg-slate-900 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 flex items-center gap-1">
                    👑 {player.unlockedTitles?.[0] || '見習い冒険者'}
                  </span>
                </div>
              </div>
            </div>

            {/* Level & EXP Progress Box */}
            <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/40 space-y-2">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-amber-300 flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span><FuriganaText text="主人公レベル" /> Lv.{level}</span>
                </span>
                <span className="text-amber-200 text-xs font-bold">
                  {isMaxLevel ? (
                    <span className="text-amber-400 font-black">MAX LEVEL</span>
                  ) : (
                    `${currentExp} / ${maxExp} EXP (${expRatio}%)`
                  )}
                </span>
              </div>

              {/* EXP Gauge */}
              <div className="w-full bg-slate-900 rounded-full h-3.5 border border-slate-700 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${expRatio}%` }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-300 h-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                />
              </div>

              {/* Remaining EXP Text */}
              <div className="text-right text-[11px] font-bold text-slate-300">
                {isMaxLevel ? (
                  <span className="text-amber-400 flex items-center justify-end gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <FuriganaText text="最大レベルに到達しました" />
                  </span>
                ) : (
                  <span className="flex items-center justify-end gap-1 text-emerald-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span><FuriganaText text="次のレベルまで" /> あと <strong className="text-amber-300 text-xs">{expRemaining}</strong> EXP</span>
                  </span>
                )}
              </div>
            </div>

            {/* Hero Stats Grid (HP, Attack, Defense) */}
            <div className="grid grid-cols-3 gap-3">
              {/* HP */}
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-rose-500/40 text-center space-y-1 shadow">
                <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold">
                  <Heart className="w-4 h-4" />
                  <span><FuriganaText text="最大HP" /></span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-rose-300 font-cinzel">
                  {stats.maxHp}
                </div>
                <div className="text-[10px] text-rose-400/80 font-bold">
                  +10 / Lv
                </div>
              </div>

              {/* Attack */}
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-amber-500/40 text-center space-y-1 shadow">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                  <Sword className="w-4 h-4" />
                  <span><FuriganaText text="攻撃力" /></span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-cinzel">
                  {stats.attack}
                </div>
                <div className="text-[10px] text-amber-400/80 font-bold">
                  +2 / Lv
                </div>
              </div>

              {/* Defense */}
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/40 text-center space-y-1 shadow">
                <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span><FuriganaText text="防御力" /></span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-300 font-cinzel">
                  {stats.defense}
                </div>
                <div className="text-[10px] text-cyan-400/80 font-bold">
                  +1 / Lv
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900/95 z-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg border border-amber-300 cursor-pointer transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Shield className="w-4 h-4" />
              <span><FuriganaText text="とじる" /></span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
