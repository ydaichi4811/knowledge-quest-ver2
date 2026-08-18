import {
  CompanionSpeciesId,
  CompanionAttribute,
  CompanionPersonality,
  CompanionRarity,
  CompanionEvolutionType,
} from '../types';

export interface SpeciesMetadata {
  id: CompanionSpeciesId;
  name: string;
  kanjiName: string;
  kanji?: string;
  description: string;
  eggType: string;
  eggName: string;
  eggDescription: string;
  eggColor: string;
  eggAccent: string;
  icon: string;
  features?: string[];
}

export interface AttributeMetadata {
  id: CompanionAttribute;
  name: string;
  kanjiName?: string;
  kanji?: string;
  icon: string;
  colorName: string;
  primaryColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
  particleType: string;
  roomDecorName: string;
  roomDecorIcon: string;
  dialogueTrait: string;
  bgGradient?: string;
  description?: string;
}

export interface PersonalityMetadata {
  id: CompanionPersonality;
  name: string;
  icon: string;
  badgeColor: string;
  description: string;
  normalDialogues: string[];
  correctDialogues: string[];
  incorrectDialogues: string[];
  careDialogues: string[];
}

export interface RarityMetadata {
  id: CompanionRarity;
  name: string;
  label: string;
  badgeBg: string;
  badgeColor?: string;
  borderColor: string;
  glowClass: string;
  sparkleDensity: 'low' | 'medium' | 'high' | 'ultra' | 'cosmic';
  description: string;
  dropRatePercent?: number;
}

export interface AccessoryMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: string;
  category: 'head' | 'face' | 'neck' | 'body' | 'badge';
}

export interface EvolutionTypeMetadata {
  id: CompanionEvolutionType;
  name: string;
  kanji?: string;
  icon: string;
  description: string;
  traitName: string;
  triggerAction?: string;
}

// 1. 5 Original Species
export const COMPANION_SPECIES: Record<CompanionSpeciesId, SpeciesMetadata> = {
  mokoru: {
    id: 'mokoru',
    name: 'モコル',
    kanjiName: '茸雲精 (モコル)',
    kanji: '茸雲精',
    description: '丸くふわふわとした温かい姿をした相棒。モコモコした毛並みや大きな耳が特徴。',
    eggType: 'egg_fluffy',
    eggName: 'ふわふわのタマゴ',
    eggDescription: '綿毛のように暖かく、触ると柔らかい不思議なタマゴ。',
    eggColor: '#fde68a',
    eggAccent: '#f59e0b',
    icon: '☁️',
    features: ['ふわふわ毛並み', '大きな垂れ耳', '丸いフォルム'],
  },
  rifin: {
    id: 'rifin',
    name: 'リフィン',
    kanjiName: '若葉精 (リフィン)',
    kanji: '若葉精',
    description: 'みずみずしい葉っぱや新芽を思わせる相棒。頭の双葉やしっぽのグラデーションが魅力的。',
    eggType: 'egg_leaf',
    eggName: '葉っぱのタマゴ',
    eggDescription: '森の深呼吸から生まれた、若葉の香りがする生き生きとしたタマゴ。',
    eggColor: '#a7f3d0',
    eggAccent: '#10b981',
    icon: '🌱',
    features: ['頭の双葉', 'みずみずしい尾', '澄んだ大きな目'],
  },
  lumia: {
    id: 'lumia',
    name: 'ルミア',
    kanjiName: '星晶精 (ルミア)',
    kanji: '星晶精',
    description: '光り輝くクリスタルと星の輝きを宿した神秘的な相棒。頭の光るアンテナがチャームポイント。',
    eggType: 'egg_light',
    eggName: 'ひかりのタマゴ',
    eggDescription: '知識の閃きに反応してほんのり明かりを放つ幻想的なタマゴ。',
    eggColor: '#fef08a',
    eggAccent: '#f59e0b',
    icon: '✨',
    features: ['輝く結晶体', '星型の光彩', '知的なオーラ'],
  },
  kurudo: {
    id: 'kurudo',
    name: 'クルド',
    kanjiName: '龍幼精 (クルド)',
    kanji: '龍幼精',
    description: '小さく可愛いドラゴン型の相棒。小さな角とお腹のやわらかい模様が特徴的。',
    eggType: 'egg_dragon',
    eggName: 'うろこのタマゴ',
    eggDescription: '頑丈なツヤのある模様が入った、頼もしさを秘めたタマゴ。',
    eggColor: '#fca5a5',
    eggAccent: '#ef4444',
    icon: '🐲',
    features: ['可愛い角', '立派なしっぽ', '翼の芽生え'],
  },
  poruka: {
    id: 'poruka',
    name: 'ポルカ',
    kanjiName: '水滴精 (ポルカ)',
    kanji: '水滴精',
    description: 'ぷるぷるの半透明な水滴から生まれた可愛い相棒。頭の小さな水冠と波模様がトレードマーク。',
    eggType: 'egg_drop',
    eggName: 'しずくのタマゴ',
    eggDescription: '透き通ったひんやり冷たい、波の揺らぎが見える綺麗なタマゴ。',
    eggColor: '#bae6fd',
    eggAccent: '#0284c7',
    icon: '💧',
    features: ['ぷるぷるボディ', '頭の水冠', '波の波紋'],
  },
};

