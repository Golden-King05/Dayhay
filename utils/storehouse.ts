import { products } from '../data/products';
import { calcChainMinutes } from './efficiency';
import { FISH_CHAIN_MINUTES } from '../data/fishing';

export type StoreMode = 'demand' | 'risk';

export interface StockItem {
  itemId: string;
  name: string;
  icon: string;
  chainMinutes: number;
  recipeCount: number;
  totalQtyNeeded: number;
  riskScore: number;
  priority: 'must' | 'high' | 'normal' | 'low';
}

function getPriority(chainMinutes: number, recipeCount: number): StockItem['priority'] {
  const veryLongChain = chainMinutes >= 240;
  const longChain = chainMinutes >= 120;
  const highDemand = recipeCount >= 5;
  const medDemand = recipeCount >= 2;

  if (veryLongChain && medDemand) return 'must';
  if (longChain && highDemand) return 'must';
  if (longChain || highDemand) return 'high';
  if (medDemand) return 'normal';
  return 'low';
}

export function getStockItems(fishMinutes = FISH_CHAIN_MINUTES): StockItem[] {
  const usageMap = new Map<string, { name: string; icon: string; count: number; qty: number }>();

  for (const product of products) {
    for (const ing of product.ingredients) {
      const existing = usageMap.get(ing.itemId);
      if (existing) {
        existing.count += 1;
        existing.qty += ing.quantity;
      } else {
        usageMap.set(ing.itemId, { name: ing.itemName, icon: ing.icon, count: 1, qty: ing.quantity });
      }
    }
  }

  return Array.from(usageMap.entries()).map(([itemId, u]) => {
    const chainMinutes = calcChainMinutes(itemId, new Set(), fishMinutes);
    return {
      itemId,
      name: u.name,
      icon: u.icon,
      chainMinutes,
      recipeCount: u.count,
      totalQtyNeeded: u.qty,
      riskScore: chainMinutes * u.count,
      priority: getPriority(chainMinutes, u.count),
    };
  });
}

export function sortStockItems(items: StockItem[], mode: StoreMode): StockItem[] {
  return [...items].sort((a, b) =>
    mode === 'demand'
      ? b.recipeCount - a.recipeCount || b.totalQtyNeeded - a.totalQtyNeeded
      : b.riskScore - a.riskScore
  );
}
