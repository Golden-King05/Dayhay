import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Product } from '../data/products';
import { formatTime, getEfficiencyColor } from '../utils/optimizer';
import { getChainBreakdown, calcChainMinutes } from '../utils/efficiency';
import { MachineIcon } from './MachineIcon';

interface ProductCardProps {
  product: Product;
  rank?: number;
  showRank?: boolean;
}

export function ProductCard({ product, rank, showRank }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false);
  const efficiencyColor = getEfficiencyColor(product.efficiency);

  const chainSteps = expanded ? getChainBreakdown(product.id) : [];
  const chainMinutes = expanded ? calcChainMinutes(product.id) : 0;

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
          <Text style={styles.detailText}>{product.sellPrice} coins</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⭐</Text>
          <Text style={styles.detailText}>Lv.{product.levelRequired}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.chain}>
          <View style={styles.chainHeader}>
            <Text style={styles.chainTitle}>Full production chain</Text>
            <Text style={styles.chainTotal}>{formatTime(chainMinutes)} total</Text>
          </View>
          {chainSteps.map((step, i) => (
            <View
              key={`${step.itemId}-${i}`}
              style={[
                styles.chainRow,
                { paddingLeft: 8 + step.depth * 16 },
                step.isCriticalPath && styles.chainRowCritical,
              ]}
            >
              <Text style={styles.chainIcon}>{step.icon}</Text>
              <View style={styles.chainInfo}>
                <Text style={[styles.chainName, step.isCriticalPath && styles.chainNameCritical]}>
                  {step.quantity > 1 ? `${step.quantity}× ` : ''}{step.name}
                </Text>
              </View>
              <Text style={[styles.chainTime, step.isCriticalPath && styles.chainTimeCritical]}>
                {formatTime(step.ownMinutes)}
                {step.isCriticalPath ? ' ⚠' : ''}
              </Text>
            </View>
          ))}
          <View style={styles.chainFooter}>
            <Text style={styles.chainFooterText}>
              🪙 {product.sellPrice} ÷ {formatTime(chainMinutes)} = {product.coinsPerHour} coins/hr
            </Text>
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
  chain: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chainTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chainTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    gap: 6,
  },
  chainRowCritical: {
    backgroundColor: Colors.accent + '15',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  chainIcon: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  chainInfo: {
    flex: 1,
  },
  chainName: {
    fontSize: 12,
    color: Colors.text,
  },
  chainNameCritical: {
    fontWeight: '700',
    color: Colors.accentDark,
  },
  chainTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chainTimeCritical: {
    color: Colors.accentDark,
    fontWeight: '700',
  },
  chainFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chainFooterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
