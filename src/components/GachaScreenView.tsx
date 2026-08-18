import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerData } from '../types';
import { savePlayerData, addExpAndPoints } from '../services/gameStorage';
import { Sparkles, Gift, Zap, Shield, Wand2, Crown, Package } from 'lucide-react';

interface GachaScreenViewProps {
  player: PlayerData;
  onPlayerUpdate: (updated: PlayerData) => void;
}

export type OfficialGachaRarity = 'ノーマル' | 'レア' | 'スーパーレア' | 'ウルトラレア' | 'レジェンド';

export interface GachaItemDef {
  title: string;
  icon: string;
  rarity: OfficialGachaRarity;
  stars: number;
  type: 'item' | 'equipment';
  exp: number;
  pts: number;
  desc: string;
  chestIcon: string;
  colorClass: string;
  badgeBg: string;
}

export const OFFICIAL_GACHA_ITEMS: GachaItemDef[] = [
  // レジェンド (★5)
  { title: '覚醒の宝石', icon: '💎✨', rarity: 'レジェンド', stars: 5, type: 'item', exp: 150, pts: 200, desc: '相棒の潜在能力を最大覚醒させる超貴重な秘宝！', chestIcon: '🐲', colorClass: 'border-amber-400 bg-amber-500/20 text-amber-200', badgeBg: 'bg-amber-400 text-slate-950' },
  { title: 'ゴールドソード', icon: '⚔️✨', rarity: 'レジェンド', stars: 5, type: 'equipment', exp: 120, pts: 150, desc: '眩く輝く黄金の聖剣。攻撃力と全ステータス大上昇！', chestIcon: '🐲', colorClass: 'border-amber-400 bg-amber-500/20 text-amber-200', badgeBg: 'bg-amber-400 text-slate-950' },

  // ウルトラレア (★4)
  { title: '進化のたまご', icon: '🥚✨', rarity: 'ウルトラレア', stars: 4, type: 'item', exp: 100, pts: 100, desc: '相棒のたまごっち進化を促す神秘の生命たまご！', chestIcon: '🟥', colorClass: 'border-rose-400 bg-rose-500/20 text-rose-200', badgeBg: 'bg-rose-500 text-white' },
  { title: '勇者の盾', icon: '🛡️', rarity: 'ウルトラレア', stars: 4, type: 'equipment', exp: 80, pts: 80, desc: 'どんな暗算モンスターの攻撃も防ぐ伝説の盾！', chestIcon: '🟥', colorClass: 'border-rose-400 bg-rose-500/20 text-rose-200', badgeBg: 'bg-rose-500 text-white' },
  { title: '魔法の杖', icon: '🪄', rarity: 'ウルトラレア', stars: 4, type: 'equipment', exp: 80, pts: 80, desc: '魔法学校特製の幾何学魔導杖。属性ダメージ増加！', chestIcon: '🟥', colorClass: 'border-rose-400 bg-rose-500/20 text-rose-200', badgeBg: 'bg-rose-500 text-white' },

  // スーパーレア (★3)
  { title: '家具チケット', icon: '🎟️', rarity: 'スーパーレア', stars: 3, type: 'item', exp: 50, pts: 60, desc: 'マイホームのおしゃれ家具を1個交換できるチケット！', chestIcon: '🟪', colorClass: 'border-purple-400 bg-purple-500/20 text-purple-200', badgeBg: 'bg-purple-600 text-white' },
  { title: '知識領の本', icon: '📘', rarity: 'スーパーレア', stars: 3, type: 'item', exp: 60, pts: 50, desc: '古代マスリア王国の算数知識が詰まった必勝書！', chestIcon: '🟪', colorClass: 'border-purple-400 bg-purple-500/20 text-purple-200', badgeBg: 'bg-purple-600 text-white' },
  { title: 'シルバーソード', icon: '🗡️✨', rarity: 'スーパーレア', stars: 3, type: 'equipment', exp: 50, pts: 50, desc: '鋭い銀光を放つ長剣。速算力を高める！', chestIcon: '🟪', colorClass: 'border-purple-400 bg-purple-500/20 text-purple-200', badgeBg: 'bg-purple-600 text-white' },

  // レア (★2)
  { title: '体力ポーション', icon: '🧪', rarity: 'レア', stars: 2, type: 'item', exp: 30, pts: 30, desc: '体力とやる気を一瞬でフル回復させる栄養ドリンク！', chestIcon: '🟦', colorClass: 'border-cyan-400 bg-cyan-500/20 text-cyan-200', badgeBg: 'bg-cyan-600 text-white' },
  { title: 'アイアンソード', icon: '⚔️', rarity: 'レア', stars: 2, type: 'equipment', exp: 30, pts: 30, desc: '頑丈な鉄の剣。冒険の頼もしい相棒！', chestIcon: '🟦', colorClass: 'border-cyan-400 bg-cyan-500/20 text-cyan-200', badgeBg: 'bg-cyan-600 text-white' },
  { title: '学者の帽子', icon: '🎓', rarity: 'レア', stars: 2, type: 'equipment', exp: 30, pts: 30, desc: '思考力を高める魔法アカデミーの正装ハット！', chestIcon: '🟦', colorClass: 'border-cyan-400 bg-cyan-500/20 text-cyan-200', badgeBg: 'bg-cyan-600 text-white' },

  // ノーマル (★1)
  { title: 'ゴールドコイン', icon: '🪙', rarity: 'ノーマル', stars: 1, type: 'item', exp: 15, pts: 20, desc: 'マスリア王国で流通しているピカピカの金貨！', chestIcon: '📦', colorClass: 'border-slate-500 bg-slate-800/40 text-slate-300', badgeBg: 'bg-slate-700 text-white' },
  { title: 'ブロンズソード', icon: '🗡️', rarity: 'ノーマル', stars: 1, type: 'equipment', exp: 15, pts: 15, desc: '駆け出し冒険者用のブロンズ製ショートソード。', chestIcon: '📦', colorClass: 'border-slate-500 bg-slate-800/40 text-slate-300', badgeBg: 'bg-slate-700 text-white' },
  { title: '冒険者のマント', icon: '🧥', rarity: 'ノーマル', stars: 1, type: 'equipment', exp: 15, pts: 15, desc: '風を防ぐ丈夫な旅用マント。', chestIcon: '📦', colorClass: 'border-slate-500 bg-slate-800/40 text-slate-300', badgeBg: 'bg-slate-700 text-white' },
];

