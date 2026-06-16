import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Tree } from '../data/trees';
import { formatTime, getEfficiencyColor } from '../utils/optimizer';

interface TreeCardProps {
  tree: Tree;
  rank?: number;
  showRank?: boolean;
}

export function TreeCard({ tree, rank, showRank }: TreeCardProps) {
  const efficiencyColor = getEfficiencyColor(
    tree.coinsPerHour >= 60 ? 'high' : tree.coinsPerHour >= 25 ? 'medium' : 'low'
  );
  const lifetimeProfit = Math.round(tree.perCycleRevenue * tree.lifetimeCycles - tree.purchaseCost);

  return (
    <View style={styles.card}>
      {showRank && rank !== undefined && (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.icon}>{tree.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{tree.name}</Text>
          <Text style={styles.source}>
            🌳 {tree.plantName} · {tree.paybackCycles} cycles to break even
          </Text>
        </View>
        <View style={[styles.cphBadge, { backgroundColor: efficiencyColor + '20', borderColor: efficiencyColor }]}>
          <Text style={[styles.cphValue, { color: efficiencyColor }]}>{tree.coinsPerHour}</Text>
          <Text style={[styles.cphLabel, { color: efficiencyColor }]}>coins/hr</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⏱</Text>
          <Text style={styles.detailText}>{formatTime(tree.cycleMinutes)}/cycle</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🪙</Text>
          <Text style={styles.detailText}>{tree.perCycleRevenue} per cycle</Text>
        </View>
      </View>
      <View style={styles.investmentRow}>
        <Text style={styles.investmentText}>
          💸 {tree.purchaseCost} coins upfront · 🌱 {tree.lifetimeCycles} cycles · net {lifetimeProfit} lifetime
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  rankText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  source: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cphBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    minWidth: 72,
  },
  cphValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  cphLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailIcon: {
    fontSize: 12,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  investmentRow: {
    marginTop: 6,
  },
  investmentText: {
    fontSize: 11,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});
