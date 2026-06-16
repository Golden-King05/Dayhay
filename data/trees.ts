export interface Tree {
  id: string;
  name: string;
  plantName: string;
  icon: string;
  plantType: 'tree' | 'bush';
  cycleMinutes: number;
  sellPrice: number;
  levelRequired: number;
  quantityPerCycle: number;
  purchaseCost: number;
  lifetimeCycles: number;   // 3 normal + 3 after free revival = 6
  coinsPerHour: number;     // amortized: accounts for purchase cost
  perCycleRevenue: number;  // sellPrice × quantityPerCycle (raw, before amortization)
  amortizedNetPerCycle: number; // perCycleRevenue - purchaseCost/lifetimeCycles
  paybackCycles: number;    // cycles until purchase cost is recovered
}

function amortizedCPH(
  sellPrice: number,
  cycleMinutes: number,
  qty: number,
  purchaseCost: number,
  lifetimeCycles: number
): number {
  const netPerCycle = sellPrice * qty - purchaseCost / lifetimeCycles;
  if (netPerCycle <= 0 || cycleMinutes === 0) return 0;
  return Math.round((netPerCycle / cycleMinutes) * 60 * 10) / 10;
}

function payback(sellPrice: number, qty: number, purchaseCost: number): number {
  return Math.ceil(purchaseCost / (sellPrice * qty));
}

export const trees: Tree[] = [
  {
    id: 'apple',
    name: 'Apple',
    plantName: 'Apple Tree',
    icon: '🍎',
    plantType: 'tree',
    cycleMinutes: 960,
    sellPrice: 39,
    levelRequired: 0,
    quantityPerCycle: 3,
    purchaseCost: 160,
    lifetimeCycles: 6,
    perCycleRevenue: 39 * 3,
    amortizedNetPerCycle: 39 * 3 - 160 / 6,
    coinsPerHour: amortizedCPH(39, 960, 3, 160, 6),
    paybackCycles: payback(39, 3, 160),
  },
  {
    id: 'cherry',
    name: 'Cherry',
    plantName: 'Cherry Tree',
    icon: '🍒',
    plantType: 'tree',
    cycleMinutes: 1620,
    sellPrice: 68,
    levelRequired: 0,
    quantityPerCycle: 3,
    purchaseCost: 410,
    lifetimeCycles: 6,
    perCycleRevenue: 68 * 3,
    amortizedNetPerCycle: 68 * 3 - 410 / 6,
    coinsPerHour: amortizedCPH(68, 1620, 3, 410, 6),
    paybackCycles: payback(68, 3, 410),
  },
  {
    id: 'coffee',
    name: 'Coffee Bean',
    plantName: 'Coffee Tree',
    icon: '☕',
    plantType: 'tree',
    cycleMinutes: 1440,
    sellPrice: 64,
    levelRequired: 0,
    quantityPerCycle: 3,
    purchaseCost: 375,
    lifetimeCycles: 6,
    perCycleRevenue: 64 * 3,
    amortizedNetPerCycle: 64 * 3 - 375 / 6,
    coinsPerHour: amortizedCPH(64, 1440, 3, 375, 6),
    paybackCycles: payback(64, 3, 375),
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    plantName: 'Cocoa Tree',
    icon: '🍫',
    plantType: 'tree',
    cycleMinutes: 2040,
    sellPrice: 86,
    levelRequired: 0,
    quantityPerCycle: 3,
    purchaseCost: 550,
    lifetimeCycles: 6,
    perCycleRevenue: 86 * 3,
    amortizedNetPerCycle: 86 * 3 - 550 / 6,
    coinsPerHour: amortizedCPH(86, 2040, 3, 550, 6),
    paybackCycles: payback(86, 3, 550),
  },
  {
    id: 'blackberry',
    name: 'Blackberry',
    plantName: 'Blackberry Bush',
    icon: '🫐',
    plantType: 'bush',
    cycleMinutes: 1860,
    sellPrice: 82,
    levelRequired: 0,
    quantityPerCycle: 3,
    purchaseCost: 530,
    lifetimeCycles: 6,
    perCycleRevenue: 82 * 3,
    amortizedNetPerCycle: 82 * 3 - 530 / 6,
    coinsPerHour: amortizedCPH(82, 1860, 3, 530, 6),
    paybackCycles: payback(82, 3, 530),
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    plantName: 'Blueberry Bush',
    icon: '🔵',
    plantType: 'bush',
    cycleMinutes: 2040,
    sellPrice: 82,
    levelRequired: 0,
    quantityPerCycle: 3,
    purchaseCost: 550,
    lifetimeCycles: 6,
    perCycleRevenue: 82 * 3,
    amortizedNetPerCycle: 82 * 3 - 550 / 6,
    coinsPerHour: amortizedCPH(82, 2040, 3, 550, 6),
    paybackCycles: payback(82, 3, 550),
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    plantName: 'Raspberry Bush',
    icon: '🍓',
    plantType: 'bush',
    cycleMinutes: 1080,
    sellPrice: 46,
    levelRequired: 0,
    quantityPerCycle: 3,
    purchaseCost: 220,
    lifetimeCycles: 6,
    perCycleRevenue: 46 * 3,
    amortizedNetPerCycle: 46 * 3 - 220 / 6,
    coinsPerHour: amortizedCPH(46, 1080, 3, 220, 6),
    paybackCycles: payback(46, 3, 220),
  },
];