export const GachaScreenView: React.FC<GachaScreenViewProps> = ({
  player,
  onPlayerUpdate,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [chestStage, setChestStage] = useState<'idle' | 'opening' | 'opened'>('idle');
  const [gachaResult, setGachaResult] = useState<GachaItemDef | null>(null);

  const handlePullGacha = (cost: number) => {
    if (player.points < cost) {
      alert('KQポイントが足りません！算数クイズを解いて貯めよう。');
      return;
    }

    setIsSpinning(true);
    setChestStage('opening');
    setGachaResult(null);

    // Pick random result weighted slightly by rarity
    setTimeout(() => {
      const rand = Math.random();
      let selected: GachaItemDef;
      if (rand < 0.08) {
        // Legend ★5 (8%)
        const legendItems = OFFICIAL_GACHA_ITEMS.filter((i) => i.rarity === 'レジェンド');
        selected = legendItems[Math.floor(Math.random() * legendItems.length)];
      } else if (rand < 0.25) {
        // Ultra Rare ★4 (17%)
        const urItems = OFFICIAL_GACHA_ITEMS.filter((i) => i.rarity === 'ウルトラレア');
        selected = urItems[Math.floor(Math.random() * urItems.length)];
      } else if (rand < 0.50) {
        // Super Rare ★3 (25%)
        const srItems = OFFICIAL_GACHA_ITEMS.filter((i) => i.rarity === 'スーパーレア');
        selected = srItems[Math.floor(Math.random() * srItems.length)];
      } else if (rand < 0.75) {
        // Rare ★2 (25%)
        const rareItems = OFFICIAL_GACHA_ITEMS.filter((i) => i.rarity === 'レア');
        selected = rareItems[Math.floor(Math.random() * rareItems.length)];
      } else {
        // Normal ★1 (25%)
        const normalItems = OFFICIAL_GACHA_ITEMS.filter((i) => i.rarity === 'ノーマル');
        selected = normalItems[Math.floor(Math.random() * normalItems.length)];
      }

      setGachaResult(selected);
      setChestStage('opened');

      const { updatedPlayer } = addExpAndPoints(
        { ...player, points: player.points - cost },
        selected.exp,
        selected.pts
      );

      onPlayerUpdate(updatedPlayer);
      setIsSpinning(false);

      confetti({
        particleCount: selected.stars >= 4 ? 140 : 60,
        spread: 90,
        origin: { y: 0.5 },
      });
    }, 1400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 my-auto relative z-10 text-slate-100">
      <div className="royal-panel p-6 space-y-6 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-amber-400" />
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
              マスリア王国の宝箱ガチャ
            </h2>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-full border border-amber-500/40 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>所持: {player.points} KQ pt</span>
          </div>
        </div>

        {/* Rarities Showcase Bar */}
        <div className="bg-slate-950/90 p-3 rounded-xl border border-amber-500/30">
          <div className="text-[11px] font-bold text-amber-300 mb-2">✨ 登場レアリティ一覧</div>
          <div className="grid grid-cols-5 gap-1 text-[10px] font-bold">
            <div className="p-1.5 rounded-lg border border-slate-600 bg-slate-800/80 text-slate-300">
              <div>📦 ノーマル</div>
              <div className="text-amber-400">★</div>
            </div>
            <div className="p-1.5 rounded-lg border border-cyan-500/60 bg-cyan-950/60 text-cyan-200">
              <div>🟦 レア</div>
              <div className="text-amber-400">★★</div>
            </div>
            <div className="p-1.5 rounded-lg border border-purple-500/60 bg-purple-950/60 text-purple-200">
              <div>🟪 Sレア</div>
              <div className="text-amber-400">★★★</div>
            </div>
            <div className="p-1.5 rounded-lg border border-rose-500/60 bg-rose-950/60 text-rose-200">
              <div>🟥 Uレア</div>
              <div className="text-amber-400">★★★★</div>
            </div>
            <div className="p-1.5 rounded-lg border border-amber-400 bg-amber-500/20 text-amber-200 animate-pulse">
              <div>🐲 レジェンド</div>
              <div className="text-amber-400">★★★★★</div>
            </div>
          </div>
        </div>

        {/* Main Chest Stage Graphic */}
        <div className="bg-slate-950/90 p-6 rounded-2xl border border-amber-500/40 max-w-md mx-auto space-y-4 relative overflow-hidden shadow-2xl">
          {/* Animated Chest */}
          <div className="relative h-32 flex items-center justify-center">
            {isSpinning ? (
              <motion.div
                animate={{ rotate: [-8, 8, -8], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="text-8xl drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]"
              >
                🧰✨
              </motion.div>
            ) : gachaResult ? (
              <motion.div
                initial={{ scale: 0.5, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-8xl drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]"
              >
                {gachaResult.chestIcon}
              </motion.div>
            ) : (
              <div className="text-8xl animate-float drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                🎁
              </div>
            )}
          </div>

          <p className="text-xs text-slate-300">
            算数クイズで集めたKQポイントで宝箱を開けよう！最新装備やレア成長アイテムをゲット！
          </p>

          {/* Result Card */}
          {gachaResult && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`p-4 border-2 rounded-xl space-y-2 ${gachaResult.colorClass}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow ${gachaResult.badgeBg}`}>
                  {gachaResult.rarity}
                </span>
                <span className="text-amber-300 text-sm">{'★'.repeat(gachaResult.stars)}</span>
              </div>
              <div className="text-5xl">{gachaResult.icon}</div>
              <div className="font-black text-base text-amber-100">{gachaResult.title}</div>
              <p className="text-xs font-bold leading-relaxed">{gachaResult.desc}</p>
              <div className="text-[10px] text-emerald-300 font-bold pt-1">
                + {gachaResult.exp} EXP & + {gachaResult.pts} KQ pt 獲得！
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              disabled={isSpinning}
              onClick={() => handlePullGacha(30)}
              className="btn-royal-gold py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>1回引く (30pt)</span>
            </button>

            <button
              disabled={isSpinning}
              onClick={() => handlePullGacha(100)}
              className="btn-royal-blue py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>お得に引く (100pt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