// 2. 6 Attributes
export const COMPANION_ATTRIBUTES: Record<CompanionAttribute, AttributeMetadata> = {
  fire: {
    id: 'fire',
    name: 'ほのお',
    kanjiName: '炎属性',
    kanji: '炎',
    icon: '🔥',
    colorName: 'ブレイズ・レッド',
    primaryColorHex: '#f97316',
    secondaryColorHex: '#fef08a',
    accentColorHex: '#dc2626',
    particleType: 'embers',
    roomDecorName: 'あたたかい暖炉',
    roomDecorIcon: '🪵',
    dialogueTrait: '情熱的で元気いっぱい',
    bgGradient: 'from-amber-900/40 via-rose-950/60 to-slate-950 border-rose-500/40',
    description: '情熱的な赤く燃える炎の属性。問題に力強く立ち向かうアグレッシブなパッションを持つ。',
  },
  water: {
    id: 'water',
    name: 'みず',
    kanjiName: '水属性',
    kanji: '水',
    icon: '💧',
    colorName: 'アクア・ブルー',
    primaryColorHex: '#0284c7',
    secondaryColorHex: '#e0f2fe',
    accentColorHex: '#38bdf8',
    particleType: 'bubbles',
    roomDecorName: 'アクア・ラグーン',
    roomDecorIcon: '🌊',
    dialogueTrait: '冷静沈着で論理的',
    bgGradient: 'from-sky-950/50 via-blue-950/60 to-slate-950 border-sky-500/40',
    description: '澄み切った清らかな水の属性。静かで深い思考力と柔軟な発想力を生み出す。',
  },
  forest: {
    id: 'forest',
    name: 'もり',
    kanjiName: '森属性',
    kanji: '森',
    icon: '🌱',
    colorName: 'フォレスト・グリーン',
    primaryColorHex: '#10b981',
    secondaryColorHex: '#ecfdf5',
    accentColorHex: '#34d399',
    particleType: 'leaves',
    roomDecorName: '木漏れ日のラグ',
    roomDecorIcon: '🍃',
    dialogueTrait: '穏やかで心優しい',
    bgGradient: 'from-emerald-950/50 via-teal-950/60 to-slate-950 border-emerald-500/40',
    description: '大自然の優しい息吹をまとった森の属性。じっくり学習を継続する育む力を持つ。',
  },
  wind: {
    id: 'wind',
    name: 'かぜ',
    kanjiName: '風属性',
    kanji: '風',
    icon: '🌪️',
    colorName: 'ウィンド・ティール',
    primaryColorHex: '#14b8a6',
    secondaryColorHex: '#f0fdfa',
    accentColorHex: '#2dd4bf',
    particleType: 'breeze',
    roomDecorName: 'そよ風のクッション',
    roomDecorIcon: '🎐',
    dialogueTrait: '自由気ままで軽やか',
    bgGradient: 'from-teal-950/50 via-cyan-950/60 to-slate-950 border-teal-500/40',
    description: '自由で風のように爽快な属性。すばやい回転の計算や柔軟な発想が得意。',
  },
  light: {
    id: 'light',
    name: 'ひかり',
    kanjiName: '光属性',
    kanji: '光',
    icon: '✨',
    colorName: 'ルミナス・ゴールド',
    primaryColorHex: '#eab308',
    secondaryColorHex: '#fefce8',
    accentColorHex: '#fde047',
    particleType: 'sparkles',
    roomDecorName: 'サンシャイン・デスク',
    roomDecorIcon: '☀️',
    dialogueTrait: '前向きで希望に満ちた',
    bgGradient: 'from-amber-950/50 via-yellow-950/60 to-slate-950 border-amber-400/40',
    description: '正解のインスピレーションを照らし出す光の属性。クリアなひらめきを与える。',
  },
  star: {
    id: 'star',
    name: 'ほし',
    kanjiName: '星属性',
    kanji: '星',
    icon: '⭐',
    colorName: 'コズミック・パープル',
    primaryColorHex: '#a855f7',
    secondaryColorHex: '#faf5ff',
    accentColorHex: '#c084fc',
    particleType: 'stardust',
    roomDecorName: '星空のプラネタリウム',
    roomDecorIcon: '🌌',
    dialogueTrait: '神秘的で探求心あふれる',
    bgGradient: 'from-purple-950/50 via-indigo-950/60 to-slate-950 border-purple-500/40',
    description: '宇宙の深遠な数理の真理を秘めた星の属性。未知の応用問題に強いひらめきを示す。',
  },
};

