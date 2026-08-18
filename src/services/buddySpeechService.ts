import { PlayerData } from '../types';

export type BuddyPersonality = 'genki' | 'gentle' | 'cool' | 'mysterious' | 'common';

export interface BuddyDialogueOption {
  id: string;
  category: 'initial' | 'near_levelup' | 'review' | 'streak' | 'recent_clear' | 'normal';
  text: string;
}

// 性格別のセリフ辞書
export const PERSONALITY_DIALOGUES: Record<BuddyPersonality, Record<string, string[]>> = {
  // ① 元気な性格 (フレイムフォックス・ドラゴンなど)
  genki: {
    initial: [
      'これから一緒に冒険しよう！',
      'まずは、はじまりの草原へ行ってみよう！',
    ],
    near_levelup: [
      'あと少しでレベルアップだよ！',
      'もうひと頑張りで強くなれそう！',
      'テンション上がってきたー！レベル上がるぞ！',
    ],
    review: [
      'もう一度挑戦したら、きっと分かるよ！',
      '一緒に練習してみよう！ファイト！',
      '前よりできるようになっているよ！',
    ],
    streak: [
      '今日も来てくれたんだね！ガッツだ！',
      '毎日いっしょで超うれしいよ！',
      'ずっと一緒に冒険できてうれしいよ！',
    ],
    recent_clear: [
      'さっきのクエスト、かっこよかったよ！',
      'また一つ、強くなったね！やったー！',
    ],
    normal: [
      '今日はどこへ行く？',
      '一緒に冒険しよう！',
      '新しいクエストが待っているよ！',
      '今日も会えてうれしいな！',
    ],
  },
  // ② 優しい性格 (アクアドラン・アクア系)
  gentle: {
    initial: [
      'これから一緒に冒険しようね。',
      'あせらず、はじまりの草原から進もう。',
    ],
    near_levelup: [
      'あと少しでレベルアップですね！応援しています。',
      'もうひと頑張りで強くなれそうですよ！',
    ],
    review: [
      '一緒に練習してみよう？大丈夫ですよ。',
      '前よりできるようになっているよ！',
      '焦らずゆっくり解いてみようね。',
    ],
    streak: [
      '今日も来てくれてありがとう。嬉しいです。',
      'ずっと一緒に冒険できてうれしいよ！',
    ],
    recent_clear: [
      'さっきのクリア、とても素敵でした！',
      'また一歩成長しましたね。',
    ],
    normal: [
      '今日はどこへ行きますか？',
      '無理せず楽しく進みましょうね。',
      '新しいクエストが待っていますよ。',
      '今日も会えてうれしいな！',
    ],
  },
  // ③ クールな性格 (ゴーレム・ナイト系)
  cool: {
    initial: [
      '準備はいいか？一緒に冒険しよう。',
      'まずは基本。はじまりの草原からだ。',
    ],
    near_levelup: [
      'あと少しでレベルアップだな。集中していこう。',
      'あと一息だ。気を抜かずに行こう。',
    ],
    review: [
      'もう一度挑戦してみよう。次は解けるはずだ。',
      '間違えた問題こそ、強くなるチャンスだ。',
    ],
    streak: [
      '今日もしっかり来たな。感心だ。',
      '継続は力だな。今日も頼むぞ。',
    ],
    recent_clear: [
      'さっきの戦い、見事だったぞ。',
      'いい調子だ。このまま進もう。',
    ],
    normal: [
      '今日はどこへ行く？指示をくれ。',
      'いつでも出発できるぞ。',
      '準備は万全だ。クエストに行こう。',
      '今日も会えてうれしいぞ。',
    ],
  },
  // ④ 不思議・賢い性格 (リーフオウル・フクロウ系)
  mysterious: {
    initial: [
      '算数の知識の旅、はじまりはじまり～♪',
      'まずは広大な草原へ繰り出そう！',
    ],
    near_levelup: [
      'ふふふ、レベルアップの予感がするぞ…！',
      'あともう一息で新しい力が覚醒する…！',
    ],
    review: [
      '復習は知識の宝箱だよ。開けてみよう！',
      'もう一度試せば、謎は解けるはず！',
      '前よりできるようになっているよ！',
    ],
    streak: [
      'おお、連続ログイン！素晴らしい執念だね。',
      '今日も巡り合えて嬉しいよ～！',
    ],
    recent_clear: [
      '素晴らしい閃きだったね！感服したよ。',
      '知識の光が輝いているね！',
    ],
    normal: [
      '今日はどんな計算の謎を解くのかな？',
      '知識の風が吹いているよ～！',
      '冒険の準備はオッケーかな？',
      '今日も会えてうれしいな！',
    ],
  },
  // ⑤ 共通デフォルト
  common: {
    initial: [
      'これから一緒に冒険しよう！',
      'まずは、はじまりの草原へ行ってみよう！',
    ],
    near_levelup: [
      'あと少しでレベルアップだよ！',
      'もうひと頑張りで強くなれそう！',
    ],
    review: [
      'もう一度挑戦したら、きっと分かるよ！',
      '一緒に練習してみよう！',
      '前よりできるようになっているよ！',
    ],
    streak: [
      '今日も来てくれたんだね！',
      'ずっと一緒に冒険できてうれしいよ！',
    ],
    recent_clear: [
      'さっきのクエスト、かっこよかったよ！',
      'また一つ、強くなったね！',
    ],
    normal: [
      '今日はどこへ行く？',
      '一緒に冒険しよう！',
      '新しいクエストが待っているよ！',
      '今日も会えてうれしいな！',
    ],
  },
};

