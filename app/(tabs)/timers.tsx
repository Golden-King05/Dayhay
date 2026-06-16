import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SectionList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useTimers, ActiveTimer } from '../../hooks/useTimers';
import { products } from '../../data/products';
import { crops } from '../../data/crops';
import { trees } from '../../data/trees';
import { formatTime } from '../../utils/optimizer';

// ── Countdown display ────────────────────────────────────────
function useNow(interval = 1000) {
  const [now, setNow] = useState(Date.now());
  useFocusEffect(
    useCallback(() => {
      const id = setInterval(() => setNow(Date.now()), interval);
      return () => clearInterval(id);
    }, [interval])
  );
  return now;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ready! ✅';
  const totalSeconds = Math.ceil(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// ── Timer card ───────────────────────────────────────────────
function TimerCard({
  timer,
  now,
  onRemove,
}: {
  timer: ActiveTimer;
  now: number;
  onRemove: (id: string) => void;
}) {
  const remaining = timer.finishesAt - now;
  const totalMs = timer.durationMinutes * 60 * 1000;
  const progress = Math.max(0, Math.min(1, 1 - remaining / totalMs));
  const done = remaining <= 0;

  return (
    <View style={[styles.card, done && styles.cardDone]}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{timer.productIcon}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{timer.productName}</Text>
          <Text style={styles.cardCategory}>
            {timer.category === 'crop' ? '🌱 Crop' : timer.category === 'tree' ? '🌳 Tree / Bush' : '⚙️ Machine'}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` as any },
                done && styles.progressDone,
              ]}
            />
          </View>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={[styles.countdown, done && styles.countdownDone]}>
          {formatCountdown(remaining)}
        </Text>
        <TouchableOpacity
          onPress={() => onRemove(timer.id)}
          style={styles.removeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={22} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Picker item types ────────────────────────────────────────
interface PickerItem {
  id: string;
  name: string;
  icon: string;
  durationMinutes: number;
  category: 'crop' | 'tree' | 'machine';
  subtitle: string;
}

const allPickerItems: PickerItem[] = [
  ...crops.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    durationMinutes: c.growTimeMinutes,
    category: 'crop' as const,
    subtitle: `${formatTime(c.growTimeMinutes)} · Lv ${c.levelRequired}`,
  })),
  ...trees.map((t) => ({
    id: t.id,
    name: t.plantName,
    icon: t.icon,
    durationMinutes: t.cycleMinutes,
    category: 'tree' as const,
    subtitle: `${formatTime(t.cycleMinutes)} per cycle · ${t.quantityPerCycle}× per harvest`,
  })),
  ...products.map((p) => ({
    id: p.id,
    name: p.name,
    icon: p.icon,
    durationMinutes: p.productionMinutes,
    category: 'machine' as const,
    subtitle: `${formatTime(p.productionMinutes)} · ${p.machineName}`,
  })),
];

// ── Add Timer Modal ──────────────────────────────────────────
function AddTimerModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: PickerItem, startedMinutesAgo: number) => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PickerItem | null>(null);
  const [minutesAgo, setMinutesAgo] = useState('0');

  function reset() {
    setSearch('');
    setSelected(null);
    setMinutesAgo('0');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleConfirm() {
    if (!selected) return;
    const ago = Math.max(0, parseInt(minutesAgo, 10) || 0);
    onAdd(selected, ago);
    reset();
    onClose();
  }

  const filtered = allPickerItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const cropItems = filtered.filter((i) => i.category === 'crop');
  const treeItems = filtered.filter((i) => i.category === 'tree');
  const machineItems = filtered.filter((i) => i.category === 'machine');
  const sections = [
    ...(cropItems.length ? [{ title: '🌱 Crops', data: cropItems }] : []),
    ...(treeItems.length ? [{ title: '🌳 Trees & Bushes', data: treeItems }] : []),
    ...(machineItems.length ? [{ title: '⚙️ Machine Products', data: machineItems }] : []),
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Timer</Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={26} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops & products…"
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => {
            const isSelected = selected?.id === item.id;
            return (
              <TouchableOpacity
                style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                onPress={() => setSelected(item)}
              >
                <Text style={styles.pickerIcon}>{item.icon}</Text>
                <View style={styles.pickerInfo}>
                  <Text style={[styles.pickerName, isSelected && styles.pickerNameSelected]}>
                    {item.name}
                  </Text>
                  <Text style={styles.pickerSub}>{item.subtitle}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          }}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingBottom: 160 }}
        />

        {selected && (
          <View style={styles.confirmPanel}>
            <Text style={styles.confirmTitle}>
              {selected.icon} {selected.name}
            </Text>
            <Text style={styles.confirmSub}>
              Duration: {selected.durationMinutes < 60
                ? `${selected.durationMinutes} min`
                : `${(selected.durationMinutes / 60).toFixed(1)} hr`}
            </Text>
            <View style={styles.agoRow}>
              <Text style={styles.agoLabel}>Started </Text>
              <TextInput
                style={styles.agoInput}
                keyboardType="number-pad"
                value={minutesAgo}
                onChangeText={setMinutesAgo}
                selectTextOnFocus
              />
              <Text style={styles.agoLabel}> min ago</Text>
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Start Timer 🔔</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ── Main screen ───────────────────────────────────────────────
export default function TimersScreen() {
  const { timers, addTimer, removeTimer, clearFinished, permissionGranted } = useTimers();
  const [modalVisible, setModalVisible] = useState(false);
  const now = useNow();

  const sorted = [...timers].sort((a, b) => a.finishesAt - b.finishesAt);
  const hasFinished = timers.some((t) => t.finishesAt <= now);

  async function handleAdd(item: PickerItem, startedMinutesAgo: number) {
    await addTimer(
      item.id,
      item.name,
      item.icon,
      item.category,
      item.durationMinutes,
      startedMinutesAgo
    );
  }

  function handleRemove(id: string) {
    Alert.alert('Remove Timer', 'Remove this timer?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeTimer(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      {!permissionGranted && (
        <View style={styles.banner}>
          <Ionicons name="warning" size={16} color={Colors.accentDark} />
          <Text style={styles.bannerText}>
            Notifications are disabled — enable them in Settings to get alerts.
          </Text>
        </View>
      )}

      {timers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⏱️</Text>
          <Text style={styles.emptyTitle}>No active timers</Text>
          <Text style={styles.emptySub}>
            Tap + to track a crop or machine and get notified when it's done.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TimerCard timer={item} now={now} onRemove={handleRemove} />
          )}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            hasFinished ? (
              <TouchableOpacity style={styles.clearBtn} onPress={clearFinished}>
                <Text style={styles.clearBtnText}>Clear finished timers</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <AddTimerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  bannerText: { flex: 1, fontSize: 13, color: Colors.accentDark },

  list: { padding: 16, paddingBottom: 100 },

  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDone: { borderLeftWidth: 4, borderLeftColor: Colors.success },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 36 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cardCategory: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressDone: { backgroundColor: Colors.success },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  countdown: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  countdownDone: { color: Colors.success },
  removeBtn: { padding: 2 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  clearBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.border,
    borderRadius: 20,
  },
  clearBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },

  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  // Modal
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 16, color: Colors.text },

  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemSelected: { backgroundColor: '#F0FAE8' },
  pickerIcon: { fontSize: 28 },
  pickerInfo: { flex: 1 },
  pickerName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  pickerNameSelected: { color: Colors.primaryDark },
  pickerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  confirmPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  confirmTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  confirmSub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  agoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  agoLabel: { fontSize: 15, color: Colors.text },
  agoInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 60,
    textAlign: 'center',
    backgroundColor: Colors.background,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
