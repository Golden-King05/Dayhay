import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  scheduleReadyNotification,
  cancelNotification,
  requestNotificationPermission,
} from '../utils/notifications';

const STORAGE_KEY = 'hay_day_timers';

export interface ActiveTimer {
  id: string;
  productId: string;
  productName: string;
  productIcon: string;
  category: 'crop' | 'machine';
  startedAt: number;
  durationMinutes: number;
  finishesAt: number;
  notificationId: string;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useTimers() {
  const [timers, setTimers] = useState<ActiveTimer[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestNotificationPermission().then(setPermissionGranted);
    loadTimers();
  }, []);

  async function loadTimers() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setTimers(JSON.parse(raw));
    } catch {}
  }

  async function saveTimers(updated: ActiveTimer[]) {
    setTimers(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const addTimer = useCallback(
    async (
      productId: string,
      productName: string,
      productIcon: string,
      category: 'crop' | 'machine',
      durationMinutes: number,
      startedMinutesAgo = 0
    ) => {
      const startedAt = Date.now() - startedMinutesAgo * 60 * 1000;
      const finishesAt = startedAt + durationMinutes * 60 * 1000;
      const finishDate = new Date(finishesAt);

      let notificationId = '';
      if (finishesAt > Date.now()) {
        notificationId = await scheduleReadyNotification(
          productName,
          productIcon,
          finishDate
        );
      }

      const timer: ActiveTimer = {
        id: generateId(),
        productId,
        productName,
        productIcon,
        category,
        startedAt,
        durationMinutes,
        finishesAt,
        notificationId,
      };

      const updated = [...timers, timer];
      await saveTimers(updated);
      return timer;
    },
    [timers]
  );

  const removeTimer = useCallback(
    async (timerId: string) => {
      const timer = timers.find((t) => t.id === timerId);
      if (timer?.notificationId) {
        await cancelNotification(timer.notificationId);
      }
      const updated = timers.filter((t) => t.id !== timerId);
      await saveTimers(updated);
    },
    [timers]
  );

  const clearFinished = useCallback(async () => {
    const now = Date.now();
    const updated = timers.filter((t) => t.finishesAt > now);
    await saveTimers(updated);
  }, [timers]);

  return { timers, addTimer, removeTimer, clearFinished, permissionGranted };
}
