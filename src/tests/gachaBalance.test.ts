import { describe, expect, it } from 'vitest';
import { selectGachaItem, selectGachaRarity } from '../components/GachaScreenView';

describe('gacha balance rules', () => {
  it('uses the published standard rarity boundaries', () => {
    expect(selectGachaRarity(0.005, false)).toBe('シークレット');
    expect(selectGachaRarity(0.01, false)).toBe('レジェンド');
    expect(selectGachaRarity(0.10, false)).toBe('ウルトラレア');
    expect(selectGachaRarity(0.20, false)).toBe('スーパーレア');
    expect(selectGachaRarity(0.50, false)).toBe('レア');
    expect(selectGachaRarity(0.90, false)).toBe('ノーマル');
  });

  it('guarantees rare or better from the premium chest', () => {
    const rolls = [0, 0.01, 0.02, 0.11, 0.12, 0.29, 0.30, 0.64, 0.65, 0.99];
    const results = rolls.map((roll) => selectGachaRarity(roll, true));

    expect(results).not.toContain('ノーマル');
  });

  it('selects an item that matches the selected rarity', () => {
    expect(selectGachaItem(0.01, false, 0).rarity).toBe('レジェンド');
    expect(selectGachaItem(0.90, false, 0.99).rarity).toBe('ノーマル');
    expect(selectGachaItem(0.99, true, 0.5).rarity).toBe('レア');
  });
});
