# QuestForge — Offline-First RPG Productivity App

An original RPG-inspired productivity app for Android, built with **React Native + Expo + TypeScript**. Complete real-life quests to earn XP, level up, grow character stats, keep streaks alive, and unlock achievements — entirely offline, with all data stored locally in SQLite.

No backend. No Firebase. No external APIs. No internet dependency.

## Features

- **Dashboard** — level, XP bar, rank badge, daily/overall streaks, today's quests, quick add
- **Quest Management** — create/edit/delete/complete, 8 categories, 3 difficulties, optional due dates and notes
- **XP & Leveling** — Easy = 20 XP, Medium = 50 XP, Hard = 100 XP, progressive per-level XP curve, animated level-up modal
- **Character Stats** — Strength, Knowledge, Programming, Health, Focus, Discipline, each grows from relevant quest categories
- **Rank System** — Novice → Explorer → Warrior → Elite → Master → Legend → Ascendant (all original names)
- **Streaks** — daily, study, workout, and overall streaks, each resets independently when its condition is missed
- **Achievements** — 16 auto-unlocking milestones across quests, streaks, levels, and category mastery, with toast notifications
- **Progress** — weekly/monthly bar charts, XP history, category breakdown
- **Local Notifications** — daily reminder (configurable time) and streak reminder, both fully optional
- **Dark/Light Theme** — dark by default, toggle in Settings

## Tech Stack

- React Native 0.74 + Expo SDK 51
- TypeScript (strict mode)
- expo-sqlite (synchronous API) for all persistence
- React Navigation (bottom tabs + native stack)
- expo-notifications for local reminders
- Custom lightweight SVG icon set (no external icon-font dependency)
- Hand-rolled bar charts (no charting library dependency)

## Project Structure

```
App.tsx                     Root entry point (providers + navigator)
src/
  types/                    Shared TypeScript interfaces
  constants/                Theme tokens, ranks, XP curve, categories, achievement defs
  database/                 SQLite schema + repository functions (quests, character, streaks, achievements, logs)
  context/                  ThemeContext (dark/light) + GameContext (central app state)
  utils/                    Leveling math, streak logic, date helpers, achievement evaluator, notifications
  components/               Reusable UI: Card, Button, XPBar, StatBar, QuestCard, RankBadge,
                             StreakCard, AchievementCard, LevelUpModal, AchievementToast,
                             SegmentedPicker, BarChart, ScreenHeader, Icon
  screens/                  Dashboard, Quests, QuestForm, Character, Progress, Achievements, Settings
  navigation/                Bottom tab navigator + stack (modals for QuestForm/Settings)
```

## Architecture Notes

- **All persistence is local SQLite.** `src/database/db.ts` initializes the schema synchronously on app start (character, streaks, and achievement rows are seeded once). Repository files expose typed CRUD functions; there is no ORM.
- **GameContext** is the single source of truth for runtime state. It wraps every quest/character/streak/achievement mutation, keeping the DB and in-memory state in sync, and queues level-up / achievement-unlock events for the UI to display.
- **Leveling** uses a progressive XP curve (`xpRequiredForLevel`) so each level requires more XP than the last. Completing a quest can trigger multiple level-ups at once if enough XP is earned; un-completing a quest safely reverses XP/level (clamped at level 1).
- **Streaks** are evaluated per category: completing a Study/Reading quest bumps the study streak, Fitness/Health bumps the workout streak, and any completion bumps the daily + overall streaks. Only the relevant streak resets if a day is missed — checked via `getEffectiveStreakCount`.
- **Achievements** are evaluated after every quest completion (`evaluateAchievements`) by querying current totals/streaks/level directly from SQLite, so they stay correct even after edits or deletions.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo Go app on an Android device, or an Android emulator (Android Studio)

### Install & Run

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android) or press `a` to launch in an emulator.

### Type-Checking

```bash
npx tsc --noEmit
```

### Building a Production Android Binary

This project is configured for [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile production
```

Alternatively, for a local Gradle build:

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

## Data & Privacy

Every piece of user data (quests, character progress, streaks, achievements, settings) is stored in a local SQLite database on-device (`questforge.db`). Nothing is transmitted anywhere — the app has no network calls and functions fully offline, including on airplane mode.

## Original IP

All names (QuestForge, rank names, category names), colors, iconography, and copy in this app are original creations for this project. No characters, artwork, or branding from any existing game franchise is used or referenced.
