import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { getAllSellableItems, SellableItem } from '../utils/allItems';

interface ItemPickerProps {
  selected: SellableItem | null;
  onSelect: (item: SellableItem) => void;
  placeholder?: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  crop: '🌱 Crop',
  animal: '🐾 Animal',
  tree: '🌳 Tree/Bush',
  product: '🏭 Product',
  fish: '🐟 Fish',
};

export function ItemPicker({ selected, onSelect, placeholder = 'Select item...' }: ItemPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const allItems = getAllSellableItems();
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter((i) => i.name.toLowerCase().includes(q));
  }, [query, allItems]);

  const handleSelect = (item: SellableItem) => {
    onSelect(item);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        {selected ? (
          <View style={styles.triggerContent}>
            <Text style={styles.triggerIcon}>{selected.icon}</Text>
            <Text style={styles.triggerName}>{selected.name}</Text>
            <Text style={styles.triggerPrice}>{selected.sellPrice}c ea</Text>
          </View>
        ) : (
          <Text style={styles.triggerPlaceholder}>{placeholder}</Text>
        )}
        <Ionicons name="chevron-down" size={16} color={Colors.textLight} />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Item</Text>
            <TouchableOpacity onPress={() => { setOpen(false); setQuery(''); }}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color={Colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor={Colors.textLight}
              value={query}
              onChangeText={setQuery}
              autoFocus
              clearButtonMode="while-editing"
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
                <Text style={styles.rowIcon}>{item.icon}</Text>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <Text style={styles.rowCategory}>{CATEGORY_LABEL[item.category]}</Text>
                </View>
                <Text style={styles.rowPrice}>{item.sellPrice}c</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerIcon: { fontSize: 18 },
  triggerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  triggerPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  triggerPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
  },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 15,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.cardBackground,
    gap: 12,
  },
  rowIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  rowCategory: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  rowPrice: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 60 },
});
