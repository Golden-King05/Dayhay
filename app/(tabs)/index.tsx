import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface NavCardProps {
  emoji: string;
  title: string;
  description: string;
  onPress: () => void;
  color: string;
}

function NavCard({ emoji, title, description, onPress, color }: NavCardProps) {
  return (
    <TouchableOpacity
      style={[styles.navCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={styles.navCardEmoji}>{emoji}</Text>
      <View style={styles.navCardText}>
        <Text style={styles.navCardTitle}>{title}</Text>
        <Text style={styles.navCardDesc}>{description}</Text>
      </View>
      <Text style={styles.navCardArrow}>›</Text>
    </TouchableOpacity>
  );
}

interface InfoRowProps {
  emoji: string;
  text: string;
}

function InfoRow({ emoji, text }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoEmoji}>{emoji}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero header */}
        <View style={styles.hero}>
          <View style={styles.heroIconRow}>
            <Text style={styles.heroIcon}>🌾</Text>
            <Text style={styles.heroIcon}>🌽</Text>
            <Text style={styles.heroIcon}>🍎</Text>
          </View>
          <Text style={styles.heroTitle}>Hay Day Optimizer</Text>
          <Text style={styles.heroSubtitle}>
            Maximize your farm's coin production with real-time profit calculations
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatItem value="40+" label="Products" />
          <View style={styles.statsDivider} />
          <StatItem value="10" label="Machines" />
          <View style={styles.statsDivider} />
          <StatItem value="Live" label="Calc" />
        </View>

        {/* Navigation cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <NavCard
            emoji="⚡"
            title="Top Products"
            description="Best coins/hour ranked by efficiency"
            onPress={() => router.push('/(tabs)/optimizer')}
            color={Colors.primary}
          />
          <NavCard
            emoji="📋"
            title="All Items"
            description="Browse and search every product"
            onPress={() => router.push('/(tabs)/products')}
            color={Colors.accent}
          />
          <NavCard
            emoji="🏭"
            title="By Machine"
            description="Filter products by production machine"
            onPress={() => router.push('/(tabs)/optimizer')}
            color={Colors.primaryLight}
          />
        </View>

        {/* About section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it Works</Text>
          <View style={styles.infoCard}>
            <InfoRow
              emoji="⚡"
              text="Coins/hour = (Sell Price ÷ Production Time) × 60"
            />
            <View style={styles.infoSeparator} />
            <InfoRow
              emoji="🟢"
              text="High efficiency: 60+ coins/hour"
            />
            <View style={styles.infoSeparator} />
            <InfoRow
              emoji="🟡"
              text="Medium efficiency: 30–59 coins/hour"
            />
            <View style={styles.infoSeparator} />
            <InfoRow
              emoji="🔴"
              text="Low efficiency: under 30 coins/hour"
            />
            <View style={styles.infoSeparator} />
            <InfoRow
              emoji="✨"
              text="Ingredients marked with * are produced items, not raw crops"
            />
          </View>
        </View>

        {/* Machines section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Machines</Text>
          <View style={styles.machineGrid}>
            {MACHINES.map((m) => (
              <View key={m.id} style={styles.machineChip}>
                <Text style={styles.machineEmoji}>{m.emoji}</Text>
                <Text style={styles.machineName}>{m.name}</Text>
                <Text style={styles.machineLevel}>Lvl {m.level}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🌱 Built for Hay Day farmers who want to earn more coins
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MACHINES = [
  { id: 'feedMill', emoji: '🌾', name: 'Feed Mill', level: 1 },
  { id: 'bakery', emoji: '🍞', name: 'Bakery', level: 2 },
  { id: 'bbqGrill', emoji: '🔥', name: 'BBQ Grill', level: 3 },
  { id: 'sugarMill', emoji: '🍬', name: 'Sugar Mill', level: 5 },
  { id: 'dairy', emoji: '🥛', name: 'Dairy', level: 7 },
  { id: 'sewingMachine', emoji: '🧵', name: 'Sewing', level: 13 },
  { id: 'pieOven', emoji: '🥧', name: 'Pie Oven', level: 14 },
  { id: 'juicer', emoji: '🥤', name: 'Juicer', level: 16 },
  { id: 'popcornPot', emoji: '🍿', name: 'Popcorn Pot', level: 19 },
  { id: 'iceCreamMachine', emoji: '🍦', name: 'Ice Cream', level: 24 },
];

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero
  hero: {
    backgroundColor: Colors.primary,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroIconRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  heroIcon: {
    fontSize: 36,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryDark,
    marginTop: -1,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.accentLight,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },

  // Sections
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  // Nav cards
  navCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navCardEmoji: {
    fontSize: 28,
  },
  navCardText: {
    flex: 1,
  },
  navCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  navCardDesc: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 16,
  },
  navCardArrow: {
    fontSize: 22,
    color: Colors.textMuted,
    fontWeight: '300',
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    gap: 10,
  },
  infoEmoji: {
    fontSize: 18,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    fontWeight: '500',
  },
  infoSeparator: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // Machine grid
  machineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  machineChip: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: '28%',
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  machineEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  machineName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  machineLevel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // Footer
  footer: {
    marginTop: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
