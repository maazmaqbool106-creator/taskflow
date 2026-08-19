import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Task } from "../types/task";

const TASKS_STORAGE_KEY = "@taskflow_tasks";
const THEME_STORAGE_KEY = "@taskflow_theme";

// Generate dynamic seed tasks so they show up correctly relative to "today"
const getSeedTasks = (): Task[] => {
  const todayStr = new Date().toISOString().split("T")[0];
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const now = new Date();

  return [
    {
      id: "1",
      title: "Complete React Native project",
      description: "Build the main screens and navigation for the Task Manager.",
      completed: false,
      priority: "high",
      dueDate: todayStr,
      category: "Work",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Study TypeScript",
      description: "Review interfaces, types and generic concepts.",
      completed: false,
      priority: "medium",
      dueDate: todayStr,
      category: "Study",
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Update GitHub README",
      description: "Add project screenshots, features and setup instructions.",
      completed: true,
      priority: "low",
      dueDate: yesterdayStr,
      category: "Work",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ];
};

export async function loadTasks(): Promise<Task[]> {
  try {
    const rawTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!rawTasks) {
      // First-time app load: store and return seed tasks
      const seeds = getSeedTasks();
      await saveTasks(seeds);
      return seeds;
    }
    return JSON.parse(rawTasks);
  } catch (error) {
    console.error("Failed to load tasks from AsyncStorage:", error);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to AsyncStorage:", error);
  }
}

export async function loadThemePreference(): Promise<"light" | "dark" | "system"> {
  try {
    const preference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (preference === "light" || preference === "dark" || preference === "system") {
      return preference;
    }
    return "system";
  } catch (error) {
    console.error("Failed to load theme preference from AsyncStorage:", error);
    return "system";
  }
}

export async function saveThemePreference(theme: "light" | "dark" | "system"): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error("Failed to save theme preference to AsyncStorage:", error);
  }
}
