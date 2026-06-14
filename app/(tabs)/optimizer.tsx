import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { products } from '../../data/products';
import { ProductCard } from '../../components/ProductCard';
import { FilterBar } from '../../components/FilterBar';
import { sortProducts, filterByMachine, SortKey } from '../../utils/optimizer';

export default function OptimizerScreen() {
  const [selectedSort, setSelectedSort] = useState<SortKey>('coinsPerHour');
  const [selectedMachine, setSelectedMachine] = useState('all');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSorted = useMemo(() => {
    const filtered = filterByMachine(products, selectedMachine);
    return sortProducts(filtered, selectedSort, sortOrder);
  }, [selectedSort, selectedMachine, sortOrder]);

  const highCount = filteredAndSorted.filter((p) => p.efficiency === 'high').length;
  const medCount = filteredAndSorted.filter((p) => p.efficiency === 'medium').length;
  const lowCount = filteredAndSorted.filter((p) => p.efficiency === 'low').length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FilterBar
        selectedSort={selectedSort}
        selectedMachine={selectedMachine}
        onSortChange={setSelectedSort}
        onMachineChange={setSelectedMachine}
      />

      {/* Efficiency Summary */}
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
        <Text style={styles.summaryTotal}>{filteredAndSorted.length} items</Text>
      </View>

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            rank={index + 1}
            showRank={selectedSort === 'coinsPerHour' && index < 3}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              Tap any card to see ingredients
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
