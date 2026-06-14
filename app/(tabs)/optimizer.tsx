import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { products } from '../../data/products';
import {
  enrichProducts,
  sortProducts,
  filterByMachine,
  ProductWithStats,
  SortBy,
} from '../../utils/optimizer';
import FilterBar from '../../components/FilterBar';
import ProductCard from '../../components/ProductCard';

const ALL_ENRICHED = enrichProducts(products);

export default function OptimizerScreen() {
  const [sortBy, setSortBy] = useState<SortBy>('coinsPerHour');
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);

  const displayProducts = useMemo(() => {
    const filtered = filterByMachine(ALL_ENRICHED, selectedMachine);
    return sortProducts(filtered, sortBy);
  }, [sortBy, selectedMachine]);

  const renderItem = ({ item, index }: ListRenderItemInfo<ProductWithStats>) => (
    <ProductCard product={item} rank={index + 1} />
  );

  const keyExtractor = (item: ProductWithStats) => item.id;

  const ListHeader = (
    <View style={styles.listHeader}>
      <Text style={styles.resultCount}>
        {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
      </Text>
      <Text style={styles.resultHint}>* = produced ingredient</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Screen header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Production Optimizer</Text>
        <Text style={styles.headerSubtitle}>
          Find the most profitable products for your farm
        </Text>
      </View>

      {/* Filters */}
      <FilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedMachine={selectedMachine}
        onMachineChange={setSelectedMachine}
      />

      {/* Product list */}
      <FlatList
        data={displayProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '500',
  },
  list: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textLight,
  },
  resultHint: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
