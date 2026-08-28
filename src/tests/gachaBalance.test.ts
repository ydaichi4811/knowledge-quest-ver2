import { describe, expect, it } from 'vitest';
import { selectGachaItem, selectGachaRarity } from '../components/GachaScreenView';

describe('gacha balance rules', () => {
  it('uses the published standard rarity boundaries', () => {
    expect(selectGachaRarity(0.01, false)).toBe('レジェンド');
    expect(selectGachaRarity(0.05, false)).toBe('ウルトラレア');
    expect(selectGachaRarity(0.20, false)).toBe('スーパーレア');
    expect(selectGachaRarity(0.50, false)).toBe('レア');
    expect(selectGachaRarity(0.90, false)).toBe('ノーマル');
  });

  it('guarantees rare or better from the premium chest', () => {
    const rolls = [0, 0.09, 0.10, 0.34, 0.35, 0.74, 0.75, 0.99];
    const results = rolls.map((roll) => selectGachaRarity(roll, true));

    expect(results).not.toContain('ノーマル');
  });

  it('selects an item that matches the selected rarity', () => {
    expect(selectGachaItem(0.01, false, 0).rarity).toBe('レジェンド');
    expect(selectGachaItem(0.90, false, 0.99).rarity).toBe('ノーマル');
    expect(selectGachaItem(0.99, true, 0.5).rarity).toBe('レア');
  });
});
