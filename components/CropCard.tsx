import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Crop } from '../data/crops';
import { formatTime, getEfficiencyColor } from '../utils/optimizer';

interface CropCardProps {
  crop: Crop;
  rank?: number;
  showRank?: boolean;
}

export function CropCard({ crop, rank, showRank }: CropCardProps) {
  const efficiencyColor = getEfficiencyColor(
    crop.coinsPerHour >= 60 ? 'high' : crop.coinsPerHour >= 25 ? 'medium' : 'low'
  );

  return (
    <View style={styles.card}>
      {showRank && rank !== undefined && (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.icon}>{crop.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{crop.name}</Text>
          <Text style={styles.source}>🌱 Field crop</Text>
        </View>
        <View style={[styles.cphBadge, { backgroundColor: efficiencyColor + '20', borderColor: efficiencyColor }]}>
          <Text style={[styles.cphValue, { color: efficiencyColor }]}>{crop.coinsPerHour}</Text>
          <Text style={[styles.cphLabel, { color: efficiencyColor }]}>coins/hr</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⏱</Text>
          <Text style={styles.detailText}>{formatTime(crop.growTimeMinutes)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🪙</Text>
          <Text style={styles.detailText}>{crop.sellPrice} coins</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⭐</Text>
          <Text style={styles.detailText}>Lv.{crop.levelRequired}</Text>
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
});
