import React from 'react';
import { PlayerData, HeroGender } from '../../types';
import { KnowledgeCrest } from '../KnowledgeCrest';

export interface HeroPortraitProps {
  player?: PlayerData | null;
  gender?: HeroGender;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  player,
  gender,
  size = 'md',
  className = '',
  onClick,
  title = '主人公プロファイル',
}) => {
  const activeGender: HeroGender = gender || player?.character?.gender || player?.gender || 'boy';
  const activeElement = player?.partner?.element || '火';

  // Size mapping
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-lg',
  };

  const crestSizes: Record<'xs' | 'sm' | 'md' | 'lg', 'xs' | 'sm' | 'md'> = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  };

  return (
    <div
      onClick={onClick}
      title={title}
      className={`relative rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-md shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0e2142] to-[#071328] flex items-center justify-center overflow-hidden border border-amber-300/40 relative">
        {/* Knowledge Crest Emblem - Face/Emblem centered gracefully with no sword/torso chop */}
        <KnowledgeCrest
          size={crestSizes[size]}
          element={activeElement}
          rank="gold"
          className="scale-95"
        />

        {/* Gender Badge Indicator Dot */}
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-900 shadow-sm ${
            activeGender === 'girl' ? 'bg-pink-400' : 'bg-blue-400'
          }`}
          title={activeGender === 'girl' ? '女の子' : '男の子'}
        />
      </div>
    </div>
  );
};
