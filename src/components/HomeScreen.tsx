import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlayerData, GameScreen } from '../types';
import { ensureDailyMissions } from '../services/dailyMissionService';
import { savePlayerData } from '../services/gameStorage';
import { DailyMissionModal } from './DailyMissionModal';
import { CompanionZukanView } from './CompanionZukanView';
import { HeroStatusModal } from './HeroStatusModal';
import { HeroCharacter } from './HeroCharacter';
import { BuddyCharacter } from './BuddyCharacter';
import { PlayerStatusBar } from './PlayerStatusBar';
import {
  Home,
  BookOpen,
  Footprints,
  Sparkles,
  Armchair,
  FileText,
  ShoppingBag,
  Settings,
  Mail,
  Zap,
  Gift,
  Clock,
  Edit3,
  Target,
  Flame,
  Trophy,
  Share2,
  HelpCircle,
  ChevronRight,
  Plus,
  User,
  Check,
  Award,
} from 'lucide-react';

interface HomeScreenProps {
  player: PlayerData;
  onNavigate: (screen: GameScreen) => void;
  onStartQuest: (regionId: string, stageId: string) => void;
  onOpenPartnerCare: () => void;
  onOpenCompanionRoom?: () => void;
  onToggleMode: (newMode: 'adventure' | 'raising') => void;
  onUpdatePlayer?: (updated: PlayerData) => void;
  onSelectTab?: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player: initialPlayer,
  onNavigate,
  onStartQuest,
  onOpenPartnerCare,
  onOpenCompanionRoom,
  onToggleMode,
  onUpdatePlayer,
  onSelectTab,
}) => {
  const player = ensureDailyMissions(initialPlayer);
  const [activeNav, setActiveNav] = useState<'home' | 'quest' | 'pet' | 'gacha' | 'room' | 'log' | 'shop' | 'settings'>('home');
  const [rankingTab, setRankingTab] = useState<'time' | 'count' | 'accuracy'>('time');
  const [showDailyMissionModal, setShowDailyMissionModal] = useState(false);
  const [showZukanModal, setShowZukanModal] = useState(false);
  const [showHeroStatusModal, setShowHeroStatusModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (player.hasSeenDailyPopupToday !== todayStr) {
      setShowDailyMissionModal(true);
      const updated: PlayerData = {
        ...player,
        hasSeenDailyPopupToday: todayStr,
      };
      savePlayerData(updated);
      if (onUpdatePlayer) onUpdatePlayer(updated);
    }
  }, [todayStr]);

  // A legitimate zero balance must remain zero. Placeholder balances make
  // rewards and gacha costs impossible for children to understand.
  const coinAmount = player.points ?? 0;
  const gemAmount = Math.floor((player.points ?? 0) / 5) + (player.foodItemsCount ?? 0);
  const dailyMissions = player.dailyMissions || [];
  const completedMissionCount = dailyMissions.filter((mission) => mission.isCompleted).length;
  const dailyMissionPercent = dailyMissions.length
    ? Math.round((completedMissionCount / dailyMissions.length) * 100)
    : 0;
  const correctRate = player.totalAnswered > 0
    ? Math.round((player.correctAnswered / player.totalAnswered) * 100)
    : 0;
  const firstClearCount = Object.values(player.questionProgress || {}).filter((progress) => progress.isFirstCleared).length;
  const collectedTreasureCount = Object.values(player.gachaCollection || {}).reduce((sum, quantity) => sum + quantity, 0);

  const handleNavClick = (navKey: 'home' | 'quest' | 'pet' | 'gacha' | 'room' | 'log' | 'shop' | 'settings') => {
    setActiveNav(navKey);
    if (navKey === 'quest') {
      onNavigate('map');
    } else if (navKey === 'pet' || navKey === 'room') {
      if (onOpenCompanionRoom) onOpenCompanionRoom();
      else onOpenPartnerCare();
    } else if (navKey === 'gacha') {
      if (onSelectTab) onSelectTab('gacha');
    } else if (navKey === 'log') {
      if (onSelectTab) onSelectTab('review');
    } else if (navKey === 'shop') {
      if (onSelectTab) onSelectTab('shop');
    } else if (navKey === 'settings') {
      if (onSelectTab) onSelectTab('settings');
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-[#2c1d11] p-2 sm:p-4 flex flex-col items-center justify-center font-sans relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-slate-950/20 pointer-events-none" />

      {/* Main Container - Formal Design Master Outer Frame */}
      <div className="w-full max-w-[1420px] bg-[#0b1b36] border-4 border-[#b89548] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row relative z-10 overflow-hidden my-auto">
        
        {/* ========================================================= */}
        {/* ■ 左固定メニュー (LEFT FIXED SIDEBAR NAV)                   */}
        {/* ========================================================= */}
        <aside className="w-full lg:w-[220px] bg-gradient-to-b from-[#0f2446] via-[#0b1a36] to-[#071226] border-b-2 lg:border-b-0 lg:border-r-2 border-[#1c355e] p-2 lg:p-3 flex flex-col justify-between shrink-0 relative z-20">
          
          {/* Top Logo */}
          <div>
            <div className="flex items-center gap-2 px-2 py-2 lg:py-3 mb-1 lg:mb-2 border-b border-[#1f3a68]">
              <div className="relative">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-lg p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#0d2244] rounded-md flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="font-cinzel text-sm sm:text-base font-black text-amber-200 leading-tight tracking-wide">
                  Knowledge
                </h1>
                <div className="flex items-center gap-1">
                  <span className="font-cinzel text-xs font-bold text-amber-400">Quest</span>
                  <span className="text-[10px] text-slate-300 font-bold">ナレッジ クエスト</span>
                </div>
              </div>
            </div>

            {/* Menu Nav Buttons */}
            <nav aria-label="メインメニュー" className="flex lg:block gap-2 lg:space-y-2 lg:mt-3 overflow-x-auto overscroll-x-contain pb-1 lg:pb-0 snap-x">
              {[
                { id: 'home', label: 'ホーム', en: 'HOME', icon: Home },
                { id: 'quest', label: 'クエスト', en: 'QUEST', icon: BookOpen },
                { id: 'pet', label: 'ペット', en: 'PET', icon: Footprints },
                { id: 'gacha', label: 'ガチャ', en: 'GACHA', icon: Sparkles },
                { id: 'room', label: 'ルーム', en: 'ROOM', icon: Armchair },
                { id: 'log', label: 'ログ', en: 'LOG', icon: FileText },
                { id: 'shop', label: 'ショップ', en: 'SHOP', icon: ShoppingBag },
                { id: 'settings', label: '設定', en: 'SETTING', icon: Settings },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as any)}
                    className={`shrink-0 min-w-[88px] sm:min-w-[104px] lg:min-w-0 lg:w-full snap-start py-2 lg:py-2.5 px-2 lg:px-3.5 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer relative overflow-hidden border-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2178e6] to-[#1253a8] border-[#70b1ff] text-white shadow-[0_0_15px_rgba(33,120,230,0.6)] ring-1 ring-amber-300/80 scale-[1.02]'
                        : 'bg-gradient-to-b from-[#1b3d6c] to-[#11294a] border-[#2d5286] text-slate-200 hover:brightness-115 hover:border-[#4270ae] active:scale-98'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-[#0f2444] text-amber-400'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="text-xs sm:text-sm font-extrabold tracking-wider">{item.label}</div>
                      <div className="hidden sm:block text-[9px] font-mono text-slate-300/80 font-bold">{item.en}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Settings Button */}
          <div className="hidden lg:block pt-3 border-t border-[#1f3a68] mt-4">
            <button
              onClick={() => handleNavClick('settings')}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-b from-[#1c3860] to-[#112644] border-2 border-[#2f558a] text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>設定 SETTING</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT MAIN CONTENT CONTAINER (Header + Notebook + Right Cards + Bottom Logs) */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col bg-[#0d1d3a] min-w-0">

          {/* --------------------------------------------------------- */}
          {/* ■ 上部ステータスバー (FORMAL COMMON PLAYER STATUS BAR)      */}
          {/* --------------------------------------------------------- */}
          <PlayerStatusBar
            player={player}
            onOpenStatus={() => setShowHeroStatusModal(true)}
            onOpenSettings={() => handleNavClick('settings')}
          />

          {/* --------------------------------------------------------- */}
          {/* ■ 中央・右エリア コンテンツレイアウト                      */}
          {/* --------------------------------------------------------- */}
          <div className="p-3 sm:p-5 space-y-5 overflow-y-visible lg:overflow-y-auto lg:max-h-[calc(100vh-120px)]">
            
            {/* Upper Notebook Grid Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
              
              {/* ======================================================= */}
              {/* 開いた冒険手帳 (CENTRAL BOOK NOTEBOOK - 8 cols on XL)     */}
              {/* ======================================================= */}
              <div className="xl:col-span-8 bg-[#f5efe0] border-4 border-[#c5af83] rounded-2xl p-3 sm:p-5 shadow-[0_10px_25px_rgba(0,0,0,0.5)] relative overflow-hidden">
                
                {/* Book Ring Binder Metal Highlights (Left Side Rings) */}
                <div className="absolute left-1 top-4 bottom-4 w-4 flex flex-col justify-between pointer-events-none z-20 hidden sm:flex">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-700 via-slate-400 to-slate-900 border border-slate-900 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]" />
                  ))}
                </div>

                {/* Notebook Paper Content (Two-page layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pl-0 sm:pl-3 relative z-10">
                  
                  {/* ----- 左ページ: 主人公 ＆ ペット ----------------- */}
                  <div className="bg-[#f9f5ea] border-2 border-[#ded1b6] rounded-xl p-3 flex flex-col items-center justify-between relative shadow-inner min-h-[380px]">
                    
                    {/* Ribbon Title */}
                    <div className="relative -top-1">
                      <div className="bg-gradient-to-r from-[#d9aa52] via-[#e8c072] to-[#d9aa52] border border-[#a87f32] text-[#3a250a] font-black text-xs px-6 py-1 rounded-md shadow-md font-cinzel tracking-wider text-center">
                        マスリア王国
                      </div>
                    </div>

                    {/* Speech Bubble */}
                    <div className="my-2 bg-white border-2 border-[#d3c29f] rounded-2xl px-4 py-2 shadow-sm relative text-center">
                      <p className="text-xs sm:text-sm font-black text-[#3a2817]">
                        今日も一緒にがんばろう！
                      </p>
                      {/* Pointer */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#d3c29f]" />
                    </div>

                    {/* Fantasy Stage Illustration + Hero & Pet */}
                    <div className="w-full flex-1 my-1 rounded-xl bg-gradient-to-b from-[#7ec5f8] via-[#a3d8ff] to-[#7fb75f] border border-[#c4b391] relative overflow-hidden flex items-end justify-center pb-0 shadow-inner min-h-[220px]">
                      
                      {/* Background Castle & Clouds */}
                      <div className="absolute top-2 left-2 right-2 flex justify-between text-white/80 opacity-70">
                        <span className="text-2xl">☁️</span>
                        <span className="text-xl">🏰</span>
                        <span className="text-2xl">☁️</span>
                      </div>

                      {/* Characters centered with flex gap */}
                      <div
                        className="flex items-end justify-center relative z-10 pb-0 mb-0"
                        style={{ gap: 'clamp(12px, 4vw, 28px)' }}
                      >
                        {/* Hero Character (15% larger & aligned to stage bottom edge, slightly right) */}
                        <div
                          className="relative transform translate-x-1 sm:translate-x-1.5 hover:scale-105 transition-transform cursor-pointer origin-bottom flex items-end"
                          onClick={() => setShowHeroStatusModal(true)}
                          title="主人公ステータスを見る"
                        >
                          <HeroCharacter player={player} size="md" className="scale-[1.15] origin-bottom block" viewType="sd" />
                        </div>

                        {/* Buddy Character (slightly left) */}
                        <div
                          className="relative transform -translate-x-1 sm:-translate-x-1.5 hover:scale-105 transition-transform cursor-pointer origin-bottom flex items-end"
                          onClick={onOpenPartnerCare}
                          title="バディとふれあう"
                        >
                          <BuddyCharacter player={player} size="md" className="origin-bottom block" />
                        </div>
                      </div>
                    </div>

                    {/* Button: キャラクター変更 */}
                    <button
                      onClick={() => {
                        if (onSelectTab) onSelectTab('character');
                      }}
                      className="w-full mt-2 py-1.5 px-3 bg-[#ebe0cb] hover:bg-[#dfcfb0] border-2 border-[#bda881] text-[#4a3522] font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#6e5338]" />
                      <span>キャラクター変更</span>
                    </button>
                  </div>

                  {/* ----- 右ページ: TODAY QUEST 今日の目標 ------------- */}
                  <div className="bg-[#f9f5ea] border-2 border-[#ded1b6] rounded-xl p-3.5 flex flex-col justify-between relative shadow-inner min-h-[380px]">
                    
                    {/* Header */}
                    <div className="text-center border-b border-[#e5d8be] pb-2">
                      <h2 className="font-black text-sm sm:text-base text-[#1b3e73] tracking-wide font-cinzel flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        TODAY QUEST
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </h2>
                      <p className="text-[11px] font-bold text-[#63513d]">今日の目標</p>
                    </div>

                    {/* Quest List */}
                    <div className="space-y-2.5 my-3">
                      {dailyMissions.map((mission) => (
                        <div key={mission.missionId} className="bg-[#f2ebdc] border border-[#d8caaa] rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold shadow ${mission.isCompleted ? 'bg-emerald-600 text-white' : 'border-2 border-[#a39270] bg-white'}`}>
                              {mission.isCompleted ? <Check className="w-3.5 h-3.5" /> : mission.icon}
                            </div>
                            <span className="text-xs font-black text-[#382716] truncate">{mission.title}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-[#6e5944] font-mono">
                              {Math.min(mission.currentValue, mission.targetValue)}/{mission.targetValue}
                            </span>
                            {mission.isCompleted && (
                              <span className="rotate-[-6deg] border-2 border-red-600 text-red-600 font-black px-1.5 py-0.5 rounded text-[10px] tracking-wider bg-red-50/80 shadow-sm">
                                CLEAR!
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quest Progress Bar */}
                    <div className="bg-[#ebdcc0] border border-[#d5c3a0] rounded-xl p-2.5 space-y-1.5 my-1">
                      <div className="flex items-center justify-between text-xs font-black text-[#3a2817]">
                        <span>クエスト達成度</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎁</span>
                          <span className="text-[#a03612] text-xs">
                            {completedMissionCount === dailyMissions.length ? 'すべて達成！' : `あと${dailyMissions.length - completedMissionCount}つ`}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#c8b794] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#aa9876] relative">
                        <div className="bg-gradient-to-r from-[#2178e6] to-[#429eff] h-full rounded-full transition-[width]" style={{ width: `${dailyMissionPercent}%` }} />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow">
                          {dailyMissionPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Reward Offer Footer */}
                    <div className="pt-2 border-t border-[#e5d8be] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#382613]">
                        <span className="text-xl">🎁</span>
                        <span>{completedMissionCount}/{dailyMissions.length} 達成・報酬を受け取ろう</span>
                      </div>
                      <button
                        onClick={() => setShowDailyMissionModal(true)}
                        className="py-1.5 px-4 bg-gradient-to-b from-[#1d6ad2] to-[#104899] border-2 border-[#5497f0] text-white font-black text-xs rounded-xl shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                      >
                        ごほうびを見る
                      </button>
                    </div>

                  </div>

                </div>
              </div>

              {/* ======================================================= */}
              {/* 右側カラム (お知らせ / ランキング / EVENT / ミッション)     */}
              {/* ======================================================= */}
              <div className="xl:col-span-4 space-y-4">
                <div className="bg-[#f5efe0] border-4 border-[#c5af83] rounded-2xl p-4 shadow-md space-y-3">
                  <h3 className="font-black text-sm text-[#1a3863] flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600" /> 冒険の進め方
                  </h3>
                  <p className="text-xs font-bold leading-relaxed text-[#4a3622]">
                    まず問題に挑戦しよう。正解して集めたKQポイントでごほうびを選び、相棒を育てられます。
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-2">
                    <button onClick={() => onNavigate('map')} className="rounded-xl border-2 border-blue-300 bg-gradient-to-b from-blue-600 to-blue-800 px-3 py-2.5 text-xs font-black text-white shadow hover:brightness-110">
                      ① 問題に挑戦する
                    </button>
                    <button onClick={() => onSelectTab?.('shop')} className="rounded-xl border-2 border-amber-300 bg-gradient-to-b from-amber-500 to-amber-700 px-3 py-2.5 text-xs font-black text-slate-950 shadow hover:brightness-110">
                      ② ごほうびを選ぶ
                    </button>
                    <button onClick={onOpenCompanionRoom || onOpenPartnerCare} className="rounded-xl border-2 border-emerald-300 bg-gradient-to-b from-emerald-600 to-emerald-800 px-3 py-2.5 text-xs font-black text-white shadow hover:brightness-110">
                      ③ 相棒を育てる
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-black">
                    <div className="rounded-lg bg-amber-100 p-2 text-amber-900">{player.points} pt</div>
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-900">宝物 {collectedTreasureCount}個</div>
                    <div className="rounded-lg bg-emerald-100 p-2 text-emerald-900">アイテム {Object.values(player.inventory || {}).reduce((sum, item) => sum + item.quantity, 0)}個</div>
                  </div>
                </div>
                
                {/* お知らせ (TOP RIGHT) */}
                <div className="hidden bg-[#f5efe0] border-4 border-[#c5af83] rounded-2xl p-3.5 shadow-md space-y-2">
                  <div className="flex items-center justify-between border-b border-[#ded1b6] pb-1.5">
                    <h3 className="font-black text-xs sm:text-sm text-[#3a2817] flex items-center gap-1.5">
                      <span className="text-base">📢</span> お知らせ
                    </h3>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#3a2817] font-bold">
                    <li className="flex items-center gap-1.5 truncate">
                      <span className="text-amber-600">・</span>サマーイベントが始まりました！
                    </li>
                    <li className="flex items-center gap-1.5 truncate">
                      <span className="text-amber-600">・</span>新しいペット「フレア」が登場！
                    </li>
                    <li className="flex items-center gap-1.5 truncate text-slate-600">
                      <span className="text-amber-600">・</span>メンテナンスのお知らせ 7/10 14:00~16:00
                    </li>
                  </ul>
                  <div className="text-right pt-1">
                    <button className="py-1 px-3 bg-[#eae0cc] hover:bg-[#decfae] border border-[#baa780] text-[#4a3622] font-extrabold text-[11px] rounded-lg cursor-pointer">
                      もっと見る
                    </button>
                  </div>
                </div>

                {/* ランキング (MIDDLE RIGHT) */}
                <div className="hidden bg-[#f5efe0] border-4 border-[#c5af83] rounded-2xl p-3.5 shadow-md space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#ded1b6] pb-1.5">
                    <h3 className="font-black text-xs sm:text-sm text-[#1a3863] flex items-center gap-1.5">
                      ランキング <span className="text-[11px] text-[#5e4b38] font-bold">（学習時間：今週）</span>
                    </h3>
                    <HelpCircle className="w-4 h-4 text-[#8c7659] cursor-pointer" />
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-[#e3d7bd] p-1 rounded-xl border border-[#cbba98]">
                    {[
                      { id: 'time', label: '学習時間' },
                      { id: 'count', label: '問題数' },
                      { id: 'accuracy', label: '正答率' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setRankingTab(tab.id as any)}
                        className={`flex-1 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                          rankingTab === tab.id
                            ? 'bg-[#1e5eb0] text-white shadow'
                            : 'text-[#574431] hover:text-[#2c1e11]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Ranking List */}
                  <div className="space-y-1.5 text-xs font-bold text-[#3a2817]">
                    {[
                      { rank: 1, name: 'りくと', score: '2時間15分', icon: '👑' },
                      { rank: 2, name: 'あおい', score: '1時間58分', icon: '🥈' },
                      { rank: 3, name: 'ひなた', score: '1時間32分', icon: '🥉' },
                      { rank: 4, name: 'あやの', score: '1時間21分', icon: '4' },
                      { rank: 5, name: 'そうた', score: '1時間10分', icon: '5' },
                    ].map((item) => (
                      <div
                        key={item.rank}
                        className="flex items-center justify-between bg-[#f8f3e8] px-2.5 py-1 rounded-lg border border-[#e2d4b7]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center font-black text-sm">{item.icon}</span>
                          <div className="w-6 h-6 rounded-full bg-amber-200 border border-amber-400 overflow-hidden flex items-center justify-center shrink-0">
                            <HeroCharacter gender={item.rank % 2 === 0 ? 'girl' : 'boy'} size="sm" viewType="sd" />
                          </div>
                          <span className="font-extrabold text-xs text-[#382613]">{item.name}</span>
                        </div>
                        <span className="font-mono text-xs font-black text-[#1e5eb0]">{item.score}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-right pt-1">
                    <button
                      onClick={() => {
                        if (onSelectTab) onSelectTab('ranking');
                      }}
                      className="py-1 px-3 bg-[#eae0cc] hover:bg-[#decfae] border border-[#baa780] text-[#4a3622] font-extrabold text-[11px] rounded-lg cursor-pointer"
                    >
                      もっと見る
                    </button>
                  </div>
                </div>

                {/* Event, Mission, Login Bonus Horizontal Cards */}
                <div className="hidden grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-2.5">
                  
                  {/* EVENT Card */}
                  <div className="bg-[#f5efe0] border-2 border-[#c5af83] rounded-xl p-2.5 flex items-center justify-between shadow-sm relative overflow-hidden">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black text-amber-700">🚩 EVENT</span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded border border-amber-300">あと6日</span>
                      </div>
                      <p className="text-xs font-black text-[#2e1f12]">サマーイベント開催中！</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1">
                      <BuddyCharacter player={player} size="xs" />
                    </div>
                  </div>

                  {/* Mission Card */}
                  <div className="bg-[#f5efe0] border-2 border-[#c5af83] rounded-xl p-2.5 flex items-center justify-between shadow-sm">
                    <div className="space-y-1 min-w-0 flex-1 mr-2">
                      <span className="text-[11px] font-black text-[#1a3863]">📜 ミッション</span>
                      <p className="text-[11px] font-bold text-[#382613] truncate">1日1回発表チャレンジ</p>
                      <div className="w-full bg-[#c8b794] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#2082e6] h-full w-[42%]" />
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDailyMissionModal(true)}
                      className="py-1 px-2.5 bg-[#1b5cb0] text-white font-black text-[10px] rounded-lg shadow shrink-0 cursor-pointer"
                    >
                      ミッション一覧
                    </button>
                  </div>

                  {/* Login Bonus Card */}
                  <div className="bg-[#f5efe0] border-2 border-[#c5af83] rounded-xl p-2.5 flex items-center justify-between shadow-sm">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-black text-[#a03612]">🎁 ログインボーナス</span>
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#382613]">
                        <span>明日の報酬</span>
                        <span className="text-blue-600 font-mono">💎 × 50</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDailyMissionModal(true)}
                      className="py-1 px-2.5 bg-[#1b5cb0] text-white font-black text-[10px] rounded-lg shadow shrink-0 cursor-pointer"
                    >
                      報酬を確認
                    </button>
                  </div>

                </div>

              </div>

            </div>

            {/* ======================================================= */}
            {/* ■ 下部エリア: TODAY LOG (今日の学習記録 & 週推移グラフ)    */}
            {/* ======================================================= */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              
              {/* TODAY LOG (8 Cols on XL) */}
              <div className="xl:col-span-8 bg-[#f5efe0] border-4 border-[#c5af83] rounded-2xl p-3 sm:p-5 shadow-md space-y-3">
                <div className="flex items-center gap-2 border-b border-[#ded1b6] pb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="font-black text-sm sm:text-base text-[#1b3863] font-cinzel">
                    TODAY LOG
                  </h3>
                  <span className="text-xs font-bold text-[#5c4936]">今日の学習記録</span>
                  <HelpCircle className="w-4 h-4 text-[#8c7659] cursor-pointer" />
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: '解いた問題', value: `${player.totalAnswered}問`, note: `初回クリア ${firstClearCount}問`, icon: Edit3, color: 'text-emerald-700' },
                    { label: '正答率', value: `${correctRate}%`, note: `${player.correctAnswered}/${player.totalAnswered || 0}問 正解`, icon: Target, color: 'text-orange-700' },
                    { label: '連続正解', value: `${player.currentStreak}問`, note: '正解を重ねよう', icon: Flame, color: 'text-purple-700' },
                    { label: '学習日数', value: `${player.studyDaysCount}日`, note: `Lv.${player.level}まで成長`, icon: Trophy, color: 'text-blue-700' },
                  ].map((stat) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-[#f9f5ea] border-2 border-[#ded1b6] rounded-xl p-3 shadow-inner">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3a2817]">
                          <StatIcon className={`w-4 h-4 ${stat.color}`} /> {stat.label}
                        </div>
                        <div className={`mt-3 text-xl font-black font-mono ${stat.color}`}>{stat.value}</div>
                        <p className="mt-1 text-[10px] text-slate-500 font-bold">{stat.note}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Card 1: 学習時間 */}
                  <div className="bg-[#f9f5ea] border-2 border-[#ded1b6] rounded-xl p-3 space-y-2 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3a2817]">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>学習時間</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#1d529a] font-mono">24分</span>
                        <span className="text-xs font-bold text-blue-600 font-mono">(+6分)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">目標 30分</p>
                    </div>

                    {/* Blue Mini Line Graph */}
                    <div className="h-16 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                        <polyline
                          fill="none"
                          stroke="#2078e6"
                          strokeWidth="2.5"
                          points="0,30 16,28 32,18 48,25 64,22 80,18 96,26"
                        />
                        <circle cx="96" cy="26" r="3.5" fill="#2078e6" />
                      </svg>
                      {/* Badge Tag */}
                      <div className="absolute top-0 right-0 bg-blue-100 border border-blue-400 text-blue-800 text-[9px] font-black px-1 rounded shadow">
                        24分(日)
                      </div>
                    </div>

                    <div className="flex justify-between text-[9px] text-[#7a6854] font-mono font-bold px-0.5">
                      <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
                    </div>

                    <button className="w-full py-1 bg-[#eae0cc] hover:bg-[#ded0b6] border border-[#baa780] text-[#4a3622] font-black text-[10px] rounded-lg transition-all cursor-pointer">
                      他の人を見る
                    </button>
                  </div>

                  {/* Card 2: 解いた問題数 */}
                  <div className="bg-[#f9f5ea] border-2 border-[#ded1b6] rounded-xl p-3 space-y-2 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3a2817]">
                      <Edit3 className="w-4 h-4 text-emerald-600" />
                      <span>解いた問題数</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-emerald-700 font-mono">43問</span>
                        <span className="text-xs font-bold text-emerald-600 font-mono">(+12問)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">目標 50問</p>
                    </div>

                    {/* Green Mini Line Graph */}
                    <div className="h-16 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          points="0,32 16,24 32,16 48,25 64,20 80,21 96,23"
                        />
                        <circle cx="96" cy="23" r="3.5" fill="#10b981" />
                      </svg>
                      <div className="absolute top-0 right-0 bg-emerald-100 border border-emerald-400 text-emerald-800 text-[9px] font-black px-1 rounded shadow">
                        43問(日)
                      </div>
                    </div>

                    <div className="flex justify-between text-[9px] text-[#7a6854] font-mono font-bold px-0.5">
                      <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
                    </div>

                    <button className="w-full py-1 bg-[#eae0cc] hover:bg-[#ded0b6] border border-[#baa780] text-[#4a3622] font-black text-[10px] rounded-lg transition-all cursor-pointer">
                      他の人を見る
                    </button>
                  </div>

                  {/* Card 3: 正答率 */}
                  <div className="bg-[#f9f5ea] border-2 border-[#ded1b6] rounded-xl p-3 space-y-2 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3a2817]">
                      <Target className="w-4 h-4 text-orange-600" />
                      <span>正答率</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-orange-700 font-mono">92%</span>
                        <span className="text-xs font-bold text-orange-600 font-mono">(+4%)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">目標 90%</p>
                    </div>

                    {/* Orange Mini Line Graph */}
                    <div className="h-16 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                        <polyline
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2.5"
                          points="0,28 16,18 32,12 48,20 64,15 80,18 96,16"
                        />
                        <circle cx="96" cy="16" r="3.5" fill="#f97316" />
                      </svg>
                      <div className="absolute top-0 right-0 bg-orange-100 border border-orange-400 text-orange-800 text-[9px] font-black px-1 rounded shadow">
                        92%(日)
                      </div>
                    </div>

                    <div className="flex justify-between text-[9px] text-[#7a6854] font-mono font-bold px-0.5">
                      <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
                    </div>

                    <button className="w-full py-1 bg-[#eae0cc] hover:bg-[#ded0b6] border border-[#baa780] text-[#4a3622] font-black text-[10px] rounded-lg transition-all cursor-pointer">
                      他の人を見る
                    </button>
                  </div>

                  {/* Card 4: 連続学習日数 */}
                  <div className="bg-[#f9f5ea] border-2 border-[#ded1b6] rounded-xl p-3 space-y-2 flex flex-col justify-between shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3a2817]">
                      <Flame className="w-4 h-4 text-purple-600" />
                      <span>連続学習日数</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-purple-700 font-mono">7日</span>
                        <span className="text-xs font-bold text-purple-600 font-mono">(+1日)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">継続中！</p>
                    </div>

                    {/* Purple Mini Line Graph */}
                    <div className="h-16 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                        <polyline
                          fill="none"
                          stroke="#9333ea"
                          strokeWidth="2.5"
                          points="0,35 16,30 32,25 48,20 64,15 80,10 96,5"
                        />
                        <circle cx="96" cy="5" r="3.5" fill="#9333ea" />
                      </svg>
                      <div className="absolute top-0 right-0 bg-purple-100 border border-purple-400 text-purple-800 text-[9px] font-black px-1 rounded shadow">
                        7日(日)
                      </div>
                    </div>

                    <div className="flex justify-between text-[9px] text-[#7a6854] font-mono font-bold px-0.5">
                      <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
                    </div>

                    <button className="w-full py-1 bg-[#eae0cc] hover:bg-[#ded0b6] border border-[#baa780] text-[#4a3622] font-black text-[10px] rounded-lg transition-all cursor-pointer">
                      他の人を見る
                    </button>
                  </div>

                </div>
              </div>

              {/* 右側: 今週の学習時間の推移 (4 Cols on XL) */}
              <div className="xl:col-span-4 bg-[#f5efe0] border-4 border-[#c5af83] rounded-2xl p-4 shadow-md flex flex-col justify-between space-y-3">
                <h4 className="font-black text-sm text-[#1a3863]">次のおすすめ</h4>
                <div className="rounded-xl border border-[#d5c3a0] bg-[#f9f5ea] p-3">
                  <p className="text-xs font-black text-[#382613]">{player.totalAnswered === 0 ? '最初の問題に挑戦しよう！' : player.points < 30 ? 'KQポイントをためよう！' : 'ごほうびを選べます！'}</p>
                  <p className="mt-1 text-[11px] font-bold text-[#6e5843]">
                    {player.totalAnswered === 0 ? 'クエストで算数に答えると、ポイントと育成アイテムが手に入ります。' : player.points < 30 ? `あと${30 - player.points}ポイントでガチャ1回` : `現在${player.points}ポイント。ショップなら欲しい品を選べます。`}
                  </p>
                </div>
                <button
                  onClick={() => player.totalAnswered === 0 || player.points < 30 ? onNavigate('map') : onSelectTab?.('shop')}
                  className="rounded-xl border-2 border-[#5497f0] bg-gradient-to-b from-[#1d6ad2] to-[#104899] px-4 py-2.5 text-xs font-black text-white shadow hover:brightness-110"
                >
                  {player.totalAnswered === 0 || player.points < 30 ? '問題に挑戦する' : 'ショップへ行く'}
                </button>
              </div>

              <div className="hidden xl:col-span-4 bg-[#f5efe0] border-4 border-[#c5af83] rounded-2xl p-3.5 shadow-md flex-col justify-between space-y-2">
                <div className="flex items-center justify-between border-b border-[#ded1b6] pb-1.5">
                  <h4 className="font-black text-xs text-[#1a3863]">今週の学習時間の推移（分）</h4>
                  <HelpCircle className="w-4 h-4 text-[#8c7659] cursor-pointer" />
                </div>

                {/* Graph Container */}
                <div className="h-32 w-full relative pt-4">
                  {/* Goal dashed line */}
                  <div className="absolute top-8 left-0 right-0 border-b border-dashed border-blue-400 flex justify-between text-[9px] text-blue-600 font-bold px-1">
                    <span>目標 20分</span>
                  </div>

                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                    <polyline
                      fill="none"
                      stroke="#2078e6"
                      strokeWidth="2"
                      points="0,32 16,22 32,16 48,20 64,12 80,4 96,18"
                    />
                    <circle cx="96" cy="18" r="3" fill="#2078e6" />
                  </svg>
                  <div className="absolute top-2 right-0 bg-blue-100 border border-blue-400 text-blue-800 text-[9px] font-black px-1 rounded shadow">
                    24分(日)
                  </div>
                </div>

                <div className="flex justify-between text-[9px] text-[#7a6854] font-mono font-bold px-1 border-t border-[#e2d4b7] pt-1">
                  <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#ded1b6]">
                  <button className="py-1 px-3 bg-[#eae0cc] border border-[#baa780] text-[#3a2817] font-black text-xs rounded-lg flex items-center gap-1 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" /> グラフをシェア
                  </button>
                  <span className="text-[11px] font-bold text-[#6e5843]">7日間の平均: <strong className="font-mono text-blue-700">21分</strong></span>
                </div>

                {/* Other Users list */}
                <div className="pt-2 border-t border-[#ded1b6] space-y-1">
                  <span className="text-[10px] font-bold text-[#6e5843]">他の人の記録をみる</span>
                  <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                    <div className="bg-[#f8f3e8] p-1 rounded border border-[#e2d4b7]">りくと (32分)</div>
                    <div className="bg-[#f8f3e8] p-1 rounded border border-[#e2d4b7]">あおい (28分)</div>
                    <div className="bg-[#f8f3e8] p-1 rounded border border-[#e2d4b7]">ひなた (25分)</div>
                    <div className="bg-[#f8f3e8] p-1 rounded border border-[#e2d4b7]">そうた (24分)</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Footer Note */}
          <footer className="bg-[#0a1832] text-slate-400 text-[10px] py-1.5 px-4 text-center border-t border-[#1a335a] font-mono">
            学習成果はこの端末に自動保存されます。次回も「つづきから」遊べます。
          </footer>

        </div>
      </div>

      {/* Modals */}
      {showDailyMissionModal && (
        <DailyMissionModal
          player={player}
          onClose={() => setShowDailyMissionModal(false)}
          onUpdatePlayer={(updated) => {
            savePlayerData(updated);
            if (onUpdatePlayer) onUpdatePlayer(updated);
          }}
        />
      )}

      {showZukanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500 rounded-2xl p-4 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowZukanModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white font-bold text-xl px-2"
            >
              ✕
            </button>
            <CompanionZukanView player={player} onClose={() => setShowZukanModal(false)} />
          </div>
        </div>
      )}

      {showHeroStatusModal && (
        <HeroStatusModal
          player={player}
          onClose={() => setShowHeroStatusModal(false)}
          onPlayerUpdate={(updated) => {
            savePlayerData(updated);
            if (onUpdatePlayer) onUpdatePlayer(updated);
          }}
        />
      )}
    </div>
  );
};
