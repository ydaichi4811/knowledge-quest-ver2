import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialPlayer, loadPlayerData, savePlayerData } from '../services/gameStorage';
import { addInventoryItem, useInventoryItem } from '../services/itemAndRoomService';
import { updateDailyMissionProgress } from '../services/dailyMissionService';

describe('学習報酬から相棒育成までの循環', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('新規開始時からポイント・相棒・育成アイテムを利用できる', () => {
    const player = createInitialPlayer('ループ勇者');

    expect(player.points).toBe(100);
    expect(player.companion).toBeDefined();
    expect(player.inventory?.knowledge_fruit.quantity).toBeGreaterThan(0);
    expect(player.dailyMissions).toHaveLength(3);
    expect(player.companionRoom).toBeDefined();
  });

  it('獲得したアイテムを使うと所持数が減り相棒が成長する', () => {
    const player = createInitialPlayer('育成勇者');
    const initialQuantity = player.inventory!.knowledge_fruit.quantity;
    const initialGrowth = player.companion!.growthExp;

    const earned = addInventoryItem(player, 'knowledge_fruit', 1);
    expect(earned.success).toBe(true);
    expect(earned.updatedPlayer.inventory!.knowledge_fruit.quantity).toBe(initialQuantity + 1);

    const used = useInventoryItem(earned.updatedPlayer, 'knowledge_fruit');
    expect(used.success).toBe(true);
    expect(used.updatedPlayer.inventory!.knowledge_fruit.quantity).toBe(initialQuantity);
    expect(used.updatedPlayer.companion!.growthExp).toBe(initialGrowth + 30);
  });

  it('ミッション進行とガチャコレクションが保存後も復元される', () => {
    let player = createInitialPlayer('保存勇者');
    const mission = player.dailyMissions![0];
    player = updateDailyMissionProgress(player, mission.type, mission.targetValue);
    player = {
      ...player,
      points: 70,
      gachaCollection: { ゴールドソード: 1 },
    };

    savePlayerData(player);
    const restored = loadPlayerData();

    expect(restored?.points).toBe(70);
    expect(restored?.gachaCollection?.ゴールドソード).toBe(1);
    expect(restored?.dailyMissions?.find((item) => item.missionId === mission.missionId)?.isCompleted).toBe(true);
  });
});

