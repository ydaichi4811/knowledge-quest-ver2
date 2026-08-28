import { describe, expect, it } from 'vitest';
import { getDiscoveredNpcCompanions } from '../services/encyclopediaService';
import { PlayerData } from '../types';

describe('encountered companion collection', () => {
  it('returns only NPC companions registered in the player encyclopedia', () => {
    const player = {
      companionEncyclopedia: {
        discoveredNpcIds: ['npc_rifin_forest', 'npc_kurudo_star'],
      },
    } as PlayerData;

    expect(getDiscoveredNpcCompanions(player).map((npc) => npc.npcId)).toEqual([
      'npc_rifin_forest',
      'npc_kurudo_star',
    ]);
  });

  it('returns an empty list before the first encounter', () => {
    expect(getDiscoveredNpcCompanions({} as PlayerData)).toEqual([]);
  });
});
