import { PlayerData, CompanionSpeciesId, CompanionAttribute, CompanionRarity, CompanionPersonality } from '../types';
import { ensureItemAndRoomData } from './itemAndRoomService';
import { COMPANION_SPECIES, COMPANION_ATTRIBUTES, COMPANION_RARITIES } from '../data/companionParts';

export interface NpcCompanionInfo {
  npcId: string;
  name: string;
  title: string;
  speciesId: CompanionSpeciesId;
  attribute: CompanionAttribute;
  rarity: CompanionRarity;
  personality: CompanionPersonality;
  dialogue: string;
  encounterLocation: string;
  avatarIcon: string;
}

export const SAMPLE_NPC_COMPANIONS: NpcCompanionInfo[] = [
  {
    npcId: 'npc_rifin_forest',
    name: 'リーフィ',
    title: '木漏れ日の精霊',
    speciesId: 'rifin',
    attribute: 'forest',
    rarity: 'R',
    personality: 'nonbiri',
    dialogue: 'やぁ！君も算数の森を探検しているんだね！一緒に頑張ろうね～🌱',
    encounterLocation: 'はじまりの森',
    avatarIcon: '🌱',
  },
  {
    npcId: 'npc_mokoru_fire',
    name: 'モコジロウ',
    title: '情熱のモコモコ',
    speciesId: 'mokoru',
    attribute: 'fire',
    rarity: 'SR',
    personality: 'ganbariya',
    dialogue: '燃えてきたぞー！どんな難しい計算問題もオレたちの熱意で撃破だ！🔥',
    encounterLocation: '熱血の炎火山',
    avatarIcon: '🔥',
  },
  {
    npcId: 'npc_poruka_water',
    name: 'ポルリン',
    title: '清流のドロップ',
    speciesId: 'poruka',
    attribute: 'water',
    rarity: 'R',
    personality: 'amembou',
    dialogue: 'ぷるぷる～！君の解いた計算式、とってもキレイだったよ！💧',
    encounterLocation: 'サザナミ海岸',
    avatarIcon: '💧',
  },
  {
    npcId: 'npc_lumia_light',
    name: 'ルミナス',
    title: '知恵の星晶',
    speciesId: 'lumia',
    attribute: 'light',
    rarity: 'UR',
    personality: 'chitei',
    dialogue: '見事な閃きですね。数理の美しい理があなたを照らしています。✨',
    encounterLocation: '幾何学の古代神殿',
    avatarIcon: '✨',
  },
  {
    npcId: 'npc_kurudo_star',
    name: 'クルード',
    title: '星海の幼龍',
    speciesId: 'kurudo',
    attribute: 'star',
    rarity: 'SEC',
    personality: 'yuukan',
    dialogue: '我は星海の真理を護る龍！勇気ある挑戦者よ、さらなる高みへ進むのだ！⭐',
    encounterLocation: '宇宙の天体観測所',
    avatarIcon: '🐲',
  },
];

/**
 * Registers an NPC companion into the Player's Encyclopedia without duplicate additions
 */
export function registerNpcCompanionToZukan(
  playerInput: PlayerData,
  npc: NpcCompanionInfo
): { updatedPlayer: PlayerData; isNewDiscovery: boolean } {
  let player = ensureItemAndRoomData(playerInput);
  const zukan = player.companionEncyclopedia!;

  const isNpcAlreadyRegistered = zukan.discoveredNpcIds.includes(npc.npcId);

  const updatedSpecies = Array.from(new Set([...zukan.discoveredSpecies, npc.speciesId]));
  const updatedAttributes = Array.from(new Set([...zukan.discoveredAttributes, npc.attribute]));
  const updatedPersonalities = Array.from(new Set([...zukan.discoveredPersonalities, npc.personality]));
  const updatedRarities = Array.from(new Set([...zukan.discoveredRarities, npc.rarity]));
  const updatedNpcIds = Array.from(new Set([...zukan.discoveredNpcIds, npc.npcId]));

  const evoFormKey = `${npc.speciesId}_${npc.attribute}_${npc.rarity}`;
  const updatedEvoForms = Array.from(new Set([...zukan.discoveredEvolutionForms, evoFormKey]));

  const isNewDiscovery = !isNpcAlreadyRegistered;

  const updatedZukan = {
    ...zukan,
    discoveredSpecies: updatedSpecies,
    discoveredAttributes: updatedAttributes,
    discoveredPersonalities: updatedPersonalities,
    discoveredRarities: updatedRarities,
    discoveredNpcIds: updatedNpcIds,
    discoveredEvolutionForms: updatedEvoForms,
    lastRegisteredAt: new Date().toISOString(),
  };

  const updatedPlayer: PlayerData = {
    ...player,
    companionEncyclopedia: updatedZukan,
  };

  return { updatedPlayer, isNewDiscovery };
}

/**
 * Checks and triggers a random NPC encounter on stage clear
 */
export function checkStageClearNpcEncounter(
  playerInput: PlayerData,
  stageTitle?: string
): { updatedPlayer: PlayerData; encounteredNpc: NpcCompanionInfo | null; isNewDiscovery: boolean } {
  let player = ensureItemAndRoomData(playerInput);

  // Filter NPCs that haven't been discovered yet, or pick from whole pool
  const zukan = player.companionEncyclopedia!;
  const undiscoveredNpcs = SAMPLE_NPC_COMPANIONS.filter(
    (npc) => !zukan.discoveredNpcIds.includes(npc.npcId)
  );

  const pool = undiscoveredNpcs.length > 0 ? undiscoveredNpcs : SAMPLE_NPC_COMPANIONS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const pickedNpc = pool[randomIndex];

  const { updatedPlayer, isNewDiscovery } = registerNpcCompanionToZukan(player, pickedNpc);

  return {
    updatedPlayer,
    encounteredNpc: pickedNpc,
    isNewDiscovery,
  };
}
