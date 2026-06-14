export interface Crop {
  id: string;
  name: string;
  emoji: string;
  growthMinutes: number;
  sellPrice: number;
  level: number;
}

export const crops: Crop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    emoji: '🌾',
    growthMinutes: 2,
    sellPrice: 1,
    level: 1,
  },
  {
    id: 'corn',
    name: 'Corn',
    emoji: '🌽',
    growthMinutes: 5,
    sellPrice: 3,
    level: 2,
  },
  {
    id: 'carrots',
    name: 'Carrots',
    emoji: '🥕',
    growthMinutes: 10,
    sellPrice: 4,
    level: 3,
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    emoji: '🫘',
    growthMinutes: 20,
    sellPrice: 7,
    level: 5,
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    emoji: '🎋',
    growthMinutes: 30,
    sellPrice: 8,
    level: 5,
  },
  {
    id: 'indigo',
    name: 'Indigo',
    emoji: '🌿',
    growthMinutes: 60,
    sellPrice: 11,
    level: 8,
  },
  {
    id: 'cotton',
    name: 'Cotton',
    emoji: '☁️',
    growthMinutes: 120,
    sellPrice: 15,
    level: 10,
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    emoji: '🍅',
    growthMinutes: 60,
    sellPrice: 11,
    level: 8,
  },
  {
    id: 'chiliPepper',
    name: 'Chili Pepper',
    emoji: '🌶️',
    growthMinutes: 120,
    sellPrice: 16,
    level: 10,
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    emoji: '🫐',
    growthMinutes: 120,
    sellPrice: 14,
    level: 11,
  },
  {
    id: 'raspberries',
    name: 'Raspberries',
    emoji: '🍓',
    growthMinutes: 240,
    sellPrice: 18,
    level: 12,
  },
  {
    id: 'blackberries',
    name: 'Blackberries',
    emoji: '🫐',
    growthMinutes: 360,
    sellPrice: 22,
    level: 16,
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    emoji: '🎃',
    growthMinutes: 480,
    sellPrice: 26,
    level: 20,
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    emoji: '🌻',
    growthMinutes: 60,
    sellPrice: 12,
    level: 9,
  },
  {
    id: 'soybean',
    name: 'Soybean',
    emoji: '🫘',
    growthMinutes: 20,
    sellPrice: 7,
    level: 5,
  },
];
