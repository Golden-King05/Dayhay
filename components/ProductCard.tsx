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
import { getChainBreakdown, calcChainMinutes, calcCraftingValue } from '../utils/efficiency';
import { buildProductionPlan } from '../utils/planner';
import { MachineIcon } from './MachineIcon';
import { FISH_CHAIN_MINUTES } from '../data/fishing';

interface ProductCardProps {
  product: Product;
  rank?: number;
  showRank?: boolean;
  fishMinutes?: number;
  ownedTreeIds?: Set<string>;
}

const QUICK_QTYS = [1, 2, 5, 10];

export function ProductCard({ product, rank, showRank, fishMinutes = FISH_CHAIN_MINUTES, ownedTreeIds = new Set() }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [planQty, setPlanQty] = useState(1);
  const efficiencyColor = getEfficiencyColor(product.efficiency);

  const chainSteps = expanded ? getChainBreakdown(product.id, 1, 0, new Set(), fishMinutes, ownedTreeIds) : [];
  const chainMinutes = expanded ? calcChainMinutes(product.id, new Set(), fishMinutes, ownedTreeIds) : 0;
  const craftingValue = calcCraftingValue(product);
  const plan = (expanded && showPlanner) ? buildProductionPlan(product.id, planQty) : null;

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

      {craftingValue.ingredientValue > 0 && (
        <View style={[
          styles.profitSummary,
          craftingValue.craftingProfit >= 0 ? styles.profitSummaryPositive : styles.profitSummaryNegative,
        ]}>
          <Text style={[
            styles.profitSummaryText,
            { color: craftingValue.craftingProfit >= 0 ? '#2E7D32' : '#C62828' },
          ]}>
            {craftingValue.craftingProfit >= 0 ? '💰' : '⚠️'}
            {' '}{craftingValue.craftingProfit >= 0 ? '+' : ''}{craftingValue.craftingProfit} coins vs raw
            {'  '}({craftingValue.markupPercent >= 0 ? '+' : ''}{craftingValue.markupPercent}%)
          </Text>
          <Text style={styles.profitSummaryRaw}>
            raw: {craftingValue.ingredientValue} → crafted: {craftingValue.sellPrice}
          </Text>
        </View>
      )}

      {product.ingredients.some((i) => i.itemId === 'gem') && (
        <View style={styles.gemWarning}>
          <Text style={styles.gemWarningText}>
            💎 Requires a Gem — an extremely rare premium currency. Gems can also permanently upgrade machines to add extra production slots. Only craft this if you can truly spare one.
          </Text>
        </View>
      )}

      {expanded && (
        <View style={styles.chain}>
          {/* Tab bar: Chain | Planner */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, !showPlanner && styles.tabActive]}
              onPress={(e) => { e.stopPropagation?.(); setShowPlanner(false); }}
            >
              <Text style={[styles.tabText, !showPlanner && styles.tabTextActive]}>⛓ Chain</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, showPlanner && styles.tabActive]}
              onPress={(e) => { e.stopPropagation?.(); setShowPlanner(true); }}
            >
              <Text style={[styles.tabText, showPlanner && styles.tabTextActive]}>📋 Planner</Text>
            </TouchableOpacity>
          </View>

          {!showPlanner ? (
            <>
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
                  🪙 {product.sellPrice * product.quantityPerRun} ÷ {formatTime(chainMinutes)} = {product.coinsPerHour} coins/hr
                </Text>
              </View>
            </>
          ) : (
            <View>
              {/* Quantity picker */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={(e) => { e.stopPropagation?.(); setPlanQty(Math.max(1, planQty - 1)); }}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{planQty}×</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={(e) => { e.stopPropagation?.(); setPlanQty(planQty + 1); }}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <View style={styles.qtyQuickBtns}>
                  {QUICK_QTYS.map((q) => (
                    <TouchableOpacity
                      key={q}
                      style={[styles.qtyQuick, planQty === q && styles.qtyQuickActive]}
                      onPress={(e) => { e.stopPropagation?.(); setPlanQty(q); }}
                    >
                      <Text style={[styles.qtyQuickText, planQty === q && styles.qtyQuickTextActive]}>
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.planHeading}>
                To make {planQty}× {product.icon} {product.name}:
              </Text>

              {plan && plan.craftNeeds.length > 0 && (
                <>
                  <Text style={styles.planSectionLabel}>⚙️ Also craft</Text>
                  {plan.craftNeeds.map((c) => (
                    <View key={c.itemId} style={styles.planRow}>
                      <Text style={styles.planIcon}>{c.icon}</Text>
                      <Text style={styles.planName}>{c.quantity}× {c.name}</Text>
                      <Text style={styles.planMeta}>{c.machineEmoji} {formatTime(c.productionMinutes)} ea</Text>
                    </View>
                  ))}
                </>
              )}

              {plan && plan.rawNeeds.length > 0 && (
                <>
                  <Text style={styles.planSectionLabel}>🌱 Farm / gather</Text>
                  {plan.rawNeeds.map((r) => (
                    <View key={r.itemId} style={styles.planRow}>
                      <Text style={styles.planIcon}>{r.icon}</Text>
                      <Text style={styles.planName}>{r.quantity}× {r.name}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary + '18',
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
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
  profitSummary: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  profitSummaryPositive: {
    backgroundColor: '#2E7D3210',
    borderColor: '#2E7D3230',
  },
  profitSummaryNegative: {
    backgroundColor: '#C6282810',
    borderColor: '#C6282830',
  },
  profitSummaryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  profitSummaryRaw: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  gemWarning: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4A148C10',
    borderWidth: 1,
    borderColor: '#4A148C40',
  },
  gemWarningText: {
    fontSize: 11,
    color: '#4A148C',
    fontWeight: '600',
    lineHeight: 16,
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
  // Planner styles
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 24,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    minWidth: 36,
    textAlign: 'center',
  },
  qtyQuickBtns: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 4,
  },
  qtyQuick: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyQuickActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  qtyQuickText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  qtyQuickTextActive: {
    color: '#fff',
  },
  planHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  planSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 3,
  },
  planIcon: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  planName: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  planMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