// 3. Personalities
export const COMPANION_PERSONALITIES: Record<CompanionPersonality, PersonalityMetadata> = {
  ganbariya: {
    id: 'ganbariya',
    name: 'がんばりや',
    icon: '💪',
    badgeColor: 'bg-amber-500 text-slate-950',
    description: 'どんな難しい問題にも粘り強く挑戦する、真面目で熱心な性格。',
    normalDialogues: [
      '今日も算数の勉強、一緒に頑張ろうね！',
      '一つずつ理解すれば、絶対に解けるようになるよ！',
      '君の努力している姿、ボクはいつも見ているよ！',
    ],
    correctDialogues: ['やったぁ！正解だよ！努力の成果が出たね！'],
    incorrectDialogues: ['大丈夫！間違いは新しい発見の第一歩だよ！'],
    careDialogues: ['ありがとう！元気がモリモリ湧いてきたよ！'],
  },
  sakitagari: {
    id: 'sakitagari',
    name: 'さきたがり',
    icon: '⚡',
    badgeColor: 'bg-sky-500 text-slate-950',
    description: '好奇心いっぱいで新しい知識やステージに早く進みたい元気な性格。',
    normalDialogues: [
      '次はどんな面白い単元に挑戦する？ワクワクするね！',
      '新しいナレッジツリーのノード、早く解放したいな！',
      'スピード回答目指して、集中していこう！',
    ],
    correctDialogues: ['大正解！この調子でどんどん進もう！'],
    incorrectDialogues: ['うーん！もう一回落ち着いて試してみよう！'],
    careDialogues: ['わーい！最高！冒険に行く準備はバッチリだよ！'],
  },
  nonbiri: {
    id: 'nonbiri',
    name: 'のんびり',
    icon: '🍵',
    badgeColor: 'bg-emerald-500 text-slate-950',
    description: '自分のペースで焦らずゆっくり図形や計算を吟味するマイペースな性格。',
    normalDialogues: [
      '焦らなくても大丈夫。自分のペースで考えようね～♪',
      '図形の問題は、じっくり見つめるとヒントが見えてくるよ～',
      'おいしいおやつを食べながら、楽しく勉強しようね。',
    ],
    correctDialogues: ['ふふっ、見事に正解だね～！素晴らしいよ～♪'],
    incorrectDialogues: ['あせらず、もう一度公式を振り返ってみようね～'],
    careDialogues: ['ぽかぽかして気持ちいいなぁ～ありがとう～♪'],
  },
  chitei: {
    id: 'chitei',
    name: 'ちてき',
    icon: '🎓',
    badgeColor: 'bg-indigo-500 text-slate-100',
    description: '論理と公式の組み立てを愛する、冷静でクレバーな探求家。',
    normalDialogues: [
      '算数は世界で一番美しい論理のパズルだよ。',
      '底辺と高さの垂直関係、しっかり確認できているかな？',
      '一つずつの定義を理解すれば、どんな応用問題も怖くない。',
    ],
    correctDialogues: ['見事な論理的アプローチだ。完璧な正解だよ。'],
    incorrectDialogues: ['どこで計算のズレが生じたか、途中の式を検証してみよう。'],
    careDialogues: ['君との交流は、ボクの知識エネルギーを深めてくれるよ。'],
  },
  amembou: {
    id: 'amembou',
    name: '甘えん坊',
    icon: '🎀',
    badgeColor: 'bg-pink-500 text-slate-950',
    description: 'プレイヤーのことが大好きで、なでられたり褒められると大喜びする性格。',
    normalDialogues: [
      'ねぇねぇ、今日もずっと一緒に勉強してくれる…？',
      '君が正解すると、ボクもとっても誇らしくなるんだ！',
      'ちょっと休憩するときは、ボクをなでなでしてね♪',
    ],
    correctDialogues: ['わぁぁーっ！正解！君はやっぱりすごいや！大好き！'],
    incorrectDialogues: ['ボクがそばにいるから心配しないで！一緒に解こう？'],
    careDialogues: ['えへへ～なでなで気持ちいいな♪もっと一緒にいようね！'],
  },
  yuukan: {
    id: 'yuukan',
    name: 'ゆうかん',
    icon: '🛡️',
    badgeColor: 'bg-rose-500 text-slate-100',
    description: '苦手な問題や高難度の試練にも勇敢に立ち向かう、頼もしい騎士のような性格。',
    normalDialogues: [
      'どんな強敵クイズが来ても、二人でなら必ず突破できる！',
      '苦手な問題こそ、ボクたちの真の力を試すチャンスだ！',
      '正義の数理ソードで、マスリア王国の平和を取り戻そう！',
    ],
    correctDialogues: ['一撃必殺！見事な正解だ！勝利のファンファーレだ！'],
    incorrectDialogues: ['一度の失敗で屈するな！次は必ず撃破できる！'],
    careDialogues: ['感謝する！このパワーで、どんな困難も切り拓くぞ！'],
  },
  hirameki: {
    id: 'hirameki',
    name: 'ひらめき',
    icon: '💡',
    badgeColor: 'bg-yellow-400 text-slate-950',
    description: '瞬時に本質を見抜くインスピレーション溢れる性格。',
    normalDialogues: ['パッと閃いたら即解答！算数はワクワクの連続だね！'],
    correctDialogues: ['ひらめいた！完璧な正解だよ！'],
    incorrectDialogues: ['もう一つの別のアプローチを閃いてみよう！'],
    careDialogues: ['閃きのひかりが溢れてくるよ！ありがとう！'],
  },
  genki: {
    id: 'genki',
    name: 'げんき',
    icon: '🔥',
    badgeColor: 'bg-orange-500 text-slate-950',
    description: 'いつもエネルギッシュで明るく応援してくれる元気いっぱいな性格。',
    normalDialogues: ['よーし！今日もテンション全開で問題にアタックしよう！'],
    correctDialogues: ['大正解！やったね！この勢いで突き進もう！'],
    incorrectDialogues: ['どんまい！次で一発クリアすれば問題ナシ！'],
    careDialogues: ['うおーっ！パワー全開！元気100倍だよ！'],
  },
  yasashii: {
    id: 'yasashii',
    name: 'やさしい',
    icon: '🌸',
    badgeColor: 'bg-teal-400 text-slate-950',
    description: 'いつも温かく寄り添い包み込んでくれる優しい性格。',
    normalDialogues: ['君が一生懸命考えている姿、とても素敵だよ。'],
    correctDialogues: ['見事な正解だよ。本当に頑張ったね。'],
    incorrectDialogues: ['焦らず深呼吸しよう。ボクはいつでも味方だよ。'],
    careDialogues: ['心があたたかくなるよ…いつもありがとうね。'],
  },
  boukenzuki: {
    id: 'boukenzuki',
    name: 'ぼうけんづき',
    icon: '🗺️',
    badgeColor: 'bg-cyan-500 text-slate-950',
    description: '未知の領域や困難なマップに胸を躍らせる冒険好きな性格。',
    normalDialogues: ['まだ見ぬ算数エリアへ、一緒に出発しよう！'],
    correctDialogues: ['素晴らしい！新たな知の扉が開かれたよ！'],
    incorrectDialogues: ['これも冒険の試練の一つ！乗り越えよう！'],
    careDialogues: ['次の大冒険に向けてエネルギー満タンだよ！'],
  },
};

