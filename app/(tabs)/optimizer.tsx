import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { crops } from '../../data/crops';
import { trees } from '../../data/trees';
import { ProductCard } from '../../components/ProductCard';
import { CropCard } from '../../components/CropCard';
import { TreeCard } from '../../components/TreeCard';
import { FilterBar } from '../../components/FilterBar';
import { getEnrichedProducts, sortProducts, filterByMachine, SortKey, OVERNIGHT_MIN_MINUTES } from '../../utils/optimizer';
import { useFishSetting } from '../../hooks/useFishSetting';
import { useBeeSetting } from '../../hooks/useBeeSetting';
import { useTreeSetting } from '../../hooks/useTreeSetting';
import { formatTime } from '../../utils/optimizer';
import { FISH_CHAIN_MINUTES } from '../../data/fishing';
import { MAX_BEE_NESTS } from '../../data/bees';

import { Product } from '../../data/products';
import { Tree } from '../../data/trees';
type ListItem =
  | { kind: 'product'; data: Product }
  | { kind: 'crop'; data: (typeof crops)[0] }
  | { kind: 'tree'; data: Tree };

export default function OptimizerScreen() {
  const [selectedSort, setSelectedSort] = useState<SortKey>('coinsPerHour');
  const [selectedMachine, setSelectedMachine] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { fishEnabled, fishMinutes, toggleFish } = useFishSetting();
  const { beeNests, setNests } = useBeeSetting();
  const { ownedTreeIds, toggleTree } = useTreeSetting();

  const isOvernight = selectedMachine === 'overnight';

  const rankedList = useMemo((): ListItem[] => {
    const products = getEnrichedProducts(fishMinutes, ownedTreeIds);
    const filteredProducts = filterByMachine(products, selectedMachine);
    const productItems: ListItem[] = sortProducts(filteredProducts, selectedSort, sortOrder)
      .map((p) => ({ kind: 'product', data: p }));

    // Only mix in crops/trees for 'all' and 'overnight'
    if (selectedMachine !== 'all' && !isOvernight) return productItems;

    const eligibleCrops = isOvernight
      ? crops.filter((c) => c.growTimeMinutes >= OVERNIGHT_MIN_MINUTES)
      : crops;

    const cropItems: ListItem[] = eligibleCrops.map((c) => ({ kind: 'crop', data: c }));
    const treeItems: ListItem[] = trees.map((t) => ({ kind: 'tree', data: t }));
    const all: ListItem[] = [...productItems, ...cropItems, ...treeItems];

    const dir = (a: number, b: number) => sortOrder === 'desc' ? b - a : a - b;

    const getVal = (item: ListItem): number => {
      if (item.kind === 'product') {
        if (selectedSort === 'coinsPerHour') return item.data.coinsPerHour;
        if (selectedSort === 'sellPrice') return item.data.sellPrice;
        if (selectedSort === 'perRunValue') return item.data.perRunValue ?? item.data.sellPrice;
        if (selectedSort === 'craftingProfit') return item.data.craftingProfit ?? 0;
        if (selectedSort === 'markupPercent') return item.data.markupPercent ?? 0;
        if (selectedSort === 'productionMinutes') return item.data.productionMinutes;
        return 0;
      }
      if (item.kind === 'tree') {
        if (selectedSort === 'coinsPerHour') return item.data.coinsPerHour;
        if (selectedSort === 'sellPrice') return item.data.sellPrice;
        if (selectedSort === 'perRunValue') return item.data.perCycleRevenue;
        if (selectedSort === 'productionMinutes') return item.data.cycleMinutes;
        return 0; // trees have no craftingProfit/markupPercent
      }
      // crop
      if (selectedSort === 'coinsPerHour') return item.data.coinsPerHour;
      if (selectedSort === 'sellPrice') return item.data.sellPrice;
      if (selectedSort === 'perRunValue') return item.data.sellPrice;
      if (selectedSort === 'productionMinutes') return item.data.growTimeMinutes;
      return 0;
    };

    all.sort((a, b) => dir(getVal(a), getVal(b)));

    return all;
  }, [selectedSort, selectedMachine, sortOrder, fishMinutes, ownedTreeIds, isOvernight]);

  const highCount = rankedList.filter((i) =>
    i.kind === 'product' ? i.data.efficiency === 'high' : i.data.coinsPerHour >= 60
  ).length;
  const medCount = rankedList.filter((i) =>
    i.kind === 'product' ? i.data.efficiency === 'medium' : (i.data.coinsPerHour >= 25 && i.data.coinsPerHour < 60)
  ).length;
  const lowCount = rankedList.filter((i) =>
    i.kind === 'product' ? i.data.efficiency === 'low' : i.data.coinsPerHour < 25
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FilterBar
        selectedSort={selectedSort}
        selectedMachine={selectedMachine}
        sortOrder={sortOrder}
        onSortChange={(key) => {
          setSelectedSort(key);
          setSortOrder('desc'); // reset to desc when switching sort type
        }}
        onSortOrderToggle={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
        onMachineChange={(id) => {
          setSelectedMachine(id);
          if (id === 'overnight') setSelectedSort('perRunValue');
        }}
      />

      <View style={styles.settingsBar}>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>
            🐟 Fish: {fishEnabled ? `Lure (${formatTime(FISH_CHAIN_MINUTES)}/fish)` : 'Pre-stocked (free)'}
          </Text>
          <Switch
            value={fishEnabled}
            onValueChange={toggleFish}
            trackColor={{ false: Colors.border, true: Colors.primary + '88' }}
            thumbColor={fishEnabled ? Colors.primary : Colors.textLight}
          />
        </View>
        <View style={[styles.settingsRow, styles.settingsRowBorder]}>
          <Text style={styles.settingsLabel}>🐝 Bee nests</Text>
          <View style={styles.nestCounter}>
            <TouchableOpacity
              style={styles.nestBtn}
              onPress={() => setNests(beeNests - 1)}
              disabled={beeNests <= 1}
            >
              <Text style={[styles.nestBtnText, beeNests <= 1 && { color: Colors.border }]}>−</Text>
            </TouchableOpacity>
            <Text style={styles.nestCount}>{beeNests} / {MAX_BEE_NESTS}</Text>
            <TouchableOpacity
              style={styles.nestBtn}
              onPress={() => setNests(beeNests + 1)}
              disabled={beeNests >= MAX_BEE_NESTS}
            >
              <Text style={[styles.nestBtnText, beeNests >= MAX_BEE_NESTS && { color: Colors.border }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.settingsRow, styles.settingsRowBorder]}>
          <Text style={styles.settingsLabel}>🌳 My trees</Text>
          <View style={styles.treeRow}>
            {trees.map((t) => {
              const owned = ownedTreeIds.has(t.id);
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.treeChip, owned && styles.treeChipOwned]}
                  onPress={() => toggleTree(t.id)}
                >
                  <Text style={styles.treeChipIcon}>{t.icon}</Text>
                  {owned && <Text style={styles.treeChipCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: Colors.highEfficiency }]} />
          <Text style={styles.summaryText}>{highCount} High</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: Colors.medEfficiency }]} />
          <Text style={styles.summaryText}>{medCount} Med</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: Colors.lowEfficiency }]} />
          <Text style={styles.summaryText}>{lowCount} Low</Text>
        </View>
        <Text style={styles.summaryTotal}>{rankedList.length} items</Text>
      </View>

      <FlatList
        data={rankedList}
        keyExtractor={(item) => `${item.kind}-${item.data.id}`}
        renderItem={({ item, index }) => {
          const isTopThree = selectedSort === 'coinsPerHour' && index < 3;
          if (item.kind === 'crop') {
            return (
              <CropCard
                crop={item.data}
                rank={index + 1}
                showRank={isTopThree}
              />
            );
          }
          if (item.kind === 'tree') {
            return (
              <TreeCard
                tree={item.data}
                rank={index + 1}
                showRank={isTopThree}
              />
            );
          }
          return (
            <ProductCard
              product={item.data}
              rank={index + 1}
              showRank={isTopThree}
              fishMinutes={fishMinutes}
              ownedTreeIds={ownedTreeIds}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          isOvernight ? (
            <View style={styles.overnightBanner}>
              <Text style={styles.overnightTitle}>🌙 Idle / Overnight mode</Text>
              <Text style={styles.overnightDesc}>
                Items with a single run ≥ 4 hours — start before bed, collect in the morning.
                Sorted by total coins per run.
              </Text>
            </View>
          ) : (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Tap any product card to see its full chain
              </Text>
            </View>
          )
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  settingsBar: {
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  settingsRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  settingsLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  nestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nestBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nestBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  nestCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
  treeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  treeChip: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  treeChipOwned: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  treeChipIcon: {
    fontSize: 16,
  },
  treeChipCheck: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 9,
    fontWeight: '900',
    color: Colors.primary,
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
    lineHeight: 12,
    paddingHorizontal: 1,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  summaryTotal: {
    marginLeft: 'auto',
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  listHeaderText: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  overnightBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    padding: 12,
    backgroundColor: '#1A237E10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A237E30',
  },
  overnightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  overnightDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
});
