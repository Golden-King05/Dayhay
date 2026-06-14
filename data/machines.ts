export interface Machine {
  id: string;
  name: string;
  emoji: string;
  level: number;
  backgroundColor: string;
}

export const machines: Machine[] = [
  {
    id: 'feedMill',
    name: 'Feed Mill',
    emoji: '🌾',
    level: 1,
    backgroundColor: '#E8D5A3',
  },
  {
    id: 'dairy',
    name: 'Dairy',
    emoji: '🥛',
    level: 7,
    backgroundColor: '#D6EAF8',
  },
  {
    id: 'sugarMill',
    name: 'Sugar Mill',
    emoji: '🍬',
    level: 5,
    backgroundColor: '#FADBD8',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    emoji: '🍞',
    level: 2,
    backgroundColor: '#FDEBD0',
  },
  {
    id: 'sewingMachine',
    name: 'Sewing Machine',
    emoji: '🧵',
    level: 13,
    backgroundColor: '#E8DAEF',
  },
  {
    id: 'bbqGrill',
    name: 'BBQ Grill',
    emoji: '🔥',
    level: 3,
    backgroundColor: '#FDEDEC',
  },
  {
    id: 'pieOven',
    name: 'Pie Oven',
    emoji: '🥧',
    level: 14,
    backgroundColor: '#FEF9E7',
  },
  {
    id: 'juicer',
    name: 'Juicer',
    emoji: '🥤',
    level: 16,
    backgroundColor: '#E8F8F5',
  },
  {
    id: 'popcornPot',
    name: 'Popcorn Pot',
    emoji: '🍿',
    level: 19,
    backgroundColor: '#FFF3CD',
  },
  {
    id: 'iceCreamMachine',
    name: 'Ice Cream Machine',
    emoji: '🍦',
    level: 24,
    backgroundColor: '#FCE4EC',
  },
];

export function getMachineById(id: string): Machine | undefined {
  return machines.find((m) => m.id === id);
}
