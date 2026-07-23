import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, fontSizes } from '@/constants/theme';
import { Icon } from '@/components/Icon';
import { Card } from '@/components/Card';
import { getSetting, setSetting } from '@/database/logsRepo';
import {
  cancelDailyReminder,
  cancelStreakReminder,
  requestNotificationPermissions,
  scheduleDailyReminder,
  scheduleStreakReminder,
} from '@/utils/notifications';

const REMINDER_TIMES = [
  { label: '8:00 AM', hour: 8, minute: 0 },
  { label: '12:00 PM', hour: 12, minute: 0 },
  { label: '6:00 PM', hour: 18, minute: 0 },
  { label: '9:00 PM', hour: 21, minute: 0 },
];

export const SettingsScreen: React.FC = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [streakReminderEnabled, setStreakReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(REMINDER_TIMES[2]);

  useEffect(() => {
    const daily = getSetting('dailyReminderEnabled');
    const streak = getSetting('streakReminderEnabled');
    const storedHour = getSetting('reminderHour');
    const storedMinute = getSetting('reminderMinute');
    if (daily === 'true') setDailyReminderEnabled(true);
    if (streak === 'true') setStreakReminderEnabled(true);
    if (storedHour && storedMinute) {
      const found = REMINDER_TIMES.find((t) => t.hour === Number(storedHour) && t.minute === Number(storedMinute));
      if (found) setReminderTime(found);
    }
  }, []);

  const handleToggleDaily = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('Permission needed', 'Enable notifications in system settings to use reminders.');
        return;
      }
      await scheduleDailyReminder(reminderTime.hour, reminderTime.minute);
    } else {
      await cancelDailyReminder();
    }
    setDailyReminderEnabled(value);
    setSetting('dailyReminderEnabled', String(value));
  };

  const handleToggleStreak = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('Permission needed', 'Enable notifications in system settings to use reminders.');
        return;
      }
      await scheduleStreakReminder(21, 0);
    } else {
      await cancelStreakReminder();
    }
    setStreakReminderEnabled(value);
    setSetting('streakReminderEnabled', String(value));
  };

  const handleTimeSelect = async (time: typeof REMINDER_TIMES[number]) => {
    setReminderTime(time);
    setSetting('reminderHour', String(time.hour));
    setSetting('reminderMinute', String(time.minute));
    if (dailyReminderEnabled) {
      await scheduleDailyReminder(time.hour, time.minute);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Icon name="chevron-left" size={26} color={theme.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Settings</Text>
          <View style={{ width: 26 }} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
        <Card style={{ marginBottom: spacing.xl }}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Icon name={mode === 'dark' ? 'moon' : 'sun'} size={18} color={theme.textPrimary} />
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Dark Mode</Text>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.cardAlt, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Notifications</Text>
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Icon name="bell" size={18} color={theme.textPrimary} />
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Daily Reminder</Text>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={handleToggleDaily}
              trackColor={{ false: theme.cardAlt, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {dailyReminderEnabled && (
            <View style={styles.timeRow}>
              {REMINDER_TIMES.map((t) => {
                const selected = t.hour === reminderTime.hour && t.minute === reminderTime.minute;
                return (
                  <Pressable
                    key={t.label}
                    onPress={() => handleTimeSelect(t)}
                    style={[
                      styles.timeChip,
                      { backgroundColor: selected ? theme.primary + '22' : theme.cardAlt, borderColor: selected ? theme.primary : theme.border },
                    ]}
                  >
                    <Text style={{ color: selected ? theme.primary : theme.textSecondary, fontSize: fontSizes.xs, fontWeight: '700' }}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Icon name="flame" size={18} color={theme.textPrimary} />
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Streak Reminder (9 PM)</Text>
            </View>
            <Switch
              value={streakReminderEnabled}
              onValueChange={handleToggleStreak}
              trackColor={{ false: theme.cardAlt, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Text style={[styles.footerNote, { color: theme.textMuted }]}>
          QuestForge stores everything locally on your device. No account, no internet connection, and no data
          leaves your phone.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingLabel: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  timeChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  footerNote: {
    fontSize: fontSizes.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});

export default SettingsScreen;
