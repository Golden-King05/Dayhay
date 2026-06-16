import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { StockItem, StoreMode } from '../utils/storehouse';
import { formatTime } from '../utils/optimizer';

const PRIORITY_CONFIG = {
  must:   { label: 'MUST STOCK', color: '#C62828', bg: '#FFEBEE' },
  high:   { label: 'HIGH',       color: '#E65100', bg: '#FFF3E0' },
  normal: { label: 'NORMAL',     color: '#5C9E2E', bg: '#F1F8E9' },
  low:    { label: 'LOW',        color: '#B09880', bg: '#F5F0E8' },
};

interface Props {
  item: StockItem;
  mode: StoreMode;
  rank: number;
}

export function StockCard({ item, mode, rank }: Props) {
  const cfg = PRIORITY_CONFIG[item.priority];
  const chainLabel = item.chainMinutes === 0
    ? 'always available'
    : `${formatTime(item.chainMinutes)} to produce`;

  return (
    <View style={styles.card}>
      <Text style={styles.rank}>#{rank}</Text>
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        <Text style={styles.sub}>
          {item.recipeCount} recipe{item.recipeCount !== 1 ? 's' : ''} · {item.totalQtyNeeded} total qty needed
        </Text>
        <Text style={[styles.chain, mode === 'risk' && styles.chainRisk]}>
          ⏱ {chainLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  rank: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    width: 24,
    textAlign: 'center',
  },
  icon: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  sub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  chain: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 1,
  },
  chainRisk: {
    color: '#E65100',
    fontWeight: '600',
  },
});
