import { products as rawProducts } from '../data/products';

const productMap = new Map(rawProducts.map((p) => [p.id, p]));

export interface RawNeed {
  itemId: string;
  name: string;
  icon: string;
  quantity: number;
}

export interface CraftNeed {
  itemId: string;
  name: string;
  icon: string;
  machineEmoji: string;
  machineName: string;
  productionMinutes: number;
  quantity: number;
}

function countCrafted(
  itemId: string,
  quantity: number,
  counts: Map<string, number>,
  depth = 0
) {
  if (depth > 12) return;
  const product = productMap.get(itemId);
  if (!product) return;
  for (const ing of product.ingredients) {
    const qty = ing.quantity * quantity;
    if (productMap.has(ing.itemId)) {
      counts.set(ing.itemId, (counts.get(ing.itemId) ?? 0) + qty);
      countCrafted(ing.itemId, qty, counts, depth + 1);
    }
  }
}

export function buildProductionPlan(
  productId: string,
  targetQty: number
): { rawNeeds: RawNeed[]; craftNeeds: CraftNeed[] } {
  const craftCounts = new Map<string, number>();
  countCrafted(productId, targetQty, craftCounts);

  const rawMap = new Map<string, RawNeed>();

  function addRaw(pid: string, qty: number) {
    const p = productMap.get(pid);
    if (!p) return;
    for (const ing of p.ingredients) {
      if (!productMap.has(ing.itemId)) {
        const ingQty = ing.quantity * qty;
        const existing = rawMap.get(ing.itemId);
        if (existing) {
          existing.quantity += ingQty;
        } else {
          rawMap.set(ing.itemId, {
            itemId: ing.itemId,
            name: ing.itemName,
            icon: ing.icon,
            quantity: ingQty,
          });
        }
      }
    }
  }

  addRaw(productId, targetQty);
  for (const [pid, qty] of craftCounts) addRaw(pid, qty);

  const craftNeeds: CraftNeed[] = [];
  for (const [pid, qty] of craftCounts) {
    const p = productMap.get(pid)!;
    craftNeeds.push({
      itemId: pid,
      name: p.name,
      icon: p.icon,
      machineEmoji: p.machineEmoji,
      machineName: p.machineName,
      productionMinutes: p.productionMinutes,
      quantity: qty,
    });
  }

  return {
    rawNeeds: [...rawMap.values()].sort((a, b) => b.quantity - a.quantity),
    craftNeeds: craftNeeds.sort((a, b) => b.quantity - a.quantity),
  };
}
