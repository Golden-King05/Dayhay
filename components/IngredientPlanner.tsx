import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { getAllSellableItems, SellableItem } from '../utils/allItems';
import { products } from '../data/products';
import { formatTime } from '../utils/optimizer';

interface StockEntry {
  item: SellableItem;
  quantity: number;
}

interface IngMatch {
  itemId: string;
  itemName: string;
  icon: string;
  needed: number;
  have: number;
  covered: boolean;
}

interface RecipeMatch {
  productId: string;
  name: string;
  icon: string;
  machineEmoji: string;
  sellPrice: number;
  productionMinutes: number;
  coinsPerHour: number;
  coveredCount: number;
  totalCount: number;
  ingredients: IngMatch[];
}

type PlannerSort = 'sellPrice' | 'coinsPerHour';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function IngredientPlanner({ visible, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingItem, setPendingItem] = useState<SellableItem | null>(null);
  const [pendingQty, setPendingQty] = useState(1);
  const [stock, setStock] = useState<StockEntry[]>([]);
  const [sortMode, setSortMode] = useState<PlannerSort>('sellPrice');

  const allItems = getAllSellableItems();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || pendingItem) return [];
    const q = searchQuery.toLowerCase();
    return allItems.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery, pendingItem]);

  const stockMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of stock) m.set(e.item.id, e.quantity);
    return m;
  }, [stock]);

  const matches = useMemo((): RecipeMatch[] => {
    if (stock.length === 0) return [];

    return products
      .flatMap((p) => {
        const ingredients: IngMatch[] = p.ingredients.map((ing) => ({
          itemId: ing.itemId,
          itemName: ing.itemName,
          icon: ing.icon,
          needed: ing.quantity,
          have: stockMap.get(ing.itemId) ?? 0,
          covered: (stockMap.get(ing.itemId) ?? 0) >= ing.quantity,
        }));

        const usesAny = ingredients.some((i) => i.have > 0);
        if (!usesAny) return [];

        const coveredCount = ingredients.filter((i) => i.covered).length;
        const coinsPerHour = p.productionMinutes > 0
          ? Math.round((p.sellPrice / p.productionMinutes) * 60 * 10) / 10
          : 0;
        return [{
          productId: p.id,
          name: p.name,
          icon: p.icon,
          machineEmoji: p.machineEmoji,
          sellPrice: p.sellPrice,
          productionMinutes: p.productionMinutes,
          coinsPerHour,
          coveredCount,
          totalCount: ingredients.length,
          ingredients,
        }];
      })
      .sort((a, b) =>
        sortMode === 'coinsPerHour'
          ? b.coinsPerHour - a.coinsPerHour
          : b.sellPrice - a.sellPrice
      );
  }, [stockMap, sortMode]);

  const canMake = matches.filter((m) => m.coveredCount === m.totalCount);
  const partial = matches.filter((m) => m.coveredCount < m.totalCount);

  function selectItem(item: SellableItem) {
    setPendingItem(item);
    setSearchQuery(item.name);
    setPendingQty(1);
  }

  function addToStock() {
    if (!pendingItem) return;
    setStock((prev) => {
      const existing = prev.find((e) => e.item.id === pendingItem.id);
      if (existing) {
        return prev.map((e) =>
          e.item.id === pendingItem.id ? { ...e, quantity: e.quantity + pendingQty } : e
        );
      }
      return [...prev, { item: pendingItem, quantity: pendingQty }];
    });
    setPendingItem(null);
    setSearchQuery('');
    setPendingQty(1);
  }

  function removeStock(itemId: string) {
    setStock((prev) => prev.filter((e) => e.item.id !== itemId));
  }

  function updateStock(itemId: string, delta: number) {
    setStock((prev) =>
      prev.map((e) =>
        e.item.id === itemId ? { ...e, quantity: Math.max(1, e.quantity + delta) } : e
      )
    );
  }

  function handleClose() {
    setPendingItem(null);
    setSearchQuery('');
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>🧺 Use My Ingredients</Text>
              <TouchableOpacity onPress={handleClose} style={styles.doneBtn}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSub}>
              Add what you have on hand — see which recipes you can make or almost make.
            </Text>
          </View>

          {/* Add ingredient */}
          <View style={styles.addSection}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search ingredients to add..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={(t) => { setSearchQuery(t); if (!t) setPendingItem(null); }}
              returnKeyType="search"
            />

            {searchResults.length > 0 && (
              <View style={styles.dropdown}>
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => selectItem(item)}
                  >
                    <Text style={styles.dropdownIcon}>{item.icon}</Text>
                    <Text style={styles.dropdownName}>{item.name}</Text>
                    <Text style={styles.dropdownPrice}>{item.sellPrice}c each</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {pendingItem && (
              <View style={styles.addRow}>
                <Text style={styles.pendingIcon}>{pendingItem.icon}</Text>
                <Text style={styles.pendingName} numberOfLines={1}>{pendingItem.name}</Text>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setPendingQty((q) => Math.max(1, q - 1))}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{pendingQty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setPendingQty((q) => q + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={addToStock}>
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Stock list */}
          {stock.length > 0 && (
            <View style={styles.stockSection}>
              <Text style={styles.sectionLabel}>YOUR STOCK</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stockScroll}>
                {stock.map((e) => (
                  <View key={e.item.id} style={styles.stockChip}>
                    <Text style={styles.stockChipIcon}>{e.item.icon}</Text>
                    <View style={styles.stockChipQtyRow}>
                      <TouchableOpacity onPress={() => updateStock(e.item.id, -1)}>
                        <Text style={styles.chipQtyBtn}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.stockChipQty}>{e.quantity}</Text>
                      <TouchableOpacity onPress={() => updateStock(e.item.id, 1)}>
                        <Text style={styles.chipQtyBtn}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.stockChipName} numberOfLines={1}>{e.item.name}</Text>
                    <TouchableOpacity onPress={() => removeStock(e.item.id)} style={styles.removeBtn}>
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Results */}
          <ScrollView
            style={styles.results}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {stock.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🧺</Text>
                <Text style={styles.emptyTitle}>Add ingredients above</Text>
                <Text style={styles.emptySubtitle}>
                  Search for items like "Bread" or "Egg", set how many you have, and see what you can make.
                </Text>
              </View>
            )}

            {matches.length > 0 && (
              <View style={styles.sortToggleRow}>
                <Text style={styles.sortToggleLabel}>Sort by:</Text>
                <TouchableOpacity
                  style={[styles.sortToggleBtn, sortMode === 'sellPrice' && styles.sortToggleBtnActive]}
                  onPress={() => setSortMode('sellPrice')}
                >
                  <Text style={[styles.sortToggleBtnText, sortMode === 'sellPrice' && styles.sortToggleBtnTextActive]}>
                    🪙 Sell Price
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortToggleBtn, sortMode === 'coinsPerHour' && styles.sortToggleBtnActive]}
                  onPress={() => setSortMode('coinsPerHour')}
                >
                  <Text style={[styles.sortToggleBtnText, sortMode === 'coinsPerHour' && styles.sortToggleBtnTextActive]}>
                    ⚡ Coins/Hr
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {canMake.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>✅ CAN MAKE NOW</Text>
                {canMake.map((m) => <RecipeRow key={m.productId} match={m} sortMode={sortMode} />)}
              </>
            )}

            {partial.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, canMake.length > 0 && { marginTop: 16 }]}>
                  🟡 USES YOUR ITEMS
                </Text>
                {partial.map((m) => <RecipeRow key={m.productId} match={m} sortMode={sortMode} />)}
              </>
            )}

            {stock.length > 0 && matches.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🤷</Text>
                <Text style={styles.emptyTitle}>No recipes use these</Text>
                <Text style={styles.emptySubtitle}>
                  None of the items in your stock are used as ingredients in any recipe.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function RecipeRow({ match, sortMode }: { match: RecipeMatch; sortMode: PlannerSort }) {
  const allCovered = match.coveredCount === match.totalCount;
  return (
    <View style={[recipeStyles.card, allCovered && recipeStyles.cardGreen]}>
      <View style={recipeStyles.top}>
        <Text style={recipeStyles.icon}>{match.icon}</Text>
        <View style={recipeStyles.info}>
          <Text style={recipeStyles.name}>{match.name}</Text>
          <Text style={recipeStyles.meta}>
            {match.machineEmoji} · ⏱ {formatTime(match.productionMinutes)}
            {sortMode === 'coinsPerHour'
              ? ` · ⚡ ${match.coinsPerHour} c/hr`
              : ` · 🪙 ${match.sellPrice}c`}
          </Text>
        </View>
        <View style={[recipeStyles.badge, allCovered ? recipeStyles.badgeGreen : recipeStyles.badgeAmber]}>
          <Text style={[recipeStyles.badgeText, allCovered ? recipeStyles.badgeTextGreen : recipeStyles.badgeTextAmber]}>
            {match.coveredCount}/{match.totalCount}
          </Text>
        </View>
      </View>
      <View style={recipeStyles.ings}>
        {match.ingredients.map((ing) => (
          <Text
            key={ing.itemId}
            style={[recipeStyles.ing, ing.covered ? recipeStyles.ingCovered : recipeStyles.ingMissing]}
          >
            {ing.covered ? '✅' : '❌'} {ing.needed}× {ing.itemName}
            {!ing.covered && ing.have > 0 ? ` (have ${ing.have})` : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  doneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '18',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  addSection: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  dropdownIcon: { fontSize: 16 },
  dropdownName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  dropdownPrice: {
    fontSize: 12,
    color: Colors.textLight,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  pendingIcon: { fontSize: 20 },
  pendingName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 30,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  stockSection: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 6,
    marginTop: 4,
  },
  stockScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  stockChip: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary + '60',
    padding: 8,
    minWidth: 70,
  },
  stockChipIcon: { fontSize: 22, marginBottom: 2 },
  stockChipQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipQtyBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    paddingHorizontal: 2,
  },
  stockChipQty: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    minWidth: 18,
    textAlign: 'center',
  },
  stockChipName: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
    maxWidth: 68,
    textAlign: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 4,
  },
  removeBtnText: {
    fontSize: 10,
    color: Colors.textLight,
    fontWeight: '700',
  },
  results: { flex: 1 },
  resultsContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  sortToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  sortToggleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textLight,
    marginRight: 2,
  },
  sortToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  sortToggleBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '18',
  },
  sortToggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  sortToggleBtnTextActive: {
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

const recipeStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardGreen: {
    borderColor: '#2E7D3240',
    backgroundColor: '#2E7D3208',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: { fontSize: 26 },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  meta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeGreen: { backgroundColor: '#2E7D3218' },
  badgeAmber: { backgroundColor: '#F57C0018' },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  badgeTextGreen: { color: '#2E7D32' },
  badgeTextAmber: { color: '#F57C00' },
  ings: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 3,
  },
  ing: {
    fontSize: 12,
    fontWeight: '500',
  },
  ingCovered: { color: '#2E7D32' },
  ingMissing: { color: Colors.textSecondary },
});
