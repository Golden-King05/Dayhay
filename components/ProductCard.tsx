import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Product } from '../data/products';
import { formatTime, getEfficiencyColor } from '../utils/optimizer';
import { MachineIcon } from './MachineIcon';

interface ProductCardProps {
  product: Product;
  rank?: number;
  showRank?: boolean;
}

export function ProductCard({ product, rank, showRank }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false);
  const efficiencyColor = getEfficiencyColor(product.efficiency);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.85}
    >
      {showRank && rank !== undefined && (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.productIcon}>{product.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.machineRow}>
            <MachineIcon emoji={product.machineEmoji} size={14} />
            <Text style={styles.machineName}>{product.machineName}</Text>
          </View>
        </View>
        <View style={styles.stats}>
          <View style={[styles.cphBadge, { backgroundColor: efficiencyColor + '20', borderColor: efficiencyColor }]}>
            <Text style={[styles.cphValue, { color: efficiencyColor }]}>
              {product.coinsPerHour}
            </Text>
            <Text style={[styles.cphLabel, { color: efficiencyColor }]}>coins/hr</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⏱</Text>
          <Text style={styles.detailText}>{formatTime(product.productionMinutes)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🪙</Text>
          <Text style={styles.detailText}>{product.sellPrice}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⭐</Text>
          <Text style={styles.detailText}>Lv.{product.levelRequired}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.ingredients}>
          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          <View style={styles.ingredientsList}>
            {product.ingredients.map((ing) => (
              <View key={ing.itemId} style={styles.ingredientChip}>
                <Text style={styles.ingredientIcon}>{ing.icon}</Text>
                <Text style={styles.ingredientText}>{ing.quantity}x {ing.itemName}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
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
  productIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  machineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  machineName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  stats: {
    alignItems: 'flex-end',
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
    gap: 12,
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
  ingredients: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 3,
  },
  ingredientIcon: {
    fontSize: 13,
  },
  ingredientText: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '500',
  },
});
