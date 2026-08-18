import {
  CompanionData,
  CompanionSpeciesId,
  CompanionAttribute,
  CompanionPersonality,
  CompanionRarity,
  CompanionAppearance,
  ProgressTraits,
} from '../types';
import {
  COMPANION_SPECIES,
  COMPANION_ATTRIBUTES,
} from '../data/companionParts';

// Simple fast deterministic Mulberry32 PRNG
export function createPRNG(seedStr: string) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  let s = h >>> 0;

  return function nextFloat(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Color palettes for body and secondary accent based on attribute and rarity
const COLOR_PALETTES: Record<CompanionAttribute, { body: string[]; secondary: string[]; eye: string[] }> = {
  fire: {
    body: ['#ef4444', '#f97316', '#ea580c', '#dc2626', '#b91c1c'],
    secondary: ['#fde047', '#fed7aa', '#fef08a', '#ffed4a', '#ffffff'],
    eye: ['#fef08a', '#f97316', '#38bdf8', '#fbbf24'],
  },
  water: {
    body: ['#0284c7', '#0284c7', '#0369a1', '#2563eb', '#0891b2'],
    secondary: ['#bae6fd', '#e0f2fe', '#7dd3fc', '#ffffff', '#c7d2fe'],
    eye: ['#38bdf8', '#34d399', '#fef08a', '#e0e7ff'],
  },
  forest: {
    body: ['#059669', '#10b981', '#047857', '#15803d', '#16a34a'],
    secondary: ['#a7f3d0', '#dcfce7', '#fef08a', '#fef3c7', '#ffffff'],
    eye: ['#fef08a', '#34d399', '#38bdf8', '#a7f3d0'],
  },
  wind: {
    body: ['#0d9488', '#14b8a6', '#0f766e', '#0284c7', '#38bdf8'],
    secondary: ['#ccfbf1', '#f0fdf4', '#e0f2fe', '#ffffff', '#99f6e4'],
    eye: ['#2dd4bf', '#fef08a', '#e0e7ff', '#38bdf8'],
  },
  light: {
    body: ['#d97706', '#f59e0b', '#b45309', '#eab308', '#ca8a04'],
    secondary: ['#fef08a', '#fef9c3', '#ffffff', '#fde68a', '#ffedd5'],
    eye: ['#fef08a', '#38bdf8', '#ec4899', '#10b981'],
  },
  star: {
    body: ['#7c3aed', '#8b5cf6', '#6d28d9', '#4c1d95', '#a855f7'],
    secondary: ['#f0abfc', '#fae8ff', '#fef08a', '#e0e7ff', '#ffffff'],
    eye: ['#fef08a', '#c084fc', '#38bdf8', '#f472b6'],
  },
};

const EYE_TYPES = ['round_cute', 'sparkle_star', 'oval_gentle', 'cat_sharp', 'dot_playful'];
const PATTERN_TYPES = ['none', 'stripes', 'spots', 'stars', 'runes', 'ripples', 'gradient_belly'];
const EAR_TYPES_BY_SPECIES: Record<CompanionSpeciesId, string[]> = {
  mokoru: ['floppy_long', 'round_fluffy', 'tufted_up'],
  rifin: ['leaf_twin', 'sprout_single', 'petal_ear'],
  lumia: ['crystal_antenna', 'light_halo_ears', 'star_tufts'],
  kurudo: ['fin_ears', 'horn_ears', 'small_spikes'],
  poruka: ['drop_tips', 'crown_notches', 'round_nubs'],
};
const TAIL_TYPES_BY_SPECIES: Record<CompanionSpeciesId, string[]> = {
  mokoru: ['puff_cotton', 'cloud_curly', 'long_fluffy'],
  rifin: ['leaf_fan', 'sprout_tail', 'vine_curl'],
  lumia: ['light_beam_tail', 'star_tip_tail', 'sparkle_ribbon'],
  kurudo: ['arrow_dragon', 'spiked_tail', 'flame_tip_tail'],
  poruka: ['drop_bubble', 'ripple_tail', 'split_droplet'],
};

// Generate companion based on egg choice and deterministic seed
export function generateCompanionFromEgg(
  eggType: string,
  customSeed?: string,
  existingName?: string
): CompanionData {
  const seed = customSeed || `kq_comp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  const prng = createPRNG(seed);

  // 1. Determine species from egg choice
  let speciesId: CompanionSpeciesId = 'mokoru';
  if (eggType === 'egg_leaf') speciesId = 'rifin';
  else if (eggType === 'egg_light') speciesId = 'lumia';
  else if (eggType === 'egg_dragon') speciesId = 'kurudo';
  else if (eggType === 'egg_drop') speciesId = 'poruka';
  else if (eggType === 'egg_fluffy') speciesId = 'mokoru';
  else {
    // fallback if generic
    const speciesList: CompanionSpeciesId[] = ['mokoru', 'rifin', 'lumia', 'kurudo', 'poruka'];
    speciesId = speciesList[Math.floor(prng() * speciesList.length)];
  }

  // 2. Initial Rarity Distribution: N (55%), R (30%), SR (12%), UR (3%)
  const rarityVal = prng();
  let rarity: 'N' | 'R' | 'SR' | 'UR' = 'N';
  if (rarityVal < 0.55) {
    rarity = 'N';
  } else if (rarityVal < 0.85) {
    rarity = 'R';
  } else if (rarityVal < 0.97) {
    rarity = 'SR';
  } else {
    rarity = 'UR';
  }

  // 3. Attribute (1 in 6 equal distribution)
  const attributes: CompanionAttribute[] = ['fire', 'water', 'forest', 'wind', 'light', 'star'];
  const attribute = attributes[Math.floor(prng() * attributes.length)];

  // 4. Personality (1 in 6 equal distribution)
  const personalities: CompanionPersonality[] = ['ganbariya', 'nonbiri', 'hirameki', 'genki', 'yasashii', 'boukenzuki'];
  const personality = personalities[Math.floor(prng() * personalities.length)];

  // 5. Build Appearance
  const palette = COLOR_PALETTES[attribute];
  const bodyColor = palette.body[Math.floor(prng() * palette.body.length)];
  const secondaryColor = palette.secondary[Math.floor(prng() * palette.secondary.length)];
  const eyeColor = palette.eye[Math.floor(prng() * palette.eye.length)];

  const eyeType = EYE_TYPES[Math.floor(prng() * EYE_TYPES.length)];
  const patternType = PATTERN_TYPES[Math.floor(prng() * PATTERN_TYPES.length)];

  const speciesEars = EAR_TYPES_BY_SPECIES[speciesId];
  const earType = speciesEars[Math.floor(prng() * speciesEars.length)];

  const speciesTails = TAIL_TYPES_BY_SPECIES[speciesId];
  const tailType = speciesTails[Math.floor(prng() * speciesTails.length)];

  // Horns & Wings depend on species and rarity
  let hornType: string | undefined = undefined;
  if (speciesId === 'kurudo' || speciesId === 'poruka' || rarity === 'SR' || rarity === 'UR') {
    const hornOptions = ['small_crown', 'twin_horns', 'single_unicorn', 'crystal_horns'];
    hornType = hornOptions[Math.floor(prng() * hornOptions.length)];
  }

  let wingType: string | undefined = undefined;
  if (speciesId === 'kurudo' || rarity === 'SR' || rarity === 'UR' || (attribute === 'wind' && prng() > 0.5)) {
    const wingOptions = ['small_angel', 'dragon_bat', 'feather_wings', 'light_wings'];
    wingType = wingOptions[Math.floor(prng() * wingOptions.length)];
  }

  // Aura effect by attribute & rarity
  let effectType: string | undefined = 'none';
  if (rarity === 'UR') {
    effectType = 'aurora_cosmic';
  } else if (rarity === 'SR') {
    effectType = COMPANION_ATTRIBUTES[attribute].particleType;
  } else if (rarity === 'R') {
    effectType = 'gentle_sparkles';
  }

  const appearance: CompanionAppearance = {
    bodyType: speciesId,
    bodyColor,
    secondaryColor,
    eyeType,
    eyeColor,
    earType,
    hornType,
    patternType,
    tailType,
    wingType,
    effectType,
  };

  const speciesInfo = COMPANION_SPECIES[speciesId];
  const initialName = existingName || `${speciesInfo.name}`;

  const initialTraits: ProgressTraits = {
    insightPoints: 0,
    effortPoints: 0,
    adventurePoints: 0,
    bondPoints: 0,
    couragePoints: 0,
  };

  const companionData: CompanionData = {
    companionId: `comp_${seed}`,
    generationSeed: seed,
    chosenEggType: eggType,
    name: initialName,
    speciesId,
    attribute,
    personality,
    birthRarity: rarity,
    currentRarity: rarity,
    rarityUpgraded: false,
    stage: 'egg',
    level: 1,
    growthExp: 0,
    bond: 10,
    energy: 100,
    appearance,
    progressTraits: initialTraits,
    evolutionType: 'hirameki',
    obtainedAt: new Date().toISOString().split('T')[0],
    unlockedAccessories: ['adv_hat'],
    roomItemIds: ['decor_default'],
    unlockedActions: ['pet', 'talk', 'play'],
    growthLogs: [
      {
        id: `log_egg_${Date.now()}`,
        type: 'obtained_egg',
        title: `${speciesInfo.eggName}と出会った！`,
        description: `温かな${speciesInfo.eggName}を受け取り、新たな冒険が始まりました。`,
        date: new Date().toISOString().split('T')[0],
        icon: speciesInfo.icon,
      },
    ],
    zukanDiscoveredSpecies: [speciesId],
    zukanDiscoveredAttributes: [attribute],
    zukanDiscoveredPatterns: [patternType],
  };

  return companionData;
}

// Verification function: Tests generating 12 mock companions to verify distribution and diversity
export function testGenerateMultipleCompanions(count: number = 12): CompanionData[] {
  const eggTypes = ['egg_fluffy', 'egg_leaf', 'egg_light', 'egg_dragon', 'egg_drop'];
  const results: CompanionData[] = [];

  for (let i = 0; i < count; i++) {
    const egg = eggTypes[i % eggTypes.length];
    const testSeed = `test_seed_kq_verification_${i}_${1000 + i * 37}`;
    const comp = generateCompanionFromEgg(egg, testSeed, `テスト相棒#${i + 1}`);
    results.push(comp);
  }

  return results;
}
