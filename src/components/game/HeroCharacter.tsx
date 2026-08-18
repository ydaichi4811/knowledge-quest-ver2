import React, { useState } from 'react';
import { PlayerData, HeroGender } from '../../types';
import { HeroPoseType, HeroExpressionType, CharacterSize } from './characterTypes';
import { HERO_ASSETS } from '../../config/characterAssets';

export interface HeroCharacterProps {
  player?: PlayerData | null;
  gender?: HeroGender;
  pose?: HeroPoseType;
  expression?: HeroExpressionType | string;
  size?: CharacterSize | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'small' | 'medium' | 'large';
  viewType?: string;
  outfitRank?: string;
  element?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * HeroCharacter is the single unified common component for displaying
 * Knowledge Quest's official protagonist (正式主人公 Ver.1.0) across all game screens:
 * ホーム画面, ゲーム開始/タイトル画面, クエスト画面, プロフィール, ランキング, キャラクター変更画面, マイホーム 等
 */
export const HeroCharacter: React.FC<HeroCharacterProps> = ({
  player,
  gender,
  pose = 'idle',
  size = 'md',
  alt = '【正式主人公Ver.1.0】',
  className = '',
  style,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const activeGender: HeroGender = gender || player?.character?.gender || player?.gender || 'boy';

  // Normalize pixel size
  let pixelSize = 140;
  if (size === 'xs' || size === 'small' || size === 'sm') { pixelSize = 72; }
  else if (size === 'medium' || size === 'md') { pixelSize = 140; }
  else if (size === 'large' || size === 'lg') { pixelSize = 220; }
  else if (size === 'xl' || size === '2xl') { pixelSize = 300; }

  // Asset key resolution
  const poseKey = pose === 'attack' ? 'attack' : pose === 'damage' ? 'damage' : pose === 'victory' ? 'victory' : 'idle';
  const assetKey = `${activeGender}_${poseKey}`;
  
  const assetPath = HERO_ASSETS[assetKey]?.image || `/assets/hero/${activeGender}/${poseKey}.png`;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-end justify-center relative shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role="img"
      aria-label={alt}
      style={{ ...style, width: `${pixelSize}px`, height: `${pixelSize}px` }}
    >
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] sm:text-xs text-center p-1 rounded font-bold">
          {activeGender === 'girl' ? '女の子画像の読み込みに失敗' : '男の子画像の読み込みに失敗'}
        </div>
      ) : (
        <img
          src={assetPath}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={(event) => {
            console.error({
              requestedSrc: event.currentTarget.src,
              naturalWidth: event.currentTarget.naturalWidth,
              naturalHeight: event.currentTarget.naturalHeight
            });
            setHasError(true);
          }}
          className="w-full h-full object-contain object-bottom pointer-events-none transition-transform duration-300"
        />
      )}
    </div>
  );
};
