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
import { ProductCard } from '../../components/ProductCard';
import { CropCard } from '../../components/CropCard';
import { FilterBar } from '../../components/FilterBar';
import { getEnrichedProducts, sortProducts, filterByMachine, SortKey } from '../../utils/optimizer';
import { useFishSetting } from '../../hooks/useFishSetting';
import { formatTime } from '../../utils/optimizer';
import { FISH_CHAIN_MINUTES } from '../../data/fishing';

type ListItem =
  | { kind: 'product'; data: (typeof products)[0] }
  | { kind: 'crop'; data: (typeof crops)[0] };

export default function OptimizerScreen() {
  const [selectedSort, setSelectedSort] = useState<SortKey>('coinsPerHour');
  const [selectedMachine, setSelectedMachine] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { fishEnabled, fishMinutes, toggleFish } = useFishSetting();

  const rankedList = useMemo((): ListItem[] => {
    const products = getEnrichedProducts(fishMinutes);
    const filteredProducts = filterByMachine(products, selectedMachine);
    const productItems: ListItem[] = sortProducts(filteredProducts, selectedSort, sortOrder)
      .map((p) => ({ kind: 'product', data: p }));

    // Only include crops when showing all (crops don't belong to a machine)
    if (selectedMachine !== 'all') return productItems;

    const cropItems: ListItem[] = crops.map((c) => ({ kind: 'crop', data: c }));
    const all = [...productItems, ...cropItems];

    if (selectedSort === 'coinsPerHour') {
      all.sort((a, b) => {
        const aCPH = a.data.coinsPerHour;
        const bCPH = b.data.coinsPerHour;
        return sortOrder === 'desc' ? bCPH - aCPH : aCPH - bCPH;
      });
    } else if (selectedSort === 'sellPrice') {
      all.sort((a, b) => {
        const aVal = a.data.sellPrice;
        const bVal = b.data.sellPrice;
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    } else if (selectedSort === 'craftingProfit') {
      // Crops have no ingredient cost so treat their full sell price as profit
      all.sort((a, b) => {
        const aVal = a.kind === 'product' ? (a.data.craftingProfit ?? 0) : a.data.sellPrice;
        const bVal = b.kind === 'product' ? (b.data.craftingProfit ?? 0) : b.data.sellPrice;
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    return all;
  }, [selectedSort, selectedMachine, sortOrder, fishMinutes]);

  const highCount = rankedList.filter((i) =>
    i.kind === 'product'
      ? i.data.efficiency === 'high'
      : i.data.coinsPerHour >= 60
  ).length;
  const medCount = rankedList.filter((i) =>
    i.kind === 'product'
      ? i.data.efficiency === 'medium'
      : i.data.coinsPerHour >= 25 && i.data.coinsPerHour < 60
  ).length;
  const lowCount = rankedList.filter((i) =>
    i.kind === 'product'
      ? i.data.efficiency === 'low'
      : i.data.coinsPerHour < 25
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
        onMachineChange={setSelectedMachine}
      />

      <View style={styles.fishToggleBar}>
        <Text style={styles.fishToggleLabel}>
          🐟 Fish: {fishEnabled ? `Lure (${formatTime(FISH_CHAIN_MINUTES)}/fish)` : 'Pre-stocked (free)'}
        </Text>
        <Switch
          value={fishEnabled}
          onValueChange={toggleFish}
          trackColor={{ false: Colors.border, true: Colors.primary + '88' }}
          thumbColor={fishEnabled ? Colors.primary : Colors.textLight}
        />
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
          return (
            <ProductCard
              product={item.data}
              rank={index + 1}
              showRank={isTopThree}
              fishMinutes={fishMinutes}
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
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              Tap any product card to see its full chain
            </Text>
          </View>
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
  fishToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  fishToggleLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
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
});
