/**
 * Knowledge Quest Centralized Character Assets Registry
 * 
 * Future asset path changes for Hero, Buddy, and Enemy images can be modified
 * right here without altering any screen or component logic.
 * All paths are static relative string paths under /assets/
 */

export interface CharacterAssetPath {
  image?: string;
  fallbackText?: string;
}

// Hero Assets (Ver.1.0 Formal Protagonist Design - Boy & Girl)
export const HERO_ASSETS: Record<string, CharacterAssetPath> = {
  boy_idle: {
    image: '/assets/hero/boy/idle.png',
    fallbackText: '【正式主人公Ver.1.0】男女の子 (青冒険服・剣)',
  },
  boy_attack: {
    image: '/assets/hero/boy/attack.png',
    fallbackText: '【正式主人公Ver.1.0】男の子・攻撃',
  },
  boy_damage: {
    image: '/assets/hero/boy/damage.png',
    fallbackText: '【正式主人公Ver.1.0】男の子・ダメージ',
  },
  boy_victory: {
    image: '/assets/hero/boy/victory.png',
    fallbackText: '【正式主人公Ver.1.0】男の子・勝利',
  },
  girl_idle: {
    image: '/assets/hero/girl/idle.png',
    fallbackText: '【正式主人公Ver.1.0】女の子 (ピンク冒険服・杖)',
  },
  girl_attack: {
    image: '/assets/hero/girl/attack.png',
    fallbackText: '【正式主人公Ver.1.0】女の子・攻撃',
  },
  girl_damage: {
    image: '/assets/hero/girl/damage.png',
    fallbackText: '【正式主人公Ver.1.0】女の子・ダメージ',
  },
  girl_victory: {
    image: '/assets/hero/girl/victory.png',
    fallbackText: '【正式主人公Ver.1.0】女の子・勝利',
  },
};

// Buddy Assets (Ver.1.0 Formal Purple Dragon "ラーニィ")
export const BUDDY_ASSETS: Record<string, CharacterAssetPath> = {
  egg: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: '紫色のタマゴ (ラーニィ)',
  },
  baby: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: '赤ちゃんの紫ドラゴン (ラーニィ)',
  },
  child: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: '幼年期の紫ドラゴン (ラーニィ)',
  },
  grown: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: '成長期の紫ドラゴン (ラーニィ)',
  },
  final: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: '最終進化紫ドラゴン (ラーニィ)',
  },
  element_fire: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: '炎の紫ドラゴン (ラーニィ)',
  },
  element_ice: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: '氷の紫ドラゴン (ラーニィ)',
  },
  element_ghost: {
    image: '/assets/buddy/larny/idle.png',
    fallbackText: 'ゴースト紫ドラゴン (ラーニィ)',
  },
  element_holy: {
    image: '/assets/buddy/larny/idle.png',
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