// 4. Rarities
export const COMPANION_RARITIES: Record<CompanionRarity, RarityMetadata> = {
  N: {
    id: 'N',
    name: 'ノーマル',
    label: 'NORMAL',
    badgeBg: 'bg-slate-700 text-slate-200 border-slate-500',
    badgeColor: 'bg-slate-700 text-slate-200 border-slate-500',
    borderColor: 'border-slate-600',
    glowClass: '',
    sparkleDensity: 'low',
    description: '親しみやすい愛らしい姿。日々の学習で絆を深めると成長する。',
    dropRatePercent: 55,
  },
  R: {
    id: 'R',
    name: 'レア',
    label: 'RARE',
    badgeBg: 'bg-blue-600 text-blue-100 border-blue-400',
    badgeColor: 'bg-blue-600 text-blue-100 border-blue-400',
    borderColor: 'border-blue-500',
    glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    sparkleDensity: 'medium',
    description: 'しっかりとした模様や光が宿った姿。学習の継続によって真価を発揮する。',
    dropRatePercent: 30,
  },
  SR: {
    id: 'SR',
    name: 'スーパーレア',
    label: 'SUPER RARE',
    badgeBg: 'bg-purple-600 text-purple-100 border-purple-400',
    badgeColor: 'bg-purple-600 text-purple-100 border-purple-400',
    borderColor: 'border-purple-500',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.6)]',
    sparkleDensity: 'high',
    description: '羽や美しい角、オーラを纏った神秘的な姿。優れた知識の輝きを示す。',
    dropRatePercent: 12,
  },
  UR: {
    id: 'UR',
    name: 'ウルトラレア',
    label: 'ULTRA RARE',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black border-amber-300',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black border-amber-300',
    borderColor: 'border-amber-400',
    glowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.8)]',
    sparkleDensity: 'ultra',
    description: '眩しい光と背景世界をまとい、究極の絆を結んだ神聖な姿。',
    dropRatePercent: 3,
  },
  SEC: {
    id: 'SEC',
    name: 'シークレット',
    label: 'SECRET',
    badgeBg: 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 text-slate-950 font-black border-cyan-300',
    badgeColor: 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 text-slate-950 font-black border-cyan-300',
    borderColor: 'border-cyan-300',
    glowClass: 'shadow-[0_0_35px_rgba(6,182,212,0.9)]',
    sparkleDensity: 'cosmic',
    description: '特別な学習の試練を達成した者だけに訪れる奇跡の隠し姿。',
    dropRatePercent: 0,
  },
};

