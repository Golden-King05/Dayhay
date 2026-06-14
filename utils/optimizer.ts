import { Product } from '../data/products';

export interface ProductWithStats extends Product {
  coinsPerHour: number;
  efficiency: 'high' | 'medium' | 'low';
}

export function calculateCoinsPerHour(product: Product): number {
  return Math.round((product.sellPrice / product.productionMinutes) * 60);
}

export function getEfficiency(coinsPerHour: number): 'high' | 'medium' | 'low' {
  if (coinsPerHour >= 60) return 'high';
  if (coinsPerHour >= 30) return 'medium';
  return 'low';
}

export function enrichProducts(products: Product[]): ProductWithStats[] {
  return products.map((p) => {
    const coinsPerHour = calculateCoinsPerHour(p);
    return {
      ...p,
      coinsPerHour,
      efficiency: getEfficiency(coinsPerHour),
    };
  });
}

export type SortBy = 'coinsPerHour' | 'sellPrice' | 'productionMinutes' | 'level';

export function sortProducts(
  products: ProductWithStats[],
  sortBy: SortBy,
): ProductWithStats[] {
  return [...products].sort((a, b) => {
    if (sortBy === 'coinsPerHour') return b.coinsPerHour - a.coinsPerHour;
    if (sortBy === 'sellPrice') return b.sellPrice - a.sellPrice;
    if (sortBy === 'productionMinutes') return a.productionMinutes - b.productionMinutes;
    if (sortBy === 'level') return a.level - b.level;
    return 0;
  });
}

export function filterByMachine(
  products: ProductWithStats[],
  machineId: string | null,
): ProductWithStats[] {
  if (!machineId) return products;
  return products.filter((p) => p.machineId === machineId);
}

export function filterBySearch(
  products: ProductWithStats[],
  query: string,
): ProductWithStats[] {
  if (!query.trim()) return products;
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.machineName.toLowerCase().includes(lower),
  );
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
