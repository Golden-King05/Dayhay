export interface Ingredient {
  itemId: string;
  name: string;
  quantity: number;
  isProduct?: boolean; // if true, it's a produced item not a raw crop
}

export interface Product {
  id: string;
  name: string;
  machineId: string;
  machineName: string;
  productionMinutes: number;
  sellPrice: number;
  level: number;
  ingredients: Ingredient[];
  emoji?: string;
}

export const products: Product[] = [
  // ── Feed Mill ────────────────────────────────────────────────────────────────
  {
    id: 'chickenFeed',
    name: 'Chicken Feed',
    machineId: 'feedMill',
    machineName: 'Feed Mill',
    productionMinutes: 5,
    sellPrice: 2,
    level: 1,
    emoji: '🐔',
    ingredients: [
      { itemId: 'wheat', name: 'Wheat', quantity: 3 },
    ],
  },
  {
    id: 'cowFeed',
    name: 'Cow Feed',
    machineId: 'feedMill',
    machineName: 'Feed Mill',
    productionMinutes: 10,
    sellPrice: 4,
    level: 4,
    emoji: '🐄',
    ingredients: [
      { itemId: 'wheat', name: 'Wheat', quantity: 3 },
      { itemId: 'corn', name: 'Corn', quantity: 3 },
    ],
  },
  {
    id: 'pigFeed',
    name: 'Pig Feed',
    machineId: 'feedMill',
    machineName: 'Feed Mill',
    productionMinutes: 15,
    sellPrice: 7,
    level: 9,
    emoji: '🐷',
    ingredients: [
      { itemId: 'corn', name: 'Corn', quantity: 3 },
      { itemId: 'soybeans', name: 'Soybeans', quantity: 3 },
    ],
  },
  {
    id: 'sheepFeed',
    name: 'Sheep Feed',
    machineId: 'feedMill',
    machineName: 'Feed Mill',
    productionMinutes: 20,
    sellPrice: 14,
    level: 14,
    emoji: '🐑',
    ingredients: [
      { itemId: 'wheat', name: 'Wheat', quantity: 3 },
      { itemId: 'corn', name: 'Corn', quantity: 3 },
      { itemId: 'carrots', name: 'Carrots', quantity: 2 },
    ],
  },

  // ── Dairy ─────────────────────────────────────────────────────────────────
  {
    id: 'cream',
    name: 'Cream',
    machineId: 'dairy',
    machineName: 'Dairy',
    productionMinutes: 5,
    sellPrice: 9,
    level: 7,
    emoji: '🫙',
    ingredients: [
      { itemId: 'milk', name: 'Milk', quantity: 2 },
    ],
  },
  {
    id: 'butter',
    name: 'Butter',
    machineId: 'dairy',
    machineName: 'Dairy',
    productionMinutes: 10,
    sellPrice: 15,
    level: 7,
    emoji: '🧈',
    ingredients: [
      { itemId: 'cream', name: 'Cream', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'cheese',
    name: 'Cheese',
    machineId: 'dairy',
    machineName: 'Dairy',
    productionMinutes: 20,
    sellPrice: 30,
    level: 16,
    emoji: '🧀',
    ingredients: [
      { itemId: 'milk', name: 'Milk', quantity: 3 },
    ],
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    machineId: 'dairy',
    machineName: 'Dairy',
    productionMinutes: 30,
    sellPrice: 44,
    level: 30,
    emoji: '🥛',
    ingredients: [
      { itemId: 'milk', name: 'Milk', quantity: 3 },
      { itemId: 'raspberries', name: 'Raspberries', quantity: 2 },
    ],
  },

  // ── Sugar Mill ────────────────────────────────────────────────────────────
  {
    id: 'sugar',
    name: 'Sugar',
    machineId: 'sugarMill',
    machineName: 'Sugar Mill',
    productionMinutes: 5,
    sellPrice: 10,
    level: 5,
    emoji: '🍚',
    ingredients: [
      { itemId: 'sugarcane', name: 'Sugarcane', quantity: 3 },
    ],
  },
  {
    id: 'brownSugar',
    name: 'Brown Sugar',
    machineId: 'sugarMill',
    machineName: 'Sugar Mill',
    productionMinutes: 10,
    sellPrice: 18,
    level: 20,
    emoji: '🟫',
    ingredients: [
      { itemId: 'sugarcane', name: 'Sugarcane', quantity: 5 },
    ],
  },

  // ── Bakery ────────────────────────────────────────────────────────────────
  {
    id: 'whiteBread',
    name: 'White Bread',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 5,
    sellPrice: 9,
    level: 2,
    emoji: '🍞',
    ingredients: [
      { itemId: 'wheat', name: 'Wheat', quantity: 3 },
    ],
  },
  {
    id: 'bread',
    name: 'Bread',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 20,
    sellPrice: 35,
    level: 20,
    emoji: '🥖',
    ingredients: [
      { itemId: 'wheat', name: 'Wheat', quantity: 3 },
      { itemId: 'cream', name: 'Cream', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'cake',
    name: 'Cake',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 30,
    sellPrice: 60,
    level: 25,
    emoji: '🎂',
    ingredients: [
      { itemId: 'cream', name: 'Cream', quantity: 2, isProduct: true },
      { itemId: 'butter', name: 'Butter', quantity: 2, isProduct: true },
      { itemId: 'sugar', name: 'Sugar', quantity: 3, isProduct: true },
    ],
  },
  {
    id: 'carrotCake',
    name: 'Carrot Cake',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 45,
    sellPrice: 75,
    level: 35,
    emoji: '🥕',
    ingredients: [
      { itemId: 'carrots', name: 'Carrots', quantity: 4 },
      { itemId: 'sugar', name: 'Sugar', quantity: 3, isProduct: true },
      { itemId: 'butter', name: 'Butter', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'cookie',
    name: 'Cookie',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 15,
    sellPrice: 25,
    level: 18,
    emoji: '🍪',
    ingredients: [
      { itemId: 'butter', name: 'Butter', quantity: 3, isProduct: true },
      { itemId: 'sugar', name: 'Sugar', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'muffin',
    name: 'Muffin',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 20,
    sellPrice: 36,
    level: 21,
    emoji: '🧁',
    ingredients: [
      { itemId: 'butter', name: 'Butter', quantity: 2, isProduct: true },
      { itemId: 'blueberries', name: 'Blueberries', quantity: 2 },
    ],
  },
  {
    id: 'donut',
    name: 'Donut',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 30,
    sellPrice: 54,
    level: 27,
    emoji: '🍩',
    ingredients: [
      { itemId: 'cream', name: 'Cream', quantity: 2, isProduct: true },
      { itemId: 'sugar', name: 'Sugar', quantity: 3, isProduct: true },
    ],
  },
  {
    id: 'croissant',
    name: 'Croissant',
    machineId: 'bakery',
    machineName: 'Bakery',
    productionMinutes: 45,
    sellPrice: 72,
    level: 32,
    emoji: '🥐',
    ingredients: [
      { itemId: 'butter', name: 'Butter', quantity: 3, isProduct: true },
      { itemId: 'cream', name: 'Cream', quantity: 3, isProduct: true },
    ],
  },

  // ── Sewing Machine ────────────────────────────────────────────────────────
  {
    id: 'cottonFabric',
    name: 'Cotton Fabric',
    machineId: 'sewingMachine',
    machineName: 'Sewing Machine',
    productionMinutes: 120,
    sellPrice: 31,
    level: 13,
    emoji: '🧶',
    ingredients: [
      { itemId: 'cotton', name: 'Cotton', quantity: 5 },
    ],
  },
  {
    id: 'indigoDress',
    name: 'Indigo Dress',
    machineId: 'sewingMachine',
    machineName: 'Sewing Machine',
    productionMinutes: 180,
    sellPrice: 89,
    level: 22,
    emoji: '👗',
    ingredients: [
      { itemId: 'indigo', name: 'Indigo', quantity: 3 },
      { itemId: 'cottonFabric', name: 'Cotton Fabric', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'woolSweater',
    name: 'Wool Sweater',
    machineId: 'sewingMachine',
    machineName: 'Sewing Machine',
    productionMinutes: 240,
    sellPrice: 66,
    level: 19,
    emoji: '🧥',
    ingredients: [
      { itemId: 'wool', name: 'Wool', quantity: 6 },
    ],
  },
  {
    id: 'linenShirt',
    name: 'Linen Shirt',
    machineId: 'sewingMachine',
    machineName: 'Sewing Machine',
    productionMinutes: 150,
    sellPrice: 56,
    level: 17,
    emoji: '👕',
    ingredients: [
      { itemId: 'cotton', name: 'Cotton', quantity: 4 },
      { itemId: 'indigo', name: 'Indigo', quantity: 2 },
    ],
  },

  // ── BBQ Grill ─────────────────────────────────────────────────────────────
  {
    id: 'grilledCorn',
    name: 'Grilled Corn',
    machineId: 'bbqGrill',
    machineName: 'BBQ Grill',
    productionMinutes: 5,
    sellPrice: 15,
    level: 3,
    emoji: '🌽',
    ingredients: [
      { itemId: 'corn', name: 'Corn', quantity: 3 },
    ],
  },
  {
    id: 'tomatoSauce',
    name: 'Tomato Sauce',
    machineId: 'bbqGrill',
    machineName: 'BBQ Grill',
    productionMinutes: 5,
    sellPrice: 14,
    level: 3,
    emoji: '🍅',
    ingredients: [
      { itemId: 'tomatoes', name: 'Tomatoes', quantity: 2 },
    ],
  },
  {
    id: 'chiliSauce',
    name: 'Chili Sauce',
    machineId: 'bbqGrill',
    machineName: 'BBQ Grill',
    productionMinutes: 30,
    sellPrice: 54,
    level: 18,
    emoji: '🌶️',
    ingredients: [
      { itemId: 'chiliPepper', name: 'Chili Pepper', quantity: 5 },
    ],
  },
  {
    id: 'barbecueSauce',
    name: 'Barbecue Sauce',
    machineId: 'bbqGrill',
    machineName: 'BBQ Grill',
    productionMinutes: 25,
    sellPrice: 45,
    level: 25,
    emoji: '🥫',
    ingredients: [
      { itemId: 'corn', name: 'Corn', quantity: 3 },
      { itemId: 'tomatoes', name: 'Tomatoes', quantity: 3 },
    ],
  },
  {
    id: 'pumpkinPieBbq',
    name: 'Pumpkin Pie',
    machineId: 'bbqGrill',
    machineName: 'BBQ Grill',
    productionMinutes: 60,
    sellPrice: 81,
    level: 23,
    emoji: '🥧',
    ingredients: [
      { itemId: 'pumpkin', name: 'Pumpkin', quantity: 3 },
      { itemId: 'sugar', name: 'Sugar', quantity: 2, isProduct: true },
    ],
  },

  // ── Pie Oven ──────────────────────────────────────────────────────────────
  {
    id: 'blueberryPie',
    name: 'Blueberry Pie',
    machineId: 'pieOven',
    machineName: 'Pie Oven',
    productionMinutes: 60,
    sellPrice: 81,
    level: 30,
    emoji: '🫐',
    ingredients: [
      { itemId: 'blueberries', name: 'Blueberries', quantity: 3 },
      { itemId: 'sugar', name: 'Sugar', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'applePie',
    name: 'Apple Pie',
    machineId: 'pieOven',
    machineName: 'Pie Oven',
    productionMinutes: 90,
    sellPrice: 108,
    level: 36,
    emoji: '🍎',
    ingredients: [
      { itemId: 'apple', name: 'Apple', quantity: 5 },
      { itemId: 'sugar', name: 'Sugar', quantity: 3, isProduct: true },
      { itemId: 'butter', name: 'Butter', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'pumpkinPieOven',
    name: 'Pumpkin Pie',
    machineId: 'pieOven',
    machineName: 'Pie Oven',
    productionMinutes: 60,
    sellPrice: 78,
    level: 28,
    emoji: '🎃',
    ingredients: [
      { itemId: 'pumpkin', name: 'Pumpkin', quantity: 4 },
      { itemId: 'sugar', name: 'Sugar', quantity: 3, isProduct: true },
    ],
  },
  {
    id: 'cherryPie',
    name: 'Cherry Pie',
    machineId: 'pieOven',
    machineName: 'Pie Oven',
    productionMinutes: 90,
    sellPrice: 102,
    level: 38,
    emoji: '🍒',
    ingredients: [
      { itemId: 'cherry', name: 'Cherry', quantity: 4 },
      { itemId: 'sugar', name: 'Sugar', quantity: 2, isProduct: true },
      { itemId: 'butter', name: 'Butter', quantity: 2, isProduct: true },
    ],
  },

  // ── Juicer ────────────────────────────────────────────────────────────────
  {
    id: 'tomatoJuice',
    name: 'Tomato Juice',
    machineId: 'juicer',
    machineName: 'Juicer',
    productionMinutes: 15,
    sellPrice: 27,
    level: 16,
    emoji: '🍅',
    ingredients: [
      { itemId: 'tomatoes', name: 'Tomatoes', quantity: 3 },
    ],
  },
  {
    id: 'carrotJuice',
    name: 'Carrot Juice',
    machineId: 'juicer',
    machineName: 'Juicer',
    productionMinutes: 20,
    sellPrice: 30,
    level: 17,
    emoji: '🥕',
    ingredients: [
      { itemId: 'carrots', name: 'Carrots', quantity: 3 },
    ],
  },
  {
    id: 'raspberrySmoothie',
    name: 'Raspberry Smoothie',
    machineId: 'juicer',
    machineName: 'Juicer',
    productionMinutes: 30,
    sellPrice: 62,
    level: 24,
    emoji: '🍓',
    ingredients: [
      { itemId: 'raspberries', name: 'Raspberries', quantity: 4 },
      { itemId: 'cream', name: 'Cream', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'blueberrySmoothie',
    name: 'Blueberry Smoothie',
    machineId: 'juicer',
    machineName: 'Juicer',
    productionMinutes: 30,
    sellPrice: 65,
    level: 26,
    emoji: '🫐',
    ingredients: [
      { itemId: 'blueberries', name: 'Blueberries', quantity: 4 },
      { itemId: 'cream', name: 'Cream', quantity: 2, isProduct: true },
    ],
  },

  // ── Popcorn Pot ───────────────────────────────────────────────────────────
  {
    id: 'popcorn',
    name: 'Popcorn',
    machineId: 'popcornPot',
    machineName: 'Popcorn Pot',
    productionMinutes: 10,
    sellPrice: 22,
    level: 19,
    emoji: '🍿',
    ingredients: [
      { itemId: 'corn', name: 'Corn', quantity: 3 },
    ],
  },
  {
    id: 'caramelPopcorn',
    name: 'Caramel Popcorn',
    machineId: 'popcornPot',
    machineName: 'Popcorn Pot',
    productionMinutes: 30,
    sellPrice: 52,
    level: 26,
    emoji: '🍿',
    ingredients: [
      { itemId: 'corn', name: 'Corn', quantity: 4 },
      { itemId: 'sugar', name: 'Sugar', quantity: 3, isProduct: true },
    ],
  },

  // ── Ice Cream Machine ─────────────────────────────────────────────────────
  {
    id: 'vanillaIceCream',
    name: 'Vanilla Ice Cream',
    machineId: 'iceCreamMachine',
    machineName: 'Ice Cream Machine',
    productionMinutes: 60,
    sellPrice: 75,
    level: 24,
    emoji: '🍦',
    ingredients: [
      { itemId: 'cream', name: 'Cream', quantity: 3, isProduct: true },
      { itemId: 'sugar', name: 'Sugar', quantity: 2, isProduct: true },
    ],
  },
  {
    id: 'blueberryIceCream',
    name: 'Blueberry Ice Cream',
    machineId: 'iceCreamMachine',
    machineName: 'Ice Cream Machine',
    productionMinutes: 90,
    sellPrice: 94,
    level: 30,
    emoji: '🍨',
    ingredients: [
      { itemId: 'cream', name: 'Cream', quantity: 2, isProduct: true },
      { itemId: 'blueberries', name: 'Blueberries', quantity: 3 },
    ],
  },
  {
    id: 'strawberryIceCream',
    name: 'Strawberry Ice Cream',
    machineId: 'iceCreamMachine',
    machineName: 'Ice Cream Machine',
    productionMinutes: 120,
    sellPrice: 115,
    level: 35,
    emoji: '🍓',
    ingredients: [
      { itemId: 'cream', name: 'Cream', quantity: 3, isProduct: true },
      { itemId: 'raspberries', name: 'Raspberries', quantity: 4 },
    ],
  },
];
