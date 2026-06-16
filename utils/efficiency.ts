import { crops } from '../data/crops';
import { products } from '../data/products';
import { trees } from '../data/trees';
import { animals } from '../data/animals';
import { FISH_CHAIN_MINUTES, FISH_SELL_PRICE } from '../data/fishing';

const cropMap = new Map(crops.map((c) => [c.id, c]));
const productMap = new Map(products.map((p) => [p.id, p]));
const treeMap = new Map(trees.map((t) => [t.id, t]));
const animalMap = new Map(animals.map((a) => [a.id, a]));

/**
 * Critical-path minutes to produce an item from scratch.
 *
 * Uses max() over ingredients rather than sum() because different ingredients
 * can be grown/made in parallel on separate fields and machines.
 *
 * Animal products (milk, wool, eggs, etc.) are not in the data files and are
 * assumed always available, so they contribute 0 to the chain.
 */
export function calcChainMinutes(
  itemId: string,
  _visited = new Set<string>(),
  fishMinutes = FISH_CHAIN_MINUTES
): number {
  if (_visited.has(itemId)) return 0; // cycle guard
  _visited.add(itemId);

  const crop = cropMap.get(itemId);
  if (crop) return crop.growTimeMinutes;

  const tree = treeMap.get(itemId);
  if (tree) return tree.cycleMinutes;

  const animal = animalMap.get(itemId);
  if (animal) {
    const feedChain = calcChainMinutes(animal.feedId, new Set(_visited), fishMinutes);
    return feedChain + animal.productionMinutes;
  }

  if (itemId === 'fish') return fishMinutes;
  if (itemId === 'nectar_bush') return 0; // environmental — bees collect passively

  const product = productMap.get(itemId);
  if (!product) return 0;

  const maxIngredientChain = product.ingredients.reduce((max, ing) => {
    return Math.max(max, calcChainMinutes(ing.itemId, new Set(_visited), fishMinutes));
  }, 0);

  return product.productionMinutes + maxIngredientChain;
}

export function calcSimpleCPH(sellPrice: number, productionMinutes: number): number {
  return Math.round((sellPrice / productionMinutes) * 60 * 10) / 10;
}

export function calcChainCPH(sellPrice: number, chainMinutes: number): number {
  if (chainMinutes === 0) return 0;
  return Math.round((sellPrice / chainMinutes) * 60 * 10) / 10;
}

// ── Chain breakdown ───────────────────────────────────────────────────────────

export interface ChainBreakdownItem {
  itemId: string;
  name: string;
  icon: string;
  quantity: number;
  depth: number;
  ownMinutes: number;    // just this item's grow/production time
  chainMinutes: number;  // full critical-path time from scratch
  isCriticalPath: boolean; // longest chain among siblings at this level
}

/**
 * Returns a flat, depth-annotated list of every item in the production chain,
 * ordered depth-first (item → its ingredients → their ingredients → ...).
 *
 * quantity is multiplied through so you see total amounts needed.
 */
export function getChainBreakdown(
  itemId: string,
  quantity = 1,
  depth = 0,
  _parentCycle = new Set<string>(),
  fishMinutes = FISH_CHAIN_MINUTES
): ChainBreakdownItem[] {
  const results: ChainBreakdownItem[] = [];

  const crop = cropMap.get(itemId);
  if (crop) {
    results.push({
      itemId,
      name: crop.name,
      icon: crop.icon,
      quantity,
      depth,
      ownMinutes: crop.growTimeMinutes,
      chainMinutes: crop.growTimeMinutes,
      isCriticalPath: false,
    });
    return results;
  }

  const tree = treeMap.get(itemId);
  if (tree) {
    results.push({
      itemId,
      name: tree.name,
      icon: tree.icon,
      quantity,
      depth,
      ownMinutes: tree.cycleMinutes,
      chainMinutes: tree.cycleMinutes,
      isCriticalPath: false,
    });
    return results;
  }

  if (itemId === 'fish') {
    results.push({
      itemId: 'fish',
      name: fishMinutes === 0 ? 'Fish (pre-stocked)' : 'Fish (lure)',
      icon: '🐟',
      quantity,
      depth,
      ownMinutes: fishMinutes,
      chainMinutes: fishMinutes,
      isCriticalPath: false,
    });
    return results;
  }

  if (itemId === 'nectar_bush') {
    results.push({
      itemId: 'nectar_bush',
      name: 'Nectar Bush (environmental)',
      icon: '🌸',
      quantity,
      depth,
      ownMinutes: 0,
      chainMinutes: 0,
      isCriticalPath: false,
    });
    return results;
  }

  const animal = animalMap.get(itemId);
  if (animal) {
    const feedChain = calcChainMinutes(animal.feedId, new Set(), fishMinutes);
    results.push({
      itemId,
      name: animal.name,
      icon: animal.icon,
      quantity,
      depth,
      ownMinutes: animal.productionMinutes,
      chainMinutes: feedChain + animal.productionMinutes,
      isCriticalPath: false,
    });
    // Show feed sub-chain
    if (!_parentCycle.has(animal.feedId)) {
      results.push(...getChainBreakdown(animal.feedId, quantity, depth + 1, new Set(_parentCycle), fishMinutes));
    }
    return results;
  }

  const product = productMap.get(itemId);
  if (!product) {
    // Unknown ingredient
    results.push({
      itemId,
      name: itemId.replace(/_/g, ' '),
      icon: '🐾',
      quantity,
      depth,
      ownMinutes: 0,
      chainMinutes: 0,
      isCriticalPath: false,
    });
    return results;
  }

  // Mark which ingredient is on the critical path (longest chain among siblings)
  const ingChainTimes = product.ingredients.map((ing) =>
    calcChainMinutes(ing.itemId, new Set(), fishMinutes)
  );
  const maxIngTime = Math.max(...ingChainTimes, 0);

  results.push({
    itemId,
    name: product.name,
    icon: product.icon,
    quantity,
    depth,
    ownMinutes: product.productionMinutes,
    chainMinutes: calcChainMinutes(itemId, new Set(), fishMinutes),
    isCriticalPath: false,
  });

  const cycle = new Set(_parentCycle);
  cycle.add(itemId);

  for (let i = 0; i < product.ingredients.length; i++) {
    const ing = product.ingredients[i];
    if (cycle.has(ing.itemId)) continue;

    const ingRows = getChainBreakdown(ing.itemId, ing.quantity * quantity, depth + 1, cycle, fishMinutes);
    // Mark top row of this ingredient branch if it is on the critical path
    if (ingRows.length > 0 && ingChainTimes[i] === maxIngTime) {
      ingRows[0] = { ...ingRows[0], isCriticalPath: true };
    }
    results.push(...ingRows);
  }

  return results;
}

