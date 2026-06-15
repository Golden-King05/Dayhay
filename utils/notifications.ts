import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) return false;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReadyNotification(
  productName: string,
  productIcon: string,
  finishesAt: Date
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${productIcon} ${productName} is ready!`,
      body: 'Time to harvest — tap to open Hay Day Optimizer.',
      sound: true,
      badge: 1,
    },
    trigger: { date: finishesAt },
  });
  return id;
}

export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
