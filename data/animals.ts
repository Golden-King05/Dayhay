export interface Animal {
  id: string;           // produce itemId — matches ingredient itemId in products.ts
  name: string;         // produce name (e.g. "Milk")
  animalName: string;   // e.g. "Cow"
  icon: string;         // produce icon
  animalIcon: string;
  productionMinutes: number;
  feedId: string;       // feed product required before animal produces
  sellPrice: number;
  levelRequired: number;
}

export const animals: Animal[] = [
  {
    id: 'egg',
    name: 'Egg',
    animalName: 'Chicken',
    icon: '🥚',
    animalIcon: '🐔',
    productionMinutes: 20,
    feedId: 'chicken_feed',
    sellPrice: 18,
    levelRequired: 0,
  },
  {
    id: 'milk',
    name: 'Milk',
    animalName: 'Cow',
    icon: '🥛',
    animalIcon: '🐄',
    productionMinutes: 60,
    feedId: 'cow_feed',
    sellPrice: 32,
    levelRequired: 0,
  },
  {
    id: 'bacon',
    name: 'Bacon',
    animalName: 'Pig',
    icon: '🥓',
    animalIcon: '🐷',
    productionMinutes: 240,
    feedId: 'pig_feed',
    sellPrice: 50,
    levelRequired: 0,
  },
  {
    id: 'lamb_chop',
    name: 'Lamb Chop',
    animalName: 'Lamb',
    icon: '🍖',
    animalIcon: '🐏',
    productionMinutes: 30,
    feedId: 'lamb_feed',
    sellPrice: 36,
    levelRequired: 0,
  },
  {
    id: 'goat_milk',
    name: 'Goat Milk',
    animalName: 'Goat',
    icon: '🥛',
    animalIcon: '🐐',
    productionMinutes: 480,
    feedId: 'goat_feed',
    sellPrice: 64,
    levelRequired: 0,
  },
  {
    id: 'wool',
    name: 'Wool',
    animalName: 'Sheep',
    icon: '🧶',
    animalIcon: '🐑',
    productionMinutes: 360,
    feedId: 'sheep_feed',
    sellPrice: 54,
    levelRequired: 0,
  },
  {
    id: 'honeycomb',
    name: 'Honeycomb',
    animalName: 'Bee',
    icon: '🍯',
    animalIcon: '🐝',
    productionMinutes: 35,
    feedId: 'nectar_bush', // environmental — contributes 0 to chain time
    sellPrice: 68,
    levelRequired: 0,
  },
];
