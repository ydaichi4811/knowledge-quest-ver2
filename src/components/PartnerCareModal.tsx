import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerData } from '../types';
import { PARTNERS_EVOLUTION_DATA, OFFICIAL_PET_STAGES, PET_BRANCH_ROUTES } from '../data/partners';
import { addExpAndPoints, savePlayerData } from '../services/gameStorage';
import { Heart, Utensils, Sparkles, X, Smile, Sun, Bed, Gamepad2, Hand } from 'lucide-react';

interface PartnerCareModalProps {
  player: PlayerData;
  onClose: () => void;
  onPlayerUpdate: (updatedPlayer: PlayerData) => void;
}

export const PartnerCareModal: React.FC<PartnerCareModalProps> = ({
  player,
  onClose,
  onPlayerUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'care' | 'evolution'>('care');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const partnerInfo = PARTNERS_EVOLUTION_DATA.find(
    (p) => p.type === player.partner.type
  );
  const currentStageInfo = partnerInfo?.stages[player.partner.stage - 1];

  // Official 5 Care Actions handler
  const handleCareAction = (
    actionName: string,
    cost: number,
    satietyGain: number,
    happyGain: number,
    expGain: number = 0
  ) => {
    if (player.points < cost) {
      setFeedbackMsg('KQポイントが足りません！算数クイズでポイントを貯めよう。');
      return;
    }

    const newPoints = player.points - cost;
    const newSatiety = Math.min(100, player.partner.satiety + satietyGain);
    const newHappy = Math.min(100, player.partner.happiness + happyGain);

    let updated: PlayerData = {
      ...player,
      points: newPoints,
      partner: {
        ...player.partner,
        satiety: newSatiety,
        happiness: newHappy,
      },
    };

    if (expGain > 0) {
      const res = addExpAndPoints(updated, expGain, 0);
      updated = res.updatedPlayer;
    }

    savePlayerData(updated);
    onPlayerUpdate(updated);

    setFeedbackMsg(`${actionName}を行いました！ 満腹度 +${satietyGain} / なつき度 +${happyGain}${expGain ? ` / EXP +${expGain}` : ''}`);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl game-card p-5 sm:p-7 relative border-2 border-emerald-400/80 shadow-2xl my-auto text-slate-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 border-b border-emerald-500/30 pb-3">
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
          <h3 className="text-lg font-bold text-emerald-300 font-cinzel">
            ペットお世話（たまごっち風育成）：{player.partner.name}
          </h3>
        </div>

        {/* Pet Stage & Affection Display */}
        <div className="my-4 p-4 bg-slate-950/90 rounded-2xl border border-emerald-500/40 text-center space-y-3 relative overflow-hidden">
          <div className="text-7xl animate-float inline-block drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            {currentStageInfo?.icon || '🐉'}
          </div>

          <div className="font-extrabold text-base text-amber-200">
            {player.partner.name} <span className="text-xs text-emerald-400">(Lv.{player.partner.level})</span>
          </div>

          {/* Affection Gauge (なつき度) Hearts Bar */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-rose-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold px-1">
              <span className="text-rose-300 flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                なつき度UP!
              </span>
              <span className="text-rose-300">{player.partner.happiness} / 100</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-rose-500/30 p-0.5 flex items-center">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, player.partner.happiness)}%` }}
              />
            </div>
            {/* Heart Icons */}
            <div className="flex justify-center gap-1 text-rose-400 pt-0.5 text-sm">
              {'❤️'.repeat(Math.min(5, Math.ceil(player.partner.happiness / 20)))}
            </div>
          </div>

          {/* Stats Summary Bar */}
          <div className="flex justify-around text-xs font-bold text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>満腹度: {player.partner.satiety}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>所持: {player.points} KQ pt</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="p-2.5 bg-emerald-950/90 border border-emerald-400 text-emerald-200 rounded-xl text-xs font-bold text-center animate-fadeIn">
            ✨ {feedbackMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 gap-2 mt-3">
          <button
            onClick={() => {
              setActiveTab('care');
              setFeedbackMsg('');
            }}
            className={`px-4 py-2 font-bold text-xs rounded-t-lg transition-all cursor-pointer ${
              activeTab === 'care'
                ? 'bg-emerald-600 text-white border-t border-x border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🐾 5大お世話機能
          </button>
          <button
            onClick={() => {
              setActiveTab('evolution');
              setFeedbackMsg('');
            }}
            className={`px-4 py-2 font-bold text-xs rounded-t-lg transition-all cursor-pointer ${
              activeTab === 'evolution'
                ? 'bg-emerald-600 text-white border-t border-x border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🐲 たまごっち進化・分岐ルート
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-3 bg-slate-900/90 rounded-b-xl border border-slate-800">
          {activeTab === 'care' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. ごはん */}
              <div
                onClick={() => handleCareAction('ごはん（特製フード）', 10, 30, 15, 10)}
                className="p-3 rounded-xl bg-slate-800/90 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <div className="font-bold text-xs text-amber-200">ごはん</div>
                    <div className="text-[10px] text-slate-300">満腹度 +30 / なつき度 +15</div>
                  </div>
                </div>
                <div className="btn-emerald px-2.5 py-1 rounded-lg text-xs font-bold">10 pt</div>
              </div>

              {/* 2. なでる */}
              <div
                onClick={() => handleCareAction('なでる（スキンシップ）', 5, 10, 25, 5)}
                className="p-3 rounded-xl bg-slate-800/90 border border-rose-500/40 hover:border-rose-400 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💖</span>
                  <div>
                    <div className="font-bold text-xs text-rose-300">なでる</div>
                    <div className="text-[10px] text-slate-300">なつき度 +25 大幅アップ!</div>
                  </div>
                </div>
                <div className="btn-emerald px-2.5 py-1 rounded-lg text-xs font-bold">5 pt</div>
              </div>

              {/* 3. あそぶ */}
              <div
                onClick={() => handleCareAction('あそぶ（ボール遊び）', 15, 10, 20, 25)}
                className="p-3 rounded-xl bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⚽</span>
                  <div>
                    <div className="font-bold text-xs text-cyan-300">あそぶ</div>
                    <div className="text-[10px] text-slate-300">EXP +25 / なつき度 +20</div>
                  </div>
                </div>
                <div className="btn-emerald px-2.5 py-1 rounded-lg text-xs font-bold">15 pt</div>
              </div>

              {/* 4. そうじ */}
              <div
                onClick={() => handleCareAction('おそうじ（ピカピカ）', 10, 5, 20, 15)}
                className="p-3 rounded-xl bg-slate-800/90 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🧹</span>
                  <div>
                    <div className="font-bold text-xs text-emerald-300">おそうじ</div>
                    <div className="text-[10px] text-slate-300">部屋を清潔にして快適化</div>
                  </div>
                </div>
                <div className="btn-emerald px-2.5 py-1 rounded-lg text-xs font-bold">10 pt</div>
              </div>

              {/* 5. ねかせる */}
              <div
                onClick={() => handleCareAction('ねかせる（すやすや）', 10, 20, 25, 15)}
                className="p-3 rounded-xl bg-slate-800/90 border border-indigo-500/40 hover:border-indigo-400 sm:col-span-2 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🛏️</span>
                  <div>
                    <div className="font-bold text-xs text-indigo-300">ねかせる</div>
                    <div className="text-[10px] text-slate-300">体力を満タンに回復してすやすや睡眠！</div>
                  </div>
                </div>
                <div className="btn-emerald px-2.5 py-1 rounded-lg text-xs font-bold">10 pt</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Evolution Flow Line */}
              <div>
                <div className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                  <span>🥚 たまごっち風・進化ステータス</span>
                </div>
                <div className="grid grid-cols-5 gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-700 text-center">
                  {OFFICIAL_PET_STAGES.map((st) => (
                    <div
                      key={st.stageId}
                      className={`p-1.5 rounded-lg border ${
                        st.stageId <= player.partner.stage
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-slate-800 bg-slate-900/50 text-slate-500'
                      }`}
                    >
                      <div className="text-2xl">{st.icon}</div>
                      <div className="text-[10px] font-bold mt-1">{st.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch Evolutions Grid */}
              <div>
                <div className="font-bold text-amber-300 mb-2">
                  ✨ お世話や関わり方で進化が分岐！
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PET_BRANCH_ROUTES.map((rt) => (
                    <div
                      key={rt.routeId}
                      className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-700 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 font-extrabold text-amber-200">
                        <span className="text-lg">{rt.icon}</span>
                        <span>{rt.name}</span>
                      </div>
                      <div className="text-[10px] text-emerald-300 font-bold">{rt.dragonTitle}</div>
                      <p className="text-[9px] text-slate-400 leading-tight">{rt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

