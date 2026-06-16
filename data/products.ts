export interface Ingredient {
  itemId: string;
  itemName: string;
  quantity: number;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  icon: string;
  machineId: string;
  machineName: string;
  machineEmoji: string;
  productionMinutes: number;
  sellPrice: number;
  levelRequired: number;
  ingredients: Ingredient[];
  quantityPerRun: number;
  coinsPerHour: number;
  efficiency: 'high' | 'medium' | 'low';
}

function calcCPH(sellPrice: number, productionMinutes: number, quantityPerRun = 1): number {
  return parseFloat((((sellPrice * quantityPerRun) / productionMinutes) * 60).toFixed(1));
}

function getEfficiency(cph: number): 'high' | 'medium' | 'low' {
  if (cph >= 60) return 'high';
  if (cph >= 25) return 'medium';
  return 'low';
}

const rawProducts = [
  // ── Feed Mill ──────────────────────────────────────────────
  {
    id: 'chicken_feed',
    name: 'Chicken Feed',
    icon: '🐔',
    machineId: 'feed_mill',
    machineName: 'Feed Mill',
    machineEmoji: '🏭',
    productionMinutes: 4,
    sellPrice: 7,
    levelRequired: 1,
    quantityPerRun: 3,
    ingredients: [
      { itemId: 'wheat', itemName: 'Wheat', quantity: 2, icon: '🌾' },
      { itemId: 'corn', itemName: 'Corn', quantity: 1, icon: '🌽' },
    ],
  },
  {
    id: 'cow_feed',
    name: 'Cow Feed',
    icon: '🐄',
    machineId: 'feed_mill',
    machineName: 'Feed Mill',
    machineEmoji: '🏭',
    productionMinutes: 9,
    sellPrice: 14,
    levelRequired: 4,
    quantityPerRun: 3,
    ingredients: [
      { itemId: 'soybeans', itemName: 'Soybeans', quantity: 2, icon: '🫘' },
      { itemId: 'corn', itemName: 'Corn', quantity: 1, icon: '🌽' },
    ],
  },
  {
    id: 'pig_feed',
    name: 'Pig Feed',
    icon: '🐷',
    machineId: 'feed_mill',
    machineName: 'Feed Mill',
    machineEmoji: '🏭',
    productionMinutes: 19,
    sellPrice: 14,
    levelRequired: 8,
    quantityPerRun: 3,
    ingredients: [
      { itemId: 'carrots', itemName: 'Carrots', quantity: 2, icon: '🥕' },
      { itemId: 'soybeans', itemName: 'Soybeans', quantity: 1, icon: '🫘' },
    ],
  },
  {
    id: 'sheep_feed',
    name: 'Sheep Feed',
    icon: '🐑',
    machineId: 'feed_mill',
    machineName: 'Feed Mill',
    machineEmoji: '🏭',
    productionMinutes: 28,
    sellPrice: 14,
    levelRequired: 11,
    quantityPerRun: 3,
    ingredients: [
      { itemId: 'wheat', itemName: 'Wheat', quantity: 3, icon: '🌾' },
      { itemId: 'soybeans', itemName: 'Soybeans', quantity: 1, icon: '🫘' },
    ],
  },
  {
    id: 'lamb_feed',
    name: 'Lamb Feed',
    icon: '🐏',
    machineId: 'feed_mill',
    machineName: 'Feed Mill',
    machineEmoji: '🏭',
    productionMinutes: 9,
    sellPrice: 18,
    levelRequired: 14,
    quantityPerRun: 3,
    ingredients: [
      { itemId: 'black_beans', itemName: 'Black Beans', quantity: 4, icon: '🫘' },
      { itemId: 'soybeans', itemName: 'Soybeans', quantity: 2, icon: '🫘' },
    ],
  },
  {
    id: 'goat_feed',
    name: 'Goat Feed',
    icon: '🐐',
    machineId: 'feed_mill',
    machineName: 'Feed Mill',
    machineEmoji: '🏭',
    productionMinutes: 38,
    sellPrice: 14,
    levelRequired: 17,
    quantityPerRun: 3,
    ingredients: [
      { itemId: 'wheat', itemName: 'Wheat', quantity: 1, icon: '🌾' },
      { itemId: 'carrots', itemName: 'Carrots', quantity: 2, icon: '🥕' },
      { itemId: 'corn', itemName: 'Corn', quantity: 1, icon: '🌽' },
    ],
  },
  // ── Dairy ──────────────────────────────────────────────────
  {
    id: 'cream',
    name: 'Cream',
    icon: '🫙',
    machineId: 'dairy',
    machineName: 'Dairy',
    machineEmoji: '🥛',
    productionMinutes: 20,
    sellPrice: 50,
    levelRequired: 0,
    ingredients: [{ itemId: 'milk', itemName: 'Milk', quantity: 1, icon: '🥛' }],
  },
  {
    id: 'butter',
    name: 'Butter',
    icon: '🧈',
    machineId: 'dairy',
    machineName: 'Dairy',
    machineEmoji: '🥛',
    productionMinutes: 30,
    sellPrice: 82,
    levelRequired: 0,
    ingredients: [{ itemId: 'milk', itemName: 'Milk', quantity: 2, icon: '🥛' }],
  },
  {
    id: 'cheese',
    name: 'Cheese',
    icon: '🧀',
    machineId: 'dairy',
    machineName: 'Dairy',
    machineEmoji: '🥛',
    productionMinutes: 60,
    sellPrice: 122,
    levelRequired: 0,
    ingredients: [{ itemId: 'milk', itemName: 'Milk', quantity: 3, icon: '🥛' }],
  },
  {
    id: 'goat_cheese',
    name: 'Goat Cheese',
    icon: '🐐',
    machineId: 'dairy',
    machineName: 'Dairy',
    machineEmoji: '🥛',
    productionMinutes: 90,
    sellPrice: 162,
    levelRequired: 0,
    ingredients: [{ itemId: 'goat_milk', itemName: 'Goat Milk', quantity: 2, icon: '🥛' }],
  },
  // ── Sugar Mill ─────────────────────────────────────────────
  {
    id: 'brown_sugar',
    name: 'Brown Sugar',
    icon: '🟫',
    machineId: 'sugar_mill',
    machineName: 'Sugar Mill',
    machineEmoji: '🍬',
    productionMinutes: 20,
    sellPrice: 32,
    levelRequired: 5,
    ingredients: [{ itemId: 'sugarcane', itemName: 'Sugarcane', quantity: 1, icon: '🎋' }],
  },
  {
    id: 'sugar',
    name: 'White Sugar',
    icon: '🍚',
    machineId: 'sugar_mill',
    machineName: 'Sugar Mill',
    machineEmoji: '🍬',
    productionMinutes: 40,
    sellPrice: 50,
    levelRequired: 6,
    ingredients: [{ itemId: 'sugarcane', itemName: 'Sugarcane', quantity: 2, icon: '🎋' }],
  },
  {
    id: 'syrup',
    name: 'Syrup',
    icon: '🍯',
    machineId: 'sugar_mill',
    machineName: 'Sugar Mill',
    machineEmoji: '🍬',
    productionMinutes: 90,
    sellPrice: 90,
    levelRequired: 8,
    ingredients: [{ itemId: 'sugarcane', itemName: 'Sugarcane', quantity: 4, icon: '🎋' }],
  },
  // ── Bakery ─────────────────────────────────────────────────
  {
    id: 'cookie',
    name: 'Cookie',
    icon: '🍪',
    machineId: 'bakery',
    machineName: 'Bakery',
    machineEmoji: '🍞',
    productionMinutes: 60,
    sellPrice: 104,
    levelRequired: 0,
    ingredients: [
      { itemId: 'wheat', itemName: 'Wheat', quantity: 2, icon: '🌾' },
      { itemId: 'brown_sugar', itemName: 'Brown Sugar', quantity: 1, icon: '🟫' },
      { itemId: 'egg', itemName: 'Egg', quantity: 2, icon: '🥚' },
    ],
  },
  // ── Coffee Kiosk ───────────────────────────────────────────
  {
    id: 'espresso',
    name: 'Espresso',
    icon: '☕',
    machineId: 'coffee_kiosk',
    machineName: 'Coffee Kiosk',
    machineEmoji: '☕',
    productionMinutes: 5,
    sellPrice: 248,
    levelRequired: 0,
    ingredients: [
      { itemId: 'coffee', itemName: 'Coffee Bean', quantity: 3, icon: '☕' },
      { itemId: 'sugar', itemName: 'White Sugar', quantity: 1, icon: '🍚' },
    ],
  },
  {
    id: 'cafe_latte',
    name: 'Café Latte',
    icon: '🍵',
    machineId: 'coffee_kiosk',
    machineName: 'Coffee Kiosk',
    machineEmoji: '☕',
    productionMinutes: 10,
    sellPrice: 219,
    levelRequired: 0,
    ingredients: [
      { itemId: 'coffee', itemName: 'Coffee Bean', quantity: 2, icon: '☕' },
      { itemId: 'milk', itemName: 'Milk', quantity: 1, icon: '🥛' },
      { itemId: 'sugar', itemName: 'White Sugar', quantity: 1, icon: '🍚' },
    ],
  },
  {
    id: 'cafe_mocha',
    name: 'Café Mocha',
    icon: '🧋',
    machineId: 'coffee_kiosk',
    machineName: 'Coffee Kiosk',
    machineEmoji: '☕',
    productionMinutes: 15,
    sellPrice: 291,
    levelRequired: 0,
    ingredients: [
      { itemId: 'coffee', itemName: 'Coffee Bean', quantity: 1, icon: '☕' },
      { itemId: 'cocoa', itemName: 'Cocoa', quantity: 2, icon: '🍫' },
      { itemId: 'cream', itemName: 'Cream', quantity: 1, icon: '🫙' },
    ],
  },
  // ── Jam Maker ──────────────────────────────────────────────
  {
    id: 'raspberry_jam',
    name: 'Raspberry Jam',
    icon: '🍓',
    machineId: 'jam_maker',
    machineName: 'Jam Maker',
    machineEmoji: '🫙',
    productionMinutes: 420,
    sellPrice: 252,
    levelRequired: 21,
    ingredients: [
      { itemId: 'raspberry', itemName: 'Raspberry', quantity: 3, icon: '🍓' },
    ],
  },
  {
    id: 'apple_jam',
    name: 'Apple Jam',
    icon: '🍎',
    machineId: 'jam_maker',
    machineName: 'Jam Maker',
    machineEmoji: '🫙',
    productionMinutes: 360,
    sellPrice: 219,
    levelRequired: 24,
    ingredients: [
      { itemId: 'apple', itemName: 'Apple', quantity: 3, icon: '🍎' },
    ],
  },
  {
    id: 'cherry_jam',
    name: 'Cherry Jam',
    icon: '🍒',
    machineId: 'jam_maker',
    machineName: 'Jam Maker',
    machineEmoji: '🫙',
    productionMinutes: 420,
    sellPrice: 334,
    levelRequired: 27,
    ingredients: [
      { itemId: 'cherry', itemName: 'Cherry', quantity: 3, icon: '🍒' },
    ],
  },
  {
    id: 'blackberry_jam',
    name: 'Blackberry Jam',
    icon: '🫐',
    machineId: 'jam_maker',
    machineName: 'Jam Maker',
    machineEmoji: '🫙',
    productionMinutes: 480,
    sellPrice: 388,
    levelRequired: 30,
    ingredients: [
      { itemId: 'blackberry', itemName: 'Blackberry', quantity: 3, icon: '🫐' },
    ],
  },
];

export const products: Product[] = rawProducts.map((p) => {
  const qty = (p as any).quantityPerRun ?? 1;
  const cph = calcCPH(p.sellPrice, p.productionMinutes, qty);
  return {
    ...p,
    quantityPerRun: qty,
    coinsPerHour: cph,
    efficiency: getEfficiency(cph),
  };
});
