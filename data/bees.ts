export interface NectarBush {
  id: string;
  name: string;
  icon: string;
  purchaseCost: number;
  nectarCapacity: number;      // per life
  livesWithRevival: number;    // 1 normal + 1 friend revival = 2
  nectarPerHoneycomb: number;  // 100
  honeycombsPerLifetime: number; // (nectarCapacity × lives) / nectarPerHoneycomb
  amortizedCostPerHoneycomb: number;
}

export const nectarBush: NectarBush = {
  id: 'nectar_bush',
  name: 'Nectar Bush',
  icon: '🌸',
  purchaseCost: 120,
  nectarCapacity: 250,
  livesWithRevival: 2,
  nectarPerHoneycomb: 100,
  honeycombsPerLifetime: Math.floor((250 * 2) / 100), // 5
  amortizedCostPerHoneycomb: Math.round(120 / Math.floor((250 * 2) / 100)), // 24
};

export const BEE_PRODUCTION_MINUTES = 35; // 1 honeycomb per nest per 35 min
export const MAX_BEE_NESTS = 3;
