import {
  PlayerData,
  InventoryItem,
  ItemUsageHistoryEntry,
  CompanionRoomData,
  CompanionRoomTheme,
  ItemRarity,
  ItemType,
} from '../types';
import { ensureCompanionData } from './companionService';

export interface ItemDefinition {
  itemId: string;
  itemType: ItemType;
  name: string;
  description: string;
  rarity: ItemRarity;
  icon: string;
  effectLabel: string;
}

export const NURTURING_ITEMS: Record<string, ItemDefinition> = {
  knowledge_fruit: {
    itemId: 'knowledge_fruit',
    itemType: 'growth',
    name: '知識の実',
    description: '算数の知恵が詰まったみずみずしい果実。相棒の成長経験値を少し増やします。',
    rarity: 'common',
    icon: '🍎',
    effectLabel: '成長エネルギー +30',
  },
  hirameki_candy: {
    itemId: 'hirameki_candy',
    itemType: 'trait',
    name: 'ひらめきキャンディ',
    description: '閃きの光を宿したスターキャンディ。ひらめき傾向ポイントをアップします。',
    rarity: 'rare',
    icon: '🍬',
    effectLabel: 'ひらめきポイント +5',
  },
  courage_cookie: {
    itemId: 'courage_cookie',
    itemType: 'trait',
    name: '勇気のクッキー',
    description: '香ばしく焼き上げられた剣の形をしたクッキー。勇気傾向ポイントをアップします。',
    rarity: 'rare',
    icon: '🍪',
    effectLabel: '勇気ポイント +5',
  },
  effort_bread: {
    itemId: 'effort_bread',
    itemType: 'trait',
    name: 'がんばりパン',
    description: '何度でも挑戦する力がわいてくる焼きたてパン。努力の進化傾向を育てます。',
    rarity: 'rare',
    icon: '🥖',
    effectLabel: '努力ポイント +5・成長 +10',
  },
  review_soup: {
    itemId: 'review_soup',
    itemType: 'growth',
    name: 'ふりかえりスープ',
    description: '間違いを学び直した知恵が溶け込んだスープ。成長ときずなを一緒に増やします。',
    rarity: 'epic',
    icon: '🥣',
    effectLabel: '成長エネルギー +20・きずな +3',
  },
  friendship_ribbon: {
    itemId: 'friendship_ribbon',
    itemType: 'bond',
    name: 'なかよしリボン',
    description: '一緒に学んだ思い出を結ぶ特別なリボン。相棒とのきずなを大きく深めます。',
    rarity: 'epic',
    icon: '🎀',
    effectLabel: 'きずな度 +10・きずな傾向 +5',
  },
  kizuna_milk: {
    itemId: 'kizuna_milk',
    itemType: 'bond',
    name: 'きずなのミルク',
    description: '心がほっと温まる特製ミルク。相棒とのきずな度をアップします。',
    rarity: 'common',
    icon: '🥛',
    effectLabel: 'きずな度 +5',
  },
  star_fragment: {
    itemId: 'star_fragment',
    itemType: 'special',
    name: '星のかけら',
    description: '夜空から降ってきた美しい星の破片。特別なアクセサリーの解放などに使われます。',
    rarity: 'epic',
    icon: '⭐',
    effectLabel: 'アクセサリー・家具解放ポイント',
  },
  evolution_dew: {
    itemId: 'evolution_dew',
    itemType: 'evolution',
    name: '進化のしずく',
    description: '相棒の真の姿を目覚めさせる神秘的なしずく。進化やレアアップを助けます。',
    rarity: 'legendary',
    icon: '💧',
    effectLabel: '進化・レアアップ促進',
  },
};

// 5 Room Themes
export interface RoomThemeDefinition {
  id: CompanionRoomTheme;
  name: string;
  description: string;
  icon: string;
  defaultWallpaper: string;
  defaultFloor: string;
  defaultBed: string;
  defaultDesk: string;
  defaultShelf: string;
  defaultLight: string;
  defaultPlant: string;
  defaultDecoration: string;
  defaultWindow: string;
  bgClass: string;
}

