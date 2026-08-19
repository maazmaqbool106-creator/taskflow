import React, { createContext, useCallback, useEffect, useState } from "react";
import { useColorScheme as RNuseColorScheme } from "react-native";
import { loadThemePreference, saveThemePreference } from "../storage/taskStorage";
import { Colors, CardGradients } from "../constants/theme";

type ThemePreference = "light" | "dark" | "system";

type ThemeContextType = {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => Promise<void>;
  theme: "light" | "dark"; // Resolved theme (either light or dark)
  colors: typeof Colors.light;
  cardGradient: readonly [string, string];
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = RNuseColorScheme() ?? "light";
  const [themePreference, setThemeState] = useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Load saved preference on mount
  useEffect(() => {
    async function initTheme() {
      const savedPref = await loadThemePreference();
      setThemeState(savedPref);
    }
    initTheme();
  }, []);

  // Update resolved theme when preference or system scheme changes
  useEffect(() => {
    if (themePreference === "system") {
      setResolvedTheme(systemScheme);
    } else {
      setResolvedTheme(themePreference);
    }
  }, [themePreference, systemScheme]);

  const setThemePreference = useCallback(async (pref: ThemePreference) => {
    setThemeState(pref);
    await saveThemePreference(pref);
  }, []);

  const isDark = resolvedTheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  const cardGradient = isDark ? CardGradients.dark : CardGradients.light;

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        setThemePreference,
        theme: resolvedTheme,
        colors,
        cardGradient,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
