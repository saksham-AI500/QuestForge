import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { useGame } from '@/context/GameContext';
import { Icon, IconName } from '@/components/Icon';
import { RootStackParamList, TabParamList } from './types';

import DashboardScreen from '@/screens/DashboardScreen';
import QuestsScreen from '@/screens/QuestsScreen';
import CharacterScreen from '@/screens/CharacterScreen';
import ProgressScreen from '@/screens/ProgressScreen';
import AchievementsScreen from '@/screens/AchievementsScreen';
import QuestFormScreen from '@/screens/QuestFormScreen';
import SettingsScreen from '@/screens/SettingsScreen';

import { LevelUpModal } from '@/components/LevelUpModal';
import { AchievementToast } from '@/components/AchievementToast';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<keyof TabParamList, IconName> = {
  Dashboard: 'home',
  Quests: 'list',
  Character: 'user-circle',
  Progress: 'bar-chart',
  Achievements: 'award',
};

const Tabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.bgElevated,
          borderTopColor: theme.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => <Icon name={TAB_ICONS[route.name as keyof TabParamList]} size={size - 2} color={color} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Character" component={CharacterScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { theme, mode } = useTheme();
  const { pendingLevelUp, clearLevelUpNotice, pendingNewAchievements, clearAchievementNotice } = useGame();

  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.bg,
      card: theme.bgElevated,
      border: theme.border,
      primary: theme.primary,
      text: theme.textPrimary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <View style={styles.flex}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="QuestForm" component={QuestFormScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal' }} />
        </Stack.Navigator>

        <LevelUpModal result={pendingLevelUp} onDismiss={clearLevelUpNotice} />
        <AchievementToast achievements={pendingNewAchievements} onDismiss={clearAchievementNotice} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default RootNavigator;
