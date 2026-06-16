export interface Crop {
  id: string;
  name: string;
  icon: string;
  growTimeMinutes: number;
  sellPrice: number;
  levelRequired: number;
  coinsPerHour: number;
}

function cph(sellPrice: number, growTimeMinutes: number) {
  return Math.round((sellPrice / growTimeMinutes) * 60 * 10) / 10;
}

export const crops: Crop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    icon: '🌾',
    growTimeMinutes: 2,
    sellPrice: 3,
    levelRequired: 1,
    coinsPerHour: cph(3, 2),
  },
  {
    id: 'corn',
    name: 'Corn',
    icon: '🌽',
    growTimeMinutes: 5,
    sellPrice: 7,
    levelRequired: 2,
    coinsPerHour: cph(7, 5),
  },
  {
    id: 'carrots',
    name: 'Carrots',
    icon: '🥕',
    growTimeMinutes: 10,
    sellPrice: 7,
    levelRequired: 3,
    coinsPerHour: cph(7, 10),
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    icon: '🫘',
    growTimeMinutes: 20,
    sellPrice: 10,
    levelRequired: 4,
    coinsPerHour: cph(10, 20),
  },
  {
    id: 'chamomile',
    name: 'Chamomile',
    icon: '🌼',
    growTimeMinutes: 20,
    sellPrice: 10,
    levelRequired: 5,
    coinsPerHour: cph(10, 20),
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    icon: '🎋',
    growTimeMinutes: 30,
    sellPrice: 14,
    levelRequired: 6,
    coinsPerHour: cph(14, 30),
  },
  {
    id: 'black_beans',
    name: 'Black Beans',
    icon: '🫘',
    growTimeMinutes: 10,
    sellPrice: 7,
    levelRequired: 7,
    coinsPerHour: cph(7, 10),
  },
  {
    id: 'indigo',
    name: 'Indigo',
    icon: '🟣',
    growTimeMinutes: 120,
    sellPrice: 25,
    levelRequired: 8,
    coinsPerHour: cph(25, 120),
  },
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    growTimeMinutes: 150,
    sellPrice: 28,
    levelRequired: 9,
    coinsPerHour: cph(28, 150),
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    icon: '🎃',
    growTimeMinutes: 180,
    sellPrice: 32,
    levelRequired: 10,
    coinsPerHour: cph(32, 180),
  },
  {
    id: 'chili_pepper',
    name: 'Chili Pepper',
    icon: '🌶️',
    growTimeMinutes: 240,
    sellPrice: 36,
    levelRequired: 11,
    coinsPerHour: cph(36, 240),
  },
  {
    id: 'potato',
    name: 'Potato',
    icon: '🥔',
    growTimeMinutes: 220,
    sellPrice: 36,
    levelRequired: 12,
    coinsPerHour: cph(36, 220),
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    icon: '🍅',
    growTimeMinutes: 360,
    sellPrice: 43,
    levelRequired: 13,
    coinsPerHour: cph(43, 360),
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    icon: '🍓',
    growTimeMinutes: 480,
    sellPrice: 50,
    levelRequired: 14,
    coinsPerHour: cph(50, 480),
  },
];
