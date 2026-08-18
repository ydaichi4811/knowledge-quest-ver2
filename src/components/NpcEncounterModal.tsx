import React from 'react';
import { motion } from 'framer-motion';
import { NpcCompanionInfo } from '../services/encyclopediaService';
import { COMPANION_ATTRIBUTES, COMPANION_RARITIES } from '../data/companionParts';
import { Sparkles, BookOpen, X } from 'lucide-react';

interface NpcEncounterModalProps {
  npc: NpcCompanionInfo;
  isNewDiscovery: boolean;
  onOpenZukan: () => void;
  onClose: () => void;
}

export const NpcEncounterModal: React.FC<NpcEncounterModalProps> = ({
  npc,
  isNewDiscovery,
  onOpenZukan,
  onClose,
}) => {
  const attrMeta = COMPANION_ATTRIBUTES[npc.attribute];
  const rarityMeta = COMPANION_RARITIES[npc.rarity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-5 text-center overflow-hidden"
      >
        {/* Background Sparkle Effects */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-xs font-black text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{isNewDiscovery ? '新しい相棒との出会い！' : '野生の相棒がやってきた！'}</span>
        </div>

        {/* NPC Avatar Card */}
        <div className="p-5 bg-slate-950/80 border border-amber-500/30 rounded-2xl space-y-3 relative">
          <div className="text-6xl animate-bounce drop-shadow-lg">{npc.avatarIcon}</div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-black"
                style={{ backgroundColor: `${attrMeta?.color}33`, color: attrMeta?.color, borderColor: attrMeta?.color }}
              >
                {attrMeta?.icon} {attrMeta?.name || npc.attribute}属性
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${rarityMeta?.badgeStyle}`}>
                レア度: {npc.rarity}
              </span>
            </div>
            <h3 className="text-2xl font-black text-amber-200 pt-1.5">{npc.name}</h3>
            <p className="text-xs text-amber-400 font-bold">{npc.title}</p>
          </div>

          {/* Dialogue Speech Bubble */}
          <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-100 font-medium leading-relaxed italic relative">
            「{npc.dialogue}」
          </div>
        </div>

        {/* Discovery Notification */}
        {isNewDiscovery && (
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>【{npc.name}】を相棒図鑑に新しく登録しました！</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            閉じる
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenZukan();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2 border border-amber-200"
          >
            <BookOpen className="w-4 h-4" />
            <span>相棒図鑑を確認する</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