export const ROOM_THEMES: Record<CompanionRoomTheme, RoomThemeDefinition> = {
  hajimari: {
    id: 'hajimari',
    name: 'はじまりの部屋',
    description: 'あたたかな木のぬくもりを感じる、居心地の良いはじまりのお部屋。',
    icon: '🏠',
    defaultWallpaper: 'wall_wood',
    defaultFloor: 'floor_carpet',
    defaultBed: 'bed_standard',
    defaultDesk: 'desk_adventurer',
    defaultShelf: 'shelf_wooden',
    defaultLight: 'light_lamp',
    defaultPlant: 'plant_potted',
    defaultDecoration: 'decor_globe',
    defaultWindow: 'win_blue_sky',
    bgClass: 'from-amber-950/80 via-slate-900 to-slate-950',
  },
  mori: {
    id: 'mori',
    name: '森の部屋',
    description: '木漏れ日と小鳥のさえずりが聴こえる、自然いっぱいの森林のお部屋。',
    icon: '🌲',
    defaultWallpaper: 'wall_mori',
    defaultFloor: 'floor_grass',
    defaultBed: 'bed_leaf',
    defaultDesk: 'desk_stump',
    defaultShelf: 'shelf_tree',
    defaultLight: 'light_firefly',
    defaultPlant: 'plant_forest',
    defaultDecoration: 'decor_mushroom',
    defaultWindow: 'win_forest',
    bgClass: 'from-emerald-950/80 via-teal-950 to-slate-950',
  },
  hoshizora: {
    id: 'hoshizora',
    name: '星空の部屋',
    description: '満天の星と宇宙の神秘に包まれた幻想的な天文観測のお部屋。',
    icon: '🌌',
    defaultWallpaper: 'wall_hoshizora',
    defaultFloor: 'floor_star_carpet',
    defaultBed: 'bed_cloud',
    defaultDesk: 'desk_scholar',
    defaultShelf: 'shelf_crystal',
    defaultLight: 'light_star_pendant',
    defaultPlant: 'plant_glowing',
    defaultDecoration: 'decor_telescope',
    defaultWindow: 'win_galaxy',
    bgClass: 'from-indigo-950/80 via-purple-950 to-slate-950',
  },
  umibe: {
    id: 'umibe',
    name: '海辺の部屋',
    description: '波の音と潮風が心地よい、爽やかで開放的なリゾートのお部屋。',
    icon: '🏖️',
    defaultWallpaper: 'wall_umibe',
    defaultFloor: 'floor_sand',
    defaultBed: 'bed_shell',
    defaultDesk: 'desk_driftwood',
    defaultShelf: 'shelf_coral',
    defaultLight: 'light_lantern',
    defaultPlant: 'plant_palm',
    defaultDecoration: 'decor_compass',
    defaultWindow: 'win_ocean',
    bgClass: 'from-sky-950/80 via-blue-950 to-slate-950',
  },
  bouken: {
    id: 'bouken',
    name: '冒険者の部屋',
    description: '世界中の宝物や古地図が飾られた、勇者と探求者の基地。',
    icon: '🗺️',
    defaultWallpaper: 'wall_stone',
    defaultFloor: 'floor_flagstone',
    defaultBed: 'bed_tent',
    defaultDesk: 'desk_map_table',
    defaultShelf: 'shelf_treasure',
    defaultLight: 'light_torch',
    defaultPlant: 'plant_cactus',
    defaultDecoration: 'decor_trophy',
    defaultWindow: 'win_castle',
    bgClass: 'from-amber-900/80 via-stone-900 to-slate-950',
  },
};

// Furniture Item Catalog
export interface FurnitureItemDefinition {
  id: string;
  name: string;
  category: 'wallpaper' | 'floor' | 'bed' | 'desk' | 'shelf' | 'light' | 'plant' | 'decoration' | 'window';
  icon: string;
  description: string;
  unlockCondition: string;
}

