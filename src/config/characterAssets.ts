/**
 * Knowledge Quest Centralized Character Assets Registry
 * 
 * Future asset path changes for Hero, Buddy, and Enemy images can be modified
 * right here without altering any screen or component logic.
 * All paths are static relative string paths under /assets/
 */

import heroBoyImage from '../assets/images/hero_boy_v1_1785625821391.jpg';
import heroGirlImage from '../assets/images/hero_girl_v1_1785625837606.jpg';
import buddyLarnyImage from '../assets/images/buddy_purple_dragon_v1_1785625850023.jpg';

export interface CharacterAssetPath {
  image?: string;
  fallbackText?: string;
}

// Hero Assets (Ver.1.0 Formal Protagonist Design - Boy & Girl)
export const HERO_ASSETS: Record<string, CharacterAssetPath> = {
  boy_idle: {
    image: heroBoyImage,
    fallbackText: '【正式主人公Ver.1.0】男女の子 (青冒険服・剣)',
  },
  boy_attack: {
    image: heroBoyImage,
    fallbackText: '【正式主人公Ver.1.0】男の子・攻撃',
  },
  boy_damage: {
    image: heroBoyImage,
    fallbackText: '【正式主人公Ver.1.0】男の子・ダメージ',
  },
  boy_victory: {
    image: heroBoyImage,
    fallbackText: '【正式主人公Ver.1.0】男の子・勝利',
  },
  girl_idle: {
    image: heroGirlImage,
    fallbackText: '【正式主人公Ver.1.0】女の子 (ピンク冒険服・杖)',
  },
  girl_attack: {
    image: heroGirlImage,
    fallbackText: '【正式主人公Ver.1.0】女の子・攻撃',
  },
  girl_damage: {
    image: heroGirlImage,
    fallbackText: '【正式主人公Ver.1.0】女の子・ダメージ',
  },
  girl_victory: {
    image: heroGirlImage,
    fallbackText: '【正式主人公Ver.1.0】女の子・勝利',
  },
};

// Buddy Assets (Ver.1.0 Formal Purple Dragon "ラーニィ")
export const BUDDY_ASSETS: Record<string, CharacterAssetPath> = {
  egg: {
    image: buddyLarnyImage,
    fallbackText: '紫色のタマゴ (ラーニィ)',
  },
  baby: {
    image: buddyLarnyImage,
    fallbackText: '赤ちゃんの紫ドラゴン (ラーニィ)',
  },
  child: {
    image: buddyLarnyImage,
    fallbackText: '幼年期の紫ドラゴン (ラーニィ)',
  },
  grown: {
    image: buddyLarnyImage,
    fallbackText: '成長期の紫ドラゴン (ラーニィ)',
  },
  final: {
    image: buddyLarnyImage,
    fallbackText: '最終進化紫ドラゴン (ラーニィ)',
  },
  element_fire: {
    image: buddyLarnyImage,
    fallbackText: '炎の紫ドラゴン (ラーニィ)',
  },
  element_ice: {
    image: buddyLarnyImage,
    fallbackText: '氷の紫ドラゴン (ラーニィ)',
  },
  element_ghost: {
    image: buddyLarnyImage,
    fallbackText: 'ゴースト紫ドラゴン (ラーニィ)',
  },
  element_holy: {
    image: buddyLarnyImage,
    fallbackText: '聖紫ドラゴン (ラーニィ)',
  },
};

// Enemy Assets
export const ENEMY_ASSETS: Record<string, CharacterAssetPath> = {
  blueOgre: {
    fallbackText: 'ブルーオーガ (青鬼モンスター)',
  },
  redDragon: {
    fallbackText: 'レッドドラゴン',
  },
  blueDragon: {
    fallbackText: 'ブルードラゴン',
  },
  greenDragon: {
    fallbackText: 'グリーンドラゴン',
  },
  purpleDragon: {
    fallbackText: 'パープルドラゴン',
  },
  ghost: {
    fallbackText: 'ゴースト・ファイヤ',
  },
  shadow: {
    fallbackText: 'シャドウモンスター',
  },
  oneEyeMonster: {
    fallbackText: 'サイクロプス',
  },
  boss: {
    fallbackText: 'ボスクイーン / トラペゾイド',
  },
};