// 5. 8 Accessories
const ACCESSORY_LIST: AccessoryMetadata[] = [
  {
    id: 'adv_hat',
    name: '冒険者の帽子',
    description: 'どんな場所でも安全に冒険できる、つばの広いおしゃれな帽子。',
    icon: '🤠',
    unlockCondition: '問題に1問回答する',
    category: 'head',
  },
  {
    id: 'star_ribbon',
    name: '星のリボン',
    description: '星くずのようにきらきら輝くかわいいリボン。',
    icon: '🎀',
    unlockCondition: '相棒のきずな度 15 以上',
    category: 'head',
  },
  {
    id: 'leaf_crown',
    name: '若葉の冠',
    description: 'みずみずしい新芽を結んで作られたナチュラルな冠。',
    icon: '👑',
    unlockCondition: '単元を1つ完全クリアする',
    category: 'head',
  },
  {
    id: 'round_glasses',
    name: '丸い眼鏡',
    description: '知的な雰囲気がアップする、レトロでかわいい丸めがね。',
    icon: '👓',
    unlockCondition: 'つまずき基礎復習を1回成功させる',
    category: 'face',
  },
  {
    id: 'mini_cape',
    name: '小さなマント',
    description: '風になびく勇者のようなかっこいい赤いマント。',
    icon: '🦸',
    unlockCondition: '初回正解問題 10問達成',
    category: 'body',
  },
  {
    id: 'knowledge_pendant',
    name: '知識のペンダント',
    description: '算数の知恵が詰まった神秘的なブルーペンダント。',
    icon: '📿',
    unlockCondition: '相棒のきずな度 50 以上',
    category: 'neck',
  },
  {
    id: 'crown_royal',
    name: '王冠風アクセサリー',
    description: 'ゴールドに輝くゴージャスなロイヤルクラウン。',
    icon: '👑',
    unlockCondition: '単元を3つ完全クリアする',
    category: 'head',
  },
  {
    id: 'area_master_badge',
    name: '面積マスターバッジ',
    description: '面積の単元を極めた勇者に贈られる誇り高き勲章。',
    icon: '🏅',
    unlockCondition: '「面積」関連の単元をクリアする',
    category: 'badge',
  },
];

