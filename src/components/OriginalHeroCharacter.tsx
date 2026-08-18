import React from 'react';
import { motion } from 'motion/react';
import { CharacterCustomizationData, HeroGender, HeroViewType, HeroOutfitRank } from '../types';
import { KnowledgeCrest, CrestRank, CrestElement } from './KnowledgeCrest';

export interface OriginalHeroCharacterProps {
  gender?: HeroGender;
  viewType?: HeroViewType;
  expression?: 'idle' | 'happy' | 'thinking' | 'levelup' | 'guts' | 'surprised' | 'attack';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  characterData?: CharacterCustomizationData;
  animationEnabled?: boolean;
  element?: CrestElement;
  crestRank?: CrestRank;
  outfitRank?: HeroOutfitRank;
  gradeLevel?: number;
  className?: string;
}

export const OriginalHeroCharacter: React.FC<OriginalHeroCharacterProps> = ({
  gender: genderProp,
  viewType: viewTypeProp,
  expression = 'idle',
  size = 'md',
  characterData,
  animationEnabled = true,
  element = '草',
  crestRank: crestRankProp,
  outfitRank: outfitRankProp,
  gradeLevel,
  className = '',
}) => {
  // Determine gender, viewType, outfitRank from props or characterData with defaults
  const gender: HeroGender = genderProp || characterData?.gender || 'boy';
  const viewType: HeroViewType = viewTypeProp || characterData?.viewType || 'sd';
  const outfitRank: HeroOutfitRank = outfitRankProp || characterData?.outfitRank || 'royal';
  
  // Map outfit rank to crest rank if not explicitly passed
  const rankMap: Record<HeroOutfitRank, CrestRank> = {
    novice: 'initial',
    royal: 'silver',
    knight: 'gold',
    master: 'rainbow',
  };
  const activeCrestRank: CrestRank = crestRankProp || rankMap[outfitRank] || 'silver';

  const isAnimated = animationEnabled && (characterData?.animationEnabled ?? true);

  // Size mapping (pixels)
  const sizeMap = {
    sd: {
      sm: { width: 72, height: 90 },
      md: { width: 140, height: 175 },
      lg: { width: 220, height: 275 },
      xl: { width: 300, height: 375 },
    },
    portrait: {
      sm: { width: 80, height: 120 },
      md: { width: 160, height: 240 },
      lg: { width: 250, height: 375 },
      xl: { width: 340, height: 510 },
    },
  };

  const currentSize = sizeMap[viewType][size];

  // Motion Variants
  const floatAnimation = isAnimated
    ? {
        idle: {
          y: [0, -6, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
        happy: {
          y: [0, -18, -2, -10, 0],
          rotate: [0, -4, 4, -2, 0],
          transition: {
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: 0.4,
          },
        },
        thinking: {
          rotate: [-2, 3, -2],
          y: [0, -3, 0],
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
        levelup: {
          y: [0, -12, 0],
          scale: [1, 1.05, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
          },
        },
        guts: {
          y: [0, -8, 0],
          scale: [1, 1.04, 1],
          transition: {
            duration: 1.8,
            repeat: Infinity,
          },
        },
        surprised: {
          scale: [1, 1.08, 0.98, 1],
          y: [0, -10, 0],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 1.5,
          },
        },
        attack: {
          x: [0, -5, 15, 0],
          y: [0, -4, -2, 0],
          transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 1,
          },
        },
      }
    : { idle: {}, happy: {}, thinking: {}, levelup: {}, guts: {}, surprised: {}, attack: {} };

  // Blinking eyes variant
  const eyeBlink = isAnimated
    ? {
        animate: {
          scaleY: [1, 1, 0.1, 1, 1, 1],
          transition: {
            duration: 4,
            repeat: Infinity,
            times: [0, 0.88, 0.92, 0.95, 0.97, 1],
          },
        },
      }
    : {};

  // Book Knowledge Energy Particles for Attack or LevelUp
  const renderKnowledgeEnergyParticles = () => (
    <g transform="translate(100, 100)">
      {/* Floating Math Symbols & Shapes */}
      <motion.text
        x="-60"
        y="-40"
        fill="#f59e0b"
        fontSize="18"
        fontWeight="black"
        animate={isAnimated ? { y: [-40, -65, -40], opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        ＋
      </motion.text>

      <motion.text
        x="45"
        y="-55"
        fill="#38bdf8"
        fontSize="18"
        fontWeight="black"
        animate={isAnimated ? { y: [-55, -80, -55], opacity: [0.4, 1, 0.4] } : {}}
        transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        ×
      </motion.text>

      <motion.text
        x="-75"
        y="15"
        fill="#34d399"
        fontSize="16"
        fontWeight="black"
        animate={isAnimated ? { y: [15, -10, 15], opacity: [0.2, 0.9, 0.2] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      >
        ÷
      </motion.text>

      <motion.text
        x="55"
        y="20"
        fill="#f43f5e"
        fontSize="16"
        fontWeight="black"
        animate={isAnimated ? { y: [20, -5, 20], opacity: [0.3, 0.95, 0.3] } : {}}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        ＝
      </motion.text>

      {/* Floating Shapes */}
      <motion.polygon
        points="0,-70 8,-55 -8,-55"
        fill="#fbbf24"
        animate={isAnimated ? { rotate: 360, y: [-70, -85, -70] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <motion.rect
        x="60"
        y="-20"
        width="12"
        height="12"
        rx="2"
        fill="#a7f3d0"
        animate={isAnimated ? { rotate: -360 } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      {/* Light Sparkles */}
      <circle cx="-35" cy="-75" r="3" fill="#ffffff" />
      <circle cx="35" cy="-65" r="4" fill="#fef08a" />
    </g>
  );

  // Companion Element Crystal Icon / Pendant
  const renderElementCrystal = (cx: number, cy: number, scale: number = 1) => {
    switch (element) {
      case '草':
        return (
          <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
            {/* Green Leaf Crystal */}
            <path d="M 0 -8 C 8 -4, 8 6, 0 10 C -8 6, -8 -4, 0 -8 Z" fill="#10b981" stroke="#fef08a" strokeWidth="1.2" />
            <path d="M 0 -5 L 0 7" stroke="#d1fae5" strokeWidth="1" />
          </g>
        );
      case '火':
        return (
          <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
            {/* Red Flame Ruby */}
            <polygon points="0,-9 7,-2 4,8 -4,8 -7,-2" fill="#ef4444" stroke="#fef08a" strokeWidth="1.2" />
            <polygon points="0,-5 3,0 0,5 -3,0" fill="#fca5a5" />
          </g>
        );
      case '水':
        return (
          <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
            {/* Blue Sapphire Crystal */}
            <polygon points="0,-10 7,-4 7,4 0,10 -7,4 -7,-4" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.2" />
            <polygon points="0,-6 4,-2 0,6 -4,-2" fill="#7dd3fc" />
          </g>
        );
      case '風':
        return (
          <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
            {/* Feather Ornament */}
            <path d="M -2 -10 Q 8 -2 -1 10 Q -6 2 -2 -10 Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            <path d="M 2 -8 Q -4 0 3 8" stroke="#ffffff" strokeWidth="0.8" />
          </g>
        );
      case '光':
        return (
          <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
            {/* Golden Star Gem */}
            <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
          </g>
        );
      case '闇':
        return (
          <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
            {/* Amethyst Crystal */}
            <polygon points="0,-10 6,-5 6,5 0,10 -6,5 -6,-5" fill="#8b5cf6" stroke="#e9d5ff" strokeWidth="1.2" />
            <polygon points="0,-5 3,0 0,5 -3,0" fill="#c084fc" />
          </g>
        );
      default:
        return null;
    }
  };

  // Knowledge Crest Symbol Emblem Rendering for Hero Outfit
  const renderCrestSymbol = (cx: number, cy: number, scale: number = 1) => {
    return (
      <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        {/* Outer Hexagon Gold Frame */}
        <polygon points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6" fill="url(#goldTrimGrad)" stroke="#ffffff" strokeWidth="1" />
        <polygon points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" fill="#0f172a" />
        {/* Center Element Core */}
        {renderElementCrystal(0, 0, 0.7)}
      </g>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: currentSize.width, height: currentSize.height }}
    >
      {/* Level Up Golden Light Ring Effect */}
      {(expression === 'levelup' || outfitRank === 'master') && isAnimated && (
        <motion.div
          animate={{ rotate: 360, scale: [0.95, 1.1, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/30 via-yellow-300/40 to-emerald-400/30 blur-xl z-0"
        />
      )}

      {/* SVG Container */}
      <motion.svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox={viewType === 'sd' ? '0 0 200 250' : '0 0 240 360'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-2xl"
        variants={floatAnimation}
        animate={expression}
      >
        <defs>
          {/* Main Gradients */}
          {/* Boy Hair Gradient */}
          <linearGradient id="boyHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="50%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>

          {/* Girl Hair Gradient */}
          <linearGradient id="girlHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Boy Suit Gradient (Royal Blue & Gold) */}
          <linearGradient id="boyJacketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          {/* Girl Suit Gradient (Aqua Blue & Mint) */}
          <linearGradient id="girlJacketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Gold Trim */}
          <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Scarf / Cape Gradient */}
          <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Skin Gradient */}
          <linearGradient id="heroSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="100%" stopColor="#ffedd5" />
          </linearGradient>

          {/* Knowledge Book Gradient */}
          <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>

          {/* Leather Bag Gradient */}
          <linearGradient id="leatherBagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* ========================================================
            PART 1: SD CHARACTER (2.5 ~ 3 頭身)
           ======================================================== */}
        {viewType === 'sd' && (
          <g id="SD_HERO_ROOT">
            {/* Attack / LevelUp Energy Effects */}
            {(expression === 'attack' || expression === 'levelup') && renderKnowledgeEnergyParticles()}

            {/* 1. ADVENTURER CAPE / SCARF (BACK) */}
            <path
              d="M 60 115 Q 35 135 25 185 Q 70 195 90 168 Q 72 135 72 118 Z"
              fill="url(#scarfGrad)"
              opacity="0.9"
            />
            <path
              d="M 140 115 Q 165 135 175 185 Q 130 195 110 168 Q 128 135 128 118 Z"
              fill="url(#scarfGrad)"
              opacity="0.9"
            />

            {/* 2. LEGS & ADVENTURER BOOTS */}
            {/* Left Leg */}
            <rect x="74" y="178" width="20" height="34" rx="6" fill="#1e293b" />
            {/* Left Boot */}
            <path d="M 69 204 L 95 204 L 97 218 Q 83 225 67 218 Z" fill="#451a03" />
            <rect x="69" y="201" width="26" height="4" rx="2" fill="url(#goldTrimGrad)" />

            {/* Right Leg */}
            <rect x="106" y="178" width="20" height="34" rx="6" fill="#1e293b" />
            {/* Right Boot */}
            <path d="M 103 204 L 129 204 L 131 218 Q 117 225 101 218 Z" fill="#451a03" />
            <rect x="103" y="201" width="26" height="4" rx="2" fill="url(#goldTrimGrad)" />

            {/* 3. SCHOOL UNIFORM x ADVENTURER OUTFIT (TORSO) */}
            {gender === 'boy' ? (
              /* BOY OUTFIT */
              <g id="BOY_SD_TORSO">
                {/* White Shirt & Tie */}
                <path d="M 85 110 L 100 135 L 115 110 Z" fill="#ffffff" />
                <path d="M 97 114 L 100 135 L 103 114 L 100 112 Z" fill="#dc2626" />

                {/* Jacket */}
                <path
                  d="M 66 112 C 66 102, 134 102, 134 112 L 140 174 C 140 180, 60 180, 60 174 Z"
                  fill="url(#boyJacketGrad)"
                />
                {/* Jacket Gold Edges */}
                <path d="M 66 112 L 85 160 M 134 112 L 115 160" stroke="url(#goldTrimGrad)" strokeWidth="3" fill="none" />

                {/* Knowledge Crest Badge on Left Chest */}
                {renderCrestSymbol(122, 126, 0.75)}
              </g>
            ) : (
              /* GIRL OUTFIT */
              <g id="GIRL_SD_TORSO">
                {/* White Shirt & Ribbon */}
                <path d="M 85 110 L 100 132 L 115 110 Z" fill="#ffffff" />
                {/* Red Ribbon */}
                <path d="M 94 112 L 100 118 L 106 112 M 95 114 L 92 124 M 105 114 L 108 124" stroke="#e11d48" strokeWidth="2.5" />

                {/* Jacket & Pleated Skirt */}
                <path
                  d="M 66 112 C 66 102, 134 102, 134 112 L 138 158 C 138 162, 62 162, 62 158 Z"
                  fill="url(#girlJacketGrad)"
                />
                {/* Skirt */}
                <path d="M 60 156 L 140 156 L 146 176 L 54 176 Z" fill="#0f172a" />
                <path d="M 75 156 L 72 176 M 100 156 L 100 176 M 125 156 L 128 176" stroke="#334155" strokeWidth="1.5" />

                {/* Knowledge Crest Badge on Left Chest */}
                {renderCrestSymbol(122, 124, 0.75)}
              </g>
            )}

            {/* WAIST BELT & POUCHES */}
            <rect x="62" y="158" width="76" height="9" rx="3" fill="#451a03" />
            <rect x="91" y="155" width="18" height="15" rx="3" fill="url(#goldTrimGrad)" />
            {/* Kingdom Emblem Buckle */}
            <polygon points="100,157 105,162 100,167 95,162" fill="#10b981" />

            {/* Companion Pouch (腰の相棒ポーチ) */}
            <rect x="122" y="154" width="16" height="18" rx="5" fill="url(#leatherBagGrad)" stroke="#451a03" strokeWidth="1.5" />
            <circle cx="130" cy="163" r="2.5" fill="url(#goldTrimGrad)" />

            {/* Knowledge Bag (肩掛け学習バッグ) */}
            <path d="M 68 118 L 126 166" stroke="#78350f" strokeWidth="4" />
            <rect x="52" y="148" width="18" height="22" rx="4" fill="url(#leatherBagGrad)" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="52" y1="158" x2="70" y2="158" stroke="#fef08a" strokeWidth="1.5" />

            {/* 4. ROYAL SCARF & ELEMENT CRYSTAL (CHEST) */}
            <path d="M 78 108 Q 100 120 122 108 L 118 124 Q 100 132 82 124 Z" fill="url(#scarfGrad)" />
            {renderElementCrystal(100, 122, 1.1)}

            {/* 5. ARMS & HANDS WITH KNOWLEDGE BOOK */}
            {/* Left Arm holding Knowledge Book */}
            <g>
              <path d="M 68 116 Q 44 135 48 152" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="14" strokeLinecap="round" fill="none" />
              <circle cx="48" cy="155" r="7" fill="url(#heroSkinGrad)" />

              {/* KNOWLEDGE BOOK (ナレッジブック - 学習ノート) */}
              <g transform="translate(28, 138) rotate(-10)">
                <rect x="0" y="0" width="22" height="28" rx="4" fill="url(#bookCoverGrad)" stroke="url(#goldTrimGrad)" strokeWidth="1.5" />
                <line x1="11" y1="0" x2="11" y2="28" stroke="url(#goldTrimGrad)" strokeWidth="1.5" />
                <text x="3" y="12" fill="#fef08a" fontSize="7" fontWeight="bold">KQ</text>
                <text x="3" y="22" fill="#ffffff" fontSize="6">Math</text>
              </g>
            </g>

            {/* Right Arm (Dynamic depending on expression) */}
            {expression === 'happy' || expression === 'levelup' ? (
              /* Raised Hand / V sign */
              <g>
                <path d="M 132 116 Q 155 98 160 82" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="14" strokeLinecap="round" fill="none" />
                <circle cx="162" cy="78" r="7.5" fill="url(#heroSkinGrad)" />
                {/* Sparkle */}
                <polygon points="172,68 175,76 183,79 175,82 172,90 169,82 161,79 169,76" fill="#f59e0b" />
              </g>
            ) : expression === 'guts' ? (
              /* Powerful Guts Pose Arm */
              <g>
                <path d="M 132 116 Q 158 120 152 98" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="14" strokeLinecap="round" fill="none" />
                <circle cx="150" cy="94" r="8" fill="url(#heroSkinGrad)" stroke="#b45309" strokeWidth="1" />
              </g>
            ) : expression === 'thinking' ? (
              /* Chin Touching Arm */
              <g>
                <path d="M 132 116 Q 152 132 128 98" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="14" strokeLinecap="round" fill="none" />
                <circle cx="125" cy="94" r="7" fill="url(#heroSkinGrad)" />
              </g>
            ) : (
              /* Normal Side Arm with Ruler/Compass Motif */
              <g>
                <path d="M 132 116 Q 152 138 150 154" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="14" strokeLinecap="round" fill="none" />
                <circle cx="150" cy="157" r="7" fill="url(#heroSkinGrad)" />
                {/* Golden Ruler Accessory */}
                <rect x="151" y="142" width="5" height="24" rx="1" fill="url(#goldTrimGrad)" transform="rotate(15, 151, 142)" />
              </g>
            )}

            {/* 6. HEAD & FRIENDLY FACE (BIG SD HEAD) */}
            <circle cx="100" cy="70" r="44" fill="url(#heroSkinGrad)" />

            {/* Cheeks Blush */}
            <ellipse cx="72" cy="78" rx="7" ry="4" fill="#f43f5e" opacity="0.35" />
            <ellipse cx="128" cy="78" rx="7" ry="4" fill="#f43f5e" opacity="0.35" />

            {/* EYES */}
            <g id="SD_EYES">
              {expression === 'thinking' ? (
                /* Pondering Eyes */
                <g>
                  <ellipse cx="78" cy="66" rx="7.5" ry="9" fill="#0f172a" />
                  <circle cx="80" cy="63" r="3.5" fill="#ffffff" />
                  <ellipse cx="122" cy="66" rx="7.5" ry="9" fill="#0f172a" />
                  <circle cx="124" cy="63" r="3.5" fill="#ffffff" />
                  <path d="M 70 52 Q 78 48 86 54" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 114 50 Q 122 46 130 50" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </g>
              ) : expression === 'happy' || expression === 'levelup' ? (
                /* Joyful Sparkling ^ ^ Eyes */
                <g>
                  <path d="M 70 68 Q 78 56 86 68" stroke="#0f172a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M 114 68 Q 122 56 130 68" stroke="#0f172a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M 70 52 Q 78 47 86 52" stroke="#451a03" strokeWidth="2.5" fill="none" />
                  <path d="M 114 52 Q 122 47 130 52" stroke="#451a03" strokeWidth="2.5" fill="none" />
                </g>
              ) : expression === 'surprised' ? (
                /* Surprised Round Eyes O O */
                <g>
                  <circle cx="78" cy="66" r="10" fill="#0f172a" />
                  <circle cx="78" cy="66" r="8" fill="#ffffff" />
                  <circle cx="78" cy="66" r="4" fill="#0f172a" />

                  <circle cx="122" cy="66" r="10" fill="#0f172a" />
                  <circle cx="122" cy="66" r="8" fill="#ffffff" />
                  <circle cx="122" cy="66" r="4" fill="#0f172a" />
                </g>
              ) : (
                /* Regular Sparkly Anime Eyes with Blinking */
                <motion.g variants={eyeBlink} animate="animate">
                  <ellipse cx="78" cy="66" rx="8" ry="10" fill="#0f172a" />
                  <circle cx="75" cy="62" r="3.5" fill="#ffffff" />
                  <circle cx="80" cy="70" r="1.8" fill={gender === 'boy' ? '#38bdf8' : '#34d399'} />

                  <ellipse cx="122" cy="66" rx="8" ry="10" fill="#0f172a" />
                  <circle cx="119" cy="62" r="3.5" fill="#ffffff" />
                  <circle cx="124" cy="70" r="1.8" fill={gender === 'boy' ? '#38bdf8' : '#34d399'} />

                  {/* Eyebrows */}
                  <path d="M 70 53 Q 78 48 86 53" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 114 53 Q 122 48 130 53" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </motion.g>
              )}
            </g>

            {/* MOUTH */}
            {expression === 'happy' || expression === 'levelup' || expression === 'guts' ? (
              <path d="M 86 80 Q 100 98 114 80 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            ) : expression === 'thinking' ? (
              <path d="M 90 84 Q 100 81 110 85" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : expression === 'surprised' ? (
              <ellipse cx="100" cy="84" rx="6" ry="8" fill="#0f172a" />
            ) : (
              <path d="M 88 80 Q 100 92 112 80" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}

            {/* NOSE */}
            <ellipse cx="100" cy="74" rx="2" ry="1.5" fill="#f97316" opacity="0.6" />

            {/* 7. HAIR & HEAD ACCESSORIES */}
            {gender === 'boy' ? (
              /* BOY HAIR (元気なショート・少し跳ねた前髪) */
              <g id="BOY_SD_HAIR">
                {/* Back Hair */}
                <path d="M 52 68 C 48 26, 75 18, 100 18 C 125 18, 152 26, 148 68 Q 138 36 100 32 Q 62 36 52 68 Z" fill="url(#boyHairGrad)" />
                {/* Front Spiky Bangs */}
                <path d="M 54 50 Q 76 68 84 50 Q 100 72 108 48 Q 122 68 144 50 Q 134 34 100 32 Z" fill="url(#boyHairGrad)" />

                {/* Kingdom Crown/Headband */}
                <path d="M 58 44 Q 100 32 142 44" stroke="url(#goldTrimGrad)" strokeWidth="3" fill="none" />
                <polygon points="100,28 106,35 100,42 94,35" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              </g>
            ) : (
              /* GIRL HAIR (セミロング・跳ね髪・星型アクセサリー) */
              <g id="GIRL_SD_HAIR">
                {/* Long Back Twin Side Hair */}
                <path d="M 44 65 C 38 90, 48 115, 56 125 C 62 110, 56 80, 56 65 Z" fill="url(#girlHairGrad)" />
                <path d="M 156 65 C 162 90, 152 115, 144 125 C 138 110, 144 80, 144 65 Z" fill="url(#girlHairGrad)" />

                {/* Crown & Front Bangs */}
                <path d="M 50 65 C 46 22, 75 16, 100 16 C 125 16, 154 22, 150 65 Q 138 34 100 30 Q 62 34 50 65 Z" fill="url(#girlHairGrad)" />
                <path d="M 54 52 Q 74 66 85 52 Q 100 68 112 52 Q 126 66 146 52 Q 134 32 100 30 Z" fill="url(#girlHairGrad)" />

                {/* Star Hair Clip Accent (星型アクセサリー) */}
                <g transform="translate(136, 42)">
                  <polygon points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                </g>
              </g>
            )}
          </g>
        )}

        {/* ========================================================
            PART 2: PORTRAIT STANDING CHARACTER (5 ~ 6 頭身 立ち絵)
           ======================================================== */}
        {viewType === 'portrait' && (
          <g id="PORTRAIT_HERO_ROOT">
            {/* Attack Energy FX for Portrait */}
            {(expression === 'attack' || expression === 'levelup') && (
              <g transform="translate(20, 20)">
                {renderKnowledgeEnergyParticles()}
              </g>
            )}

            {/* 1. ELEGANT CAPE & SCARF (BACK) */}
            <path
              d="M 65 140 Q 30 180 20 280 Q 80 300 120 250 Q 95 190 95 145 Z"
              fill="url(#scarfGrad)"
              opacity="0.88"
            />
            <path
              d="M 175 140 Q 210 180 220 280 Q 160 300 120 250 Q 145 190 145 145 Z"
              fill="url(#scarfGrad)"
              opacity="0.88"
            />

            {/* 2. LEGS & ADVENTURER TALL BOOTS */}
            {/* Left Leg */}
            <rect x="92" y="240" width="22" height="85" rx="8" fill="#1e293b" />
            <path d="M 88 285 L 116 285 L 118 322 Q 102 332 84 322 Z" fill="#451a03" />
            <rect x="88" y="282" width="28" height="5" rx="2.5" fill="url(#goldTrimGrad)" />

            {/* Right Leg */}
            <rect x="126" y="240" width="22" height="85" rx="8" fill="#1e293b" />
            <path d="M 122 285 L 150 285 L 152 322 Q 136 332 118 322 Z" fill="#451a03" />
            <rect x="122" y="282" width="28" height="5" rx="2.5" fill="url(#goldTrimGrad)" />

            {/* 3. SCHOOL UNIFORM x ADVENTURER OUTFIT (TORSO PORTRAIT) */}
            {gender === 'boy' ? (
              /* BOY PORTRAIT TORSO */
              <g id="BOY_PORTRAIT_TORSO">
                {/* White Shirt & Tie */}
                <path d="M 104 128 L 120 160 L 136 128 Z" fill="#ffffff" />
                <path d="M 117 132 L 120 162 L 123 132 Z" fill="#dc2626" />

                {/* Jacket */}
                <path
                  d="M 80 130 C 80 115, 160 115, 160 130 L 168 238 C 168 245, 72 245, 72 238 Z"
                  fill="url(#boyJacketGrad)"
                />
                <path d="M 80 130 L 104 210 M 160 130 L 136 210" stroke="url(#goldTrimGrad)" strokeWidth="3.5" fill="none" />

                {/* Knowledge Crest Badge */}
                {renderCrestSymbol(148, 150, 0.9)}
              </g>
            ) : (
              /* GIRL PORTRAIT TORSO */
              <g id="GIRL_PORTRAIT_TORSO">
                {/* White Shirt & Ribbon */}
                <path d="M 104 128 L 120 156 L 136 128 Z" fill="#ffffff" />
                <path d="M 113 130 L 120 138 L 127 130 M 114 133 L 110 146 M 126 133 L 130 146" stroke="#e11d48" strokeWidth="3" />

                {/* Jacket */}
                <path
                  d="M 80 130 C 80 115, 160 115, 160 130 L 165 210 C 165 215, 75 215, 75 210 Z"
                  fill="url(#girlJacketGrad)"
                />
                {/* Skirt */}
                <path d="M 72 208 L 168 208 L 175 242 L 65 242 Z" fill="#0f172a" />
                <path d="M 92 208 L 88 242 M 120 208 L 120 242 M 148 208 L 152 242" stroke="#334155" strokeWidth="2" />

                {/* Knowledge Crest Badge */}
                {renderCrestSymbol(148, 148, 0.9)}
              </g>
            )}

            {/* BELT & POUCHES */}
            <rect x="74" y="210" width="92" height="11" rx="4" fill="#451a03" />
            <rect x="110" y="206" width="20" height="19" rx="4" fill="url(#goldTrimGrad)" />
            <polygon points="120,208 125,215 120,222 115,215" fill="#10b981" />

            {/* Companion Pouch */}
            <rect x="148" y="205" width="20" height="22" rx="6" fill="url(#leatherBagGrad)" stroke="#451a03" strokeWidth="1.5" />
            <circle cx="158" cy="216" r="3" fill="url(#goldTrimGrad)" />

            {/* Knowledge Bag */}
            <path d="M 84 135 L 152 220" stroke="#78350f" strokeWidth="4.5" />
            <rect x="62" y="196" width="22" height="28" rx="5" fill="url(#leatherBagGrad)" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="62" y1="208" x2="84" y2="208" stroke="#fef08a" strokeWidth="1.5" />

            {/* 4. SCARF & ELEMENT CRYSTAL (CHEST) */}
            <path d="M 94 125 Q 120 140 146 125 L 140 145 Q 120 155 100 145 Z" fill="url(#scarfGrad)" />
            {renderElementCrystal(120, 144, 1.3)}

            {/* 5. ARMS & HANDS WITH KNOWLEDGE BOOK */}
            {/* Left Arm holding Knowledge Book */}
            <g>
              <path d="M 82 135 Q 52 160 56 185" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="16" strokeLinecap="round" fill="none" />
              <circle cx="56" cy="188" r="8" fill="url(#heroSkinGrad)" />

              {/* KNOWLEDGE BOOK */}
              <g transform="translate(30, 168) rotate(-12)">
                <rect x="0" y="0" width="28" height="36" rx="5" fill="url(#bookCoverGrad)" stroke="url(#goldTrimGrad)" strokeWidth="2" />
                <line x1="14" y1="0" x2="14" y2="36" stroke="url(#goldTrimGrad)" strokeWidth="2" />
                <text x="4" y="16" fill="#fef08a" fontSize="9" fontWeight="bold">KQ</text>
                <text x="4" y="28" fill="#ffffff" fontSize="7">Math</text>
              </g>
            </g>

            {/* Right Arm */}
            {expression === 'happy' || expression === 'levelup' ? (
              <g>
                <path d="M 158 135 Q 188 110 196 90" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="16" strokeLinecap="round" fill="none" />
                <circle cx="198" cy="85" r="8.5" fill="url(#heroSkinGrad)" />
                <polygon points="210,72 214,82 224,85 214,88 210,98 206,88 196,85 206,82" fill="#f59e0b" />
              </g>
            ) : expression === 'guts' ? (
              <g>
                <path d="M 158 135 Q 190 142 182 112" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="16" strokeLinecap="round" fill="none" />
                <circle cx="180" cy="106" r="9" fill="url(#heroSkinGrad)" stroke="#b45309" strokeWidth="1" />
              </g>
            ) : (
              <g>
                <path d="M 158 135 Q 185 165 182 188" stroke={gender === 'boy' ? 'url(#boyJacketGrad)' : 'url(#girlJacketGrad)'} strokeWidth="16" strokeLinecap="round" fill="none" />
                <circle cx="182" cy="192" r="8" fill="url(#heroSkinGrad)" />
                <rect x="183" y="172" width="6" height="30" rx="1" fill="url(#goldTrimGrad)" transform="rotate(15, 183, 172)" />
              </g>
            )}

            {/* 6. HEAD & PROPORTIONAL PORTRAIT FACE */}
            <circle cx="120" cy="82" r="38" fill="url(#heroSkinGrad)" />

            {/* Cheeks */}
            <ellipse cx="96" cy="90" rx="6" ry="3.5" fill="#f43f5e" opacity="0.3" />
            <ellipse cx="144" cy="90" rx="6" ry="3.5" fill="#f43f5e" opacity="0.3" />

            {/* EYES */}
            <g id="PORTRAIT_EYES">
              {expression === 'happy' || expression === 'levelup' ? (
                <g>
                  <path d="M 96 82 Q 102 70 110 82" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M 130 82 Q 138 70 144 82" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
                </g>
              ) : (
                <motion.g variants={eyeBlink} animate="animate">
                  <ellipse cx="102" cy="78" rx="6.5" ry="8.5" fill="#0f172a" />
                  <circle cx="100" cy="74" r="3" fill="#ffffff" />
                  <circle cx="104" cy="81" r="1.5" fill={gender === 'boy' ? '#38bdf8' : '#34d399'} />

                  <ellipse cx="138" cy="78" rx="6.5" ry="8.5" fill="#0f172a" />
                  <circle cx="136" cy="74" r="3" fill="#ffffff" />
                  <circle cx="140" cy="81" r="1.5" fill={gender === 'boy' ? '#38bdf8' : '#34d399'} />

                  <path d="M 94 66 Q 102 62 110 66" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 130 66 Q 138 62 146 66" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
                </motion.g>
              )}
            </g>

            {/* MOUTH */}
            {expression === 'happy' || expression === 'levelup' || expression === 'guts' ? (
              <path d="M 108 92 Q 120 106 132 92 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            ) : (
              <path d="M 110 92 Q 120 100 130 92" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}

            {/* NOSE */}
            <ellipse cx="120" cy="85" rx="1.5" ry="1" fill="#f97316" opacity="0.6" />

            {/* 7. HAIR & CROWN */}
            {gender === 'boy' ? (
              <g id="BOY_PORTRAIT_HAIR">
                <path d="M 78 80 C 74 40 98 32 120 32 C 142 32 166 40 162 80 Q 152 50 120 46 Q 88 50 78 80 Z" fill="url(#boyHairGrad)" />
                <path d="M 80 62 Q 98 78 106 62 Q 120 82 128 60 Q 140 78 158 62 Q 150 46 120 44 Z" fill="url(#boyHairGrad)" />
                <path d="M 82 56 Q 120 44 158 56" stroke="url(#goldTrimGrad)" strokeWidth="3" fill="none" />
                <polygon points="120,40 125,47 120,54 115,47" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              </g>
            ) : (
              <g id="GIRL_PORTRAIT_HAIR">
                <path d="M 70 78 C 65 105 74 135 82 145 C 88 130 80 95 80 78 Z" fill="url(#girlHairGrad)" />
                <path d="M 170 78 C 175 105 166 135 158 145 C 152 130 160 95 160 78 Z" fill="url(#girlHairGrad)" />
                <path d="M 76 78 C 72 38 98 30 120 30 C 142 30 168 38 164 78 Q 152 48 120 44 Q 88 48 76 78 Z" fill="url(#girlHairGrad)" />
                <path d="M 80 64 Q 98 78 108 64 Q 120 80 130 64 Q 142 78 160 64 Q 150 44 120 42 Z" fill="url(#girlHairGrad)" />
                <g transform="translate(152, 50)">
                  <polygon points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                </g>
              </g>
            )}
          </g>
        )}
      </motion.svg>
    </div>
  );
};