/**
 * パートナーのタイプ・性格情報から性格カテゴリを判定するヘルパー
 * 拡張ポイント: player.companion?.personality や partner.type から動的に分類
 */
export function getBuddyPersonality(player: PlayerData): BuddyPersonality {
  // Companionの明確な性格プロパティがある場合
  const compPersonality = player.companion?.personality;
  if (compPersonality) {
    if (compPersonality === 'genki' || compPersonality === 'yuukan' || compPersonality === 'boukenzuki') return 'genki';
    if (compPersonality === 'yasashii' || compPersonality === 'nonbiri' || compPersonality === 'amembou') return 'gentle';
    if (compPersonality === 'hirameki' || compPersonality === 'sakitagari') return 'mysterious';
    if (compPersonality === 'chitei' || compPersonality === 'ganbariya') return 'cool';
  }

  // PartnerType からの推定判定
  const partnerType = player.partner?.type;
  if (partnerType === 'fox') return 'genki';
  if (partnerType === 'dragon') return 'cool';
  if (partnerType === 'golem') return 'mysterious';

  const element = player.partner?.element;
  if (element === '火') return 'genki';
  if (element === '水') return 'gentle';
  if (element === '草') return 'mysterious';

  return 'common';
}

/**
 * プレイヤーの現状ステータスから最も適したセリフを1つ選択する
 */
export function selectBuddyQuote(
  player: PlayerData,
  previousQuote?: string
): string {
  try {
    const personality = getBuddyPersonality(player);
    const dict = PERSONALITY_DIALOGUES[personality] || PERSONALITY_DIALOGUES.common;

    // ⑥ 初回またはデータが少ない時
    const totalQuestions = player.totalAnswered || 0;
    if (totalQuestions < 5 || player.level === 1) {
      return getRandomCandidate(dict.initial, previousQuote);
    }

    // ② レベルアップが近い時 (経験値75%以上 または 残り経験値 <= 30)
    const expRemaining = (player.maxExp || 100) - (player.exp || 0);
    const expRatio = (player.exp || 0) / (player.maxExp || 1);
    if (expRatio >= 0.75 || expRemaining <= 30) {
      return getRandomCandidate(dict.near_levelup, previousQuote);
    }

    // ④ 間違えた問題や強化クエストがある時
    const weakCount = player.weakConcepts?.length || 0;
    if (weakCount > 0) {
      return getRandomCandidate(dict.review, previousQuote);
    }

    // ⑤ 連続ログイン時 (2日以上)
    if ((player.currentStreak || 0) >= 2) {
      return getRandomCandidate(dict.streak, previousQuote);
    }

    // ③ 最近クエストをクリアした時
    const completedCount = player.completedQuests?.length || 0;
    if (completedCount > 0 && Math.random() < 0.45) {
      return getRandomCandidate(dict.recent_clear, previousQuote);
    }

    // ① 通常時
    return getRandomCandidate(dict.normal, previousQuote);
  } catch (err) {
    console.warn('Buddy dialogue fallback triggered:', err);
    return '今日はどこへ行く？';
  }
}

/**
 * 前回のセリフと重複しにくいランダム選択
 */
function getRandomCandidate(candidates: string[], previousQuote?: string): string {
  if (!candidates || candidates.length === 0) {
    return '今日はどこへ行く？';
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  const filtered = candidates.filter((c) => c !== previousQuote);
  const pool = filtered.length > 0 ? filtered : candidates;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || '今日はどこへ行く？';
}
