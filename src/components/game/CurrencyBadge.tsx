import React from 'react';

export interface CurrencyBadgeProps {
  type: 'kq' | 'gem' | 'coin';
  value: number;
  label?: string;
  icon?: string | React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({
  type,
  value,
  label,
  icon,
  className = '',
  onClick,
}) => {
  const defaults = {
    kq: {
      defaultIcon: '🪙',
      defaultLabel: 'KQ',
      borderColor: 'border-[#c2b08d]',
      bgColor: 'bg-[#ebdcc0]',
      textColor: 'text-[#3a2817]',
    },
    coin: {
      defaultIcon: '🪙',
      defaultLabel: 'G',
      borderColor: 'border-[#c2b08d]',
      bgColor: 'bg-[#ebdcc0]',
      textColor: 'text-[#3a2817]',
    },
    gem: {
      defaultIcon: '💎',
      defaultLabel: 'Gem',
      borderColor: 'border-[#b1cadc]',
      bgColor: 'bg-[#e2eff8]',
      textColor: 'text-[#183954]',
    },
  };

  const config = defaults[type] || defaults.kq;
  const displayIcon = icon || config.defaultIcon;
  const displayLabel = label || config.defaultLabel;

  return (
    <div
      onClick={onClick}
      className={`border ${config.borderColor} ${config.bgColor} px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:brightness-95 transition-all' : ''
      } ${className}`}
    >
      <span className="text-sm leading-none shrink-0">{displayIcon}</span>
      <div className="flex items-baseline gap-1">
        <span className={`font-black text-xs sm:text-sm ${config.textColor} font-mono tracking-tight`}>
          {value.toLocaleString()}
        </span>
        <span className={`text-[10px] font-bold opacity-75 ${config.textColor}`}>
          {displayLabel}
        </span>
      </div>
    </div>
  );
};