// ── Opportunity cost ─────────────────────────────────────────────────────────

/** Sell price of a single unit of any item by ID. Returns 0 if unknown. */
export function getItemSellPrice(itemId: string): number {
  const crop = cropMap.get(itemId);
  if (crop) return crop.sellPrice;

  const tree = treeMap.get(itemId);
  if (tree) return tree.sellPrice;

  const animal = animalMap.get(itemId);
  if (animal) return animal.sellPrice;

  if (itemId === 'fish') return FISH_SELL_PRICE;

  const product = productMap.get(itemId);
  if (product) return product.sellPrice * product.quantityPerRun;

  return 0;
}

export interface CraftingValue {
  sellPrice: number;       // what the finished product sells for
  ingredientValue: number; // what you'd earn selling all direct ingredients raw
  craftingProfit: number;  // sellPrice - ingredientValue (positive = worth crafting)
  markupPercent: number;   // how much extra % you earn by crafting vs selling raw
}

/**
 * For each direct ingredient, totals up what you'd earn selling it raw instead.
 * If craftingProfit < 0, you lose money by crafting — better to sell ingredients.
 */
export function calcCraftingValue(product: { sellPrice: number; quantityPerRun: number; ingredients: { itemId: string; quantity: number }[] }): CraftingValue {
  const sellPrice = product.sellPrice * product.quantityPerRun;
  const ingredientValue = product.ingredients.reduce((total, ing) => {
    return total + getItemSellPrice(ing.itemId) * ing.quantity;
  }, 0);
  const craftingProfit = sellPrice - ingredientValue;
  const markupPercent = ingredientValue > 0
    ? Math.round((craftingProfit / ingredientValue) * 100)
    : 0;
  return { sellPrice, ingredientValue, craftingProfit, markupPercent };
}

// ── Ranked analysis ───────────────────────────────────────────────────────────

export interface RankedItem {
  itemId: string;
  name: string;
  icon: string;
  type: 'crop' | 'product';
  sellPrice: number;
  ownMinutes: number;
  chainMinutes: number;
  simpleCPH: number;
  chainCPH: number;
}

/** Returns all crops and products sorted by chain CPH descending. */
export function getRankedItems(): RankedItem[] {
  const items: RankedItem[] = [];

  for (const crop of crops) {
    items.push({
      itemId: crop.id,
      name: crop.name,
      icon: crop.icon,
      type: 'crop',
      sellPrice: crop.sellPrice,
      ownMinutes: crop.growTimeMinutes,
      chainMinutes: crop.growTimeMinutes,
      simpleCPH: calcSimpleCPH(crop.sellPrice, crop.growTimeMinutes),
      chainCPH: calcSimpleCPH(crop.sellPrice, crop.growTimeMinutes),
    });
  }

  for (const tree of trees) {
    if (tree.sellPrice === 0) continue; // skip until sell price is known
    const effectivePrice = tree.sellPrice * tree.quantityPerCycle;
    items.push({
      itemId: tree.id,
      name: `${tree.name} (${tree.plantName})`,
      icon: tree.icon,
      type: 'crop',
      sellPrice: effectivePrice,
      ownMinutes: tree.cycleMinutes,
      chainMinutes: tree.cycleMinutes,
      simpleCPH: calcSimpleCPH(effectivePrice, tree.cycleMinutes),
      chainCPH: calcSimpleCPH(effectivePrice, tree.cycleMinutes),
    });
  }

  for (const product of products) {
    const chain = calcChainMinutes(product.id);
    const effectivePrice = product.sellPrice * product.quantityPerRun;
    items.push({
      itemId: product.id,
      name: product.name,
      icon: product.icon,
      type: 'product',
      sellPrice: effectivePrice,
      ownMinutes: product.productionMinutes,
      chainMinutes: chain,
      simpleCPH: calcSimpleCPH(effectivePrice, product.productionMinutes),
      chainCPH: calcChainCPH(effectivePrice, chain),
    });
  }

  return items.sort((a, b) => b.chainCPH - a.chainCPH);
}
