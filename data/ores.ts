export interface Ore {
  id: string;
  name: string;
  icon: string;
  sellPrice: number;
  levelRequired: number;
}

export const ores: Ore[] = [
  { id: 'coal',         name: 'Coal',         icon: '⚫', sellPrice: 10, levelRequired: 0 },
  { id: 'iron_ore',     name: 'Iron Ore',     icon: '🪨', sellPrice: 14, levelRequired: 0 },
  { id: 'silver_ore',   name: 'Silver Ore',   icon: '🩶', sellPrice: 18, levelRequired: 0 },
  { id: 'gold_ore',     name: 'Gold Ore',     icon: '🪙', sellPrice: 21, levelRequired: 0 },
  { id: 'platinum_ore', name: 'Platinum Ore', icon: '💿', sellPrice: 32, levelRequired: 0 },
];
