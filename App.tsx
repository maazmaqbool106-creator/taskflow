import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from "@react-navigation/native";
import React from "react";
import { TaskProvider } from "./context/TaskContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useAppTheme } from "./hooks/useAppTheme";
import AppNavigator from "./navigation/AppNavigator";

function MainApp() {
  const { colors, isDark } = useAppTheme();

  const defaultTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme: Theme = {
    ...defaultTheme,
    dark: isDark,
    colors: {
      ...defaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <MainApp />
      </TaskProvider>
    </ThemeProvider>
  );
}
