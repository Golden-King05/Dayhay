export interface Tree {
  id: string;        // matches ingredient itemId used in products.ts
  name: string;      // produce name (e.g. "Apple")
  plantName: string; // display name (e.g. "Apple Tree")
  icon: string;
  plantType: 'tree' | 'bush';
  cycleMinutes: number;
  sellPrice: number;
  levelRequired: number;
  quantityPerCycle: number;
  coinsPerHour: number;
}

function cph(sellPrice: number, cycleMinutes: number, qty: number) {
  if (sellPrice === 0) return 0;
  return Math.round(((sellPrice * qty) / cycleMinutes) * 60 * 10) / 10;
}

export const trees: Tree[] = [
  {
    id: 'apple',
    name: 'Apple',
    plantName: 'Apple Tree',
    icon: '🍎',
    plantType: 'tree',
    cycleMinutes: 960,
    sellPrice: 0,
    levelRequired: 0,
    quantityPerCycle: 3,
    coinsPerHour: cph(0, 960, 3),
  },
  {
    id: 'cherry',
    name: 'Cherry',
    plantName: 'Cherry Tree',
    icon: '🍒',
    plantType: 'tree',
    cycleMinutes: 1620,
    sellPrice: 0,
    levelRequired: 0,
    quantityPerCycle: 3,
    coinsPerHour: cph(0, 1620, 3),
  },
  {
    id: 'coffee',
    name: 'Coffee Bean',
    plantName: 'Coffee Tree',
    icon: '☕',
    plantType: 'tree',
    cycleMinutes: 1440,
    sellPrice: 0,
    levelRequired: 0,
    quantityPerCycle: 3,
    coinsPerHour: cph(0, 1440, 3),
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    plantName: 'Cocoa Tree',
    icon: '🍫',
    plantType: 'tree',
    cycleMinutes: 2040,
    sellPrice: 0,
    levelRequired: 0,
    quantityPerCycle: 3,
    coinsPerHour: cph(0, 2040, 3),
  },
  {
    id: 'blackberry',
    name: 'Blackberry',
    plantName: 'Blackberry Bush',
    icon: '🫐',
    plantType: 'bush',
    cycleMinutes: 1860,
    sellPrice: 0,
    levelRequired: 0,
    quantityPerCycle: 3,
    coinsPerHour: cph(0, 1860, 3),
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    plantName: 'Blueberry Bush',
    icon: '🔵',
    plantType: 'bush',
    cycleMinutes: 2040,
    sellPrice: 0,
    levelRequired: 0,
    quantityPerCycle: 3,
    coinsPerHour: cph(0, 2040, 3),
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    plantName: 'Raspberry Bush',
    icon: '🍓',
    plantType: 'bush',
    cycleMinutes: 1080,
    sellPrice: 0,
    levelRequired: 0,
    quantityPerCycle: 3,
    coinsPerHour: cph(0, 1080, 3),
  },
];
