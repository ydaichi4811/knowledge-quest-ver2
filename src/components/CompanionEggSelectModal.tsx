import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BuddyCharacter } from './BuddyCharacter';
import { COMPANION_SPECIES } from '../data/companionParts';
import { Sparkles, Check, ChevronRight } from 'lucide-react';

interface CompanionEggSelectModalProps {
  onSelectEgg: (eggType: string) => void;
  title?: string;
  subtitle?: string;
}

const EGG_OPTIONS = [
  {
    type: 'egg_fluffy',
    speciesId: 'mokoru',
    name: 'ふわふわのタマゴ',
    desc: '綿毛のように柔らかい手触り。温かい愛嬌のある相棒が生まれそう。',
    icon: '☁️',
    bgGradient: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40',
  },
  {
    type: 'egg_leaf',
    speciesId: 'rifin',
    name: '葉っぱのタマゴ',
    desc: '若葉の香りがする生き生きとしたタマゴ。自然を愛する優しい相棒。',
    icon: '🌱',
    bgGradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
  },
  {
    type: 'egg_light',
    speciesId: 'lumia',
    name: 'ひかりのタマゴ',
    desc: '知識に反応してほんのり明かりを放つ。光あふれる探求心旺盛な相棒。',
    icon: '✨',
    bgGradient: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/40',
  },
  {
    type: 'egg_dragon',
    speciesId: 'kurudo',
    name: 'うろこのタマゴ',
    desc: '星の模様が入ったしっかりとした手触り。頼もしいドラゴン相棒。',
    icon: '🐲',
    bgGradient: 'from-rose-500/20 to-pink-500/10 border-rose-500/40',
  },
  {
    type: 'egg_drop',
    speciesId: 'poruka',
    name: 'しずくのタマゴ',
    desc: '透き通ったひんやり水滴のタマゴ。自由な発想を持つひらめき相棒。',
    icon: '💧',
    bgGradient: 'from-sky-500/20 to-blue-500/10 border-sky-500/40',
  },
];

export const CompanionEggSelectModal: React.FC<CompanionEggSelectModalProps> = ({
  onSelectEgg,
  title = 'あなたの冒険を支える「タマゴ」を選ぼう！',
  subtitle = 'タマゴの種類によって誕生する相棒の種族が決まります。属性や性格、模様は誕生時に明かされます！',
}) => {
  const [selectedType, setSelectedType] = useState<string>('egg_fluffy');

  const selectedEgg = EGG_OPTIONS.find((e) => e.type === selectedType) || EGG_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900/95 border-2 border-emerald-500/50 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl text-slate-100 space-y-5 flex flex-col max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            知識の相棒・タマゴ選択
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-amber-200">{title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">{subtitle}</p>
        </div>

        {/* 5 Egg Selector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {EGG_OPTIONS.map((egg) => {
            const isSelected = egg.type === selectedType;
            return (
              <motion.button
                key={egg.type}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedType(egg.type)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 rounded-full p-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="w-16 h-16 my-1">
                  <BuddyCharacter
                    speciesId={egg.speciesId as any}
                    stage="egg"
                    size="sm"
                    animationEnabled={isSelected}
                  />
                </div>

                <div className="font-extrabold text-xs text-slate-200 mt-1">{egg.name}</div>
                <div className="text-[10px] text-amber-300 font-bold">{egg.icon} {COMPANION_SPECIES[egg.speciesId as keyof typeof COMPANION_SPECIES]?.name}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Egg Description Box */}
        <div className={`p-4 rounded-xl border ${selectedEgg.bgGradient} space-y-2 text-left transition-all`}>
          <div className="flex items-center justify-between">
            <span className="font-black text-amber-200 text-sm flex items-center gap-2">
              <span className="text-lg">{selectedEgg.icon}</span>
              {selectedEgg.name}
            </span>
            <span className="text-xs text-emerald-300 font-bold bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              期待される種族: {COMPANION_SPECIES[selectedEgg.speciesId as keyof typeof COMPANION_SPECIES]?.name}
            </span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">{selectedEgg.desc}</p>
        </div>

        {/* Action Confirmation Button */}
        <button
          onClick={() => onSelectEgg(selectedType)}
          className="btn-royal-gold w-full py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-xl animate-gold-glow cursor-pointer mt-2"
        >
          <span>このタマゴと一緒に冒険をはじめる！</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
