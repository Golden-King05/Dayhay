import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@hayday/ownedTrees';

export function useTreeSetting() {
  const [ownedTreeIds, setOwnedTreeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          setOwnedTreeIds(new Set(JSON.parse(val) as string[]));
        } catch {}
      }
    });
  }, []);

  const toggleTree = useCallback((treeId: string) => {
    setOwnedTreeIds((prev) => {
      const next = new Set(prev);
      if (next.has(treeId)) next.delete(treeId);
      else next.add(treeId);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { ownedTreeIds, toggleTree };
}
