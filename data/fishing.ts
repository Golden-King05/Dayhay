export interface FishingMethod {
  id: string;
  name: string;
  icon: string;
  craftMinutes: number;     // time to make the lure/net
  cooldownMinutes: number;  // wait time after use before spot is ready again
  fishPerUse: number;       // how many fish caught per use
  effectiveMinutesPerFish: number; // (craftMinutes + cooldownMinutes) / fishPerUse
  sellPrice: number;        // sell price of one fish
}

export const FISH_SELL_PRICE = 54;

export const fishingMethods: FishingMethod[] = [
  {
    id: 'lure',
    name: 'Red Lure',
    icon: '🎣',
    craftMinutes: 85,        // 1h 25m to craft
    cooldownMinutes: 150,    // 2.5h cooldown per fishing spot after use
    fishPerUse: 1,
    effectiveMinutesPerFish: 85 + 150, // 235 min per fish
    sellPrice: FISH_SELL_PRICE,
  },
  {
    id: 'net',
    name: 'Fishing Net',
    icon: '🪤',
    craftMinutes: 228,       // 3h 48m to craft/deploy
    cooldownMinutes: 1440,   // 24h placeholder — actual time unknown
    fishPerUse: 3,
    effectiveMinutesPerFish: Math.round((228 + 1440) / 3), // 556 min per fish (placeholder)
    sellPrice: FISH_SELL_PRICE,
  },
];

// Lure is used as the default chain time since net cooldown is a placeholder
export const FISH_CHAIN_MINUTES = fishingMethods[0].effectiveMinutesPerFish; // 235
