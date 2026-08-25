import React from 'react';
import { FuriganaText } from './FuriganaText';
import { GameScreen } from '../types';

export type MainTabType =
  | 'study'
  | 'review'
  | 'tree'
  | 'character'
  | 'ranking'
  | 'zukan'
  | 'gacha'
  | 'shop'
  | 'settings';

export type NavTabType = MainTabType | 'map';

interface GameFooterMenuProps {
  activeTab: MainTabType;
  currentScreen?: GameScreen;
  onSelectTab: (tab: NavTabType) => void;
}

export const GameFooterMenu: React.FC<GameFooterMenuProps> = ({
  activeTab,
  currentScreen,
  onSelectTab,
}) => {
  const menuItems: { id: NavTabType; label: string; icon: string; badge?: string }[] = [
    { id: 'study', label: 'ホーム', icon: '🏠' },
    { id: 'map', label: 'マップ', icon: '🗺️', badge: '冒険' },
    { id: 'tree', label: 'クエスト', icon: '⚔️', badge: '挑戦' },
    { id: 'character', label: 'バディ', icon: '🐾' },
    { id: 'review', label: '復習', icon: '📖' },
    { id: 'ranking', label: 'ランキング', icon: '🏆' },
    { id: 'gacha', label: 'ガチャ', icon: '🎁' },
    { id: 'shop', label: 'ショップ', icon: '🛍️' },
    { id: 'settings', label: '設定', icon: '⚙️' },
  ];

  return (
    <nav className="w-full bg-slate-950/95 border-t-4 border-amber-500/80 shadow-[0_-10px_25px_rgba(0,0,0,0.95)] px-1 sm:px-3 py-2 relative z-40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-9 gap-1.5 sm:gap-2">
        {menuItems.map((item) => {
          const isSelected =
            item.id === 'map'
              ? currentScreen === 'map'
              : currentScreen !== 'map' && activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'btn-royal-gold ring-2 ring-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.85)] scale-105 z-10 font-black'
                  : 'bg-slate-900/90 border-2 border-slate-700/80 hover:border-amber-400/60 text-slate-200 hover:scale-105'
              }`}
            >
              {item.badge && !isSelected && (
                <span className="absolute -top-1.5 right-0.5 bg-rose-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full border border-rose-300 animate-pulse shadow">
                  {item.badge}
                </span>
              )}

              <span className="text-xl sm:text-2xl mb-0.5 leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {item.icon}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-black tracking-tight leading-tight w-full text-center ${
                  isSelected ? 'text-slate-950' : 'text-slate-100'
                }`}
              >
                <FuriganaText text={item.label} />
              </span>

              {/* Active Tab Indicator Glow Dot */}
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 mt-0.5 shadow-[0_0_8px_rgba(245,158,11,1)] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

