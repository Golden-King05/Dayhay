import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FISH_CHAIN_MINUTES } from '../data/fishing';

const STORAGE_KEY = '@hayday/fishEnabled';

export function useFishSetting() {
  const [fishEnabled, setFishEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val !== null) setFishEnabled(val === 'true');
    });
  }, []);

  const toggleFish = useCallback(() => {
    setFishEnabled((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return {
    fishEnabled,
    fishMinutes: fishEnabled ? FISH_CHAIN_MINUTES : 0,
    toggleFish,
  };
}
