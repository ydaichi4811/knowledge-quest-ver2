import React from 'react';
import { PlayerData } from '../../types';
import { HeroPortrait } from './HeroPortrait';
import { CurrencyBadge } from './CurrencyBadge';
import { EnergyGauge } from './EnergyGauge';
import { Mail, Settings } from 'lucide-react';

export interface PlayerStatusBarProps {
  player: PlayerData;
  onOpenStatus?: () => void;
  onOpenMail?: () => void;
  onOpenSettings?: () => void;
  onAddEnergy?: () => void;
  unreadMailCount?: number;
  className?: string;
}

export const PlayerStatusBar: React.FC<PlayerStatusBarProps> = ({
  player,
  onOpenStatus,
  onOpenMail,
  onOpenSettings,
  onAddEnergy,
  unreadMailCount = 2,
  className = '',
}) => {
  const level = player.level || 1;
  const exp = player.exp || 0;
  const maxExp = player.maxExp || 100;
  const expPercent = Math.min(100, Math.max(0, Math.round((exp / maxExp) * 100)));

  const coinAmount = player.points || 0;
  const gemAmount = Math.max(0, Math.floor((player.points || 0) / 5) + (player.foodItemsCount || 0));
  const energyCurrent = player.stamina ?? player.energy ?? 84;
  const energyMax = player.maxStamina ?? player.maxEnergy ?? 100;

  return (
    <header
      className={`bg-gradient-to-r from-[#f5ebd6] via-[#f8f1e3] to-[#ebdcc2] border-b-2 border-[#d0bc93] px-3 sm:px-5 py-2 shadow-md relative z-30 ${className}`}
    >
      <div className="max-w-[1420px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3">
        {/* スマホ上段 / PC左側: HeroPortrait, Level, EXP Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* Hero Portrait Icon */}
          <HeroPortrait
            player={player}
            size="md"
            onClick={onOpenStatus}
            title="主人公ステータスを見る"
          />

          {/* Level & EXP Gauge */}
          <div
            onClick={onOpenStatus}
            className="flex-1 min-w-0 cursor-pointer group flex flex-col justify-center"
            title="主人公ステータスを見る"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-black text-sm sm:text-base text-[#382613] tracking-tight shrink-0">
                Lv.{level}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#6b5235] truncate">
                {player.name || '主人公'}
              </span>
            </div>

            {/* EXP Bar */}
            <div className="w-full max-w-[200px] sm:max-w-[240px] bg-[#cfbe9b] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#ab9976] relative shadow-inner">
              <div
                className="bg-gradient-to-r from-[#2178e6] to-[#409cff] h-full rounded-full transition-all duration-500"
                style={{ width: `${expPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] tracking-tighter whitespace-nowrap px-1">
                EXP {exp} / {maxExp} ({expPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* スマホ下段 / PC右側: KQ, Gem, Energy, Mail, Settings */}
        <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2.5 flex-wrap sm:flex-nowrap shrink-0 pt-1 md:pt-0 border-t border-[#d8c8a8] md:border-t-0">
          {/* KQ Badge */}
          <CurrencyBadge
            type="kq"
            value={coinAmount}
            label="KQ"
          />

          {/* Gem Badge */}
          <CurrencyBadge
            type="gem"
            value={gemAmount}
            label="Gem"
          />

          {/* Energy Gauge */}
          <EnergyGauge
            current={energyCurrent}
            max={energyMax}
            onAddEnergy={onAddEnergy}
          />

          {/* Action Buttons: Mail & Settings (>=44px touch targets) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mail Button */}
            <button
              type="button"
              onClick={onOpenMail}
              aria-label="メールボックス"
              className="relative min-w-[44px] min-h-[44px] bg-[#ebdcc0] hover:bg-[#e0d0b0] active:bg-[#d5c2a0] border border-[#c2b08d] rounded-xl flex items-center justify-center cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 transition-colors shrink-0"
            >
              <Mail className="w-5 h-5 text-[#4a3622]" />
              {unreadMailCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-black min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow">
                  {unreadMailCount}
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="設定"
              className="min-w-[44px] min-h-[44px] bg-[#ebdcc0] hover:bg-[#e0d0b0] active:bg-[#d5c2a0] border border-[#c2b08d] rounded-xl flex items-center justify-center cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 transition-colors shrink-0"
            >
              <Settings className="w-5 h-5 text-[#4a3622]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
