import React from 'react';
import { FuriganaMode, ReadingItem } from '../types';

export const mathTerms: ReadingItem[] = [
  { word: '長方形', reading: 'ちょうほうけい', level: 'difficult' },
  { word: '正方形', reading: 'せいほうけい', level: 'difficult' },
  { word: '平行四辺形', reading: 'へいこうしへんけい', level: 'difficult' },
  { word: '三角形', reading: 'さんかくけい', level: 'difficult' },
  { word: '台形', reading: 'だいけい', level: 'difficult' },
  { word: 'ひし形', reading: 'ひしがた', level: 'difficult' },
  { word: '複合図形', reading: 'ふくごうずけい', level: 'difficult' },
  { word: '面積', reading: 'めんせき', level: 'difficult' },
  { word: '底辺', reading: 'ていへん', level: 'difficult' },
  { word: '高さ', displayWord: '高', reading: 'たか', level: 'all' },
  { word: '平方センチメートル', reading: 'へいほうセンチメートル', level: 'difficult' },
  { word: '平方メートル', reading: 'へいほうメートル', level: 'difficult' },
  { word: '公式', reading: 'こうしき', level: 'difficult' },
  { word: '計算', reading: 'けいさん', level: 'all' },
  { word: '答え', displayWord: '答', reading: 'こた', level: 'all' },
  { word: '周り', displayWord: '周', reading: 'まわ', level: 'all' },
  { word: '直角', reading: 'ちょっかく', level: 'difficult' },
  { word: '角度', reading: 'かくど', level: 'difficult' },
  { word: '垂直', reading: 'すいちょく', level: 'difficult' },
  { word: '平行', reading: 'へいこう', level: 'difficult' },
  { word: '対角線', reading: 'たいかくせん', level: 'difficult' },
  { word: '単位', reading: 'たんい', level: 'difficult' },
  { word: '平方', reading: 'へいほう', level: 'difficult' },
  { word: '長さ', displayWord: '長', reading: 'なが', level: 'all' },
  { word: '求めましょう', displayWord: '求', reading: 'もと', level: 'all' },
  { word: '求めよう', displayWord: '求', reading: 'もと', level: 'all' },
  { word: '求める', displayWord: '求', reading: 'もと', level: 'all' },
  { word: '答えましょう', displayWord: '答', reading: 'こた', level: 'all' },
  { word: '図形', reading: 'ずけい', level: 'difficult' },
  { word: '辺', reading: 'へん', level: 'all' },
];

