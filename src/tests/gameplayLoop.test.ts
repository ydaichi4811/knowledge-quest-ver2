import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialPlayer, loadPlayerData, savePlayerData } from '../services/gameStorage';
import { addInventoryItem, useInventoryItem } from '../services/itemAndRoomService';
import { updateDailyMissionProgress } from '../services/dailyMissionService';
import { purchaseShopProduct } from '../services/shopService';

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

  it('努力・復習・きずなの新アイテムが、それぞれ異なる育成目的を持つ', () => {
    let player = createInitialPlayer('育成目的勇者');
    const initialGrowth = player.companion!.growthExp;
    const initialBond = player.companion!.bond;

    player = addInventoryItem(player, 'effort_bread', 1).updatedPlayer;
    const effortResult = useInventoryItem(player, 'effort_bread');
    expect(effortResult.success).toBe(true);
    expect(effortResult.updatedPlayer.companion!.progressTraits.effortPoints).toBe(5);
    expect(effortResult.updatedPlayer.companion!.growthExp).toBe(initialGrowth + 10);

    player = addInventoryItem(effortResult.updatedPlayer, 'review_soup', 1).updatedPlayer;
    const reviewResult = useInventoryItem(player, 'review_soup');
    expect(reviewResult.success).toBe(true);
    expect(reviewResult.updatedPlayer.companion!.growthExp).toBe(initialGrowth + 30);
    expect(reviewResult.updatedPlayer.companion!.bond).toBe(initialBond + 5);

    player = addInventoryItem(reviewResult.updatedPlayer, 'friendship_ribbon', 1).updatedPlayer;
    const bondResult = useInventoryItem(player, 'friendship_ribbon');
    expect(bondResult.success).toBe(true);
    expect(bondResult.updatedPlayer.companion!.progressTraits.bondPoints).toBe(5);
    expect(bondResult.updatedPlayer.companion!.bond).toBe(initialBond + 15);
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

  it('ショップ購入はポイントと所持数を同時に更新する', () => {
    const player = createInitialPlayer('買い物勇者');
    const initialQuantity = player.inventory!.knowledge_fruit.quantity;

    const purchased = purchaseShopProduct(player, 'knowledge_fruit');

    expect(purchased.success).toBe(true);
    expect(purchased.updatedPlayer.points).toBe(60);
    expect(purchased.updatedPlayer.inventory!.knowledge_fruit.quantity).toBe(initialQuantity + 1);
    expect(purchased.updatedPlayer.shopPurchaseCounts?.knowledge_fruit).toBe(1);
  });

  it('ポイント不足や無効な商品では残高と所持品を変更しない', () => {
    const player = { ...createInitialPlayer('節約勇者'), points: 10 };

    const insufficient = purchaseShopProduct(player, 'evolution_dew');
    const invalid = purchaseShopProduct(player, 'unknown_item');

    expect(insufficient.success).toBe(false);
    expect(insufficient.updatedPlayer).toBe(player);
    expect(invalid.success).toBe(false);
    expect(invalid.updatedPlayer).toBe(player);
  });
});
