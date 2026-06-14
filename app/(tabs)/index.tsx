import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { products } from '../../data/products';
import { machines } from '../../data/machines';
import { crops } from '../../data/crops';
import { getTopProducts, formatTime } from '../../utils/optimizer';

export default function HomeScreen() {
  const router = useRouter();
  const topProducts = getTopProducts(products, 3);
  const uniqueMachines = new Set(products.map((p) => p.machineId)).size;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>🌾🚜🌽</Text>
          <Text style={styles.heroTitle}>Welcome to{'\n'}Hay Day Optimizer</Text>
          <Text style={styles.heroSubtitle}>Maximize your farm profits with smart production planning</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{uniqueMachines}</Text>
            <Text style={styles.statLabel}>Machines</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{crops.length}</Text>
            <Text style={styles.statLabel}>Crops</Text>
          </View>
        </View>

        {/* Quick Action Cards */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionCards}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#E8F5E9' }]}
            onPress={() => router.push('/optimizer')}
          >
            <Text style={styles.actionEmoji}>⚡</Text>
            <Text style={styles.actionTitle}>Best Products</Text>
            <Text style={styles.actionDesc}>Find highest coins/hour production</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]}
            onPress={() => router.push('/optimizer')}
          >
            <Text style={styles.actionEmoji}>🌾</Text>
            <Text style={styles.actionTitle}>Crop Guide</Text>
            <Text style={styles.actionDesc}>Best crops to grow for profit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#E3F2FD' }]}
            onPress={() => router.push('/products')}
          >
            <Text style={styles.actionEmoji}>📦</Text>
            <Text style={styles.actionTitle}>All Items</Text>
            <Text style={styles.actionDesc}>Browse every product in the game</Text>
          </TouchableOpacity>
        </View>

        {/* Top Producers */}
        <Text style={styles.sectionTitle}>Top Producers 🏆</Text>
        {topProducts.map((product, idx) => (
          <View key={product.id} style={styles.topProductRow}>
            <View style={[styles.topRankBadge, idx === 0 && styles.gold, idx === 1 && styles.silver, idx === 2 && styles.bronze]}>
              <Text style={styles.topRankText}>{idx + 1}</Text>
            </View>
            <Text style={styles.topProductIcon}>{product.icon}</Text>
            <View style={styles.topProductInfo}>
              <Text style={styles.topProductName}>{product.name}</Text>
              <Text style={styles.topProductMachine}>{product.machineEmoji} {product.machineName}</Text>
            </View>
            <View style={styles.topProductStats}>
              <Text style={styles.topProductCPH}>{product.coinsPerHour}</Text>
              <Text style={styles.topProductCPHLabel}>coins/hr</Text>
            </View>
          </View>
        ))}

        {/* Tips */}
        <Text style={styles.sectionTitle}>Pro Tips 💡</Text>
        <View style={styles.tipsCard}>
          {[
            '🥛 Dairy products (Cream, Butter) have excellent coins/hour ratios',
            '🍞 Bakery items use Dairy products for massive profit boosts',
            '⏱ Short production times compound faster — run them continuously',
            '🌾 Wheat is the backbone of many high-value recipes',
            '🔥 BBQ Grill items convert crops into much higher-value goods',
          ].map((tip, i) => (
            <Text key={i} style={styles.tipText}>{tip}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroBanner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#D4EDAA',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  actionCards: {
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    flexWrap: 'wrap',
  },
  topProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gold: { backgroundColor: '#FFD700' },
  silver: { backgroundColor: '#C0C0C0' },
  bronze: { backgroundColor: '#CD7F32' },
  topRankText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  topProductIcon: {
    fontSize: 26,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  topProductMachine: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  topProductStats: {
    alignItems: 'flex-end',
  },
  topProductCPH: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.highEfficiency,
  },
  topProductCPHLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  tipText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 19,
  },
});
