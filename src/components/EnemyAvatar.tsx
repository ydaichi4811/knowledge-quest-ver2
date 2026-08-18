import React from 'react';
import { motion } from 'motion/react';

interface EnemyAvatarProps {
  type:
    | 'moya'
    | 'golem'
    | 'sprite'
    | 'guard'
    | 'bat'
    | 'sankaku'
    | 'boss_trapezoid'
    | 'dragon_red'
    | 'dragon_blue'
    | 'dragon_green'
    | 'dragon_shadow'
    | 'ghost_fire'
    | 'ghost_spirit'
    | 'ghost_lantern'
    | 'ghost_chain'
    | 'ogre_blue'
    | 'ogre_shadow'
    | 'ogre_cyclops'
    | 'ogre_mask';
  accentColor?: string;
  isHit?: boolean;
  isDefeated?: boolean;
  size?: 'normal' | 'large';
}

export const EnemyAvatar: React.FC<EnemyAvatarProps> = ({
  type,
  accentColor = '#38bdf8',
  isHit = false,
  isDefeated = false,
  size = 'normal',
}) => {
  const containerSizeClass = size === 'large' ? 'w-48 h-48 sm:w-60 sm:h-60' : 'w-36 h-36 sm:w-44 sm:h-44';

  // Hit shake / defeat animation variants
  const animationVariants = {
    normal: { scale: 1, x: 0, opacity: 1 },
    hit: { scale: [1, 1.15, 0.95, 1.05, 1], x: [0, -12, 12, -6, 0], opacity: 1 },
    defeated: { scale: 0, opacity: 0, rotate: 180 },
  };

  const currentAnim = isDefeated ? 'defeated' : isHit ? 'hit' : 'normal';

  return (
    <motion.div
      className={`relative flex items-center justify-center ${containerSizeClass}`}
      variants={animationVariants}
      animate={currentAnim}
      transition={{ duration: isHit ? 0.4 : isDefeated ? 0.6 : 0.3 }}
    >
      {/* Background glow circle */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse"
        style={{ backgroundColor: accentColor }}
      />

      {/* SVG Illustrations */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === 'moya' && (
          // メジャーモヤ (Major Moya - Misty cloud with tape measure marks)
          <g>
            <path
              d="M50 120 C30 120 20 100 30 80 C35 60 60 50 80 55 C90 35 120 30 140 50 C160 45 180 65 175 90 C185 110 170 130 150 130 Z"
              fill="url(#moyaGrad)"
              stroke="#38bdf8"
              strokeWidth="4"
            />
            {/* Measuring Tape Marks */}
            <path
              d="M 45 105 L 55 105 M 65 100 L 75 100 M 85 95 L 95 95 M 105 90 L 115 90 M 125 95 L 135 95 M 145 100 L 155 100"
              stroke="#facc15"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Expressive Cute Eyes */}
            <circle cx="80" cy="80" r="8" fill="#1e293b" />
            <circle cx="120" cy="80" r="8" fill="#1e293b" />
            <circle cx="82" cy="78" r="3" fill="#ffffff" />
            <circle cx="122" cy="78" r="3" fill="#ffffff" />
            {/* Cute smile */}
            <path d="M 92 95 Q 100 102 108 95" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="moyaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </g>
        )}

        {type === 'golem' && (
          // スクエアゴーレム (Square Golem - Blocky grid stone friend)
          <g>
            {/* Body Rect */}
            <rect x="50" y="50" width="100" height="100" rx="16" fill="url(#golemGrad)" stroke="#34d399" strokeWidth="5" />
            {/* Grid Pattern overlay */}
            <line x1="50" y1="83" x2="150" y2="83" stroke="#059669" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="116" x2="150" y2="116" stroke="#059669" strokeWidth="2" opacity="0.6" />
            <line x1="83" y1="50" x2="83" y2="150" stroke="#059669" strokeWidth="2" opacity="0.6" />
            <line x1="116" y1="50" x2="116" y2="150" stroke="#059669" strokeWidth="2" opacity="0.6" />
            {/* Glowing Eyes */}
            <rect x="70" y="75" width="18" height="18" rx="4" fill="#fbbf24" />
            <rect x="112" y="75" width="18" height="18" rx="4" fill="#fbbf24" />
            <rect x="75" y="80" width="8" height="8" rx="2" fill="#ffffff" />
            <rect x="117" y="80" width="8" height="8" rx="2" fill="#ffffff" />
            {/* Feet */}
            <rect x="60" y="150" width="25" height="15" rx="6" fill="#047857" />
            <rect x="115" y="150" width="25" height="15" rx="6" fill="#047857" />
            <defs>
              <linearGradient id="golemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
          </g>
        )}

        {type === 'sprite' && (
          // ナナメノコ (Nanamenoko - Slanted Parallelogram sprite)
          <g>
            <polygon
              points="70,50 160,50 130,140 40,140"
              fill="url(#spriteGrad)"
              stroke="#c084fc"
              strokeWidth="5"
            />
            {/* Slanted Accent Lines */}
            <line x1="60" y1="70" x2="135" y2="70" stroke="#f472b6" strokeWidth="3" strokeDasharray="6 4" />
            <line x1="50" y1="120" x2="125" y2="120" stroke="#f472b6" strokeWidth="3" strokeDasharray="6 4" />
            {/* Eyes */}
            <circle cx="85" cy="85" r="7" fill="#1e1b4b" />
            <circle cx="115" cy="85" r="7" fill="#1e1b4b" />
            <circle cx="87" cy="83" r="2.5" fill="#ffffff" />
            <circle cx="117" cy="83" r="2.5" fill="#ffffff" />
            {/* Cheeks */}
            <circle cx="75" cy="95" r="5" fill="#f472b6" opacity="0.8" />
            <circle cx="125" cy="95" r="5" fill="#f472b6" opacity="0.8" />
            <defs>
              <linearGradient id="spriteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </g>
        )}

        {type === 'guard' && (
          // パラレルガード (Parallel Guard - Knight with slanted shield)
          <g>
            {/* Body/Armor */}
            <rect x="70" y="80" width="60" height="70" rx="12" fill="#1e293b" stroke="#10b981" strokeWidth="4" />
            {/* Parallelogram Shield */}
            <polygon
              points="35,60 105,60 85,150 15,150"
              fill="url(#guardGrad)"
              stroke="#34d399"
              strokeWidth="4"
            />
            {/* Shield Emblem */}
            <line x1="45" y1="105" x2="95" y2="105" stroke="#fef08a" strokeWidth="4" />
            {/* Helmet visor */}
            <rect x="80" y="55" width="40" height="25" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
            <line x1="85" y1="67" x2="115" y2="67" stroke="#34d399" strokeWidth="3" />
            <defs>
              <linearGradient id="guardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
            </defs>
          </g>
        )}

        {type === 'bat' && (
          // トライアバット (Tria Bat - Triangular winged bat)
          <g>
            {/* Left Triangle Wing */}
            <polygon points="100,100 20,40 40,140" fill="#e11d48" opacity="0.9" />
            {/* Right Triangle Wing */}
            <polygon points="100,100 180,40 160,140" fill="#e11d48" opacity="0.9" />
            {/* Main Body Triangle */}
            <polygon points="100,50 140,130 60,130" fill="url(#batGrad)" stroke="#fda4af" strokeWidth="4" />
            {/* Bat Ears */}
            <polygon points="80,50 70,25 90,40" fill="#9f1239" />
            <polygon points="120,50 130,25 110,40" fill="#9f1239" />
            {/* Glowing Eyes */}
            <circle cx="88" cy="80" r="6" fill="#fef08a" />
            <circle cx="112" cy="80" r="6" fill="#fef08a" />
            <defs>
              <linearGradient id="batGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>
          </g>
        )}

        {type === 'sankaku' && (
          // さんかくの番人 (Sankaku Guardian - Three-pointed stone watcher)
          <g>
            {/* Main Outer Triangle */}
            <polygon points="100,30 170,160 30,160" fill="url(#sankakuGrad)" stroke="#f59e0b" strokeWidth="6" />
            {/* Inner Triangle Eye */}
            <polygon points="100,70 140,140 60,140" fill="#1e293b" stroke="#fcd34d" strokeWidth="3" />
            <circle cx="100" cy="110" r="14" fill="#f59e0b" />
            <circle cx="100" cy="110" r="6" fill="#ffffff" />
            <circle cx="100" cy="110" r="3" fill="#0f172a" />
            <defs>
              <linearGradient id="sankakuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
          </g>
        )}

        {type === 'boss_trapezoid' && (
          // トラペロード (Boss Trape Lord - Regal Lord of Trapezoids)
          <g>
            {/* Outer Regal Aura / Wings */}
            <polygon points="100,20 180,60 170,170 30,170 20,60" fill="#7e22ce" opacity="0.3" />
            {/* Crown Trapezoid */}
            <polygon points="60,30 140,30 160,65 40,65" fill="#f59e0b" stroke="#fef08a" strokeWidth="4" />
            <circle cx="100" cy="48" r="8" fill="#ef4444" />
            {/* Main Body Trapezoid */}
            <polygon points="50,70 150,70 175,160 25,160" fill="url(#bossGrad)" stroke="#fbbf24" strokeWidth="6" />
            {/* Glowing Gem Formula Core */}
            <polygon points="80,95 120,95 130,135 70,135" fill="#1e1b4b" stroke="#67e8f9" strokeWidth="3" />
            <text x="100" y="122" textAnchor="middle" fill="#67e8f9" fontSize="22" fontWeight="900" fontFamily="sans-serif">
              梯
            </text>
            {/* Eyes */}
            <circle cx="78" cy="85" r="7" fill="#fef08a" />
            <circle cx="122" cy="85" r="7" fill="#fef08a" />
            <circle cx="78" cy="85" r="3" fill="#1e1b4b" />
            <circle cx="122" cy="85" r="3" fill="#1e1b4b" />
            <defs>
              <linearGradient id="bossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#7e22ce" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* ================= OFFICIAL VER 2.0 MONSTER SERIES ================= */}
        {/* 1. DRAGON SERIES (ドラゴン系: 赤竜/青竜/緑竜/紫竜) */}
        {(type === 'dragon_red' || type === 'dragon_blue' || type === 'dragon_green' || type === 'dragon_shadow') && (
          <g>
            {/* Wings */}
            <path
              d="M 100 90 Q 30 20 20 90 Q 60 110 100 100 Q 140 110 180 90 Q 170 20 100 90 Z"
              fill={
                type === 'dragon_red' ? '#ef4444' : type === 'dragon_blue' ? '#0284c7' : type === 'dragon_green' ? '#16a34a' : '#7e22ce'
              }
              opacity="0.85"
            />
            {/* Body */}
            <path
              d="M 100 40 Q 130 60 120 120 Q 100 160 80 120 Q 70 60 100 40 Z"
              fill={
                type === 'dragon_red' ? '#b91c1c' : type === 'dragon_blue' ? '#0369a1' : type === 'dragon_green' ? '#15803d' : '#581c87'
              }
              stroke="#fbbf24"
              strokeWidth="3"
            />
            {/* Dragon Eyes */}
            <circle cx="90" cy="70" r="5" fill="#fef08a" />
            <circle cx="110" cy="70" r="5" fill="#fef08a" />
            <circle cx="90" cy="70" r="2" fill="#000000" />
            <circle cx="110" cy="70" r="2" fill="#000000" />
            {/* Horns */}
            <polygon points="85,50 75,25 92,42" fill="#fbbf24" />
            <polygon points="115,50 125,25 108,42" fill="#fbbf24" />
          </g>
        )}

        {/* 2. GHOST SERIES (ゴースト系: 炎/ローブ/ランタン/鎖) */}
        {(type === 'ghost_fire' || type === 'ghost_spirit' || type === 'ghost_lantern' || type === 'ghost_chain') && (
          <g>
            {/* Floating Ghost Hood */}
            <path
              d="M 100 30 C 50 30 50 110 40 160 C 70 145 100 165 130 145 C 150 160 160 110 100 30 Z"
              fill={
                type === 'ghost_fire' ? '#38bdf8' : type === 'ghost_spirit' ? '#3b0764' : type === 'ghost_lantern' ? '#0284c7' : '#475569'
              }
              stroke={type === 'ghost_fire' ? '#67e8f9' : '#c084fc'}
              strokeWidth="4"
            />
            {/* Glowing Ghost Eyes */}
            <circle cx="82" cy="85" r="8" fill="#67e8f9" />
            <circle cx="118" cy="85" r="8" fill="#67e8f9" />
            <circle cx="82" cy="85" r="4" fill="#ffffff" />
            <circle cx="118" cy="85" r="4" fill="#ffffff" />
          </g>
        )}

        {/* 3. HORROR / BLUE OGRE SERIES (ホラー・青鬼系: 青鬼/影/単眼/仮面) */}
        {(type === 'ogre_blue' || type === 'ogre_shadow' || type === 'ogre_cyclops' || type === 'ogre_mask') && (
          <g>
            {/* Ogre Horn */}
            <polygon points="100,20 85,50 115,50" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            {/* Ogre Head */}
            <rect
              x="55"
              y="50"
              width="90"
              height="90"
              rx="24"
              fill={type === 'ogre_blue' ? '#1d4ed8' : type === 'ogre_shadow' ? '#0f172a' : '#1e3a8a'}
              stroke="#60a5fa"
              strokeWidth="4"
            />
            {/* Fierce Eyes */}
            {type === 'ogre_cyclops' ? (
              <circle cx="100" cy="85" r="16" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
            ) : (
              <>
                <circle cx="80" cy="85" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <circle cx="120" cy="85" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              </>
            )}
            {/* Fangs Mouth */}
            <path d="M 75 115 Q 100 130 125 115" stroke="#ffffff" strokeWidth="4" fill="none" />
            <polygon points="82,115 87,125 92,115" fill="#ffffff" />
            <polygon points="108,115 113,125 118,115" fill="#ffffff" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
