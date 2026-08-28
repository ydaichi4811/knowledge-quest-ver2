import { describe, expect, it } from 'vitest';
import { sanitizeFirestoreData } from '../services/cloudSaveService';

describe('sanitizeFirestoreData', () => {
  it('removes undefined values from nested game data', () => {
    const input = {
      companion: {
        name: 'ラーニィ',
        appearance: {
          color: 'purple',
          hornType: undefined,
        },
      },
      inventory: [undefined, { id: 'cookie', count: 1 }],
    };

    expect(sanitizeFirestoreData(input)).toEqual({
      companion: {
        name: 'ラーニィ',
        appearance: {
          color: 'purple',
        },
      },
      inventory: [{ id: 'cookie', count: 1 }],
    });
  });

  it('preserves null, false, and zero values', () => {
    expect(sanitizeFirestoreData({ empty: null, enabled: false, count: 0 })).toEqual({
      empty: null,
      enabled: false,
      count: 0,
    });
  });
});
