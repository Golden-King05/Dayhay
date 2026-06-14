import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { ProductWithStats } from '../utils/optimizer';
import { formatTime } from '../utils/optimizer';
import MachineIcon from './MachineIcon';

interface ProductCardProps {
  product: ProductWithStats;
  style?: ViewStyle;
  rank?: number;
}

function getEfficiencyColor(efficiency: 'high' | 'medium' | 'low'): string {
  if (efficiency === 'high') return Colors.highEfficiency;
  if (efficiency === 'medium') return Colors.medEfficiency;
  return Colors.lowEfficiency;
}

function getEfficiencyLabel(efficiency: 'high' | 'medium' | 'low'): string {
  if (efficiency === 'high') return 'High';
  if (efficiency === 'medium') return 'Med';
  return 'Low';
}

export default function ProductCard({ product, style, rank }: ProductCardProps) {
  const efficiencyColor = getEfficiencyColor(product.efficiency);

  return (
    <View style={[styles.card, style]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        {rank !== undefined && (
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{rank}</Text>
          </View>
        )}
        <Text style={styles.emoji}>{product.emoji ?? '📦'}</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.machineRow}>
            <MachineIcon machineId={product.machineId} size={20} />
            <Text style={styles.machineName}>{product.machineName}</Text>
          </View>
        </View>
        {/* Coins/hour badge */}
        <View style={[styles.cphBadge, { backgroundColor: efficiencyColor }]}>
          <Text style={styles.cphValue}>{product.coinsPerHour}</Text>
          <Text style={styles.cphLabel}>coins/hr</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>⏱ Time</Text>
          <Text style={styles.statValue}>{formatTime(product.productionMinutes)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>🪙 Price</Text>
          <Text style={styles.statValue}>{product.sellPrice}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>⭐ Level</Text>
          <Text style={styles.statValue}>{product.level}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Efficiency</Text>
          <Text style={[styles.efficiencyText, { color: efficiencyColor }]}>
            {getEfficiencyLabel(product.efficiency)}
          </Text>
        </View>
      </View>

      {/* Ingredients */}
      <View style={styles.ingredientsSection}>
        <Text style={styles.ingredientsTitle}>Ingredients:</Text>
        <View style={styles.ingredientsList}>
          {product.ingredients.map((ing, idx) => (
            <View key={`${ing.itemId}-${idx}`} style={styles.ingredientChip}>
              <Text style={styles.ingredientText}>
                {ing.quantity}x {ing.name}
                {ing.isProduct ? ' *' : ''}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 30,
  },
  titleBlock: {
    flex: 1,
    marginLeft: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  machineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  machineName: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  cphBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 64,
  },
  cphValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  cphLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  efficiencyText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ingredientsSection: {
    marginTop: 2,
  },
  ingredientsTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  ingredientChip: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ingredientText: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '500',
  },
});
