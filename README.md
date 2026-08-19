# TaskFlow — React Native Task Manager 🚀

TaskFlow is a production-quality, portfolio-grade Task Management mobile application built with **React Native**, **Expo**, **TypeScript**, and **React Navigation**. It is designed with clean architectural practices, local storage persistence, responsive styling, and complete system-dark/light theme synchronization.

Designed for maximum performance and fluid animations, TaskFlow provides a comprehensive overview of tasks categorized by life domains, paired with high-quality productivity metrics.

---

## 🎨 Visual Preview

> [!NOTE]
> *App Icon & Interface Design: Custom modern checkmark symbol overlaying flat abstract task list cards on a rich violet-indigo gradient background matching the app's visual guidelines.*

```
+-------------------------------------------------------------+
|                                                             |
|                       [ SCREENSHOTS ]                       |
|   (Placeholder for HomeScreen, DetailsScreen, AddTaskScreen,  |
|         ExploreScreen in Light and Dark theme configurations)    |
|                                                             |
+-------------------------------------------------------------+
```

---

## 🔥 Features

- 📱 **Robust Task CRUD:** Add, view, edit, and delete tasks with instant feedback.
- ⚡ **Instant Completion Toggle:** Toggle task status directly from the task list with haptic touch feedback.
- 📆 **Custom Calendar Date Picker:** Fully stylized, high-fidelity grid calendar selector supporting custom date assignments.
- 🧭 **Dashboard Overview:** Displays today's task statistics (Pending, Completed, Overdue), dynamic time-sensitive greetings, and completion progress bars.
- 📊 **Category Insights:** Breaks tasks down into **Work**, **Study**, **Personal**, and **Other** with individual statistics and list indicators.
- 🔍 **Real-time Search:** Filter tasks dynamically by typing title, description, or category keywords.
- 🎛️ **Advanced Filters & Sorting:** Filter by status, priority level, and categories. Sort by due date, priority severity, and creation timestamp.
- 🌗 **System-synced Dark Mode:** Fully dynamic theme engine which syncs automatically with the system scheme or allows manually overriding settings (persisted locally).
- 💾 **Offline-first Architecture:** Persists tasks and setting configurations locally via `AsyncStorage`.
- ♿ **Accessible Interface:** Strictly structured around accessibility labels, checked state hooks, and accessible touch target areas (minimum 44x44 dp).

---

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev) + [Expo (SDK 54)](https://expo.dev)
- **Language:** [TypeScript](https://www.typescriptlang.org) (100% type-safe compilation)
- **Navigation:** [React Navigation (v7)](https://reactnavigation.org)
- **Local Persistence:** [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)
- **Feedback:** [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- **Icons:** [@expo/vector-icons (Feather, MaterialIcons)](https://icons.expo.fyi)

---

## 🏗️ Architecture Overview

The codebase is structured around clean, decoupled architectural layers ensuring separation of concerns:

```
├── assets/                  # Branding files and media
│   └── images/              # Dynamic custom checkmark assets (icon, splash)
├── components/              # Decoupled UI components
│   ├── ui/                  # Atom-level templates
│   ├── DatePickerModal.tsx  # Custom scrollable calendar modal picker
│   ├── FilterSortModal.tsx  # Bottom-sheet filter coordinator
│   └── TaskCard.tsx         # List view card with checkbox trigger
├── constants/               # Global configurations
│   └── theme.ts             # Spacing, typography, and light/dark colors
├── context/                 # Application state providers
│   ├── TaskContext.tsx      # Coordinates task logic and state persistence
│   └── ThemeContext.tsx     # Computes color scheme and stores preferences
├── hooks/                   # Reusable business logic hooks
│   ├── useTasks.ts          # State accessor for task lists and CRUD functions
│   └── useAppTheme.ts       # Accessor for resolved colors and toggle options
├── navigation/              # Route config
│   └── AppNavigator.tsx     # Stack and Tab coordinators (strongly typed)
├── screens/                 # Component views (HomeScreen, DetailsScreen, AddTaskScreen, ExploreScreen)
├── storage/                 # Data persistence Layer
│   └── taskStorage.ts       # Directly handles AsyncStorage calls for tasks/themes
└── types/                   # TypeScript interfaces
    └── task.ts              # Custom Task structural definitions
```

- **Persistence Layer:** AsyncStorage interactions are completely isolated inside `storage/taskStorage.ts`.
- **State Management:** Logic is centralized in `context/` providers to prevent prop-drilling. Screens consume parameters and operations directly through dedicated custom hooks (`useTasks`, `useAppTheme`).
- **Navigation Safety:** Tab and Stack navigators are fully checked by TS compiler. Route params utilize strong types (e.g. `DetailsScreen` reads dynamic `taskId` lookup).

---

## 🚀 Setup & Installation

Follow these steps to run the application locally on your emulator, device, or browser:

### 1. Clone the repository
```bash
git clone <repository-url>
cd react-native-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Expo developer server
```bash
npm start
```

### 4. Run on a simulator or device
- **Android Emulator:** Press `a` in the terminal to boot the project.
- **iOS Simulator:** Press `i` in the terminal (requires macOS).
- **Physical Device:** Download the **Expo Go** application on your phone and scan the QR code displayed in the terminal/browser.
- **Web Interface:** Press `w` in the terminal to view in your browser.

---

## 🛠️ Verification & Quality Checks

Run the compiler checks to ensure clean execution:

```bash
# Verify TypeScript Type Safety
npx tsc --noEmit

# Run ESLint validation
npm run lint
```

---

## 📈 Future Enhancements

- 🔔 **Local Push Notifications:** Schedule notification alerts before task due dates occur.
- 📁 **Sub-task Checklists:** Support nesting checklists within tasks for granular progress tracking.
- 🔁 **Recurring Tasks:** Support daily, weekly, or monthly repetition configurations.
- 📊 **Productivity Graphs:** Display monthly completion trends and category ratios using data charts.
- ☁️ **Cloud Synchronization:** Add Firebase/Supabase backup compatibility when offline states resolve.
