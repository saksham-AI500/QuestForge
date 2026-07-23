import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAILY_REMINDER_ID = 'daily-reminder';
const STREAK_REMINDER_ID = 'streak-reminder';

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'QuestForge Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7C4DFF',
    });
  }

  return finalStatus === 'granted';
};

export const scheduleDailyReminder = async (hour: number, minute: number): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Your quests await ⚔️',
      body: "Check today's quest log and keep your progress moving.",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.CalendarTriggerInput,
  });
};

export const scheduleStreakReminder = async (hour: number, minute: number): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_REMINDER_ID,
    content: {
      title: 'Your streak is at risk 🔥',
      body: "Complete a quest today to keep your streak alive.",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.CalendarTriggerInput,
  });
};

export const cancelDailyReminder = async (): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
};

export const cancelStreakReminder = async (): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID).catch(() => {});
};
