import { Product } from '../data/products';

export type SortKey = 'coinsPerHour' | 'sellPrice' | 'productionMinutes' | 'levelRequired';
export type SortOrder = 'asc' | 'desc';

export function sortProducts(
  products: Product[],
  sortKey: SortKey,
  sortOrder: SortOrder = 'desc'
): Product[] {
  return [...products].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
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
