import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { SortKey } from '../utils/optimizer';

interface SortOption {
  key: SortKey;
  label: string;
  icon: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'coinsPerHour', label: 'Coins/Hr', icon: '⚡' },
  { key: 'markupPercent', label: '% Gain', icon: '📈' },
  { key: 'perRunValue', label: 'Per Run', icon: '🌙' },
  { key: 'craftingProfit', label: 'Profit', icon: '💰' },
  { key: 'sellPrice', label: 'Price', icon: '🪙' },
  { key: 'productionMinutes', label: 'Time', icon: '⏱' },
  { key: 'levelRequired', label: 'Level', icon: '⭐' },
];

interface MachineFilter {
  id: string;
  label: string;
  emoji: string;
}

const MACHINE_FILTERS: MachineFilter[] = [
  { id: 'all', label: 'All', emoji: '🏡' },
  { id: 'overnight', label: 'Idle 4h+', emoji: '🌙' },
  { id: 'feed_mill', label: 'Feed Mill', emoji: '🏭' },
  { id: 'dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'sugar_mill', label: 'Sugar Mill', emoji: '🍬' },
  { id: 'bakery', label: 'Bakery', emoji: '🍞' },
  { id: 'loom', label: 'Loom', emoji: '🪡' },
  { id: 'sewing_machine', label: 'Sewing', emoji: '🧵' },
  { id: 'bbq_grill', label: 'BBQ', emoji: '🔥' },
  { id: 'pie_oven', label: 'Pie Oven', emoji: '🥧' },
  { id: 'juice_press', label: 'Juice', emoji: '🧃' },
  { id: 'ice_cream_maker', label: 'Ice Cream', emoji: '🍦' },
  { id: 'coffee_kiosk', label: 'Coffee', emoji: '☕' },
  { id: 'honey_extractor', label: 'Bees', emoji: '🐝' },
  { id: 'jam_maker', label: 'Jam', emoji: '🫙' },
  { id: 'popcorn_pot', label: 'Popcorn', emoji: '🍿' },
];

interface FilterBarProps {
  selectedSort: SortKey;
  selectedMachine: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (key: SortKey) => void;
  onSortOrderToggle: () => void;
  onMachineChange: (machineId: string) => void;
}

export function FilterBar({
  selectedSort,
  selectedMachine,
  sortOrder,
  onSortChange,
  onSortOrderToggle,
  onMachineChange,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sortHeader}>
        <Text style={styles.sectionLabel}>Sort By</Text>
        <TouchableOpacity style={styles.orderToggle} onPress={onSortOrderToggle}>
          <Text style={styles.orderToggleText}>
            {sortOrder === 'desc' ? '↓ High→Low' : '↑ Low→High'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.chip, selectedSort === opt.key && styles.chipActive]}
            onPress={() => onSortChange(opt.key)}
          >
            <Text style={styles.chipIcon}>{opt.icon}</Text>
            <Text style={[styles.chipText, selectedSort === opt.key && styles.chipTextActive]}>
              {opt.label}
            </Text>
            {selectedSort === opt.key && (
              <Text style={[styles.chipArrow, { color: Colors.primary }]}>
                {sortOrder === 'desc' ? '↓' : '↑'}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>Machine</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MACHINE_FILTERS.map((mf) => (
          <TouchableOpacity
            key={mf.id}
            style={[styles.chip, selectedMachine === mf.id && styles.chipActiveMachine]}
            onPress={() => onMachineChange(mf.id)}
          >
            <Text style={styles.chipIcon}>{mf.emoji}</Text>
            <Text style={[styles.chipText, selectedMachine === mf.id && styles.chipTextActiveMachine]}>
              {mf.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 6,
    marginTop: 4,
  },
  orderToggle: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    marginBottom: 4,
  },
  orderToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  chipArrow: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 6,
    paddingBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
  },
  chipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  chipActiveMachine: {
    backgroundColor: Colors.accent + '25',
    borderColor: Colors.accent,
  },
  chipIcon: {
    fontSize: 13,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primary,
  },
  chipTextActiveMachine: {
    color: Colors.accentDark,
  },
});
