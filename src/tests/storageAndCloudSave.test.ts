import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlayerData } from '../types';
import { loadPlayerData, savePlayerData, createInitialPlayer, PLAYER_LEVEL_CONFIG } from '../services/gameStorage';
import { saveGameDataToCloud, ensureUserDocument } from '../services/cloudSaveService';

describe('ストレージ・クラウド保存・互換性テスト', () => {
  let player: PlayerData;

  beforeEach(() => {
    localStorage.clear();
    player = createInitialPlayer('セーブテスト勇者');
  });

  // ⑨ ローカル保存
  it('⑨ ローカルストレージへの保存と読み込みが正常に行われること', () => {
    player.level = 5;
    player.exp = 40;
    player.points = 350;
    savePlayerData(player);

    const loaded = loadPlayerData();
    expect(loaded).not.toBeNull();
    expect(loaded?.name).toBe('セーブテスト勇者');
    expect(loaded?.level).toBe(5);
    expect(loaded?.exp).toBe(40);
    expect(loaded?.points).toBe(350);
  });

  it('⑨-b ガチャ・育成アイテム・部屋の成果が再起動後も残ること', () => {
    player.gachaCollection = { ゴールドソード: 2 };
    const knowledgeFruit = player.inventory!.knowledge_fruit;
    player.inventory = {
      ...(player.inventory || {}),
      knowledge_fruit: {
        ...knowledgeFruit,
        quantity: 4,
        lastObtainedAt: new Date().toISOString(),
      },
    };
    savePlayerData(player);

    const loaded = loadPlayerData();
    expect(loaded?.gachaCollection?.ゴールドソード).toBe(2);
    expect(loaded?.inventory?.knowledge_fruit?.quantity).toBe(4);
    expect(loaded?.companionRoom).toBeDefined();
  });

  // ⑩ Firebaseフォールバック
  it('⑩ Firebase未設定時または接続エラー時にローカル動作へ安全にフォールバックすること', async () => {
    // Call saveGameDataToCloud when Firebase is not configured in test environment
    const result = await saveGameDataToCloud('test_uid_123', player);
    // Should safely return false or fallback without throwing an unhandled exception
    expect(result).toBe(false);

    const code = await ensureUserDocument('test_uid_123', player);
    expect(code).toBe('KQ-LOCAL-00');
  });

  // ⑪ データ移行 & ⑫ 古い保存データ
  it('⑪ & ⑫ 古い構造のデータ（level, exp, baseStatsが欠落）をロード時に自動修復・移行すること', () => {
    const legacyOldSave = {
      name: '伝説の古参勇者',
      mode: 'adventure',
      // level, exp, baseStats, computedStats are missing or undefined
      partner: {
        id: 'fox',
        name: 'フォッコ',
        type: 'fox',
        element: '火',
        stage: 1,
        level: 1,
        stats: { hp: 100, maxHp: 100, atk: 20, def: 15, speed: 12 },
        avatarIcon: '🦊',
      },
    };

    localStorage.setItem('knowledge_quest_save_data_v1', JSON.stringify(legacyOldSave));

    const loaded = loadPlayerData();
    expect(loaded).not.toBeNull();
    expect(loaded?.name).toBe('伝説の古参勇者');
    expect(loaded?.level).toBe(1);
    expect(loaded?.exp).toBe(0);
    expect(loaded?.maxExp).toBe(PLAYER_LEVEL_CONFIG.INITIAL_LEVEL === 1 ? 100 : 100);
    expect(loaded?.baseStats).toBeDefined();
    expect(loaded?.baseStats?.maxHp).toBe(100);
    expect(loaded?.computedStats).toBeDefined();
    expect(loaded?.computedStats?.attack).toBe(10);
  });

  // ⑬ 二重保存防止
  it('⑬ 連続保存呼び出し時にエラーにならず整合性が保たれること', () => {
    player.exp += 10;
    savePlayerData(player);
    savePlayerData(player);
    savePlayerData(player);

    const loaded = loadPlayerData();
    expect(loaded?.exp).toBe(player.exp);
    expect(loaded?.level).toBe(player.level);
  });
});

