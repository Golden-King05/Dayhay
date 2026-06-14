import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface MachineIconProps {
  emoji: string;
  size?: number;
}

export function MachineIcon({ emoji, size = 24 }: MachineIconProps) {
  return (
    <View style={[styles.container, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
      <Text style={{ fontSize: size * 0.75 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
});
