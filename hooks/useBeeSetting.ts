import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_BEE_NESTS } from '../data/bees';

const STORAGE_KEY = '@hayday/beeNests';

export function useBeeSetting() {
  const [beeNests, setBeeNests] = useState(1);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val !== null) setBeeNests(Math.max(1, Math.min(MAX_BEE_NESTS, parseInt(val) || 1)));
    });
  }, []);

  const setNests = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(MAX_BEE_NESTS, n));
    setBeeNests(clamped);
    AsyncStorage.setItem(STORAGE_KEY, String(clamped));
  }, []);

  return { beeNests, setNests };
}
