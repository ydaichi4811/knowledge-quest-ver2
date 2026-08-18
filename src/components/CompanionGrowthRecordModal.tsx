import React from 'react';
import { motion } from 'motion/react';
import { PlayerData } from '../types';
import { BuddyCharacter } from './BuddyCharacter';
import { X, Award, Calendar, BookOpen, Crown, Sparkles, Heart } from 'lucide-react';

interface CompanionGrowthRecordModalProps {
  player: PlayerData;
  onClose: () => void;
}

export const CompanionGrowthRecordModal: React.FC<CompanionGrowthRecordModalProps> = ({
  player,
  onClose,
}) => {
  const comp = player.companion!;
  const logs = comp.growthLogs || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl game-card p-5 sm:p-7 relative border-2 border-amber-400/80 shadow-2xl my-auto space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
          <Award className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-xl font-black text-amber-300 font-cinzel">
              成長記録 ～MEMORIAL RECORDS～
            </h3>
            <p className="text-xs text-slate-300">
              相棒「{comp.name}」と一緒に歩んできた冒険と成長の軌跡カード
            </p>
          </div>
        </div>

        {/* Companion Overview Box */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4">
          <BuddyCharacter
            player={player}
            companion={comp}
            stage={comp.stage}
            expression="happy"
            size="md"
            animationEnabled={true}
          />
          <div className="space-y-1 text-xs">
            <div className="font-black text-base text-amber-200">
              {comp.name} <span className="text-xs text-emerald-400">Lv.{comp.level}</span>
            </div>
            <div className="text-slate-300">
              成長段階: <span className="font-bold text-amber-300">{comp.stage === 'egg' ? 'タマゴ' : comp.stage === 'hatched' ? '誕生（幼体直前）' : '幼体'}</span>
            </div>
            <div className="text-slate-400">
              タマゴ授与日: {new Date(comp.obtainedAt).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>

        {/* Memorial Photo-Style Game Cards Grid */}
        <div className="space-y-3">
          <div className="text-xs font-black text-amber-300 flex items-center gap-1.5 font-cinzel">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>獲得記念カードアルバム</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/90 p-4 rounded-2xl border-2 border-amber-500/40 relative overflow-hidden space-y-2 hover:border-amber-300 transition-all shadow-md"
              >
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-full">
                    {log.cardBadge || '記念カード'}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {log.date}
                  </span>
                </div>

                {/* Main Card Graphic / Content */}
                <div className="flex items-start gap-3 pt-1">
                  <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                    {log.icon}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-amber-200">{log.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {log.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-gold w-full py-3 rounded-xl text-xs font-extrabold cursor-pointer"
        >
          閉じる
        </button>
      </motion.div>
    </div>
  );
};
