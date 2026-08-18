import React from 'react';
import { PlayerData, GameScreen } from '../types';
import { Shield, Map, Home, RotateCcw, Sparkles, Award } from 'lucide-react';

interface NavbarHeaderProps {
  player: PlayerData;
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  onOpenResetModal: () => void;
  onOpenStatus?: () => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  player,
  currentScreen,
  onNavigate,
  onOpenResetModal,
  onOpenStatus,
}) => {
  const expPercentage = Math.min(100, Math.round((player.exp / player.maxExp) * 100));

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b-2 border-amber-500/40 px-3 py-2 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="font-cinzel text-lg font-bold text-amber-300 tracking-wider leading-none">
              Knowledge Quest
            </h1>
            <p className="text-[10px] text-emerald-400 font-semibold tracking-tight">
              マスリア王国 5年算数
            </p>
          </div>
        </div>

        {/* Player Status Overview */}
        <div
          onClick={onOpenStatus}
          className={`flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30 ${
            onOpenStatus ? 'cursor-pointer hover:border-amber-400/70 hover:bg-slate-900 transition-all' : ''
          }`}
          title="主人公ステータスを見る"
        >
          {/* Level Badge */}
          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/50 px-2.5 py-0.5 rounded-lg text-amber-300 font-bold text-xs">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Lv.{player.level}</span>
          </div>

          {/* Name & Mode */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-sm max-w-[120px] truncate">
                {player.name}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  player.mode === 'adventure'
                    ? 'bg-blue-600/40 text-blue-300 border border-blue-400/40'
                    : 'bg-emerald-600/40 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                {player.mode === 'adventure' ? '🗡️ 冒険' : '🐾 育成'}
              </span>
            </div>

            {/* EXP Bar */}
            <div className="w-24 bg-slate-800 rounded-full h-2 border border-slate-700 overflow-hidden mt-0.5">
              <div
                className="bg-gradient-to-r from-blue-500 via-amber-400 to-amber-300 h-full transition-all duration-500"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>

          {/* KQ Points */}
          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-500/40 px-2 py-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs font-extrabold text-amber-300">
              {player.points} <span className="text-[10px] text-amber-400/80">KQ</span>
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentScreen === 'home'
                ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-md'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>ホーム</span>
          </button>

          <button
            onClick={() => onNavigate('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentScreen === 'map'
                ? 'bg-emerald-500 text-slate-950 border border-emerald-300 shadow-md'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>王国マップ</span>
          </button>

          <button
            onClick={onOpenResetModal}
            title="データ初期化"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/60 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">初期化</span>
          </button>
        </div>
      </div>
    </header>
  );
};
