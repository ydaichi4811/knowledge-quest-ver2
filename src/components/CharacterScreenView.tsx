import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlayerData, HeroGender, HeroViewType, HeroOutfitRank } from '../types';
import { PARTNERS_EVOLUTION_DATA } from '../data/partners';
import { HeroCharacter } from './HeroCharacter';
import { KnowledgeCrest, CrestRank } from './KnowledgeCrest';
import { FuriganaText } from './FuriganaText';
import {
  Shield,
  Award,
  Heart,
  Sparkles,
  Play,
  Pause,
  User,
  Crown,
  BookOpen,
  Zap,
} from 'lucide-react';

interface CharacterScreenViewProps {
  player: PlayerData;
  onOpenPartnerCare: () => void;
  onPlayerUpdate?: (updatedPlayer: PlayerData) => void;
}

export const CharacterScreenView: React.FC<CharacterScreenViewProps> = ({
  player,
  onOpenPartnerCare,
  onPlayerUpdate,
}) => {
  const partnerInfo = PARTNERS_EVOLUTION_DATA.find(
    (p) => p.type === player.partner.type
  );
  const currentStageInfo = partnerInfo?.stages[player.partner.stage - 1];

  const animationEnabled = player.character?.animationEnabled ?? true;

  // Local state for interactive preview mode
  const [selectedGender, setSelectedGender] = useState<HeroGender>(
    player.character?.gender || 'boy'
  );
  const [selectedViewType, setSelectedViewType] = useState<HeroViewType>(
    player.character?.viewType || 'sd'
  );
  const [selectedOutfitRank, setSelectedOutfitRank] = useState<HeroOutfitRank>(
    player.character?.outfitRank || 'royal'
  );
  const [selectedCrestRank, setSelectedCrestRank] = useState<CrestRank>('gold');
  const [isCrestResonating, setIsCrestResonating] = useState(false);
  const [selectedExpression, setSelectedExpression] = useState<
    'idle' | 'happy' | 'thinking' | 'levelup' | 'guts' | 'surprised' | 'attack'
  >('idle');

  const handleGenderChange = (gender: HeroGender) => {
    setSelectedGender(gender);
    if (onPlayerUpdate) {
      onPlayerUpdate({
        ...player,
        character: {
          ...player.character,
          gender,
        },
      });
    }
  };

  const handleViewTypeChange = (viewType: HeroViewType) => {
    setSelectedViewType(viewType);
    if (onPlayerUpdate) {
      onPlayerUpdate({
        ...player,
        character: {
          ...player.character,
          viewType,
        },
      });
    }
  };

  const handleOutfitRankChange = (outfitRank: HeroOutfitRank) => {
    setSelectedOutfitRank(outfitRank);
    if (onPlayerUpdate) {
      onPlayerUpdate({
        ...player,
        character: {
          ...player.character,
          outfitRank,
        },
      });
    }
  };

  const toggleAnimation = () => {
    if (!onPlayerUpdate) return;
    const updatedCharacter = {
      ...player.character,
      animationEnabled: !animationEnabled,
    };
    onPlayerUpdate({
      ...player,
      character: updatedCharacter,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6 my-auto relative z-10">
      <div className="royal-panel p-6 space-y-6">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
              <FuriganaText text="主人公＆相棒詳細" />
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
            ✨ <FuriganaText text={`相棒属性: ${player.partner.element}`} />
          </span>
        </div>

        {/* Hero Protagonist Showcase Card */}
        <div className="bg-slate-950/90 p-5 sm:p-6 rounded-3xl border-2 border-amber-400/70 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Column: Visual Character Rendering */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="p-4 bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-400/80 shadow-2xl relative min-w-[180px] sm:min-w-[200px] flex items-center justify-center">
                <HeroCharacter
                  player={player}
                  gender={selectedGender}
                  viewType={selectedViewType}
                  expression={selectedExpression}
                  size="lg"
                  outfitRank={selectedOutfitRank}
                />

                {/* Badge Tag on Avatar */}
                <span className="absolute top-3 left-3 bg-amber-500/80 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                  {selectedViewType === 'sd' ? 'SD 2.5頭身' : '立ち絵 5頭身'}
                </span>
              </div>

              {/* Character Details & Bio */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-400/40 flex items-center gap-1">
                    👑 <FuriganaText text="Knowledge Quest 公式主人公" />
                  </span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full font-bold border border-cyan-400/40">
                    <FuriganaText text={selectedGender === 'boy' ? '男の子（元気な知識冒険者）' : '女の子（好奇心いっぱいの知識冒険者）'} />
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-amber-200 font-cinzel">
                  {player.nickname || player.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                  <FuriganaText text="【ナレッジブック（学習ノート）】と【知識バッグ】【相棒ポーチ】を身につけ、知識とひらめきでマスリア王国の数理謎解きに挑む知識冒険者！" />
                </p>

                {/* Common Motifs Checklist */}
                <div className="pt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start text-[11px] font-bold text-amber-300/90">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30">📜 王国エンブレム</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30">📖 ナレッジブック</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30">🎒 知識バッグ</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30">💎 属性クリスタル</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30">🧣 王国スカーフ</span>
                </div>
              </div>
            </div>

            {/* Right Column: Controls & Animation Toggle */}
            <div className="shrink-0 space-y-3 w-full lg:w-auto text-center lg:text-right">
              <button
                onClick={toggleAnimation}
                className="w-full lg:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/50 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md mx-auto"
              >
                {animationEnabled ? (
                  <>
                    <Pause className="w-4 h-4 text-amber-400" />
                    <span><FuriganaText text="アニメーション OFF" /></span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span><FuriganaText text="アニメーション ON" /></span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Customization & Pose Preview Bar */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-4">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <FuriganaText text="主人公カスタマイズ ＆ モーションプレビュー" />
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
              {/* Gender Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <FuriganaText text="主人公の性別" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleGenderChange('boy')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedGender === 'boy'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    👦 <FuriganaText text="男の子（元気）" />
                  </button>
                  <button
                    onClick={() => handleGenderChange('girl')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedGender === 'girl'
                        ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-md ring-2 ring-sky-300/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    👧 <FuriganaText text="女の子（好奇心）" />
                  </button>
                </div>
              </div>

              {/* View Type Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <FuriganaText text="表示スタイル" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleViewTypeChange('sd')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedViewType === 'sd'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    🏃 <FuriganaText text="SDキャラ (3頭身)" />
                  </button>
                  <button
                    onClick={() => handleViewTypeChange('portrait')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedViewType === 'portrait'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    🖼️ <FuriganaText text="立ち絵 (5頭身)" />
                  </button>
                </div>
              </div>

              {/* Outfit Rank Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <FuriganaText text="衣装ランク" />
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {(['novice', 'royal', 'knight', 'master'] as HeroOutfitRank[]).map((rank) => {
                    const labelMap = {
                      novice: '新人冒険者',
                      royal: '王国冒険者',
                      knight: '知識騎士',
                      master: 'マスター',
                    };
                    const isSel = selectedOutfitRank === rank;
                    return (
                      <button
                        key={rank}
                        onClick={() => handleOutfitRankChange(rank)}
                        className={`py-1.5 px-2 rounded-lg border transition-all cursor-pointer ${
                          isSel
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <FuriganaText text={labelMap[rank]} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Expression & Pose Tester Buttons */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 text-xs flex items-center gap-1 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <FuriganaText text="ポーズ・アニメーションテスト" />
              </label>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {[
                  { id: 'idle', label: '通常 (Idle)', icon: '😃' },
                  { id: 'happy', label: '大喜び (Happy)', icon: '🌟' },
                  { id: 'thinking', label: 'ひらめき・思考 (Thinking)', icon: '🤔' },
                  { id: 'guts', label: 'ガッツポーズ (Guts)', icon: '💪' },
                  { id: 'surprised', label: '驚く (Surprised)', icon: '😲' },
                  { id: 'attack', label: 'ナレッジバースト (Attack)', icon: '⚡' },
                  { id: 'levelup', label: 'レベルアップ (LevelUp)', icon: '👑' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedExpression(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                      selectedExpression === item.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-md font-black'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.icon}</span> <FuriganaText text={item.label} />
                  </button>
                ))}
              </div>
            </div>

            {/* Knowledge Crest Showcase Panel */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-amber-300 text-xs font-black flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <FuriganaText text="Knowledge Crest（知識の紋章）成長＆共鳴テスト" />
                </label>
                <button
                  onClick={() => {
                    setIsCrestResonating(true);
                    setTimeout(() => setIsCrestResonating(false), 3000);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-lg text-[11px] shadow hover:scale-105 transition-transform cursor-pointer flex items-center gap-1"
                >
                  ✨ <FuriganaText text="学習・正解で共鳴させる！" />
                </button>
              </div>

              <div className="p-3 bg-slate-950/90 rounded-xl border border-amber-500/40 flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <KnowledgeCrest
                    rank={selectedCrestRank}
                    element={player.partner.element}
                    size="lg"
                    isResonating={isCrestResonating}
                    isGlowing={isCrestResonating}
                  />
                  <span className="text-[10px] font-bold text-amber-300">
                    {selectedCrestRank.toUpperCase()} RANK
                  </span>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    <FuriganaText text="学習を積み重ねることで Crest が成長！正解すると本と共鳴して光と星があふれます。" />
                  </p>
                  {/* Rank Select Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {(['initial', 'bronze', 'silver', 'gold', 'rainbow'] as CrestRank[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedCrestRank(r)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border cursor-pointer transition-all ${
                          selectedCrestRank === r
                            ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monster Companion Evolution & Detailed Combat Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Monster Visual & Evolution */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/30 text-center space-y-4">
            <div className="text-7xl sm:text-8xl animate-hero-float my-4 inline-block">
              {currentStageInfo?.icon || '🦊'}
            </div>

            <div>
              <h3 className="text-xl font-bold text-amber-200 font-cinzel">
                {player.partner.name}
              </h3>
              <p className="text-xs text-emerald-300 font-bold mt-1">
                {currentStageInfo?.title}
              </p>
              <p className="text-xs text-slate-300 mt-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                {currentStageInfo?.description || partnerInfo?.description}
              </p>
            </div>

            {/* Evolution Stage Steps */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-amber-400 text-left mb-2">
                🌱 <FuriganaText text={`進化ロードマップ (Stage ${player.partner.stage} / 3)`} />
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {partnerInfo?.stages.map((stg) => {
                  const reached = player.partner.stage >= stg.stage;
                  return (
                    <div
                      key={stg.stage}
                      className={`p-2 rounded-xl border text-center ${
                        reached
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="text-2xl">{stg.icon}</div>
                      <div className="text-[10px] font-bold mt-1">
                        Stage {stg.stage}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Lv.{stg.reqLevel}で到達
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Detailed Combat Stats */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-amber-500/30 space-y-3">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <FuriganaText text="ステータス能力値" />
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400"><FuriganaText text="レベル" /></div>
                  <div className="text-base font-extrabold text-amber-300">
                    Lv.{player.partner.level}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400"><FuriganaText text="体力 (HP)" /></div>
                  <div className="text-base font-extrabold text-emerald-400">
                    {player.partner.stats.hp} / {player.partner.stats.maxHp}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400"><FuriganaText text="算数攻撃力 (ATK)" /></div>
                  <div className="text-base font-extrabold text-blue-400">
                    {player.partner.stats.atk}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400"><FuriganaText text="幾何防御力 (DEF)" /></div>
                  <div className="text-base font-extrabold text-amber-400">
                    {player.partner.stats.def}
                  </div>
                </div>
              </div>

              {/* Happiness & Satiety */}
              <div className="space-y-2 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span><FuriganaText text="なつき度" /></span>
                    <span className="font-bold text-rose-400">
                      {player.partner.happiness} %
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                    <div
                      className="bg-rose-400 h-full"
                      style={{ width: `${player.partner.happiness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span><FuriganaText text="満腹度" /></span>
                    <span className="font-bold text-amber-400">
                      {player.partner.satiety} %
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full"
                      style={{ width: `${player.partner.satiety}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenPartnerCare}
              className="btn-royal-emerald w-full py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span><FuriganaText text="相棒のごはん・お世話部屋へ" /></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