export const gameTerms: ReadingItem[] = [
  { word: 'マスリア王国', reading: 'マスリアおうこく', level: 'difficult' },
  { word: 'アレア地方', reading: 'アレアちほう', level: 'difficult' },
  { word: 'トラペの丘', reading: 'トラペのおか', level: 'difficult' },
  { word: 'ダイヤ遺跡', reading: 'ダイヤいせき', level: 'difficult' },
  { word: '冒険', reading: 'ぼうけん', level: 'difficult' },
  { word: '相棒', reading: 'あいぼう', level: 'difficult' },
  { word: '知識', reading: 'ちしき', level: 'difficult' },
  { word: '王国', reading: 'おうこく', level: 'difficult' },
  { word: '地域', reading: 'ちいき', level: 'difficult' },
  { word: '経験値', reading: 'けいけんち', level: 'difficult' },
  { word: '成長', reading: 'せいちょう', level: 'difficult' },
  { word: '進化', reading: 'しんか', level: 'difficult' },
  { word: '誕生', reading: 'たんじょう', level: 'difficult' },
  { word: '図鑑', reading: 'ずかん', level: 'difficult' },
  { word: '報酬', reading: 'ほうしゅう', level: 'difficult' },
  { word: '装備', reading: 'そうび', level: 'difficult' },
  { word: '属性', reading: 'ぞくせい', level: 'difficult' },
  { word: '性格', reading: 'せいかく', level: 'difficult' },
  { word: '個性', reading: 'こせい', level: 'difficult' },
  { word: '個体差', reading: 'こたいさ', level: 'difficult' },
  { word: '希少', reading: 'きしょう', level: 'difficult' },
  { word: '獲得', reading: 'かくとく', level: 'difficult' },
  { word: '解放', reading: 'かいほう', level: 'difficult' },
  { word: '勇気', reading: 'ゆうき', level: 'difficult' },
  { word: '努力', reading: 'どりょく', level: 'difficult' },
  { word: '挑戦', reading: 'ちょうせん', level: 'difficult' },
  { word: '連続', reading: 'れんぞく', level: 'difficult' },
  { word: '達成', reading: 'たっせい', level: 'difficult' },
  { word: '未挑戦', reading: 'みちょうせん', level: 'difficult' },
  { word: '習熟度', reading: 'しゅうじゅくど', level: 'difficult' },
  { word: '正答率', reading: 'せいとうりつ', level: 'difficult' },
  { word: '基礎', reading: 'きそ', level: 'difficult' },
  { word: '復習', reading: 'ふくしゅう', level: 'difficult' },
  { word: '技', reading: 'わざ', level: 'difficult' },
  { word: '敵', reading: 'てき', level: 'all' },
  { word: '番人', reading: 'ばんにん', level: 'difficult' },
  { word: '一緒', reading: 'いっしょ', level: 'difficult' },
  { word: '部屋', reading: 'へや', level: 'all' },
  { word: '仲間たち', reading: 'なかまたち', level: 'all' },
  { word: '仲間', reading: 'なかま', level: 'all' },
  { word: '設定', reading: 'せってい', level: 'difficult' },
  { word: '表示', reading: 'ひょうじ', level: 'difficult' },
  { word: '育成', reading: 'いくせい', level: 'difficult' },
  { word: '部屋飾り', reading: 'へやかざり', level: 'difficult' },
  { word: '食材', reading: 'しょくざい', level: 'difficult' },
  { word: '日課', reading: 'にっか', level: 'difficult' },
  { word: '登録', reading: 'とうろく', level: 'difficult' },
  { word: '探索', reading: 'たんさく', level: 'difficult' },
  { word: '案内', reading: 'あんない', level: 'difficult' },
  { word: '判定', reading: 'はんてい', level: 'difficult' },
];

export const ALL_DICTIONARY_ITEMS: ReadingItem[] = [...mathTerms, ...gameTerms];

export interface FuriganaSegment {
  text: string;
  reading?: string;
}

/**
 * Parses input text and returns segments with optional ruby readings according to FuriganaMode.
 */
export function parseTextToFuriganaSegments(
  text: string,
  mode: FuriganaMode,
  customReadings?: ReadingItem[],
  excludeWords?: string[]
): FuriganaSegment[] {
  if (!text || mode === 'off') return [{ text }];

  const dictionary = [...(customReadings || []), ...ALL_DICTIONARY_ITEMS];
  dictionary.sort((a, b) => b.word.length - a.word.length);

  const cleanExcludes = (excludeWords || []).filter((w) => w && w.trim().length > 0);

  const segments: FuriganaSegment[] = [];
  let index = 0;
  let currentPlain = '';

  const pushPlain = () => {
    if (currentPlain) {
      segments.push({ text: currentPlain });
      currentPlain = '';
    }
  };

  while (index < text.length) {
    // Check if an excluded word (e.g. user player name or custom companion name) matches here
    const matchedExclude = cleanExcludes.find((ex) => text.startsWith(ex, index));
    if (matchedExclude) {
      pushPlain();
      segments.push({ text: matchedExclude });
      index += matchedExclude.length;
      continue;
    }

    // Check dictionary match
    let matchedItem: ReadingItem | null = null;
    for (const item of dictionary) {
      if (text.startsWith(item.word, index)) {
        matchedItem = item;
        break;
      }
    }

    if (matchedItem) {
      const itemLevel = matchedItem.level || 'difficult';
      const shouldShow =
        mode === 'all' || (mode === 'difficult' && itemLevel === 'difficult');

      if (shouldShow) {
        pushPlain();
        const displayWord = matchedItem.displayWord || matchedItem.word;
        const trailing = matchedItem.word.slice(displayWord.length);

        segments.push({
          text: displayWord,
          reading: matchedItem.reading,
        });

        if (trailing) {
          currentPlain += trailing;
        }
      } else {
        currentPlain += matchedItem.word;
      }

      index += matchedItem.word.length;
    } else {
      currentPlain += text[index];
      index++;
    }
  }

  pushPlain();
  return segments;
}