export const FURNITURE_CATALOG: FurnitureItemDefinition[] = [
  // Wallpapers
  { id: 'wall_wood', name: '木目の壁紙', category: 'wallpaper', icon: '🪵', description: '温かみのある木の壁', unlockCondition: '初期所有' },
  { id: 'wall_mori', name: '深緑の森の壁', category: 'wallpaper', icon: '🌿', description: '木漏れ日が差す壁紙', unlockCondition: '「森の部屋」解放' },
  { id: 'wall_hoshizora', name: '銀河の壁紙', category: 'wallpaper', icon: '🌌', description: '星屑が煌めく壁紙', unlockCondition: '「星空の部屋」解放' },
  { id: 'wall_umibe', name: 'マリンブルーの壁', category: 'wallpaper', icon: '🌊', description: '爽やかな波模様', unlockCondition: '「海辺の部屋」解放' },
  { id: 'wall_stone', name: '石造りの壁', category: 'wallpaper', icon: '🏰', description: '重厚な城壁風', unlockCondition: '「冒険者の部屋」解放' },

  // Floors
  { id: 'floor_carpet', name: '温かい絨毯', category: 'floor', icon: '🧶', description: 'ふかふかの手織りカーペット', unlockCondition: '初期所有' },
  { id: 'floor_grass', name: '緑の芝生ラグ', category: 'floor', icon: '🌱', description: 'やわらかい草の敷物', unlockCondition: 'ミッションクリアで獲得' },
  { id: 'floor_star_carpet', name: 'コズミックラグ', category: 'floor', icon: '✨', description: '宇宙柄の特製絨毯', unlockCondition: 'きずな度 30 達成' },
  { id: 'floor_sand', name: '白砂のフロア', category: 'floor', icon: '🏖️', description: 'サラサラとした白い砂浜風', unlockCondition: '「海辺の部屋」解放' },
  { id: 'floor_flagstone', name: '石畳の床', category: 'floor', icon: '🪨', description: '城塞の堅固な石畳', unlockCondition: '単元3つクリア' },

  // Beds
  { id: 'bed_standard', name: '木のふかふかベッド', category: 'bed', icon: '🛏️', description: 'ぐっすり眠れるベッド', unlockCondition: '初期所有' },
  { id: 'bed_cloud', name: '雲のフワフワベッド', category: 'bed', icon: '☁️', description: 'まるで空に浮かぶ寝心地', unlockCondition: 'きずな度 40 達成' },
  { id: 'bed_leaf', name: '葉っぱのハモック', category: 'bed', icon: '🍃', description: '揺れて気持ちいいハンモック', unlockCondition: 'ミッションクリアで獲得' },
  { id: 'bed_shell', name: '貝殻のクッション', category: 'bed', icon: '🐚', description: '大きな貝のソファーベッド', unlockCondition: '「海辺の部屋」解放' },

  // Desks
  { id: 'desk_adventurer', name: '冒険者の学習机', category: 'desk', icon: '🪑', description: 'しっかり勉強できる木製デスク', unlockCondition: '初期所有' },
  { id: 'desk_stump', name: '切り株のテーブル', category: 'desk', icon: '🪵', description: '大木の切り株を使ったテーブル', unlockCondition: '森の部屋解放' },
  { id: 'desk_scholar', name: '研究者の天文デスク', category: 'desk', icon: '🔭', description: '星座早見表が載ったデスク', unlockCondition: '星空の部屋解放' },
  { id: 'desk_map_table', name: '古地図の大卓', category: 'desk', icon: '🗺️', description: '世界の地図が広がる大卓', unlockCondition: '冒険者の部屋解放' },

  // Shelves
  { id: 'shelf_wooden', name: '木製の棚', category: 'shelf', icon: '📚', description: '本や小物を飾る本棚', unlockCondition: '初期所有' },
  { id: 'shelf_tree', name: '大木の枝棚', category: 'shelf', icon: '🌳', description: '自然の枝を生かしたラック', unlockCondition: '森の部屋解放' },
  { id: 'shelf_crystal', name: 'クリスタルラック', category: 'shelf', icon: '💎', description: '鉱石が輝くディスプレイ棚', unlockCondition: '星空の部屋解放' },
  { id: 'shelf_treasure', name: '宝箱のスタック', category: 'shelf', icon: '🧰', description: '宝箱を積み重ねた棚', unlockCondition: '冒険者の部屋解放' },

  // Lights
  { id: 'light_lamp', name: 'スタンドライト', category: 'light', icon: '💡', description: 'あたたかい光のランプ', unlockCondition: '初期所有' },
  { id: 'light_firefly', name: '蛍のランタン', category: 'light', icon: '🏮', description: '幻想的な光を放つ虫籠', unlockCondition: 'ミッションクリアで獲得' },
  { id: 'light_star_pendant', name: '星のペンダントライト', category: 'light', icon: '⭐', description: '天井から吊るす星の照明', unlockCondition: '星空の部屋解放' },

  // Plants
  { id: 'plant_potted', name: '観葉植物', category: 'plant', icon: '🪴', description: '可愛い植木鉢', unlockCondition: '初期所有' },
  { id: 'plant_forest', name: '発光キノコの鉢', category: 'plant', icon: '🍄', description: '暗闇でほのかに光るキノコ', unlockCondition: '森の部屋解放' },
  { id: 'plant_coral', name: 'サンゴのアクアリウム', category: 'plant', icon: '🪸', description: '海の中のような綺麗なサンゴ', unlockCondition: '海辺の部屋解放' },

  // Decorations
  { id: 'decor_globe', name: '算数地球儀', category: 'decoration', icon: '🌐', description: '世界の図形が載った地球儀', unlockCondition: '初期所有' },
  { id: 'decor_telescope', name: '天体望遠鏡', category: 'decoration', icon: '🔭', description: '遠くの星を観察する望遠鏡', unlockCondition: '星空の部屋解放' },
  { id: 'decor_compass', name: '黄金のコンパス', category: 'decoration', icon: '🧭', description: '正しい方角を示すコンパス', unlockCondition: '冒険者の部屋解放' },

  // Windows
  { id: 'win_blue_sky', name: '青空の窓', category: 'window', icon: '🪟', description: '清々しい快晴の空', unlockCondition: '初期所有' },
  { id: 'win_forest', name: '新緑の森の景色', category: 'window', icon: '🌲', description: '緑豊かな森の風景', unlockCondition: '森の部屋解放' },
  { id: 'win_galaxy', name: '銀河の景色', category: 'window', icon: '🌌', description: '輝く星々と天の川', unlockCondition: '星空の部屋解放' },
  { id: 'win_ocean', name: 'コバルトブルーの海', category: 'window', icon: '🌊', description: '澄み切った水平線', unlockCondition: '海辺の部屋解放' },
];

