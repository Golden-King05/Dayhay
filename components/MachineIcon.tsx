import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MachineIconProps {
  machineId: string;
  size?: number;
}

const MACHINE_EMOJI: Record<string, string> = {
  feedMill: '🌾',
  dairy: '🥛',
  sugarMill: '🍬',
  bakery: '🍞',
  sewingMachine: '🧵',
  bbqGrill: '🔥',
  pieOven: '🥧',
  juicer: '🥤',
  popcornPot: '🍿',
  iceCreamMachine: '🍦',
};

const MACHINE_BACKGROUND: Record<string, string> = {
  feedMill: '#E8D5A3',
  dairy: '#D6EAF8',
  sugarMill: '#FADBD8',
  bakery: '#FDEBD0',
  sewingMachine: '#E8DAEF',
  bbqGrill: '#FDEDEC',
  pieOven: '#FEF9E7',
  juicer: '#E8F8F5',
  popcornPot: '#FFF3CD',
  iceCreamMachine: '#FCE4EC',
};

export default function MachineIcon({ machineId, size = 36 }: MachineIconProps) {
  const emoji = MACHINE_EMOJI[machineId] ?? '⚙️';
  const bg = MACHINE_BACKGROUND[machineId] ?? '#F0F0F0';
  const fontSize = size * 0.55;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={{ fontSize }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
