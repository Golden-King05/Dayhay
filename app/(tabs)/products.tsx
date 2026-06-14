import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { products } from '../../data/products';
import {
  enrichProducts,
  filterBySearch,
  formatTime,
  ProductWithStats,
} from '../../utils/optimizer';
import MachineIcon from '../../components/MachineIcon';

const ALL_ENRICHED = enrichProducts(products);

function getEfficiencyColor(efficiency: 'high' | 'medium' | 'low'): string {
  if (efficiency === 'high') return Colors.highEfficiency;
  if (efficiency === 'medium') return Colors.medEfficiency;
  return Colors.lowEfficiency;
}

interface ProductRowProps {
  product: ProductWithStats;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

function ProductRow({ product, isExpanded, onToggle }: ProductRowProps) {
  const effColor = getEfficiencyColor(product.efficiency);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(product.id)}
      style={styles.rowOuter}
    >
      <View style={styles.row}>
        {/* Left: emoji + name */}
        <Text style={styles.rowEmoji}>{product.emoji ?? '📦'}</Text>
        <View style={styles.rowMain}>
          <Text style={styles.rowName} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.rowMeta}>
            <MachineIcon machineId={product.machineId} size={16} />
            <Text style={styles.rowMachineName} numberOfLines={1}>
              {product.machineName}
            </Text>
          </View>
        </View>

        {/* Right: stats */}
        <View style={styles.rowStats}>
          <View style={styles.rowStatLine}>
            <Text style={styles.rowStatIcon}>⏱</Text>
            <Text style={styles.rowStatText}>{formatTime(product.productionMinutes)}</Text>
          </View>
          <View style={styles.rowStatLine}>
            <Text style={styles.rowStatIcon}>🪙</Text>
            <Text style={styles.rowStatText}>{product.sellPrice}</Text>
          </View>
          <View style={[styles.cphPill, { backgroundColor: effColor }]}>
            <Text style={styles.cphPillText}>{product.coinsPerHour}/hr</Text>
          </View>
        </View>

        {/* Expand arrow */}
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={Colors.textMuted}
          style={styles.chevron}
        />
      </View>

      {/* Expanded ingredients */}
      {isExpanded && (
        <View style={styles.expandedSection}>
          <View style={styles.expandedDivider} />
          <View style={styles.expandedContent}>
            <View style={styles.expandedLeft}>
              <Text style={styles.expandedLabel}>Ingredients</Text>
              <View style={styles.ingredientList}>
                {product.ingredients.map((ing, idx) => (
                  <View key={`${ing.itemId}-${idx}`} style={styles.ingredientItem}>
                    <Text style={styles.ingredientDot}>•</Text>
                    <Text style={styles.ingredientText}>
                      {ing.quantity}× {ing.name}
                      {ing.isProduct ? (
                        <Text style={styles.ingredientProductMark}> (made)</Text>
                      ) : null}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.expandedRight}>
              <View style={styles.expandedStat}>
                <Text style={styles.expandedStatLabel}>Level</Text>
                <Text style={styles.expandedStatValue}>⭐ {product.level}</Text>
              </View>
              <View style={styles.expandedStat}>
                <Text style={styles.expandedStatLabel}>Efficiency</Text>
                <Text style={[styles.expandedStatValue, { color: effColor }]}>
                  {product.efficiency === 'high'
                    ? 'High'
                    : product.efficiency === 'medium'
                    ? 'Med'
                    : 'Low'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ProductsScreen() {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayProducts = useMemo(() => {
    return filterBySearch(ALL_ENRICHED, query);
  }, [query]);

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const renderItem = ({ item }: ListRenderItemInfo<ProductWithStats>) => (
    <ProductRow
      product={item}
      isExpanded={expandedId === item.id}
      onToggle={handleToggle}
    />
  );

  const keyExtractor = (item: ProductWithStats) => item.id;

  const ListHeader = (
    <View style={styles.listHeader}>
      <Text style={styles.resultCount}>
        {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
      </Text>
      <Text style={styles.tapHint}>Tap a row to expand</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Products</Text>
        <Text style={styles.headerSubtitle}>Search and explore every item</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or machines..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          {query.length > 0 && Platform.OS === 'android' && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={displayProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        removeClippedSubviews
        maxToRenderPerBatch={15}
        windowSize={12}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyDesc}>
              Try a different search term
            </Text>
          </View>
        }
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
  searchContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
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
  tapHint: {
    fontSize: 11,
    color: Colors.textMuted,
  },

  // Row styles
  rowOuter: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  rowEmoji: {
    fontSize: 26,
    width: 32,
    textAlign: 'center',
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowMachineName: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500',
    flex: 1,
  },
  rowStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rowStatLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rowStatIcon: {
    fontSize: 10,
  },
  rowStatText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '600',
  },
  cphPill: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 2,
  },
  cphPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chevron: {
    marginLeft: 4,
  },

  // Expanded section
  expandedSection: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 10,
  },
  expandedContent: {
    flexDirection: 'row',
    gap: 12,
  },
  expandedLeft: {
    flex: 1,
  },
  expandedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  ingredientList: {
    gap: 3,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  ingredientDot: {
    fontSize: 11,
    color: Colors.primary,
    lineHeight: 18,
  },
  ingredientText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
    lineHeight: 18,
  },
  ingredientProductMark: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  expandedRight: {
    gap: 8,
    minWidth: 72,
  },
  expandedStat: {
    alignItems: 'flex-end',
  },
  expandedStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  expandedStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
