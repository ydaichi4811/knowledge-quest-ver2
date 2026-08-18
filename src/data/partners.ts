import { PartnerType } from '../types';

export interface PetEvolutionStage {
  stageId: 1 | 2 | 3 | 4 | 5;
  name: string;
  icon: string;
  reqLevel: number;
  description: string;
}

export interface PetBranchRoute {
  routeId: 'flame' | 'ice' | 'ghost' | 'holy';
  name: string;
  dragonTitle: string;
  icon: string;
  color: string;
  element: string;
  description: string;
}

export const OFFICIAL_PET_STAGES: PetEvolutionStage[] = [
  { stageId: 1, name: 'たまご', icon: '🥚', reqLevel: 1, description: '不思議な紋様が浮かぶ神秘のたまご。温かく見守ろう！' },
  { stageId: 2, name: '赤ちゃん', icon: '🐣', reqLevel: 3, description: '生まれたばかりのかわいいドラゴン。お世話を待っているよ。' },
  { stageId: 3, name: '幼年期', icon: '🐉', reqLevel: 6, description: '翼が生えて活発になった子供ドラゴン。しっかりごはんをあげよう。' },
  { stageId: 4, name: '成長期', icon: '🦕', reqLevel: 10, description: '凛々しく成長したドラゴン。お世話の方向で未来の姿が変わる！' },
  { stageId: 5, name: '最終進化', icon: '🐲', reqLevel: 15, description: '絆とお世話の成果が花開いた究極のドラゴン姿！' },
];

export const PET_BRANCH_ROUTES: PetBranchRoute[] = [
  {
    routeId: 'flame',
    name: '炎竜ルート',
    dragonTitle: '神炎皇ヴォルカノン',
    icon: '🔥',
    color: 'from-red-600 to-amber-600',
    element: '火',
    description: '熱い情熱と元気なお世話で進化！燃え盛る炎ブレスで問題を一掃！',
  },
  {
    routeId: 'ice',
    name: '氷竜ルート',
    dragonTitle: '氷晶帝グラシエール',
    icon: '❄️',
    color: 'from-cyan-500 to-blue-700',
    element: '水',
    description: '冷静で丁寧なおそうじとあそぶことで進化！美しく輝く氷のブレス！',
  },
  {
    routeId: 'ghost',
    name: 'ゴーストルート',
    dragonTitle: '幻影龍ヴェノムナイト',
    icon: '👻',
    color: 'from-purple-600 to-indigo-950',
    element: '闇',
    description: '夜ふかしや独特なお世話で目覚める！幻影と紫炎を操るミステリアスドラゴン！',
  },
  {
    routeId: 'holy',
    name: '聖竜ルート',
    dragonTitle: '聖光龍アルティメット',
    icon: '✨',
    color: 'from-amber-300 via-yellow-200 to-amber-500',
    element: '光',
    description: 'なつき度MAX＆完璧なお世話で覚醒！王国を守護する黄金の最高峰聖龍！',
  },
];

export interface PartnerEvolutionInfo {
  type: PartnerType;
  baseName: string;
  element: '火' | '草' | '水';
  description: string;
  stages: {
    stage: 1 | 2 | 3;
    title: string;
    icon: string;
    reqLevel: number;
    description: string;
  }[];
}

export const PARTNERS_EVOLUTION_DATA: PartnerEvolutionInfo[] = [
  {
    type: 'dragon',
    baseName: 'マグノン',
    element: '火',
    description: '熱い計算魂を燃やす火竜の子供。正解すると炎のブレスを放つ！',
    stages: [
      { stage: 1, title: 'フレイムドラゴン幼体', icon: '🔥', reqLevel: 1, description: '小さな火花を散らす元気な竜。' },
      { stage: 2, title: 'バーニングドラゴノイド', icon: '🐉', reqLevel: 5, description: '力強い翼と激しい炎の息を操る。' },
      { stage: 3, title: '神炎龍イグニス＝算聖', icon: '🐲', reqLevel: 10, description: '王国の伝説となりし幾何学の聖龍。' },
    ],
  },
  {
    type: 'fox',
    baseName: 'リーフォン',
    element: '草',
    description: '森の知恵を宿した九尾のキツネ。素早いひらめきで答えに導く！',
    stages: [
      { stage: 1, title: 'リーフフォックス', icon: '🍃', reqLevel: 1, description: '木の実を運ぶかしこい妖精狐。' },
      { stage: 2, title: 'シルフィードフォックス', icon: '🦊', reqLevel: 5, description: '緑の風をまとって速算の舞を踊る。' },
      { stage: 3, title: '翠森賢狐リーフィア＝知者', icon: '🌿', reqLevel: 10, description: 'マスリア王国の知恵を司る大賢者。' },
    ],
  },
  {
    type: 'golem',
    baseName: 'アクアガメ',
    element: '水',
    description: '澄んだ清流から生まれた結晶ガメ。どっしり構えて頼れる相棒！',
    stages: [
      { stage: 1, title: 'クリスタルタートル', icon: '💧', reqLevel: 1, description: '光る甲羅をもつマイペースなカメ。' },
      { stage: 2, title: 'グラシアスゴーレム', icon: '🐢', reqLevel: 5, description: '頑丈な氷晶の甲羅で攻撃を防ぐ。' },
      { stage: 3, title: '海晶皇アクアリス＝守護', icon: '🌊', reqLevel: 10, description: '数理の障壁を築き平和を守る守護神。' },
    ],
  },
];

