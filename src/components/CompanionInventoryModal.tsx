import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData, InventoryItem, QuestionProgressData } from '../types';
import { useInventoryItem, NURTURING_ITEMS } from '../services/itemAndRoomService';
import { savePlayerData } from '../services/gameStorage';
import { Package, Sparkles, X, Heart, Zap } from 'lucide-react';

interface CompanionInventoryModalProps {
  player: PlayerData;
  onUpdatePlayer: (updated: PlayerData) => void;
  onClose: () => void;
}

export const CompanionInventoryModal: React.FC<CompanionInventoryModalProps> = ({
  player,
  onUpdatePlayer,
  onClose,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isUsing, setIsUsing] = useState(false);
  const [feedbackDialogue, setFeedbackDialogue] = useState<string | null>(null);

  const inventory = player.inventory || {};
  const itemsList = Object.keys(NURTURING_ITEMS).map((itemId) => {
    const def = NURTURING_ITEMS[itemId];
    const quantity = inventory[itemId]?.quantity || 0;
    return {
      itemId,
      def,
      quantity,
    };
  });

  const comp = player.companion;
  const uniqueCleared = (Object.values(player.questionProgress || {}) as QuestionProgressData[])\n    .filter((progress) => progress.isFirstCleared).length;
  const reviewCount = (player.reviewedConcepts || []).length + (player.reviewSession?.isCompleted ? 1 : 0);
  const growthGoal = !comp
    ? '相棒を選ぶと育成目標が表示されます。'
    : comp.stage === 'egg'
      ? `誕生まで、あと ${Math.max(0, 50 - (comp.growthExp || 0))} 成長エネルギー`
      : comp.stage === 'hatched'
        ? `幼体へ：成長 ${Math.min(comp.growthExp || 0, 150)}/150・初クリア ${Math.min(uniqueCleared, 10)}/10・復習 ${Math.min(reviewCount, 1)}/1`
        : '次は問題の初クリアと復習を重ねて、相棒のレア度アップを目指そう！';

  const handleUseItem = (itemId: string) => {
    if (isUsing) return; // Anti-double click protection
    setIsUsing(true);

    const result = useInventoryItem(player, itemId);
    if (result.success) {
      savePlayerData(result.updatedPlayer);
      onUpdatePlayer(result.updatedPlayer);
      setFeedbackDialogue(result.dialogue);

      setTimeout(() => {
        setFeedbackDialogue(null);
        setIsUsing(false);
      }, 3000);
    } else {
      setIsUsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200">もちもの（育成アイテム）</h2>
              <p className="text-xs text-slate-400">
                学習報酬で獲得したアイテムを相棒に使ってお世話や育成ができます！
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Companion Feedback Dialogue Bubble */}
        <AnimatePresence>
          {feedbackDialogue && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-400 rounded-2xl flex items-center gap-3 text-amber-200 shadow-lg animate-pulse"
            >
              <div className="text-2xl">✨💬</div>
              <div className="text-xs font-bold leading-relaxed">{feedbackDialogue}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="rounded-2xl border border-emerald-400/40 bg-emerald-950/40 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black text-emerald-200">
            <span>🌱 今の育成ゴール</span>
            <span>成長 {comp?.growthExp || 0} ／ きずな {comp?.bond || 0}</span>
          </div>
          <p className="mt-2 text-xs font-bold leading-relaxed text-slate-200">{growthGoal}</p>
          <p className="mt-1 text-[10px] text-emerald-300">アイテムの効果を見て、育てたい力に合うものを選ぼう。</p>
        </section>

        {/* Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {itemsList.map(({ itemId, def, quantity }) => {
            const isSelectable = quantity > 0;

            return (
              <div
                key={itemId}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  isSelectable
                    ? 'bg-slate-800/80 border-slate-700 hover:border-amber-400/50 hover:bg-slate-800'
                    : 'bg-slate-900/50 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2 bg-slate-950/60 rounded-xl border border-slate-700/60 shadow-inner">
                      {def.icon || '📦'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-amber-100">{def.name}</h3>
                      <p className="text-[10px] text-amber-400 font-medium">
                        {def.effectLabel}
                      </p>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs font-black text-amber-300">
                    所持: {quantity}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {def.description}
                </p>

                <button
                  onClick={() => handleUseItem(itemId)}
                  disabled={!isSelectable || isUsing}
                  className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                    isSelectable && !isUsing
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-300'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUsing ? '使っています...' : '相棒に使う'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span>※問題の初クリアや復習、デイリーミッションでアイテムを無限獲得できます</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-all cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </div>
  );
};