/**
 * Ensures player object has initialized inventory, companionRoom, claimedRewardIds, companionEncyclopedia
 */
export function ensureItemAndRoomData(playerInput: PlayerData): PlayerData {
  const player = ensureCompanionData(playerInput);
  const now = new Date().toISOString();

  // 1. Inventory initialization
  const initialInventory: Record<string, InventoryItem> = {
    knowledge_fruit: {
      itemId: 'knowledge_fruit',
      itemType: 'growth',
      name: '知識の実',
      description: NURTURING_ITEMS.knowledge_fruit.description,
      rarity: 'common',
      quantity: 3,
      obtainedAt: now,
      lastObtainedAt: now,
      icon: '🍎',
    },
    hirameki_candy: {
      itemId: 'hirameki_candy',
      itemType: 'trait',
      name: 'ひらめきキャンディ',
      description: NURTURING_ITEMS.hirameki_candy.description,
      rarity: 'rare',
      quantity: 1,
      obtainedAt: now,
      lastObtainedAt: now,
      icon: '🍬',
    },
    courage_cookie: {
      itemId: 'courage_cookie',
      itemType: 'trait',
      name: '勇気のクッキー',
      description: NURTURING_ITEMS.courage_cookie.description,
      rarity: 'rare',
      quantity: 1,
      obtainedAt: now,
      lastObtainedAt: now,
      icon: '🍪',
    },
    kizuna_milk: {
      itemId: 'kizuna_milk',
      itemType: 'bond',
      name: 'きずなのミルク',
      description: NURTURING_ITEMS.kizuna_milk.description,
      rarity: 'common',
      quantity: 2,
      obtainedAt: now,
      lastObtainedAt: now,
      icon: '🥛',
    },
    star_fragment: {
      itemId: 'star_fragment',
      itemType: 'special',
      name: '星のかけら',
      description: NURTURING_ITEMS.star_fragment.description,
      rarity: 'epic',
      quantity: 1,
      obtainedAt: now,
      lastObtainedAt: now,
      icon: '⭐',
    },
    evolution_dew: {
      itemId: 'evolution_dew',
      itemType: 'evolution',
      name: '進化のしずく',
      description: NURTURING_ITEMS.evolution_dew.description,
      rarity: 'legendary',
      quantity: 0,
      obtainedAt: now,
      lastObtainedAt: now,
      icon: '💧',
    },
  };

  const inventory = {
    ...initialInventory,
    ...(player.inventory || {}),
  };

  // 2. Room Data Initialization
  const defaultRoom: CompanionRoomData = {
    roomThemeId: 'hajimari',
    wallpaperId: 'wall_wood',
    floorId: 'floor_carpet',
    bedId: 'bed_standard',
    deskId: 'desk_adventurer',
    shelfId: 'shelf_wooden',
    lightId: 'light_lamp',
    plantId: 'plant_potted',
    decorationIds: ['decor_globe'],
    windowViewId: 'win_blue_sky',
    unlockedRoomItemIds: [
      'wall_wood',
      'floor_carpet',
      'bed_standard',
      'desk_adventurer',
      'shelf_wooden',
      'light_lamp',
      'plant_potted',
      'decor_globe',
      'win_blue_sky',
    ],
    lastUpdatedAt: now,
  };

  const companionRoom = {
    ...defaultRoom,
    ...(player.companionRoom || {}),
    unlockedRoomItemIds: Array.from(
      new Set([
        ...defaultRoom.unlockedRoomItemIds,
        ...(player.companionRoom?.unlockedRoomItemIds || []),
      ])
    ),
  };

  // 3. Encyclopedia auto-registration of own companion
  const comp = player.companion!;
  const existingZukan = player.companionEncyclopedia || {
    discoveredSpecies: [],
    discoveredAttributes: [],
    discoveredPersonalities: [],
    discoveredRarities: [],
    discoveredPatterns: [],
    discoveredParts: { ears: [], horns: [], wings: [], tails: [] },
    discoveredEvolutionForms: [],
    discoveredNpcIds: [],
  };

  const newSpecies = Array.from(new Set([...existingZukan.discoveredSpecies, comp.speciesId]));
  const newAttributes = Array.from(new Set([...existingZukan.discoveredAttributes, comp.attribute]));
  const newPersonalities = Array.from(new Set([...existingZukan.discoveredPersonalities, comp.personality]));
  const newRarities = Array.from(new Set([...existingZukan.discoveredRarities, comp.currentRarity || 'N']));
  const newPatterns = Array.from(new Set([...existingZukan.discoveredPatterns, comp.appearance?.patternType || 'none']));

  const partsEars = Array.from(new Set([...existingZukan.discoveredParts.ears, comp.appearance?.earType || 'standard']));
  const partsHorns = Array.from(new Set([...existingZukan.discoveredParts.horns, comp.appearance?.hornType || 'none']));
  const partsWings = Array.from(new Set([...existingZukan.discoveredParts.wings, comp.appearance?.wingType || 'none']));
  const partsTails = Array.from(new Set([...existingZukan.discoveredParts.tails, comp.appearance?.tailType || 'short']));

  const evolutionFormKey = `${comp.speciesId}_${comp.attribute}_${comp.currentRarity}`;
  const newEvoForms = Array.from(new Set([...existingZukan.discoveredEvolutionForms, evolutionFormKey]));

  const companionEncyclopedia = {
    ...existingZukan,
    discoveredSpecies: newSpecies,
    discoveredAttributes: newAttributes,
    discoveredPersonalities: newPersonalities,
    discoveredRarities: newRarities,
    discoveredPatterns: newPatterns,
    discoveredParts: {
      ears: partsEars,
      horns: partsHorns,
      wings: partsWings,
      tails: partsTails,
    },
    discoveredEvolutionForms: newEvoForms,
    lastRegisteredAt: now,
  };

  return {
    ...player,
    inventory,
    itemUsageHistory: player.itemUsageHistory || [],
    companionRoom,
    companionEncyclopedia,
    claimedRewardIds: player.claimedRewardIds || [],
  };
}

