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
import { getStockItems, sortStockItems, StoreMode } from '../../utils/storehouse';
import { StockCard } from '../../components/StockCard';
import { useFishSetting } from '../../hooks/useFishSetting';

export default function StorehouseScreen() {
  const [mode, setMode] = useState<StoreMode>('demand');
  const { fishMinutes } = useFishSetting();

  const sorted = useMemo(() => {
    const items = getStockItems(fishMinutes);
    return sortStockItems(items, mode);
  }, [mode, fishMinutes]);

  const mustCount   = sorted.filter((i) => i.priority === 'must').length;
  const highCount   = sorted.filter((i) => i.priority === 'high').length;
  const normalCount = sorted.filter((i) => i.priority === 'normal').length;
  const lowCount    = sorted.filter((i) => i.priority === 'low').length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Mode toggle */}
      <View style={styles.modeBar}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'demand' && styles.modeBtnActive]}
          onPress={() => setMode('demand')}
        >
          <Text style={[styles.modeBtnText, mode === 'demand' && styles.modeBtnTextActive]}>
            📊 By Demand
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'risk' && styles.modeBtnActive]}
          onPress={() => setMode('risk')}
        >
          <Text style={[styles.modeBtnText, mode === 'risk' && styles.modeBtnTextActive]}>
            ⚠️ By Risk
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mode description */}
      <View style={styles.descBar}>
        <Text style={styles.descText}>
          {mode === 'demand'
            ? 'Ranked by how many recipes use each ingredient — stock high-demand items first.'
            : 'Ranked by production time × demand — items that are slow to make AND often needed.'}
        </Text>
      </View>

      {/* Summary counts */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: '#C62828' }]} />
          <Text style={styles.summaryText}>{mustCount} Must Stock</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: '#E65100' }]} />
          <Text style={styles.summaryText}>{highCount} High</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: '#5C9E2E' }]} />
          <Text style={styles.summaryText}>{normalCount} Normal</Text>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.dot, { backgroundColor: '#B09880' }]} />
          <Text style={styles.summaryText}>{lowCount} Low</Text>
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item, index }) => (
          <StockCard item={item} mode={mode} rank={index + 1} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modeBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modeBtnActive: {
    backgroundColor: Colors.primary + '18',
    borderColor: Colors.primary,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modeBtnTextActive: {
    color: Colors.primary,
  },
  descBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  descText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
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
    flexWrap: 'wrap',
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
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
});
