import { crops } from '../data/crops';
import { animals } from '../data/animals';
import { trees } from '../data/trees';
import { products as rawProducts } from '../data/products';
import { ores } from '../data/ores';
import { FISH_SELL_PRICE } from '../data/fishing';

export interface SellableItem {
  id: string;
  name: string;
  icon: string;
  sellPrice: number; // per single item
  category: 'crop' | 'animal' | 'tree' | 'product' | 'fish' | 'ore';
}

let _cache: SellableItem[] | null = null;

export function getAllSellableItems(): SellableItem[] {
  if (_cache) return _cache;

  const items: SellableItem[] = [];

  for (const c of crops) {
    items.push({ id: c.id, name: c.name, icon: c.icon, sellPrice: c.sellPrice, category: 'crop' });
  }
  for (const a of animals) {
    if (a.sellPrice > 0) {
      items.push({ id: a.id, name: a.name, icon: a.icon, sellPrice: a.sellPrice, category: 'animal' });
    }
  }
  for (const t of trees) {
    items.push({ id: t.id, name: t.name, icon: t.icon, sellPrice: t.sellPrice, category: 'tree' });
  }
  for (const p of rawProducts) {
    items.push({ id: p.id, name: p.name, icon: p.icon, sellPrice: p.sellPrice, category: 'product' });
  }
  items.push({ id: 'fish', name: 'Fish', icon: '🐟', sellPrice: FISH_SELL_PRICE, category: 'fish' });
  for (const o of ores) {
    items.push({ id: o.id, name: o.name, icon: o.icon, sellPrice: o.sellPrice, category: 'ore' });
  }

  _cache = items.sort((a, b) => a.name.localeCompare(b.name));
  return _cache;
}

export function findItem(id: string): SellableItem | undefined {
  return getAllSellableItems().find((i) => i.id === id);
}
