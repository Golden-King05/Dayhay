import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { ProductCard } from '../../components/ProductCard';
import { IngredientPlanner } from '../../components/IngredientPlanner';
import { getEnrichedProducts, searchProducts, sortProducts } from '../../utils/optimizer';
import { useFishSetting } from '../../hooks/useFishSetting';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [plannerOpen, setPlannerOpen] = useState(false);
  const { fishMinutes } = useFishSetting();

  const filtered = useMemo(() => {
    const products = getEnrichedProducts(fishMinutes);
    const searched = searchProducts(products, searchQuery);
    return sortProducts(searched, 'levelRequired', 'asc');
  }, [searchQuery, fishMinutes]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, machines, ingredients..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>

      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} • sorted by level
        </Text>
        <TouchableOpacity style={styles.plannerBtn} onPress={() => setPlannerOpen(true)}>
          <Text style={styles.plannerBtnText}>🧺 Use My Ingredients</Text>
        </TouchableOpacity>
      </View>

      <IngredientPlanner visible={plannerOpen} onClose={() => setPlannerOpen(false)} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} fishMinutes={fishMinutes} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    margin: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 8,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.text,
  },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  resultsText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
    flex: 1,
  },
  plannerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.primary + '18',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '50',
  },
  plannerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
