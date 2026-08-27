import React, { useMemo, useState } from 'react';
import { CheckCircle2, Coins, ShoppingBag, Sparkles } from 'lucide-react';
import { PlayerData } from '../types';
import { savePlayerData } from '../services/gameStorage';
import { NURTURING_ITEMS } from '../services/itemAndRoomService';
import { purchaseShopProduct, SHOP_PRODUCTS, ShopProduct } from '../services/shopService';
import { FuriganaText } from './FuriganaText';

interface ShopScreenViewProps {
  player: PlayerData;
  onPlayerUpdate: (updated: PlayerData) => void;
  onOpenCompanionRoom?: () => void;
}

type ShopCategory = 'all' | ShopProduct['category'];

const CATEGORY_LABELS: Record<ShopCategory, string> = {
  all: 'すべて',
  growth: '成長',
  trait: '個性',
  bond: 'きずな',
  special: '特別',
};

export const ShopScreenView: React.FC<ShopScreenViewProps> = ({
  player,
  onPlayerUpdate,
  onOpenCompanionRoom,
}) => {
  const [category, setCategory] = useState<ShopCategory>('all');
  const [message, setMessage] = useState('欲しい育成アイテムを選んで、確実に手に入れよう。');
  const [lastPurchasedItemId, setLastPurchasedItemId] = useState<string | null>(null);

  const products = useMemo(
    () => SHOP_PRODUCTS.filter((product) => category === 'all' || product.category === category),
    [category]
  );

  const handlePurchase = (itemId: string) => {
    const result = purchaseShopProduct(player, itemId);
    setMessage(result.message);
    if (!result.success) return;

    savePlayerData(result.updatedPlayer);
    onPlayerUpdate(result.updatedPlayer);
    setLastPurchasedItemId(itemId);
  };

  return (
    <div className="relative z-10 mx-auto my-auto w-full max-w-5xl space-y-5 p-3 sm:p-5 text-slate-100">
      <section className="royal-panel space-y-5 p-4 sm:p-6">
        <header className="flex flex-col gap-3 border-b-2 border-amber-500/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-7 w-7 text-amber-400" />
            <div>
              <h2 className="font-cinzel text-xl font-black text-amber-300 sm:text-2xl">王国育成ショップ</h2>
              <p className="text-xs font-bold text-slate-300">中身が分かる安心のお店</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-slate-950 px-4 py-2 text-sm font-black text-amber-300">
            <Coins className="h-4 w-4" /> {player.points} KQ pt
          </div>
        </header>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/50 p-3 text-xs font-bold text-cyan-100">
          <Sparkles className="mr-1 inline h-4 w-4 text-cyan-300" />
          ガチャは30ptからのランダム抽選。ショップは少し高い代わりに、選んだ品を必ず購入できます。
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {(Object.keys(CATEGORY_LABELS) as ShopCategory[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`rounded-xl border px-1 py-2 text-[11px] font-black sm:text-xs ${
                category === key
                  ? 'border-amber-300 bg-amber-500 text-slate-950'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-500/60'
              }`}
            >
              <FuriganaText text={CATEGORY_LABELS[key]} />
            </button>
          ))}
        </div>

        <div aria-live="polite" className={`rounded-xl border p-3 text-center text-xs font-black ${
          lastPurchasedItemId
            ? 'border-emerald-400/50 bg-emerald-950/70 text-emerald-200'
            : 'border-slate-700 bg-slate-950/80 text-slate-300'
        }`}>
          {lastPurchasedItemId && <CheckCircle2 className="mr-1 inline h-4 w-4" />}
          <FuriganaText text={message} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const item = NURTURING_ITEMS[product.itemId];
            const owned = player.inventory?.[product.itemId]?.quantity || 0;
            const canBuy = player.points >= product.price;
            return (
              <article key={product.itemId} className="relative flex flex-col rounded-2xl border border-amber-500/35 bg-slate-950/90 p-4 shadow-lg">
                {product.recommended && (
                  <span className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-slate-950">おすすめ</span>
                )}
                <div className="mb-2 text-4xl" aria-hidden="true">{item.icon}</div>
                <h3 className="font-black text-amber-200"><FuriganaText text={item.name} /></h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-300"><FuriganaText text={item.description} /></p>
                <div className="mt-3 rounded-lg bg-slate-900 p-2 text-[11px] font-bold text-emerald-300">
                  <FuriganaText text={item.effectLabel} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">所持 ×{owned}</span>
                  <span className="text-amber-300">{product.price} pt</span>
                </div>
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => handlePurchase(product.itemId)}
                  className={`mt-3 rounded-xl py-2.5 text-xs font-black ${
                    canBuy
                      ? 'btn-royal-gold cursor-pointer'
                      : 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500'
                  }`}
                >
                  {canBuy ? '1個購入する' : 'ポイント不足'}
                </button>
              </article>
            );
          })}
        </div>

        {onOpenCompanionRoom && (
          <button type="button" onClick={onOpenCompanionRoom} className="btn-royal-emerald w-full rounded-xl py-3 text-sm font-black">
            購入したアイテムを相棒に使う
          </button>
        )}
      </section>
    </div>
  );
};
