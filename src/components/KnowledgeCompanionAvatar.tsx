import React from 'react';
import { motion } from 'motion/react';
import {
  CompanionData,
  CompanionSpeciesId,
  CompanionAttribute,
  CompanionRarity,
  CompanionAppearance,
  CompanionStage,
  CompanionExpression,
} from '../types';
import {
  COMPANION_ATTRIBUTES,
  COMPANION_RARITIES,
  COMPANION_SPECIES,
} from '../data/companionParts';

interface KnowledgeCompanionAvatarProps {
  companion?: CompanionData;
  speciesId?: CompanionSpeciesId;
  attribute?: CompanionAttribute;
  rarity?: CompanionRarity;
  appearance?: CompanionAppearance;
  stage?: CompanionStage;
  expression?: CompanionExpression;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animationEnabled?: boolean;
  onClick?: () => void;
  showSparkles?: boolean;
  equippedAccessoryId?: string;
  className?: string;
}

export const KnowledgeCompanionAvatar: React.FC<KnowledgeCompanionAvatarProps> = ({
  companion,
  speciesId: propSpeciesId,
  attribute: propAttribute,
  rarity: propRarity,
  appearance: propAppearance,
  stage: propStage,
  expression = 'normal',
  size = 'md',
  animationEnabled = true,
  onClick,
  showSparkles = true,
  equippedAccessoryId: propAccessoryId,
  className = '',
}) => {
  // Extract values from companion object or fallback props
  const speciesId = companion?.speciesId || propSpeciesId || 'mokoru';
  const attribute = companion?.attribute || propAttribute || 'forest';
  const rarity = companion?.currentRarity || propRarity || 'N';
  const stage = companion?.stage || propStage || 'hatched';
  const accessoryId = companion?.equippedAccessoryId || propAccessoryId || companion?.appearance?.accessoryId;

  const defaultAppearance: CompanionAppearance = {
    bodyType: speciesId,
    bodyColor: COMPANION_ATTRIBUTES[attribute]?.primaryColorHex || '#10b981',
    secondaryColor: COMPANION_ATTRIBUTES[attribute]?.accentColorHex || '#a7f3d0',
    eyeType: 'round_cute',
    eyeColor: '#fef08a',
    earType: 'default',
    patternType: 'none',
    tailType: 'default',
  };

  const appearance = companion?.appearance || propAppearance || defaultAppearance;

  // Dimensions
  const sizePixels = {
    xs: 36,
    sm: 52,
    md: 84,
    lg: 130,
    xl: 180,
    '2xl': 240,
  }[size];

  const floatAnimation = animationEnabled
    ? {
        y: [0, -6, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  const wiggleAnimation = animationEnabled
    ? {
        rotate: [-2, 2, -2],
        scale: [1, 1.02, 1],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  // EGG STAGE RENDERING
  if (stage === 'egg') {
    const speciesInfo = COMPANION_SPECIES[speciesId] || COMPANION_SPECIES.mokoru;
    const eggColor = speciesInfo.eggColor;
    const eggAccent = speciesInfo.eggAccent;

    return (
      <div
        onClick={onClick}
        className={`relative flex items-center justify-center cursor-pointer group shrink-0 ${className}`}
        style={{ width: sizePixels, height: sizePixels }}
      >
        <motion.div
          animate={animationEnabled ? { rotate: [-4, 4, -4] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Egg Aura Glow */}
          <div
            className="absolute rounded-full blur-md opacity-40 animate-pulse"
            style={{
              backgroundColor: eggAccent,
              width: sizePixels * 0.85,
              height: sizePixels * 0.85,
            }}
          />

          <svg
            viewBox="0 0 100 120"
            className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] relative z-10"
          >
            {/* Egg Base Shell */}
            <path
              d="M 50 10 C 25 10, 10 45, 10 75 C 10 100, 28 112, 50 112 C 72 112, 90 100, 90 75 C 90 45, 75 10, 50 10 Z"
              fill={eggColor}
              stroke={eggAccent}
              strokeWidth="4"
            />
            {/* Egg Shading */}
            <path
              d="M 50 10 C 65 10, 85 40, 85 75 C 85 95, 72 110, 50 112 C 68 110, 80 90, 80 70 C 80 40, 65 15, 50 10 Z"
              fill="rgba(0,0,0,0.12)"
            />
            {/* Egg Highlight */}
            <ellipse cx="32" cy="36" rx="8" ry="16" fill="rgba(255,255,255,0.45)" transform="rotate(-20 32 36)" />

            {/* Egg Spots / Stripes Pattern */}
            <circle cx="35" cy="65" r="7" fill={eggAccent} opacity="0.6" />
            <circle cx="65" cy="50" r="9" fill={eggAccent} opacity="0.6" />
            <circle cx="58" cy="85" r="6" fill={eggAccent} opacity="0.6" />
            <circle cx="30" cy="90" r="5" fill={eggAccent} opacity="0.5" />

            {/* Question / Sparkle Mark */}
            <path
              d="M 50 35 L 53 43 L 61 46 L 53 49 L 50 57 L 47 49 L 39 46 L 47 43 Z"
              fill="#ffffff"
              opacity="0.8"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  // HATCHED / CHILD / GROWN / EVOLVED COMPANION RENDERING
  const attrInfo = COMPANION_ATTRIBUTES[attribute] || COMPANION_ATTRIBUTES.forest;
  const rarityInfo = COMPANION_RARITIES[rarity] || COMPANION_RARITIES.N;

  // Render SVG Layers
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer group shrink-0 ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
    >
      {/* Background Aura / Glow (Rarity + Attribute dependent) */}
      {showSparkles && (rarity === 'UR' || rarity === 'SEC' || rarity === 'SR') && (
        <div
          className={`absolute rounded-full blur-xl opacity-60 pointer-events-none animate-pulse ${
            rarity === 'UR'
              ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300'
              : rarity === 'SR'
              ? 'bg-purple-500'
              : 'bg-blue-400'
          }`}
          style={{
            width: sizePixels * 1.1,
            height: sizePixels * 1.1,
          }}
        />
      )}

      {/* Main Companion Body Motion Wrapper */}
      <motion.div animate={floatAnimation} className="relative w-full h-full flex items-center justify-center">
        <motion.div animate={wiggleAnimation} className="w-full h-full relative">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] relative z-10"
          >
            <defs>
              <linearGradient id={`grad_body_${speciesId}_${attribute}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={appearance.bodyColor} />
                <stop offset="100%" stopColor={attrInfo.primaryColorHex} />
              </linearGradient>

              <radialGradient id={`grad_glow_${attribute}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={attrInfo.secondaryColorHex} stopOpacity="0.8" />
                <stop offset="100%" stopColor={attrInfo.primaryColorHex} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 1. WINGS LAYER (BEHIND BODY) */}
            {appearance.wingType && (
              <g id="wings_layer">
                {appearance.wingType === 'feather_wings' && (
                  <path
                    d="M 30 50 C 10 30, 5 60, 25 70 M 90 50 C 110 30, 115 60, 95 70"
                    fill={appearance.secondaryColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                )}
                {appearance.wingType === 'dragon_bat' && (
                  <path
                    d="M 35 55 C 10 30, 15 70, 30 75 M 85 55 C 110 30, 105 70, 90 75"
                    fill={attrInfo.secondaryColorHex}
                    stroke={appearance.bodyColor}
                    strokeWidth="2"
                  />
                )}
                {appearance.wingType === 'light_wings' && (
                  <path
                    d="M 32 45 C 5 20, 10 65, 30 65 M 88 45 C 115 20, 110 65, 90 65"
                    fill="#fef08a"
                    opacity="0.75"
                  />
                )}
              </g>
            )}

            {/* 2. TAIL LAYER (BEHIND BODY) */}
            <g id="tail_layer">
              {speciesId === 'mokoru' && (
                <circle cx="88" cy="80" r="14" fill="#ffffff" opacity="0.9" stroke={appearance.bodyColor} strokeWidth="2" />
              )}
              {speciesId === 'rifin' && (
                <path
                  d="M 80 80 Q 105 75 100 60 Q 90 65 78 82 Z"
                  fill={attrInfo.secondaryColorHex}
                  stroke={appearance.bodyColor}
                  strokeWidth="2"
                />
              )}
              {speciesId === 'lumia' && (
                <path
                  d="M 78 82 Q 108 85 100 65 Q 85 70 75 80 Z"
                  fill="#fde047"
                  opacity="0.85"
                />
              )}
              {speciesId === 'kurudo' && (
                <path
                  d="M 75 80 C 100 85, 105 60, 112 55 C 100 68, 85 75, 75 80 Z"
                  fill={appearance.bodyColor}
                  stroke={attrInfo.secondaryColorHex}
                  strokeWidth="2"
                />
              )}
              {speciesId === 'poruka' && (
                <path
                  d="M 76 80 Q 98 88 95 72 Q 85 75 74 82 Z"
                  fill={appearance.secondaryColor}
                  opacity="0.8"
                />
              )}
            </g>

            {/* 3. MAIN BODY SHAPE LAYER */}
            <g id="body_base">
              {speciesId === 'mokoru' && (
                /* Round Fluffy Body */
                <path
                  d="M 60 22 C 30 22, 18 42, 18 72 C 18 96, 36 108, 60 108 C 84 108, 102 96, 102 72 C 102 42, 90 22, 60 22 Z"
                  fill={`url(#grad_body_${speciesId}_${attribute})`}
                  stroke={attrInfo.primaryColorHex}
                  strokeWidth="3"
                />
              )}
              {speciesId === 'rifin' && (
                /* Leaf Sprout Body */
                <path
                  d="M 60 20 C 35 20, 22 45, 22 75 C 22 98, 38 108, 60 108 C 82 108, 98 98, 98 75 C 98 45, 85 20, 60 20 Z"
                  fill={`url(#grad_body_${speciesId}_${attribute})`}
                  stroke={attrInfo.primaryColorHex}
                  strokeWidth="3"
                />
              )}
              {speciesId === 'lumia' && (
                /* Crystal Teardrop Body */
                <path
                  d="M 60 18 C 36 28, 20 48, 20 76 C 20 98, 38 108, 60 108 C 82 108, 100 98, 100 76 C 100 48, 84 28, 60 18 Z"
                  fill={`url(#grad_body_${speciesId}_${attribute})`}
                  stroke="#ffffff"
                  strokeWidth="3"
                />
              )}
              {speciesId === 'kurudo' && (
                /* Cute Dragon Body */
                <path
                  d="M 60 22 C 32 22, 20 44, 20 74 C 20 96, 36 108, 60 108 C 84 108, 100 96, 100 74 C 100 44, 88 22, 60 22 Z"
                  fill={`url(#grad_body_${speciesId}_${attribute})`}
                  stroke={attrInfo.primaryColorHex}
                  strokeWidth="3"
                />
              )}
              {speciesId === 'poruka' && (
                /* Water Drop Slime Body */
                <path
                  d="M 60 16 C 36 26, 18 46, 18 76 C 18 98, 36 108, 60 108 C 84 108, 102 98, 102 76 C 102 46, 84 26, 60 16 Z"
                  fill={`url(#grad_body_${speciesId}_${attribute})`}
                  stroke="#38bdf8"
                  strokeWidth="3"
                />
              )}

              {/* Chest / Belly Accent (Secondary Color) */}
              <ellipse
                cx="60"
                cy="76"
                rx="24"
                ry="22"
                fill={appearance.secondaryColor}
                opacity="0.85"
              />
            </g>

            {/* 4. PATTERN LAYER */}
            {appearance.patternType && appearance.patternType !== 'none' && (
              <g id="pattern_layer" opacity="0.6">
                {appearance.patternType === 'stripes' && (
                  <path
                    d="M 45 42 Q 60 38 75 42 M 40 52 Q 60 48 80 52 M 38 62 Q 60 58 82 62"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
                {appearance.patternType === 'spots' && (
                  <>
                    <circle cx="42" cy="48" r="4" fill="#ffffff" />
                    <circle cx="78" cy="48" r="5" fill="#ffffff" />
                    <circle cx="38" cy="62" r="3" fill="#ffffff" />
                  </>
                )}
                {appearance.patternType === 'stars' && (
                  <>
                    <polygon points="60,35 62,40 67,40 63,43 65,48 60,45 55,48 57,43 53,40 58,40" fill="#fef08a" />
                    <polygon points="40,55 41,58 44,58 42,60 43,63 40,61 37,63 38,60 36,58 39,58" fill="#fef08a" />
                  </>
                )}
                {appearance.patternType === 'ripples' && (
                  <path
                    d="M 44 48 C 52 44, 68 44, 76 48 M 40 60 C 50 56, 70 56, 80 60"
                    stroke="#ffffff"
                    strokeWidth="2"
                    fill="none"
                  />
                )}
              </g>
            )}

            {/* 5. EARS & HORNS LAYER */}
            <g id="ears_horns_layer">
              {/* Species Ears */}
              {speciesId === 'mokoru' && (
                /* Long Floppy Fluffy Ears */
                <>
                  <ellipse cx="26" cy="32" rx="10" ry="22" fill={appearance.bodyColor} transform="rotate(-30 26 32)" stroke={attrInfo.primaryColorHex} strokeWidth="2" />
                  <ellipse cx="26" cy="32" rx="5" ry="14" fill={appearance.secondaryColor} transform="rotate(-30 26 32)" />
                  <ellipse cx="94" cy="32" rx="10" ry="22" fill={appearance.bodyColor} transform="rotate(30 94 32)" stroke={attrInfo.primaryColorHex} strokeWidth="2" />
                  <ellipse cx="94" cy="32" rx="5" ry="14" fill={appearance.secondaryColor} transform="rotate(30 94 32)" />
                </>
              )}
              {speciesId === 'rifin' && (
                /* Twin Sprouts / Leaves */
                <>
                  <path d="M 58 22 C 40 5, 25 18, 52 24 Z" fill="#10b981" stroke="#047857" strokeWidth="2" />
                  <path d="M 62 22 C 80 5, 95 18, 68 24 Z" fill="#34d399" stroke="#047857" strokeWidth="2" />
                </>
              )}
              {speciesId === 'lumia' && (
                /* Crystal Antenna / Halo */
                <>
                  <path d="M 60 20 L 60 8" stroke="#fef08a" strokeWidth="3" />
                  <polygon points="60,2 64,8 60,14 56,8" fill="#fef08a" />
                </>
              )}
              {speciesId === 'kurudo' && (
                /* Small Dragon Horns */
                <>
                  <path d="M 42 24 L 34 10 L 48 20 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                  <path d="M 78 24 L 86 10 L 72 20 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                </>
              )}
              {speciesId === 'poruka' && (
                /* Crown-notch Droplet Tip */
                <>
                  <path d="M 60 16 Q 52 4 60 0 Q 68 4 60 16 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                </>
              )}

              {/* Extra Horns if present */}
              {appearance.hornType && (
                <g id="extra_horns">
                  {appearance.hornType === 'small_crown' && (
                    <path d="M 48 18 L 52 8 L 60 14 L 68 8 L 72 18 Z" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
                  )}
                  {appearance.hornType === 'single_unicorn' && (
                    <polygon points="60,4 64,22 56,22" fill="#e0e7ff" stroke="#a855f7" strokeWidth="1.5" />
                  )}
                </g>
              )}
            </g>

            {/* 6. FACE & EYES LAYER */}
            <g id="face_eyes">
              {/* Cheeks */}
              <circle cx="36" cy="62" r="6" fill="#f472b6" opacity="0.6" />
              <circle cx="84" cy="62" r="6" fill="#f472b6" opacity="0.6" />

              {/* Eyes Expression Logic */}
              {expression === 'happy' ? (
                /* Curved Happy Arc Eyes ^ ^ */
                <>
                  <path d="M 40 52 Q 46 44 52 52" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M 68 52 Q 74 44 80 52" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
                </>
              ) : expression === 'sleeping' ? (
                /* Sleeping Eyes u u */
                <>
                  <path d="M 40 50 Q 46 56 52 50" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M 68 50 Q 74 56 80 50" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
                </>
              ) : expression === 'levelup' ? (
                /* Star Eyes ★ ★ */
                <>
                  <polygon points="46,45 48,50 53,50 49,53 51,58 46,55 41,58 43,53 39,50 44,50" fill="#f59e0b" />
                  <polygon points="74,45 76,50 81,50 77,53 79,58 74,55 69,58 71,53 67,50 72,50" fill="#f59e0b" />
                </>
              ) : (
                /* Normal / Thinking Eyes */
                <>
                  <ellipse cx="46" cy="52" rx="7" ry="9" fill="#1e293b" />
                  <ellipse cx="74" cy="52" rx="7" ry="9" fill="#1e293b" />

                  {/* Pupil Highlights */}
                  <circle cx="44" cy="49" r="3" fill="#ffffff" />
                  <circle cx="72" cy="49" r="3" fill="#ffffff" />
                  <circle cx="48" cy="54" r="1.5" fill="#ffffff" />
                  <circle cx="76" cy="54" r="1.5" fill="#ffffff" />
                </>
              )}

              {/* Mouth */}
              <path d="M 55 62 Q 60 67 65 62" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            {/* 7. ACCESSORIES LAYER */}
            {accessoryId && (
              <g id="accessory_layer">
                {accessoryId === 'adv_hat' && (
                  /* Adventurer Hat */
                  <g transform="translate(0, -6)">
                    <path d="M 30 25 C 30 10, 90 10, 90 25 Z" fill="#854d0e" stroke="#fef08a" strokeWidth="2" />
                    <ellipse cx="60" cy="25" rx="42" ry="7" fill="#a16207" stroke="#78350f" strokeWidth="2" />
                    <rect x="42" y="19" width="36" height="4" fill="#dc2626" />
                  </g>
                )}
                {accessoryId === 'star_ribbon' && (
                  /* Star Ribbon */
                  <g transform="translate(24, 18)">
                    <polygon points="12,6 4,0 4,12" fill="#ec4899" />
                    <polygon points="12,6 20,0 20,12" fill="#ec4899" />
                    <circle cx="12" cy="6" r="4" fill="#fef08a" />
                  </g>
                )}
                {accessoryId === 'leaf_crown' && (
                  /* Leaf Crown */
                  <g transform="translate(26, 12)">
                    <path d="M 5 12 Q 35 2 68 12" stroke="#16a34a" strokeWidth="3" fill="none" />
                    <circle cx="20" cy="6" r="4" fill="#34d399" />
                    <circle cx="35" cy="4" r="5" fill="#10b981" />
                    <circle cx="50" cy="6" r="4" fill="#34d399" />
                  </g>
                )}
                {accessoryId === 'round_glasses' && (
                  /* Round Glasses */
                  <g transform="translate(0, 0)">
                    <circle cx="46" cy="52" r="10" stroke="#0f172a" strokeWidth="2.5" fill="none" />
                    <circle cx="74" cy="52" r="10" stroke="#0f172a" strokeWidth="2.5" fill="none" />
                    <line x1="56" y1="52" x2="64" y2="52" stroke="#0f172a" strokeWidth="2.5" />
                  </g>
                )}
                {accessoryId === 'mini_cape' && (
                  /* Red Cape */
                  <path d="M 38 72 C 20 85, 20 105, 34 108 L 86 108 C 100 105, 100 85, 82 72 Z" fill="#dc2626" opacity="0.9" />
                )}
                {accessoryId === 'knowledge_pendant' && (
                  /* Pendant */
                  <g transform="translate(60, 78)">
                    <polygon points="0,-4 5,4 0,10 -5,4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                  </g>
                )}
                {accessoryId === 'crown_royal' && (
                  /* Royal Crown */
                  <path d="M 42 18 L 48 8 L 60 16 L 72 8 L 78 18 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                )}
                {accessoryId === 'area_master_badge' && (
                  /* Area Master Badge */
                  <g transform="translate(42, 78)">
                    <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="0" y="3" fontSize="8" textAnchor="middle" fill="#0f172a" fontWeight="bold">S</text>
                  </g>
                )}
              </g>
            )}

            {/* 8. FOREGROUND FLOATING PARTICLES (BY ATTRIBUTE) */}
            {showSparkles && (
              <g id="foreground_particles">
                {attribute === 'fire' && (
                  <circle cx="28" cy="24" r="2.5" fill="#f97316" className="animate-ping" />
                )}
                {attribute === 'water' && (
                  <circle cx="92" cy="28" r="3" fill="#38bdf8" className="animate-bounce" />
                )}
                {attribute === 'forest' && (
                  <circle cx="24" cy="85" r="2.5" fill="#34d399" className="animate-pulse" />
                )}
                {attribute === 'light' && (
                  <polygon points="95,20 97,25 102,25 98,28 100,33 95,30 90,33 92,28 88,25 93,25" fill="#fde047" />
                )}
                {attribute === 'star' && (
                  <polygon points="20,20 22,24 26,24 23,26 24,30 20,28 16,30 17,26 14,24 18,24" fill="#f0abfc" />
                )}
              </g>
            )}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};