export const COMPANION_ACCESSORIES: Record<string, AccessoryMetadata> = ACCESSORY_LIST.reduce(
  (acc, curr) => ({ ...acc, [curr.id]: curr }),
  {} as Record<string, AccessoryMetadata>
);

// 6. Evolution Traits Metadata
export const EVOLUTION_TYPES: Record<CompanionEvolutionType, EvolutionTypeMetadata> = {
  hirameki: {
    id: 'hirameki',
    name: 'ひらめき型',
    kanji: '閃光',
    icon: '💡',
    description: '初回クリアとひらめき解答が得意な知性溢れる進化傾向。',
    traitName: 'ひらめき力',
    triggerAction: '異なる問題の初回正解',
  },
  doryoku: {
    id: 'doryoku',
    name: '努力型',
    kanji: '錬磨',
    icon: '📚',
    description: '基礎復習とコツコツ学習を積み重ねた粘り強い進化傾向。',
    traitName: '努力の結晶',
    triggerAction: 'つまずき基礎復習の達成',
  },
  bouken: {
    id: 'bouken',
    name: '冒険型',
    kanji: '拓路',
    icon: '🗺️',
    description: '新しい単元や様々なステージに挑戦し続ける勇敢な進化傾向。',
    traitName: '冒険心',
    triggerAction: '新単元の学習＆完全クリア',
  },
  kizuna: {
    id: 'kizuna',
    name: 'きずな型',
    kanji: '深愛',
    icon: '💖',
    description: '毎日のお世話と深い信頼関係によって開花した心温まる進化傾向。',
    traitName: '絆の深さ',
    triggerAction: '毎日のなでなで・おやつ・会話',
  },
  yuuki: {
    id: 'yuuki',
    name: '勇気型',
    kanji: '不屈',
    icon: '🛡️',
    description: '間違えた問題にも諦めず再挑戦して克服したたくましい進化傾向。',
    traitName: '不屈の勇気',
    triggerAction: '間違えた苦手問題への再挑戦クリア',
  },
};

export const COMPANION_EVOLUTION_TYPES = EVOLUTION_TYPES;
