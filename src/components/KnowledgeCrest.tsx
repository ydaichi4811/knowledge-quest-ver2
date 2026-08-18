import React from 'react';
import { motion } from 'motion/react';

export type CrestRank = 'initial' | 'bronze' | 'silver' | 'gold' | 'rainbow';
export type CrestElement = '草' | '火' | '水' | '風' | '光' | '闇';

export interface KnowledgeCrestProps {
  rank?: CrestRank;
  element?: CrestElement;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isGlowing?: boolean;
  isResonating?: boolean;
  gradeLevel?: number; // 1~6年生
  className?: string;
  onClick?: () => void;
}

export const KnowledgeCrest: React.FC<KnowledgeCrestProps> = ({
  rank = 'silver',
  element = '草',
  size = 'md',
  isGlowing = false,
  isResonating = false,
  gradeLevel = 4,
  className = '',
  onClick,
}) => {
  // Size mapping (px)
  const sizeMap = {
    xs: 24,
    sm: 36,
    md: 52,
    lg: 80,
    xl: 120,
  };

  const dim = sizeMap[size];

  // Element Center Colors & Glow
  const elementColors: Record<CrestElement, { primary: string; secondary: string; glow: string }> = {
    草: { primary: '#10b981', secondary: '#059669', glow: '#a7f3d0' },
    火: { primary: '#ef4444', secondary: '#dc2626', glow: '#fca5a5' },
    水: { primary: '#0284c7', secondary: '#0369a1', glow: '#7dd3fc' },
    風: { primary: '#10b981', secondary: '#047857', glow: '#6ee7b7' },
    光: { primary: '#f59e0b', secondary: '#d97706', glow: '#fef08a' },
    闇: { primary: '#8b5cf6', secondary: '#6d28d9', glow: '#c084fc' },
  };

  const elemStyle = elementColors[element] || elementColors['草'];

  // Rank Frame Styles & Decorations
  const rankStyles: Record<CrestRank, { frameGradient: string; stroke: string; jewels: boolean; wings: boolean; crown: boolean }> = {
    initial: { frameGradient: 'initialGrad', stroke: '#94a3b8', jewels: false, wings: false, crown: false },
    bronze: { frameGradient: 'bronzeGrad', stroke: '#d97706', jewels: false, wings: false, crown: false },
    silver: { frameGradient: 'silverGrad', stroke: '#e2e8f0', jewels: true, wings: false, crown: false },
    gold: { frameGradient: 'goldGrad', stroke: '#fbbf24', jewels: true, wings: true, crown: false },
    rainbow: { frameGradient: 'rainbowGrad', stroke: '#ffffff', jewels: true, wings: true, crown: true },
  };

  const currentRankStyle = rankStyles[rank];

  // Grade level rounding tweak (Grades 1-2 rounded, 3-4 standard, 5-6 sharp royal)
  const cornerRadius = gradeLevel <= 2 ? 6 : gradeLevel <= 4 ? 3 : 1;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
      style={{ width: dim, height: dim }}
    >
      {/* Outer Glow Effect on Correct/Glowing */}
      {(isGlowing || isResonating || rank === 'rainbow') && (
        <motion.div
          animate={
            isResonating
              ? { scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }
              : { scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }
          }
          transition={{ duration: isResonating ? 1 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full blur-md"
          style={{ backgroundColor: elemStyle.glow }}
        />
      )}

      {/* Sparkles Particle Animation for Resonance */}
      {isResonating && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <motion.div
            animate={{ y: [-10, -25], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-amber-300 text-xs font-black"
          >
            ✦
          </motion.div>
          <motion.div
            animate={{ x: [10, 25], opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }}
            className="absolute top-1/2 right-0 text-yellow-200 text-xs"
          >
            ★
          </motion.div>
          <motion.div
            animate={{ x: [-10, -25], opacity: [0, 1, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/2 left-0 text-emerald-300 text-xs"
          >
            ✧
          </motion.div>
        </div>
      )}

      {/* Main Vector SVG */}
      <motion.svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-md"
        animate={isResonating ? { rotate: [0, -3, 3, 0] } : {}}
        transition={{ duration: 0.5, repeat: isResonating ? Infinity : 0 }}
      >
        <defs>
          {/* Frame Rank Gradients */}
          <linearGradient id="initialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="20%" stopColor="#f59e0b" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="80%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* Element Core Gradient */}
          <radialGradient id="elemCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={elemStyle.glow} />
            <stop offset="60%" stopColor={elemStyle.primary} />
            <stop offset="100%" stopColor={elemStyle.secondary} />
          </radialGradient>
        </defs>

        {/* 1. WINGS (Gold & Rainbow ranks) */}
        {currentRankStyle.wings && (
          <g id="CREST_WINGS">
            <path d="M 22 50 Q 5 35 12 18 Q 30 25 32 42 Z" fill={`url(#${currentRankStyle.frameGradient})`} opacity="0.9" />
            <path d="M 78 50 Q 95 35 88 18 Q 70 25 68 42 Z" fill={`url(#${currentRankStyle.frameGradient})`} opacity="0.9" />
          </g>
        )}

        {/* 2. CROWN (Rainbow rank) */}
        {currentRankStyle.crown && (
          <g id="CREST_CROWN" transform="translate(0, -6)">
            <polygon points="50,12 42,22 50,18 58,22" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
            <circle cx="50" cy="12" r="2.5" fill="#ef4444" />
          </g>
        )}

        {/* 3. HEXAGON BASE SHIELD FRAME (六角形の基礎紋章) */}
        <polygon
          points="50,10 85,30 85,70 50,90 15,70 15,30"
          fill={`url(#${currentRankStyle.frameGradient})`}
          stroke={currentRankStyle.stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
          rx={cornerRadius}
        />

        {/* Inner Dark Inset */}
        <polygon
          points="50,17 78,33 78,67 50,83 22,67 22,33"
          fill="#0f172a"
          stroke={`url(#${currentRankStyle.frameGradient})`}
          strokeWidth="1.5"
        />

        {/* 4. COMPASS & RAYS MOTIF (コンパスと光の羅針盤) */}
        <line x1="50" y1="18" x2="50" y2="82" stroke="#334155" strokeWidth="1" />
        <line x1="23" y1="50" x2="77" y2="50" stroke="#334155" strokeWidth="1" />

        {/* 4 Star Points Ray */}
        <polygon points="50,25 54,46 75,50 54,54 50,75 46,54 25,50 46,46" fill="#1e293b" opacity="0.8" />

        {/* 5. OPEN KNOWLEDGE BOOK (知識の開かれた本) */}
        <path d="M 50 68 Q 36 62 28 66 L 28 46 Q 36 42 50 48 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 50 68 Q 64 62 72 66 L 72 46 Q 64 42 50 48 Z" fill="#e2e8f0" opacity="0.95" />
        <line x1="50" y1="48" x2="50" y2="68" stroke="#f59e0b" strokeWidth="1.5" />

        {/* 6. ELEMENTAL KNOWLEDGE CRYSTAL (中心の属性クリスタル) */}
        <polygon points="50,32 60,42 50,52 40,42" fill="url(#elemCoreGrad)" stroke="#ffffff" strokeWidth="1" />

        {/* Star Sparkle on Crystal */}
        <polygon points="50,38 52,42 56,42 53,44 54,48 50,45 46,48 47,44 44,42 48,42" fill="#ffffff" />

        {/* 7. LEAF & NATURE ACCENTS (下部の双葉・成長モチーフ) */}
        <path d="M 50 83 Q 38 78 35 72 Q 45 72 50 83 Z" fill="#10b981" />
        <path d="M 50 83 Q 62 78 65 72 Q 55 72 50 83 Z" fill="#059669" />

        {/* 8. CORNER JEWELS (For Silver / Gold / Rainbow Ranks) */}
        {currentRankStyle.jewels && (
          <g id="CREST_JEWELS">
            <circle cx="50" cy="18" r="2.5" fill="#fbbf24" />
            <circle cx="78" cy="33" r="2.5" fill="#38bdf8" />
            <circle cx="78" cy="67" r="2.5" fill="#34d399" />
            <circle cx="22" cy="67" r="2.5" fill="#34d399" />
            <circle cx="22" cy="33" r="2.5" fill="#38bdf8" />
          </g>
        )}
      </motion.svg>
    </div>
  );
};
