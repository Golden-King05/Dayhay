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
    growTimeMinutes: 1,
    sellPrice: 1,
    levelRequired: 1,
    coinsPerHour: cph(1, 1),
  },
  {
    id: 'corn',
    name: 'Corn',
    icon: '🌽',
    growTimeMinutes: 5,
    sellPrice: 3,
    levelRequired: 2,
    coinsPerHour: cph(3, 5),
  },
  {
    id: 'carrots',
    name: 'Carrots',
    icon: '🥕',
    growTimeMinutes: 10,
    sellPrice: 3,
    levelRequired: 3,
    coinsPerHour: cph(3, 10),
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    icon: '🫘',
    growTimeMinutes: 20,
    sellPrice: 4,
    levelRequired: 4,
    coinsPerHour: cph(4, 20),
  },
  {
    id: 'chamomile',
    name: 'Chamomile',
    icon: '🌼',
    growTimeMinutes: 20,
    sellPrice: 4,
    levelRequired: 5,
    coinsPerHour: cph(4, 20),
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    icon: '🎋',
    growTimeMinutes: 30,
    sellPrice: 9,
    levelRequired: 6,
    coinsPerHour: cph(9, 30),
  },
  {
    id: 'black_beans',
    name: 'Black Beans',
    icon: '🫘',
    growTimeMinutes: 10,
    sellPrice: 4,
    levelRequired: 7,
    coinsPerHour: cph(4, 10),
  },
  {
    id: 'indigo',
    name: 'Indigo',
    icon: '🟣',
    growTimeMinutes: 120,
    sellPrice: 36,
    levelRequired: 8,
    coinsPerHour: cph(36, 120),
  },
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    growTimeMinutes: 150,
    sellPrice: 45,
    levelRequired: 9,
    coinsPerHour: cph(45, 150),
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    icon: '🎃',
    growTimeMinutes: 180,
    sellPrice: 55,
    levelRequired: 10,
    coinsPerHour: cph(55, 180),
  },
  {
    id: 'chili_pepper',
    name: 'Chili Pepper',
    icon: '🌶️',
    growTimeMinutes: 240,
    sellPrice: 66,
    levelRequired: 11,
    coinsPerHour: cph(66, 240),
  },
  {
    id: 'potato',
    name: 'Potato',
    icon: '🥔',
    growTimeMinutes: 220,
    sellPrice: 46,
    levelRequired: 12,
    coinsPerHour: cph(46, 220),
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    icon: '🍅',
    growTimeMinutes: 360,
    sellPrice: 57,
    levelRequired: 13,
    coinsPerHour: cph(57, 360),
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    icon: '🍓',
    growTimeMinutes: 480,
    sellPrice: 72,
    levelRequired: 14,
    coinsPerHour: cph(72, 480),
  },
];
