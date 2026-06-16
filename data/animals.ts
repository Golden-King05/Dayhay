export interface Animal {
  id: string;           // produce itemId — matches ingredient itemId in products.ts
  name: string;         // produce name (e.g. "Milk")
  animalName: string;   // e.g. "Cow"
  icon: string;         // produce icon
  animalIcon: string;
  productionMinutes: number;
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
    sellPrice: 0,
    levelRequired: 0,
  },
  {
    id: 'milk',
    name: 'Milk',
    animalName: 'Cow',
    icon: '🥛',
    animalIcon: '🐄',
    productionMinutes: 60,
    sellPrice: 0,
    levelRequired: 0,
  },
  {
    id: 'bacon',
    name: 'Bacon',
    animalName: 'Pig',
    icon: '🥓',
    animalIcon: '🐷',
    productionMinutes: 240,
    sellPrice: 0,
    levelRequired: 0,
  },
  {
    id: 'lamb_chop',
    name: 'Lamb Chop',
    animalName: 'Lamb',
    icon: '🍖',
    animalIcon: '🐏',
    productionMinutes: 30,
    sellPrice: 0,
    levelRequired: 0,
  },
  {
    id: 'goat_milk',
    name: 'Goat Milk',
    animalName: 'Goat',
    icon: '🥛',
    animalIcon: '🐐',
    productionMinutes: 480,
    sellPrice: 0,
    levelRequired: 0,
  },
  {
    id: 'wool',
    name: 'Wool',
    animalName: 'Sheep',
    icon: '🧶',
    animalIcon: '🐑',
    productionMinutes: 360,
    sellPrice: 0,
    levelRequired: 0,
  },
];
