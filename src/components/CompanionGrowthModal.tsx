import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerData } from '../types';
import { BuddyCharacter } from './BuddyCharacter';
import { evolveCompanionToChild } from '../services/companionService';
import { savePlayerData } from '../services/gameStorage';
import { Sparkles, Crown, Check } from 'lucide-react';

interface CompanionGrowthModalProps {
  player: PlayerData;
  onClose: () => void;
  onPlayerUpdate: (updatedPlayer: PlayerData) => void;
}

export const CompanionGrowthModal: React.FC<CompanionGrowthModalProps> = ({
  player,
  onClose,
  onPlayerUpdate,
}) => {
  const comp = player.companion!;

  const handleEvolve = () => {
    const updated = evolveCompanionToChild(player);
    savePlayerData(updated);
    onPlayerUpdate(updated);

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md game-card p-6 sm:p-8 relative border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)] text-center space-y-6 my-auto"
      >
        <div className="space-y-2">
          <span className="text-xs font-black text-emerald-300 uppercase tracking-widest font-cinzel bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center justify-center gap-1.5 w-fit mx-auto">
            <Crown className="w-4 h-4 text-amber-300" />
            <span>GROWTH EVOLUTION ～幼体へ～</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-amber-200">
            相棒が成長しました！
          </h2>
        </div>

        <div className="py-4 flex justify-center">
          <BuddyCharacter
            player={player}
            stage="child"
            expression="levelup"
            size="xl"
            animationEnabled={true}
          />
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/40 space-y-3 text-xs text-slate-200">
          <p className="font-extrabold text-amber-300 text-sm">
            「たくさんの知識と挑戦によって、相棒が成長しました！」
          </p>
          <p className="text-slate-300">
            「{comp.name}」は、あなたの勇気ある学習の努力に応えて、小さな翼と冠を授かりたくましくなりました！
          </p>
        </div>

        <button
          onClick={handleEvolve}
          className="btn-royal-emerald w-full py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>「{comp.name}」の新しい姿を受け入れる！</span>
        </button>
      </motion.div>
    </div>
  );
};
