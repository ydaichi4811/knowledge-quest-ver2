import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerData } from '../types';
import {
  addPlayerExperience,
  addExpAndPoints,
  computePlayerStats,
  getRequiredExpForLevel,
  PLAYER_LEVEL_CONFIG,
  createInitialPlayer,
} from '../services/gameStorage';

describe('主人公レベル・経験値・能力値システムテスト', () => {
  let player: PlayerData;

  beforeEach(() => {
    player = createInitialPlayer('テスト勇者');
  });

  // ① EXP加算
  it('① EXPが正しく加算されること', () => {
    const initialExp = player.exp;
    const { expResult } = addExpAndPoints(player, 50, 20);

    expect(expResult.gainedExp).toBe(50);
    expect(expResult.updatedPlayer.exp).toBe(initialExp + 50);
    expect(expResult.updatedPlayer.points).toBe(player.points + 20);
    expect(expResult.leveledUp).toBe(false);
  });

  // ② レベルアップ
  it('② 1レベルアップ処理が正しく行われること', () => {
    // Level 1 required EXP is 100
    const reqExp = getRequiredExpForLevel(1);
    const { expResult, leveledUp } = addExpAndPoints(player, reqExp, 0);

    expect(leveledUp).toBe(true);
    expect(expResult.oldLevel).toBe(1);
    expect(expResult.newLevel).toBe(2);
    expect(expResult.levelUpCount).toBe(1);
    expect(expResult.updatedPlayer.level).toBe(2);
    expect(expResult.updatedPlayer.exp).toBe(0); // ちょうどあがったので余り0
  });

  // ③ 複数レベルアップ
  it('③ 大量のEXPで複数レベルアップ（レベル飛び）が正しく処理されること', () => {
    // Grant 1000 EXP at level 1
    const { expResult } = addExpAndPoints(player, 1000, 100);

    expect(expResult.leveledUp).toBe(true);
    expect(expResult.levelUpCount).toBeGreaterThan(1);
    expect(expResult.newLevel).toBeGreaterThan(2);
    expect(expResult.statDiff.maxHp).toBe(expResult.levelUpCount * PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.maxHp);
    expect(expResult.statDiff.attack).toBe(expResult.levelUpCount * PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.attack);
    expect(expResult.statDiff.defense).toBe(expResult.levelUpCount * PLAYER_LEVEL_CONFIG.STAT_GROWTH_PER_LEVEL.defense);
  });

  // ④ 最大レベル
  it('④ 最大レベル（50）のカンストとあふれ処理が正常に動作すること', () => {
    player.level = 49;
    player.exp = 0;

    // Grant huge EXP to reach & exceed level 50
    const { expResult } = addExpAndPoints(player, 999999, 500);

    expect(expResult.updatedPlayer.level).toBe(PLAYER_LEVEL_CONFIG.MAX_LEVEL);
    expect(expResult.updatedPlayer.exp).toBe(0);
    expect(expResult.updatedPlayer.maxExp).toBe(0);

    // Additional EXP at max level should not increase level or exp
    const atCapResult = addPlayerExperience(expResult.updatedPlayer, 5000, 100);
    expect(atCapResult.updatedPlayer.level).toBe(PLAYER_LEVEL_CONFIG.MAX_LEVEL);
    expect(atCapResult.updatedPlayer.exp).toBe(0);
    expect(atCapResult.leveledUp).toBe(false);
  });

  // ⑤ 能力値計算
  it('⑤ 各レベルにおけるステータス（HP, 攻撃力, 防御力）の計算が正しいこと', () => {
    const lvl1Stats = computePlayerStats(1).computedStats;
    expect(lvl1Stats.maxHp).toBe(100);
    expect(lvl1Stats.attack).toBe(10);
    expect(lvl1Stats.defense).toBe(8);

    const lvl5Stats = computePlayerStats(5).computedStats;
    // Level 5 = Level 1 + (4 * growth)
    expect(lvl5Stats.maxHp).toBe(100 + 4 * 10); // 140
    expect(lvl5Stats.attack).toBe(10 + 4 * 2);   // 18
    expect(lvl5Stats.defense).toBe(8 + 4 * 1);    // 12

    const lvl50Stats = computePlayerStats(50).computedStats;
    expect(lvl50Stats.maxHp).toBe(100 + 49 * 10); // 590
    expect(lvl50Stats.attack).toBe(10 + 49 * 2);   // 108
    expect(lvl50Stats.defense).toBe(8 + 49 * 1);    // 57
  });

  // ⑭ 二重EXP防止
  it('⑭ 二重EXP加算防止：負の値や0のEXPは無視されること', () => {
    const initialExp = player.exp;
    const initialLevel = player.level;

    const zeroResult = addPlayerExperience(player, 0, 0);
    expect(zeroResult.updatedPlayer.exp).toBe(initialExp);
    expect(zeroResult.updatedPlayer.level).toBe(initialLevel);
    expect(zeroResult.leveledUp).toBe(false);

    const negativeResult = addPlayerExperience(player, -50, -10);
    expect(negativeResult.updatedPlayer.exp).toBe(initialExp);
    expect(negativeResult.updatedPlayer.level).toBe(initialLevel);
  });
});
