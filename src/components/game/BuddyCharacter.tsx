import React, { useState } from 'react';
import { PlayerData, CompanionData, CompanionStage } from '../../types';
import { BuddyStageType, CharacterSize } from './characterTypes';
import { BUDDY_ASSETS } from '../../config/characterAssets';

export interface BuddyCharacterProps {
  player?: PlayerData | null;
  companion?: CompanionData;
  stage?: BuddyStageType | CompanionStage;
  size?: CharacterSize | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * BuddyCharacter is the single unified common component for displaying
 * Knowledge Quest's official companion dragon (バディ Ver.1.0 ラーニィ - 紫ドラゴン) across all game screens.
 */
export const BuddyCharacter: React.FC<BuddyCharacterProps> = ({
  player,
  companion,
  stage = 'hatched',
  size = 'md',
  alt = '【正式バディ Ver.1.0】ラーニィ (紫ドラゴン)',
  className = '',
  style,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);

  // Normalize size
  let pixelSize = 96;
  if (size === 'xs') { pixelSize = 48; }
  else if (size === 'small' || size === 'sm') { pixelSize = 64; }
  else if (size === 'medium' || size === 'md') { pixelSize = 96; }
  else if (size === 'large' || size === 'lg') { pixelSize = 144; }
  else if (size === 'xl') { pixelSize = 192; }
  else if (size === '2xl') { pixelSize = 256; }

  let mappedStage = 'child';
  if (stage === 'egg') mappedStage = 'egg';
  else if (stage === 'baby' || stage === 'hatched') mappedStage = 'baby';
  else if (stage === 'grown') mappedStage = 'grown';
  else if (stage === 'final' || stage === 'evolved') mappedStage = 'final';

  const assetPath = BUDDY_ASSETS[mappedStage]?.image || BUDDY_ASSETS.child?.image || '/assets/buddy/larny/idle.png';

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
          ラーニィ画像の読み込みに失敗
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
          className="w-full h-full pointer-events-none transition-transform duration-300"
          style={{
            objectFit: 'contain',
            objectPosition: 'center bottom',
          }}
        />
      )}
    </div>
  );
};
