import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { LevelUpDetail, PlayerStats } from '../types';
import { FuriganaText } from './FuriganaText';
import { Sparkles, Heart, Sword, ShieldAlert, Award, ArrowUpRight, X } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
  levelUpCount?: number;
  levelUpDetails?: LevelUpDetail[];
  statDiff?: PlayerStats;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  levelUpCount = 1,
  statDiff,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback if confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const count = levelUpCount || (newLevel - oldLevel) || 1;
  const hpGain = statDiff?.maxHp ?? (count * 10);
  const atkGain = statDiff?.attack ?? (count * 2);
  const defGain = statDiff?.defense ?? (count * 1);

  const oldHp = 100 + 10 * (oldLevel - 1);
  const newHp = oldHp + hpGain;

  const oldAtk = 10 + 2 * (oldLevel - 1);
  const newAtk = oldAtk + atkGain;

  const oldDef = 8 + 1 * (oldLevel - 1);
  const newDef = oldDef + defGain;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-400 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center overflow-hidden"
        >
          {/* Top Decorative Sparkles */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 cursor-pointer z-10 transition-all"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Title */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black px-6 py-2 rounded-full shadow-lg border-2 border-amber-200 mb-4"
          >
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="font-cinzel text-lg sm:text-xl tracking-wider">LEVEL UP!</span>
            <Sparkles className="w-5 h-5 animate-spin" />
          </motion.div>

          {/* Level Numbers Jump Display */}
          <div className="my-3 space-y-1">
            <div className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-black text-amber-300 font-cinzel">
              <span className="text-slate-400 text-xl">Lv.{oldLevel}</span>
              <ArrowUpRight className="w-6 h-6 text-emerald-400 animate-bounce" />
              <span className="text-amber-300 text-3xl sm:text-4xl drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
                Lv.{newLevel}
              </span>
            </div>
            {count > 1 && (
              <p className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full inline-block">
                ✨ {count} <FuriganaText text="レベル連続アップ！" />
              </p>
            )}
          </div>

          <p className="text-xs text-slate-300 font-bold mb-4">
            <FuriganaText text="学びの成果で主人公の能力値がアップしたぞ！" />
          </p>

          {/* Stat Changes Breakdown */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/40 space-y-3 mb-5 text-left">
            {/* Max HP */}
            <div className="flex justify-between items-center text-xs font-bold p-2 bg-slate-900/80 rounded-xl border border-rose-500/30">
              <span className="text-rose-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <FuriganaText text="最大HP" />
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400">{oldHp}</span>
                <span className="text-slate-500">→</span>
                <span className="text-rose-300 font-black text-sm">{newHp}</span>
                <span className="text-emerald-400 font-black text-xs bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  +{hpGain}
                </span>
              </div>
            </div>

            {/* Attack */}
            <div className="flex justify-between items-center text-xs font-bold p-2 bg-slate-900/80 rounded-xl border border-amber-500/30">
              <span className="text-amber-400 flex items-center gap-1.5">
                <Sword className="w-4 h-4 text-amber-400" />
                <FuriganaText text="攻撃力" />
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400">{oldAtk}</span>
                <span className="text-slate-500">→</span>
                <span className="text-amber-300 font-black text-sm">{newAtk}</span>
                <span className="text-emerald-400 font-black text-xs bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  +{atkGain}
                </span>
              </div>
            </div>

            {/* Defense */}
            <div className="flex justify-between items-center text-xs font-bold p-2 bg-slate-900/80 rounded-xl border border-cyan-500/30">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <FuriganaText text="防御力" />
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400">{oldDef}</span>
                <span className="text-slate-500">→</span>
                <span className="text-cyan-300 font-black text-sm">{newDef}</span>
                <span className="text-emerald-400 font-black text-xs bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  +{defGain}
                </span>
              </div>
            </div>
          </div>

          {/* Close Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg border border-amber-200 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Award className="w-5 h-5" />
            <span><FuriganaText text="オッケー！" /></span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
