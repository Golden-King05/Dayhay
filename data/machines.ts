export interface Machine {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  levelRequired: number;
  description: string;
}

export const machines: Machine[] = [
  {
    id: 'feed_mill',
    name: 'Feed Mill',
    icon: 'feed-mill',
    emoji: '🏭',
    levelRequired: 1,
    description: 'Produces animal feed from crops',
  },
  {
    id: 'dairy',
    name: 'Dairy',
    icon: 'dairy',
    emoji: '🥛',
    levelRequired: 7,
    description: 'Processes milk into dairy products',
  },
  {
    id: 'sugar_mill',
    name: 'Sugar Mill',
    icon: 'sugar-mill',
    emoji: '🍬',
    levelRequired: 5,
    description: 'Converts sugarcane into sugar',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    icon: 'bakery',
    emoji: '🍞',
    levelRequired: 2,
    description: 'Bakes bread and cakes',
  },
  {
    id: 'sewing_machine',
    name: 'Sewing Machine',
    icon: 'sewing-machine',
    emoji: '🧵',
    levelRequired: 13,
    description: 'Crafts clothing and fabric',
  },
  {
    id: 'bbq_grill',
    name: 'BBQ Grill',
    icon: 'bbq-grill',
    emoji: '🔥',
    levelRequired: 1,
    description: 'Grills vegetables and makes sauces',
  },
  {
    id: 'pie_oven',
    name: 'Pie Oven',
    icon: 'pie-oven',
    emoji: '🥧',
    levelRequired: 30,
    description: 'Bakes delicious pies',
  },
  {
    id: 'juice_press',
    name: 'Juice Press',
    icon: 'juice-press',
    emoji: '🧃',
    levelRequired: 14,
    description: 'Presses fruits into juice',
  },
  {
    id: 'ice_cream_maker',
    name: 'Ice Cream Maker',
    icon: 'ice-cream-maker',
    emoji: '🍦',
    levelRequired: 28,
    description: 'Makes frozen treats',
  },
  {
    id: 'jam_maker',
    name: 'Jam Maker',
    icon: 'jam-maker',
    emoji: '🫙',
    levelRequired: 18,
    description: 'Turns fruit into jam',
  },
  {
    id: 'popcorn_pot',
    name: 'Popcorn Pot',
    icon: 'popcorn-pot',
    emoji: '🍿',
    levelRequired: 3,
    description: 'Pops corn into popcorn',
  },
  {
    id: 'coffee_kiosk',
    name: 'Coffee Kiosk',
    icon: 'coffee-kiosk',
    emoji: '☕',
    levelRequired: 0,
    description: 'Brews coffee drinks',
  },
];
