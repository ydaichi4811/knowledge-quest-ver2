import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PlayerData } from '../types';
import { PARTNERS_EVOLUTION_DATA } from '../data/partners';
import { HeroCharacter } from './HeroCharacter';
import { BuddyCharacter } from './BuddyCharacter';
import { KnowledgeCrest } from './KnowledgeCrest';
import { FuriganaText } from './FuriganaText';
import { PretestEntranceCard } from './PretestEntranceCard';
import { selectBuddyQuote } from '../services/buddySpeechService';
import { HeroStatusModal } from './HeroStatusModal';

import {
  Award,
  Sparkles,
  Swords,
  Heart,
  ChevronRight,
  Zap,
  Shield,
  MapPin,
  Home,
  RefreshCw,
} from 'lucide-react';

interface MainGameLayoutProps {
  player: PlayerData;
  onNavigateMap: () => void;
  onStartQuest: (regionId: string, stageId: string) => void;
  onOpenPartnerCare: () => void;
  onOpenCompanionRoom?: () => void;
  onToggleMode: (mode: 'adventure' | 'raising') => void;
  onOpenPretest?: () => void;
}

export const MainGameLayout: React.FC<MainGameLayoutProps> = ({
  player,
  onNavigateMap,
  onStartQuest,
  onOpenPartnerCare,
  onOpenCompanionRoom,
  onToggleMode,
  onOpenPretest,
}) => {
  const comp = player.companion;
  const partnerInfo = PARTNERS_EVOLUTION_DATA.find(
    (p) => p.type === player.partner.type
  );
  const currentStageInfo = partnerInfo?.stages[player.partner.stage - 1];

  const expPercentage = Math.min(
    100,
    Math.round((player.exp / player.maxExp) * 100)
  );

  const expRemaining = Math.max(0, player.maxExp - player.exp);
  const questionsToLevelUp = Math.max(1, Math.ceil(expRemaining / 15));

  // Dynamic Gems derived from points / care items
  const coinAmount = player.points || 0;
  const gemAmount = Math.max(5, Math.floor(coinAmount / 5) + (player.foodItemsCount || 0));

  // 状況に応じたバディのセリフ初期選択
  const [currentQuote, setCurrentQuote] = useState<string>(() =>
    selectBuddyQuote(player)
  );
  const [isBubbleBouncing, setIsBubbleBouncing] = useState(false);
  const [showHeroStatusModal, setShowHeroStatusModal] = useState(false);
  const isCoolingDownRef = useRef(false);

  // 画面を開いた時・プレイヤー情報が大きく変わった時の初期設定
  useEffect(() => {
    setCurrentQuote(selectBuddyQuote(player));
  }, [player.level, player.partner?.type]);

  // タップ時の切り替えハンドラー（連打防止クールダウン付き）
  const handleNextQuote = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isCoolingDownRef.current) return;

    isCoolingDownRef.current = true;
    setIsBubbleBouncing(true);

    const nextQuote = selectBuddyQuote(player, currentQuote);
    setCurrentQuote(nextQuote);

    setTimeout(() => {
      setIsBubbleBouncing(false);
    }, 250);

    setTimeout(() => {
      isCoolingDownRef.current = false;
    }, 600);
  };

  const avatarLabels: Record<string, string> = {
    hero: '算数勇者',
    mage: '数理魔導士',
    knight: '幾何学騎士',
    scholar: '算術学者',
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 flex flex-col gap-4 relative z-10 my-auto">
      
      {/* ========================================================= */}
      {/* 1. 上部 (TOP HEADER / STATUS BAR): Level, EXP, Coins, Gems */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-slate-900/90 border-4 border-amber-500/80 rounded-2xl p-3 sm:p-4 shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden"
      >
        {/* Subtle glowing accent gradient */}
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Player Profile & Level */}
        <div
          onClick={() => setShowHeroStatusModal(true)}
          className="flex items-center gap-3 w-full md:w-auto cursor-pointer hover:opacity-90 transition-all group"
          title="主人公ステータスを見る"
        >
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-1 shadow-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-2xl">
                {player.partner.avatarIcon || '🛡️'}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-amber-200 shadow">
              Lv.{player.level}
            </span>
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg text-amber-200 truncate group-hover:text-amber-100">
                {player.name}
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                {player.rankTitle || avatarLabels[player.avatar] || '算数勇者'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-300 font-bold mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>マスリア王国 中央平原</span>
              <span className="text-[10px] text-amber-400 ml-1 underline">📊 ステータス</span>
            </div>
          </div>
        </div>

        {/* EXP Progress Bar & Level Up Indicator */}
        <div
          onClick={() => setShowHeroStatusModal(true)}
          className="w-full md:w-72 bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/30 flex flex-col gap-1.5 cursor-pointer hover:border-amber-400/60 transition-all"
          title="主人公ステータスを見る"
        >
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-amber-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <FuriganaText text="プレイヤーレベル" /> Lv.{player.level}
            </span>
            <span className="text-amber-200 text-[11px]">
              {player.exp} / {player.maxExp} EXP ({expPercentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-700 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-300 h-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ width: `${expPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-extrabold text-emerald-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>あと<strong className="text-amber-300 mx-0.5 text-xs">{questionsToLevelUp}問</strong>でレベルアップ！</span>
            </span>
          </div>
        </div>

        {/* Currency Display: Coins & Gems & Care Button */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
          {/* Coins Badge */}
          <div className="bg-slate-950/90 border-2 border-amber-400/60 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md">
            <span className="text-lg">🪙</span>
            <div className="flex flex-col">
              <span className="text-[9px] text-amber-300/80 font-bold leading-none">コイン</span>
              <span className="text-sm font-black text-amber-300 font-cinzel leading-tight">
                {coinAmount.toLocaleString()} G
              </span>
            </div>
          </div>

          {/* Gems Badge */}
          <div className="bg-slate-950/90 border-2 border-cyan-400/60 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md">
            <span className="text-lg">💎</span>
            <div className="flex flex-col">
              <span className="text-[9px] text-cyan-300/80 font-bold leading-none">ジェム</span>
              <span className="text-sm font-black text-cyan-300 font-cinzel leading-tight">
                {gemAmount.toLocaleString()} Gem
              </span>
            </div>
          </div>

          {/* Partner Care Quick Link */}
          <button
            onClick={onOpenPartnerCare}
            className="btn-royal-emerald px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow cursor-pointer shrink-0"
            title="パートナーのお世話"
          >
            <Heart className="w-4 h-4 text-rose-300 fill-rose-400" />
            <span className="hidden sm:inline"><FuriganaText text="お世話" /></span>
          </button>
        </div>
      </motion.div>


      {/* ========================================================= */}
      {/* 2. 画面中央 (CENTER STAGE): Open-Field Stage for Hero & Buddy */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full relative flex flex-col items-center justify-center text-center py-6 px-3 sm:px-6 my-1 overflow-hidden min-h-[420px]"
      >
        {/* Open Field Atmosphere (Kingdom/Adventure Background without rigid card borders) */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-emerald-950/20 to-slate-950/90 rounded-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Stage Title / Crest Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/90 border-2 border-amber-400/70 text-xs font-black text-amber-300 shadow-[0_4px_15px_rgba(0,0,0,0.6)] backdrop-blur-md mb-2">
          <KnowledgeCrest size="xs" element={player.partner?.element || '草'} rank="gold" />
          <span>マスリア冒険隊: {player.name} & {comp?.name || player.partner.name || 'バディ'}</span>
        </div>

        {/* ========================================================= */}
        {/* バディの一言 (Buddy Speech Bubble) - Floating Speech Cloud */}
        {/* ========================================================= */}
        <div className="relative z-20 my-2 max-w-md w-full px-2">
          <motion.div
            onClick={handleNextQuote}
            animate={{ scale: isBubbleBouncing ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-amber-100 text-slate-950 px-4 py-2.5 rounded-2xl border-3 border-amber-400 shadow-[0_8px_25px_rgba(245,158,11,0.4)] cursor-pointer hover:bg-amber-50 transition-colors relative flex items-center justify-between gap-2 group"
          >
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-amber-400" />

            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xl">💬</span>
              <div className="text-left font-black text-xs sm:text-sm text-slate-900 tracking-tight leading-snug">
                <span className="text-[10px] text-amber-800 font-bold block">
                  {comp?.name || player.partner.name || 'バディ'}の一言:
                </span>
                <FuriganaText text={currentQuote} />
              </div>
            </div>

            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/90 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 group-hover:bg-amber-300">
              <RefreshCw className="w-3 h-3" />
              <span>チェンジ</span>
            </span>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* Open Field Stage Platform (Hero + Buddy Standing Side by Side) */}
        {/* ========================================================= */}
        <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-10 md:gap-16 my-4 w-full max-w-2xl px-2">
          
          {/* 1. 主人公 (MAIN HERO CHARACTER) */}
          <div className="flex flex-col items-center relative group">
            {/* Glowing Aura & Field Pedestal Shadow under Hero */}
            <div className="absolute -bottom-3 w-36 h-10 sm:w-44 sm:h-12 bg-gradient-to-r from-amber-500/30 via-amber-300/40 to-amber-500/30 rounded-[100%] blur-sm border border-amber-400/50 animate-pulse pointer-events-none" />
            <div className="absolute -bottom-1 w-28 h-5 sm:w-36 sm:h-6 bg-slate-950/80 rounded-[100%] pointer-events-none" />

            {/* Idle Floating Animation Container */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 transform scale-90 sm:scale-100 md:scale-110 origin-bottom"
            >
              <HeroCharacter
                player={player}
                expression="idle"
                size="lg"
              />
            </motion.div>

            {/* Hero Status Readout Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-3 py-1.5 bg-slate-950/95 rounded-2xl border-2 border-amber-400/80 text-center shadow-[0_6px_20px_rgba(0,0,0,0.8)] z-20 min-w-[130px] sm:min-w-[160px]"
            >
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-black text-amber-200">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{player.name}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-0.5 text-[10px] sm:text-[11px] font-bold">
                <span className="text-amber-400 font-extrabold">Lv.{player.level}</span>
                <span className="text-slate-400">|</span>
                <span className="text-amber-100/90 font-black">
                  {player.rankTitle || avatarLabels[player.avatar] || '算数勇者'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* 2. バディ (CURRENT BUDDY / KNOWLEDGE COMPANION) */}
          <div className="flex flex-col items-center relative group">
            {/* Glowing Aura & Field Pedestal Shadow under Buddy */}
            <div className="absolute -bottom-3 w-32 h-9 sm:w-40 sm:h-11 bg-gradient-to-r from-emerald-500/30 via-teal-300/40 to-emerald-500/30 rounded-[100%] blur-sm border border-emerald-400/50 animate-pulse pointer-events-none" />
            <div className="absolute -bottom-1 w-24 h-5 sm:w-32 sm:h-6 bg-slate-950/80 rounded-[100%] pointer-events-none" />

            {/* Idle Swaying Animation Container */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="relative z-10 transform scale-90 sm:scale-100 md:scale-110 origin-bottom"
              onClick={(e) => handleNextQuote(e)}
            >
              {comp ? (
                <div
                  className="cursor-pointer hover:scale-105 transition-transform"
                  title="相棒の部屋を開く (タップでセリフチェンジ)"
                >
                  <BuddyCharacter
                    player={player}
                    companion={comp}
                    size="lg"
                    animationEnabled={player.companionSettings?.partnerAnimationEnabled ?? true}
                  />
                </div>
              ) : (
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950/80 border-2 border-emerald-400/60 flex items-center justify-center text-5xl sm:text-6xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
                >
                  {currentStageInfo?.icon || player.partner?.avatarIcon || '🦊'}
                </div>
              )}
            </motion.div>

            {/* Buddy Status Readout Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onOpenCompanionRoom}
              className="mt-4 px-3 py-1.5 bg-slate-950/95 rounded-2xl border-2 border-emerald-400/80 text-center shadow-[0_6px_20px_rgba(0,0,0,0.8)] z-20 min-w-[130px] sm:min-w-[160px] cursor-pointer hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-black text-emerald-300">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>{comp?.name || player.partner.name || 'バディ'}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-0.5 text-[10px] sm:text-[11px] font-bold">
                <span className="text-emerald-400 font-extrabold">
                  Lv.{comp?.level || player.partner.level || 1}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-emerald-200">
                  {currentStageInfo?.title || '相棒モンスター'}
                </span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Mode & Companion Room Quick Buttons */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 mt-2">
          <button
            onClick={() => onToggleMode(player.mode === 'adventure' ? 'raising' : 'adventure')}
            className="text-xs font-extrabold px-3.5 py-1.5 rounded-xl bg-slate-950/90 text-blue-300 border border-blue-500/60 hover:bg-slate-900 transition-colors shadow flex items-center gap-1"
          >
            {player.mode === 'adventure' ? '🗡️ 冒険モード' : '🐾 育成モード'}
          </button>
          {onOpenCompanionRoom && comp && (
            <button
              onClick={onOpenCompanionRoom}
              className="text-xs font-extrabold px-3.5 py-1.5 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-900 transition-colors shadow flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>相棒の部屋 🏠</span>
            </button>
          )}
        </div>
      </motion.div>


      {/* ========================================================= */}
      {/* 3. 中央下 (MIDDLE-BOTTOM): Big 【冒険に出る】 Button & Recommended Quest */}
      {/* ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-3"
      >
        {/* BIG 【冒険に出る】 BUTTON */}
        <button
          type="button"
          onClick={onNavigateMap}
          className="btn-royal-gold w-full py-5 rounded-3xl text-xl sm:text-2xl font-black flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(245,158,11,0.5)] border-4 border-amber-300 animate-gold-glow cursor-pointer hover:scale-102 transition-all relative overflow-hidden group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 select-none z-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 via-amber-100/40 to-amber-300/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
          <Swords className="w-8 h-8 fill-slate-950 text-slate-950 animate-bounce pointer-events-none shrink-0" />
          <div className="flex flex-col items-center pointer-events-none">
            <span className="tracking-wide text-slate-950 drop-shadow-sm font-black">
              【 ⚔️ 冒険に出る 】
            </span>
            <span className="text-xs text-amber-950 font-bold tracking-normal">
              マスリア王国の算数マップへ出発！
            </span>
          </div>
          <ChevronRight className="w-7 h-7 text-slate-950 pointer-events-none shrink-0" />
        </button>

        {/* あと○問でレベルアップ Highlight Banner */}
        <div className="w-full bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border-2 border-amber-500/50 p-2.5 rounded-2xl flex items-center justify-between px-4 text-xs font-black shadow-md">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>LEVEL UP PROGRESS</span>
          </div>
          <div className="text-amber-200 font-extrabold text-xs sm:text-sm">
            🔥 あと <strong className="text-amber-400 font-black text-base mx-1">{questionsToLevelUp}问</strong> 正解で Lv.{player.level + 1} にレベルアップ！
          </div>
        </div>

        {/* 今日のおすすめクエスト (Today's Recommended Quest Card) */}
        <div className="w-full bg-slate-900/90 border-3 border-amber-500/60 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shrink-0 flex items-center justify-center text-2xl shadow">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                🎯
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
                  今日のおすすめクエスト
                </span>
                <span className="text-xs text-amber-300 font-bold">小5算数 面積の王国</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-100 mt-0.5">
                ステージ2: 「三角形の面積公式」に挑もう！
              </h3>
              <p className="text-xs text-slate-400">
                底辺 × 高さ ÷ 2 の計算マスターを目指せ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="text-right text-[10px] font-bold text-amber-300 pr-2 hidden sm:block">
              <div>報酬: +45 EXP</div>
              <div>+30 コイン 🪙</div>
            </div>
            <button
              onClick={() => onStartQuest('area', 'area_stage_2')}
              className="btn-royal-gold px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow cursor-pointer shrink-0 w-full sm:w-auto justify-center"
            >
              <Swords className="w-4 h-4 fill-slate-950" />
              <span>クエスト開始</span>
            </button>
          </div>
        </div>

        {/* Optional Pretest Bonus Card */}
        {onOpenPretest && (
          <PretestEntranceCard
            player={player}
            unitId="area"
            onOpenPretest={onOpenPretest}
          />
        )}
        {/* Hero Growth Status Modal */}
        <HeroStatusModal
          isOpen={showHeroStatusModal}
          onClose={() => setShowHeroStatusModal(false)}
          player={player}
        />
      </motion.div>

    </div>
  );
};
