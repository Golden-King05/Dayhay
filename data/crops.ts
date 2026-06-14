export interface Crop {
  id: string;
  name: string;
  icon: string;
  growTimeMinutes: number;
  sellPrice: number;
  levelRequired: number;
  coinsPerHour: number;
}

export const crops: Crop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    icon: '🌾',
    growTimeMinutes: 1,
    sellPrice: 1,
    levelRequired: 1,
    coinsPerHour: 60,
  },
  {
    id: 'corn',
    name: 'Corn',
    icon: '🌽',
    growTimeMinutes: 5,
    sellPrice: 3,
    levelRequired: 2,
    coinsPerHour: 36,
  },
  {
    id: 'carrots',
    name: 'Carrots',
    icon: '🥕',
    growTimeMinutes: 2,
    sellPrice: 2,
    levelRequired: 3,
    coinsPerHour: 60,
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    icon: '🫘',
    growTimeMinutes: 5,
    sellPrice: 3,
    levelRequired: 4,
    coinsPerHour: 36,
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    icon: '🎋',
    growTimeMinutes: 30,
    sellPrice: 9,
    levelRequired: 5,
    coinsPerHour: 18,
  },
  {
    id: 'indigo',
    name: 'Indigo',
    icon: '🟣',
    growTimeMinutes: 60,
    sellPrice: 18,
    levelRequired: 6,
    coinsPerHour: 18,
  },
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    growTimeMinutes: 60,
    sellPrice: 18,
    levelRequired: 7,
    coinsPerHour: 18,
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    icon: '🍅',
    growTimeMinutes: 25,
    sellPrice: 7,
    levelRequired: 8,
    coinsPerHour: 16.8,
  },
  {
    id: 'chili_pepper',
    name: 'Chili Pepper',
    icon: '🌶️',
    growTimeMinutes: 40,
    sellPrice: 12,
    levelRequired: 9,
    coinsPerHour: 18,
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    icon: '🎃',
    growTimeMinutes: 60,
    sellPrice: 20,
    levelRequired: 10,
    coinsPerHour: 20,
  },
  {
    id: 'potato',
    name: 'Potato',
    icon: '🥔',
    growTimeMinutes: 15,
    sellPrice: 5,
    levelRequired: 11,
    coinsPerHour: 20,
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    icon: '🫐',
    growTimeMinutes: 45,
    sellPrice: 14,
    levelRequired: 12,
    coinsPerHour: 18.67,
  },
];
