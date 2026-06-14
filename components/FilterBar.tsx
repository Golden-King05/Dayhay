import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { SortBy } from '../utils/optimizer';

interface SortOption {
  key: SortBy;
  label: string;
}

interface MachineFilter {
  id: string | null;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'coinsPerHour', label: '⚡ Coins/hr' },
  { key: 'sellPrice', label: '🪙 Price' },
  { key: 'productionMinutes', label: '⏱ Time' },
  { key: 'level', label: '⭐ Level' },
];

const MACHINE_FILTERS: MachineFilter[] = [
  { id: null, label: 'All' },
  { id: 'feedMill', label: '🌾 Feed Mill' },
  { id: 'dairy', label: '🥛 Dairy' },
  { id: 'sugarMill', label: '🍬 Sugar Mill' },
  { id: 'bakery', label: '🍞 Bakery' },
  { id: 'sewingMachine', label: '🧵 Sewing' },
  { id: 'bbqGrill', label: '🔥 BBQ' },
  { id: 'pieOven', label: '🥧 Pie Oven' },
  { id: 'juicer', label: '🥤 Juicer' },
  { id: 'popcornPot', label: '🍿 Popcorn' },
  { id: 'iceCreamMachine', label: '🍦 Ice Cream' },
];

interface FilterBarProps {
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  selectedMachine: string | null;
  onMachineChange: (machineId: string | null) => void;
}

export default function FilterBar({
  sortBy,
  onSortChange,
  selectedMachine,
  onMachineChange,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      {/* Sort row */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Sort by</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
        style={styles.scrollRow}
      >
        {SORT_OPTIONS.map((option) => {
          const isActive = sortBy === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSortChange(option.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Machine filter row */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Machine</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
        style={styles.scrollRow}
      >
        {MACHINE_FILTERS.map((filter) => {
          const isActive = selectedMachine === filter.id;
          return (
            <TouchableOpacity
              key={filter.id ?? 'all'}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onMachineChange(filter.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    paddingTop: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scrollRow: {
    marginBottom: 4,
  },
  rowContent: {
    paddingHorizontal: 12,
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textLight,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
