import { products as rawProducts, Product } from '../data/products';
import { calcChainMinutes, calcChainCPH, calcCraftingValue } from './efficiency';
import { FISH_CHAIN_MINUTES } from '../data/fishing';

function enrichProducts(fishMinutes: number): Product[] {
  return rawProducts.map((p) => {
    const effectivePrice = p.sellPrice * p.quantityPerRun;
    const chain = calcChainMinutes(p.id, new Set(), fishMinutes);
    const chainCPH = calcChainCPH(effectivePrice, chain);
    const efficiency: 'high' | 'medium' | 'low' =
      chainCPH >= 60 ? 'high' : chainCPH >= 25 ? 'medium' : 'low';
    const { craftingProfit } = calcCraftingValue(p);
    return { ...p, coinsPerHour: chainCPH, efficiency, craftingProfit };
  });
}

// Products with coinsPerHour set to full chain CPH (includes ingredient grow times)
export const products: Product[] = enrichProducts(FISH_CHAIN_MINUTES);

/** Re-compute products with a custom fish timing (0 = pre-stocked, FISH_CHAIN_MINUTES = lure). */
export function getEnrichedProducts(fishMinutes: number): Product[] {
  return enrichProducts(fishMinutes);
}

export type SortKey = 'coinsPerHour' | 'sellPrice' | 'productionMinutes' | 'levelRequired' | 'craftingProfit';
export type SortOrder = 'asc' | 'desc';

export function sortProducts(
  products: Product[],
  sortKey: SortKey,
  sortOrder: SortOrder = 'desc'
): Product[] {
  return [...products].sort((a, b) => {
    const aVal = sortKey === 'craftingProfit' ? (a.craftingProfit ?? 0) : a[sortKey as keyof Product] as number;
    const bVal = sortKey === 'craftingProfit' ? (b.craftingProfit ?? 0) : b[sortKey as keyof Product] as number;
    if (sortOrder === 'desc') return bVal - aVal;
    return aVal - bVal;
  });
}

export function filterByMachine(products: Product[], machineId: string | null): Product[] {
  if (!machineId || machineId === 'all') return products;
  return products.filter((p) => p.machineId === machineId);
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.machineName.toLowerCase().includes(q) ||
      p.ingredients.some((i) => i.itemName.toLowerCase().includes(q))
  );
}

export function getTopProducts(products: Product[], limit: number = 5): Product[] {
  return sortProducts(products, 'coinsPerHour', 'desc').slice(0, limit);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getEfficiencyColor(efficiency: 'high' | 'medium' | 'low'): string {
  switch (efficiency) {
    case 'high': return '#2E7D32';
    case 'medium': return '#F57C00';
    case 'low': return '#C62828';
  }
}
