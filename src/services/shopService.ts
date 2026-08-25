import { PlayerData } from '../types';
import { addInventoryItem, NURTURING_ITEMS } from './itemAndRoomService';

export interface ShopProduct {
  itemId: string;
  price: number;
  category: 'growth' | 'trait' | 'bond' | 'special';
  recommended?: boolean;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  { itemId: 'knowledge_fruit', price: 40, category: 'growth', recommended: true },
  { itemId: 'effort_bread', price: 55, category: 'trait' },
  { itemId: 'hirameki_candy', price: 55, category: 'trait' },
  { itemId: 'courage_cookie', price: 55, category: 'trait' },
  { itemId: 'kizuna_milk', price: 40, category: 'bond', recommended: true },
  { itemId: 'review_soup', price: 80, category: 'growth' },
  { itemId: 'friendship_ribbon', price: 80, category: 'bond' },
  { itemId: 'star_fragment', price: 110, category: 'special' },
  { itemId: 'evolution_dew', price: 180, category: 'special' },
];

export interface ShopPurchaseResult {
  success: boolean;
  updatedPlayer: PlayerData;
  message: string;
}

export function purchaseShopProduct(
  player: PlayerData,
  itemId: string,
  quantity: number = 1
): ShopPurchaseResult {
  const product = SHOP_PRODUCTS.find((entry) => entry.itemId === itemId);
  const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 0;

  if (!product || !NURTURING_ITEMS[itemId] || safeQuantity === 0) {
    return { success: false, updatedPlayer: player, message: '購入できない商品です。' };
  }

  const totalPrice = product.price * safeQuantity;
  if (player.points < totalPrice) {
    return {
      success: false,
      updatedPlayer: player,
      message: `KQポイントがあと ${totalPrice - player.points} pt必要です。`,
    };
  }

  const inventoryResult = addInventoryItem(player, itemId, safeQuantity);
  if (!inventoryResult.success) {
    return {
      success: false,
      updatedPlayer: player,
      message: inventoryResult.message || '購入処理に失敗しました。',
    };
  }

  const updatedPlayer: PlayerData = {
    ...inventoryResult.updatedPlayer,
    points: inventoryResult.updatedPlayer.points - totalPrice,
    shopPurchaseCounts: {
      ...(inventoryResult.updatedPlayer.shopPurchaseCounts || {}),
      [itemId]: (inventoryResult.updatedPlayer.shopPurchaseCounts?.[itemId] || 0) + safeQuantity,
    },
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    updatedPlayer,
    message: `${NURTURING_ITEMS[itemId].name}を${safeQuantity}個購入しました！`,
  };
}
