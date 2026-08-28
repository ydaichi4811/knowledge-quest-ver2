import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData } from '../types';
import {
  COMPANION_SPECIES,
  COMPANION_ATTRIBUTES,
  COMPANION_RARITIES,
  COMPANION_EVOLUTION_TYPES,
} from '../data/companionParts';
import { BuddyCharacter } from './BuddyCharacter';
import { getDiscoveredNpcCompanions } from '../services/encyclopediaService';
import { BookOpen, Sparkles, X, Shield, Lock, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface CompanionZukanViewProps {
  player: PlayerData;
  onClose: () => void;
}

export const CompanionZukanView: React.FC<CompanionZukanViewProps> = ({
  player,
  onClose,
}) => {
  const comp = player.companion!;
  const [activeTab, setActiveTab] = useState<'species' | 'attributes' | 'rarities' | 'evolution'>('species');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(comp.speciesId || 'mokoru');

  const encyclopedia = player.companionEncyclopedia;
  const discoveredSpecies = new Set([
    ...(comp.zukanDiscoveredSpecies || []),
    ...(encyclopedia?.discoveredSpecies || []),
    comp.speciesId,
  ]);
  const discoveredAttributes = new Set([
    ...(comp.zukanDiscoveredAttributes || []),
    ...(encyclopedia?.discoveredAttributes || []),
    comp.attribute,
  ]);
  const discoveredRarities = new Set([
    ...(encyclopedia?.discoveredRarities || []),
    comp.currentRarity || 'N',
  ]);
  const discoveredNpcs = getDiscoveredNpcCompanions(player);
  const currentRarity = comp.currentRarity || 'N';

  const speciesList = Object.values(COMPANION_SPECIES);
  const attributeList = Object.values(COMPANION_ATTRIBUTES);
  const rarityList = Object.values(COMPANION_RARITIES);
  const evolutionList = Object.values(COMPANION_EVOLUTION_TYPES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4 pr-10">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-200 flex items-center gap-2">
              マスリア王国・知識の相棒図鑑
            </h2>
            <p className="text-xs text-emerald-400 font-semibold">
              発見・育成した相棒の種族、属性、成長形態をコレクション！
            </p>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-4 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-bold">発見種族</div>
            <div className="text-sm font-black text-emerald-300">
              {discoveredSpecies.size} / {speciesList.length} 種
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold">発見属性</div>
            <div className="text-sm font-black text-amber-300">
              {discoveredAttributes.size} / {attributeList.length} 種
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold">到達レア度</div>
            <div className="text-sm font-black text-rose-300">
              {currentRarity} ランク（発見 {discoveredRarities.size}）
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center border-b border-slate-800 gap-1 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setActiveTab('species');
              setSelectedItemId('mokoru');
            }}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'species'
                ? 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            種族図鑑 (5種)
          </button>
          <button
            onClick={() => {
              setActiveTab('attributes');
              setSelectedItemId('forest');
            }}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'attributes'
                ? 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            属性図鑑 (6種)
          </button>
          <button
            onClick={() => {
              setActiveTab('rarities');
              setSelectedItemId('N');
            }}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rarities'
                ? 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            レア度形態 (5ランク)
          </button>
          <button
            onClick={() => {
              setActiveTab('evolution');
              setSelectedItemId('hirameki');
            }}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'evolution'
                ? 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            進化傾向 (5傾向)
          </button>
        </div>

        {/* Main Grid View */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <section className="rounded-2xl border border-sky-400/30 bg-sky-950/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-sky-200">🤝 出会った相棒</h3>
                <p className="mt-1 text-[10px] font-semibold text-slate-400">
                  冒険で出会った相棒は図鑑に保存されます。現在育てている相棒とは別のコレクションです。
                </p>
              </div>
              <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-black text-sky-200">
                {discoveredNpcs.length} / {5} 人
              </span>
            </div>
            {discoveredNpcs.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {discoveredNpcs.map((npc) => (
                  <article key={npc.npcId} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl" aria-hidden="true">{npc.avatarIcon}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-black text-amber-100">{npc.name}</h4>
                          <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-black text-rose-200">
                            {npc.rarity}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-sky-300">{npc.title}</p>
                        <p className="mt-1 text-[10px] text-slate-400">出会った場所：{npc.encounterLocation}</p>
                        <p className="mt-1 text-[10px] leading-relaxed text-slate-300">「{npc.dialogue}」</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl bg-slate-950/50 p-3 text-center text-xs font-bold text-slate-400">
                クエストをクリアすると、新しい相棒に出会えることがあります。
              </p>
            )}
          </section>

          {/* TAB 1: SPECIES ZUKAN */}
          {activeTab === 'species' && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {speciesList.map((sp) => {
                const isDiscovered = discoveredSpecies.has(sp.id as any) || sp.id === comp.speciesId;
                const isSelected = selectedItemId === sp.id;

                return (
                  <motion.div
                    key={sp.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedItemId(sp.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : isDiscovered
                        ? 'bg-slate-950/80 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="w-16 h-16 my-1 relative flex items-center justify-center">
                      {isDiscovered ? (
                        <BuddyCharacter
                          speciesId={sp.id as any}
                          stage="child"
                          size="sm"
                          showSparkles={false}
                          animationEnabled={isSelected}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                          <Lock className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="font-black text-xs text-slate-100 mt-1">
                      {isDiscovered ? sp.name : '？？？？'}
                    </div>
                    <div className="text-[10px] text-amber-300 font-bold mt-0.5">
                      {isDiscovered ? sp.kanji : '未発見'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* TAB 2: ATTRIBUTE ZUKAN */}
          {activeTab === 'attributes' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {attributeList.map((attr) => {
                const isDiscovered = discoveredAttributes.has(attr.id as any) || attr.id === comp.attribute;
                const isSelected = selectedItemId === attr.id;

                return (
                  <motion.div
                    key={attr.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedItemId(attr.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 shadow-md'
                        : isDiscovered
                        ? 'bg-slate-950/80 border-slate-700'
                        : 'bg-slate-950/30 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="text-3xl p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {isDiscovered ? attr.icon : '❓'}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-100">
                        {isDiscovered ? attr.name : '？？？？属性'}
                      </div>
                      <div className="text-xs text-amber-300 font-bold mt-0.5">
                        {isDiscovered ? attr.kanji : '未解放'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* TAB 3: RARITIES ZUKAN */}
          {activeTab === 'rarities' && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {rarityList.map((r) => {
                const isReached = r.id === currentRarity || (r.id === 'N' && comp.currentRarity);
                const isSelected = selectedItemId === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedItemId(r.id)}
                    className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 shadow-md'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border inline-block mb-1 ${r.badgeColor}`}>
                      {r.label}
                    </span>
                    <div className="font-bold text-xs text-slate-200 mt-1">{r.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">出現率: {r.dropRatePercent}%</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: EVOLUTION TYPES ZUKAN */}
          {activeTab === 'evolution' && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {evolutionList.map((evo) => {
                const isCurrent = evo.id === (comp.evolutionType || 'hirameki');
                const isSelected = selectedItemId === evo.id;

                return (
                  <div
                    key={evo.id}
                    onClick={() => setSelectedItemId(evo.id)}
                    className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 shadow-md'
                        : isCurrent
                        ? 'bg-emerald-500/20 border-emerald-400'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="text-2xl mb-1">{evo.icon}</div>
                    <div className="font-bold text-xs text-slate-100">{evo.name}</div>
                    <div className="text-[10px] text-amber-300 font-bold mt-0.5">{evo.kanji}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DETAIL DESCRIPTION CARD AT BOTTOM */}
          {selectedItemId && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 space-y-2 mt-4 text-left">
              {activeTab === 'species' && (() => {
                const sp = COMPANION_SPECIES[selectedItemId as keyof typeof COMPANION_SPECIES];
                if (!sp) return null;
                const isDiscovered = discoveredSpecies.has(sp.id as any) || sp.id === comp.speciesId;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-amber-200">{sp.name} ({sp.kanji})</span>
                      <span className="text-xs text-emerald-400 font-bold">{isDiscovered ? '発見済み' : '未発見'}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{sp.description}</p>
                    <div className="text-[11px] text-amber-300 font-semibold mt-2">
                      卵の名称: {sp.eggName} ｜ 代表的な特徴: {sp.features.join('・')}
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'attributes' && (() => {
                const attr = COMPANION_ATTRIBUTES[selectedItemId as keyof typeof COMPANION_ATTRIBUTES];
                if (!attr) return null;
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{attr.icon}</span>
                      <span className="font-black text-sm text-amber-200">{attr.name}属性 ({attr.kanji})</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{attr.description}</p>
                  </div>
                );
              })()}

              {activeTab === 'rarities' && (() => {
                const r = COMPANION_RARITIES[selectedItemId as keyof typeof COMPANION_RARITIES];
                if (!r) return null;
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-black border ${r.badgeColor}`}>{r.label}</span>
                      <span className="font-black text-sm text-amber-200">{r.name}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
                  </div>
                );
              })()}

              {activeTab === 'evolution' && (() => {
                const evo = COMPANION_EVOLUTION_TYPES[selectedItemId as keyof typeof COMPANION_EVOLUTION_TYPES];
                if (!evo) return null;
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{evo.icon}</span>
                      <span className="font-black text-sm text-amber-200">{evo.name}傾向 ({evo.kanji})</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{evo.description}</p>
                    <div className="text-[11px] text-emerald-300 font-semibold mt-1">高まる要因: {evo.triggerAction}</div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Modal Bottom Action */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </div>
  );
};
