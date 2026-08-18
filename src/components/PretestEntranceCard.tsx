import React from 'react';
import { motion } from 'motion/react';
import { PlayerData } from '../types';
import { isAreaPretestUnlocked } from './PretestModal';
import { FuriganaText } from './FuriganaText';

interface PretestEntranceCardProps {
  player: PlayerData;
  unitId?: string; // 'area'
  onOpenPretest: () => void;
  className?: string;
}

export const PretestEntranceCard: React.FC<PretestEntranceCardProps> = ({
  player,
  unitId = 'area',
  onOpenPretest,
  className = '',
}) => {
  const unlocked = isAreaPretestUnlocked(player);
  const progress = player.pretestProgress?.[unitId];

  const attempts = progress?.attempts || 0;
  const bestScore = progress?.bestScore ?? null;
  const cleared = progress?.cleared || false;
  const perfectCleared = progress?.perfectCleared || false;

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.01 } : {}}
      className={`p-5 rounded-3xl border-2 transition-all relative overflow-hidden shadow-xl ${
        unlocked
          ? 'bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-slate-900 border-amber-400/80 text-amber-100 ring-2 ring-amber-400/30'
          : 'bg-slate-900/70 border-slate-800 text-slate-400 opacity-80'
      } ${className}`}
    >
      {/* Top Tag Banner */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-black text-amber-300">
          📜 <FuriganaText text="王国からの特別依頼" />
        </div>

        <div>
          {unlocked ? (
            cleared ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-extrabold flex items-center gap-1">
                {perfectCleared ? '🌟 パーフェクト達成' : '✨ クリア済み'}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-extrabold">
                ✨ 解放済み（挑戦可）
              </span>
            )
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-500 border border-slate-700 text-[11px] font-bold">
              🔒 未解放
            </span>
          )}
        </div>
      </div>

      {/* Main Info Header */}
      <div className="flex items-start justify-between gap-4 my-2">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-amber-200">
            <FuriganaText text="面積マスタープレテスト" />
          </h3>
          <p className="text-xs text-amber-300/80 font-medium mt-1">
            <FuriganaText text="学校のテストに近い問題（全10問）に挑戦しよう！" />
          </p>
        </div>

        <div className="text-4xl shrink-0 p-2 bg-amber-950/60 rounded-2xl border border-amber-500/30">
          👑
        </div>
      </div>

      {/* Progress & Scores */}
      <div className="my-3 pt-3 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/20">
          <div className="text-[10px] text-amber-400/80">最高得点</div>
          <div className="text-sm font-black text-amber-200 mt-0.5">
            {bestScore !== null ? `${bestScore}点` : '未挑戦'}
          </div>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/20">
          <div className="text-[10px] text-amber-400/80">挑戦回数</div>
          <div className="text-sm font-black text-amber-200 mt-0.5">
            {attempts}回
          </div>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/20 col-span-2 sm:col-span-1">
          <div className="text-[10px] text-amber-400/80">合格判定</div>
          <div className="text-sm font-black mt-0.5">
            {cleared ? (
              <span className="text-emerald-400">合格 (80点以上)</span>
            ) : (
              <span className="text-slate-400">未合格 (80点以上)</span>
            )}
          </div>
        </div>
      </div>

      {/* Unlock Condition or Action Button */}
      {unlocked ? (
        <button
          onClick={onOpenPretest}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>📜 <FuriganaText text="プレテストに挑戦する！" /></span>
        </button>
      ) : (
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-bold text-center space-y-1">
          <div className="text-rose-400 flex items-center justify-center gap-1">
            🔒 <FuriganaText text="まだ挑戦できません" />
          </div>
          <div className="text-[11px] text-slate-500 font-normal">
            <FuriganaText text="通常ステージとボス戦をクリアすると解放されます。" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
