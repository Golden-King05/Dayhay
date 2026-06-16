import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { ItemPicker } from '../../components/ItemPicker';
import { SellableItem } from '../../utils/allItems';

// ── Shared result banner ──────────────────────────────────────────────────────

function DealResult({ rawValue, offered }: { rawValue: number; offered: number }) {
  if (offered === 0 || rawValue === 0) return null;
  const diff = offered - rawValue;
  const pct = Math.round((diff / rawValue) * 100);
  const good = diff >= 0;
  return (
    <View style={[styles.result, good ? styles.resultGood : styles.resultBad]}>
      <Text style={[styles.resultTitle, { color: good ? '#2E7D32' : '#C62828' }]}>
        {good ? '✅ Good deal' : '⚠️ Below market'}
      </Text>
      <Text style={styles.resultLine}>
        Raw value: <Text style={styles.resultBold}>{rawValue} coins</Text>
      </Text>
      <Text style={styles.resultLine}>
        Order pays: <Text style={styles.resultBold}>{offered} coins</Text>
      </Text>
      <Text style={[styles.resultDiff, { color: good ? '#2E7D32' : '#C62828' }]}>
        {good ? '+' : ''}{diff} coins ({good ? '+' : ''}{pct}%) vs selling raw
      </Text>
    </View>
  );
}

// ── Boat ──────────────────────────────────────────────────────────────────────

function BoatSection() {
  const [item, setItem] = useState<SellableItem | null>(null);
  const [qty, setQty] = useState('');
  const [offered, setOffered] = useState('');

  const quantity = parseInt(qty) || 0;
  const offeredCoins = parseInt(offered) || 0;
  const rawValue = item ? item.sellPrice * quantity : 0;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🚢</Text>
        <Text style={styles.sectionTitle}>Boat Order</Text>
        <Text style={styles.sectionSub}>One item type</Text>
      </View>

      <ItemPicker selected={item} onSelect={setItem} placeholder="Select item..." />

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Quantity</Text>
          <TextInput
            style={styles.input}
            value={qty}
            onChangeText={setQty}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="0"
            placeholderTextColor={Colors.textLight}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Boat offers (coins)</Text>
          <TextInput
            style={styles.input}
            value={offered}
            onChangeText={setOffered}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="0"
            placeholderTextColor={Colors.textLight}
          />
        </View>
      </View>

      {item && quantity > 0 && (
        <Text style={styles.rawHint}>
          {item.icon} {quantity}× {item.name} = {rawValue} coins raw
        </Text>
      )}

      <DealResult rawValue={rawValue} offered={offeredCoins} />
    </View>
  );
}

// ── Truck ─────────────────────────────────────────────────────────────────────

interface TruckRow {
  id: number;
  item: SellableItem | null;
  qty: string;
}

function TruckSection() {
  const [rows, setRows] = useState<TruckRow[]>([
    { id: 1, item: null, qty: '' },
    { id: 2, item: null, qty: '' },
  ]);
  const [offered, setOffered] = useState('');

  const addRow = () => {
    setRows((prev) => [...prev, { id: Date.now(), item: null, qty: '' }]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, patch: Partial<TruckRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const totalRaw = rows.reduce((sum, r) => {
    if (!r.item) return sum;
    return sum + r.item.sellPrice * (parseInt(r.qty) || 0);
  }, 0);

  const offeredCoins = parseInt(offered) || 0;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🚛</Text>
        <Text style={styles.sectionTitle}>Truck Order</Text>
        <Text style={styles.sectionSub}>Lump sum payout</Text>
      </View>

      {rows.map((row, i) => {
        const rowRaw = row.item ? row.item.sellPrice * (parseInt(row.qty) || 0) : 0;
        return (
          <View key={row.id} style={styles.truckRow}>
            <Text style={styles.truckRowNum}>{i + 1}</Text>
            <View style={styles.truckRowContent}>
              <View style={styles.truckPickerRow}>
                <ItemPicker
                  selected={row.item}
                  onSelect={(item) => updateRow(row.id, { item })}
                  placeholder="Select item..."
                />
                {rows.length > 1 && (
                  <TouchableOpacity onPress={() => removeRow(row.id)} style={styles.removeBtn}>
                    <Ionicons name="close-circle" size={22} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Qty</Text>
                  <TextInput
                    style={styles.input}
                    value={row.qty}
                    onChangeText={(v) => updateRow(row.id, { qty: v })}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    placeholder="0"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
                {row.item && row.qty ? (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Raw value</Text>
                    <View style={styles.inputReadonly}>
                      <Text style={styles.inputReadonlyText}>{rowRaw} coins</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}

      <TouchableOpacity style={styles.addBtn} onPress={addRow}>
        <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
        <Text style={styles.addBtnText}>Add item</Text>
      </TouchableOpacity>

      {totalRaw > 0 && (
        <View style={styles.truckTotalRow}>
          <Text style={styles.truckTotalLabel}>Total raw value:</Text>
          <Text style={styles.truckTotalValue}>{totalRaw} coins</Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Truck offers (lump sum)</Text>
        <TextInput
          style={styles.input}
          value={offered}
          onChangeText={setOffered}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          placeholder="0"
          placeholderTextColor={Colors.textLight}
        />
      </View>

      <DealResult rawValue={totalRaw} offered={offeredCoins} />
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CompareScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <BoatSection />
            <TruckSection />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, gap: 16, paddingBottom: 40 },

  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: { fontSize: 22 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  sectionSub: { fontSize: 12, color: Colors.textLight, marginLeft: 'auto' },

  inputRow: { flexDirection: 'row', gap: 10 },
  inputGroup: { flex: 1 },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  inputReadonly: {
    backgroundColor: Colors.border + '40',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  inputReadonlyText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  rawHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  result: {
    borderRadius: 12,
    padding: 12,
    gap: 3,
    borderWidth: 1,
  },
  resultGood: {
    backgroundColor: '#2E7D3210',
    borderColor: '#2E7D3230',
  },
  resultBad: {
    backgroundColor: '#C6282810',
    borderColor: '#C6282830',
  },
  resultTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  resultLine: { fontSize: 13, color: Colors.textSecondary },
  resultBold: { fontWeight: '700', color: Colors.text },
  resultDiff: { fontSize: 14, fontWeight: '700', marginTop: 4 },

  // Truck
  truckRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  truckRowNum: {
    width: 20,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textLight,
    paddingTop: 12,
  },
  truckRowContent: { flex: 1, gap: 8 },
  truckPickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  removeBtn: { padding: 4 },
  truckTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  truckTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  truckTotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary + '60',
    borderStyle: 'dashed',
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