/**
 * Adds an item to player inventory with duplicate reward check
 */
export function addInventoryItem(
  playerInput: PlayerData,
  itemId: string,
  quantityToAdd: number = 1,
  rewardId?: string
): { updatedPlayer: PlayerData; success: boolean; item?: InventoryItem; message?: string } {
  let player = ensureItemAndRoomData(playerInput);

  // Check duplicate reward
  if (rewardId) {
    if (player.claimedRewardIds?.includes(rewardId)) {
      return { updatedPlayer: player, success: false, message: '既に受け取り済みの報酬です。' };
    }
  }

  const itemDef = NURTURING_ITEMS[itemId];
  if (!itemDef) {
    return { updatedPlayer: player, success: false, message: '無効なアイテムIDです。' };
  }

  const now = new Date().toISOString();
  const currentInv = player.inventory || {};
  const existingItem = currentInv[itemId];

  const newQty = (existingItem?.quantity || 0) + Math.max(1, quantityToAdd);

  const updatedItem: InventoryItem = {
    itemId,
    itemType: itemDef.itemType,
    name: itemDef.name,
    description: itemDef.description,
    rarity: itemDef.rarity,
    quantity: newQty,
    obtainedAt: existingItem?.obtainedAt || now,
    lastObtainedAt: now,
    icon: itemDef.icon,
  };

  const updatedInventory = {
    ...currentInv,
    [itemId]: updatedItem,
  };

  const updatedClaimedIds = rewardId
    ? [...(player.claimedRewardIds || []), rewardId]
    : player.claimedRewardIds;

  const updatedPlayer: PlayerData = {
    ...player,
    inventory: updatedInventory,
    claimedRewardIds: updatedClaimedIds,
  };

  return {
    updatedPlayer,
    success: true,
    item: updatedItem,
    message: `${itemDef.name} を ${quantityToAdd} 個獲得しました！`,
  };
}

