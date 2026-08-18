import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerData } from '../types';
import { BuddyCharacter } from './BuddyCharacter';
import { setCompanionNameAndHatch } from '../services/companionService';
import { savePlayerData } from '../services/gameStorage';
import { Sparkles, Heart, Check, Edit3 } from 'lucide-react';

interface CompanionHatchingModalProps {
  player: PlayerData;
  onClose: () => void;
  onPlayerUpdate: (updatedPlayer: PlayerData) => void;
}

export const CompanionHatchingModal: React.FC<CompanionHatchingModalProps> = ({
  player,
  onClose,
  onPlayerUpdate,
}) => {
  const [step, setStep] = useState<'hatching' | 'naming'>('hatching');
  const [inputName, setInputName] = useState('ルミナ');

  const handleStartHatchAnimation = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
    });
    setStep('naming');
  };

  const handleConfirmName = () => {
    const cleaned = inputName.trim().substring(0, 8) || 'ルミナ';
    const updated = setCompanionNameAndHatch(player, cleaned);

    savePlayerData(updated);
    onPlayerUpdate(updated);

    confetti({
      particleCount: 100,
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
        className="w-full max-w-md game-card p-6 sm:p-8 relative border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] text-center space-y-6 my-auto"
      >
        {step === 'hatching' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest font-cinzel bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40">
                ✨ 誕生の時 ～HATCHING～
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                知識エネルギーが満ちました！
              </h2>
            </div>

            <div className="py-6 flex justify-center relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
              <BuddyCharacter
                player={player}
                stage="egg"
                expression="pre_evolution"
                size="xl"
                animationEnabled={true}
              />
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/40 space-y-2 text-xs text-slate-200">
              <p className="font-bold text-amber-300">
                「知識のタマゴから、あたたかい光が溢れ出しています…！」
              </p>
              <p className="text-slate-300">
                あなたの学びと挑戦のエネルギーを受けて、タマゴが殻を破ろうとしています！
              </p>
            </div>

            <button
              onClick={handleStartHatchAnimation}
              className="btn-gold w-full py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer animate-bounce"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>タマゴを誕生させる！</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs font-black text-emerald-300 uppercase tracking-widest font-cinzel bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                🎉 BIRTH CELEBRATION
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-200">
                新しい相棒が誕生しました！
              </h2>
            </div>

            <div className="py-4 flex justify-center">
              <BuddyCharacter
                player={player}
                stage="hatched"
                expression="happy"
                size="xl"
                animationEnabled={true}
              />
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/40 space-y-3 text-xs text-slate-200">
              <p className="font-extrabold text-amber-300 text-sm">
                「知識のタマゴから、新しい相棒が生まれました！」
              </p>
              <p className="font-bold text-emerald-300">
                「これから一緒に、マスリア王国を冒険しよう！」
              </p>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>相棒の名前を決めてね（8文字以内）:</span>
              </label>
              <input
                type="text"
                maxLength={8}
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-slate-950 border-2 border-amber-500/60 rounded-xl px-4 py-3 text-sm font-bold text-amber-200 focus:outline-none focus:border-amber-400"
                placeholder="相棒の名前"
              />
            </div>

            <button
              onClick={handleConfirmName}
              className="btn-royal-emerald w-full py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <Check className="w-5 h-5 text-amber-300" />
              <span>「{inputName || 'ルミナ'}」と一緒に冒険へ出発！</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