/**
 * Uses an item from player inventory with anti-double-spend protection
 */
export function useInventoryItem(
  playerInput: PlayerData,
  itemId: string
): { updatedPlayer: PlayerData; success: boolean; message: string; dialogue: string } {
  let player = ensureItemAndRoomData(playerInput);
  const currentInv = player.inventory || {};
  const item = currentInv[itemId];

  if (!item || item.quantity <= 0) {
    return {
      updatedPlayer: player,
      success: false,
      message: 'アイテムの所持数が足らないよ！',
      dialogue: 'あれれ？アイテムがないみたい！',
    };
  }

  const comp = player.companion!;
  const newQty = Math.max(0, item.quantity - 1);

  let energyGain = 0;
  let bondGain = 0;
  let dialogue = 'おいしい！元気が湧いてきたよ！';
  let effectType = 'none';
  let effectAmount = 0;

  const traits = { ...comp.progressTraits };

  switch (itemId) {
    case 'knowledge_fruit':
      energyGain = 30;
      effectType = 'energy';
      effectAmount = 30;
      dialogue = '「知識の実」はおいしいなぁ！頭がさえてパワーが湧いてきたよ！';
      break;
    case 'hirameki_candy':
      traits.insightPoints = (traits.insightPoints || 0) + 5;
      bondGain = 2;
      effectType = 'insight';
      effectAmount = 5;
      dialogue = '「ひらめきキャンディ」甘くておいしい！あたらしくひらめく気がする！';
      break;
    case 'courage_cookie':
      traits.couragePoints = (traits.couragePoints || 0) + 5;
      bondGain = 2;
      effectType = 'courage';
      effectAmount = 5;
      dialogue = '「勇気のクッキー」サクサクだ！どんな難しい問題も倒せそう！';
      break;
    case 'effort_bread':
      traits.effortPoints = (traits.effortPoints || 0) + 5;
      energyGain = 10;
      bondGain = 2;
      effectType = 'effort';
      effectAmount = 5;
      dialogue = '「がんばりパン」で力がわいてきたよ！むずかしい問題にも、もう一度挑戦しよう！';
      break;
    case 'review_soup':
      energyGain = 20;
      bondGain = 3;
      effectType = 'review_growth';
      effectAmount = 20;
      dialogue = '「ふりかえりスープ」で頭も心もぽかぽか！間違いが次の力になったよ！';
      break;
    case 'friendship_ribbon':
      traits.bondPoints = (traits.bondPoints || 0) + 5;
      bondGain = 10;
      effectType = 'bond_trait';
      effectAmount = 10;
      dialogue = '「なかよしリボン」を結んでくれてありがとう！これからも一緒に学ぼうね！';
      break;
    case 'kizuna_milk':
      bondGain = 5;
      effectType = 'bond';
      effectAmount = 5;
      dialogue = '「きずなのミルク」あたたかくてほっとするよ…！ありがとう！';
      break;
    case 'star_fragment':
      traits.adventurePoints = (traits.adventurePoints || 0) + 5;
      bondGain = 3;
      effectType = 'adventure';
      effectAmount = 5;
      dialogue = '「星のかけら」がキラキラ輝いている！冒険のワクワクが広がるよ！';
      break;
    case 'evolution_dew':
      energyGain = 50;
      bondGain = 5;
      effectType = 'evolution_boost';
      effectAmount = 1;
      dialogue = '「進化のしずく」不思議なひかりに包まれて真のパワーを感じるよ！';
      break;
  }

  // Update companion stats
  const newEnergy = (comp.growthExp || 0) + energyGain;
  const newBond = Math.min(100, (comp.bond || 0) + bondGain);
  const newLevel = Math.floor(newEnergy / 30) + 1;

  const updatedCompanion = {
    ...comp,
    growthExp: newEnergy,
    bond: newBond,
    level: Math.max(comp.level || 1, newLevel),
    progressTraits: traits,
  };

  // Record usage history
  const historyEntry: ItemUsageHistoryEntry = {
    id: `use_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    itemId,
    usedAt: new Date().toISOString(),
    targetCompanionId: comp.companionId,
    effectType,
    effectAmount,
  };

  const updatedInventory = {
    ...currentInv,
    [itemId]: {
      ...item,
      quantity: newQty,
    },
  };

  const updatedPlayer: PlayerData = {
    ...player,
    companion: updatedCompanion,
    inventory: updatedInventory,
    itemUsageHistory: [historyEntry, ...(player.itemUsageHistory || [])],
  };

  return {
    updatedPlayer,
    success: true,
    message: `${item.name} を使用しました！`,
    dialogue,
  };
}
