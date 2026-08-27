import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#4F46E5", // Premium Indigo
    secondary: "#7C3AED", // Violet
    accent: "#EC4899", // Accent Pink
    primaryLight: "#EEF2FF", // Soft indigo tint
    background: "#F8FAFC", // Clean Slate-50 background
    card: "#FFFFFF", // Crisp White cards
    text: "#0F172A", // Slate-900 for primary typography
    textSecondary: "#475569", // Slate-600 for secondary descriptions
    textMuted: "#64748B", // Slate-500 for captions/details
    border: "#E2E8F0", // Slate-200 for clean structural borders
    borderSoft: "#F1F5F9", // Slate-100 for very soft dividers
    icon: "#64748B", // Icon Slate-500
    tabIconDefault: "#94A3B8", // Tab default
    tabIconSelected: "#4F46E5",
    
    // Status colors
    success: "#10B981", // Emerald-500
    successLight: "#D1FAE5",
    warning: "#F59E0B", // Amber-500
    warningLight: "#FEF3C7",
    danger: "#EF4444", // Red-500
    dangerLight: "#FEE2E2",
    
    // Overdue indicator
    overdue: "#EF4444",
    overdueLight: "#FEE2E2",
    
    // Priorities
    priorityLow: "#10B981",
    priorityMedium: "#D97706",
    priorityHigh: "#EF4444",
    
    shadow: "#0F172A",
    tint: "#4F46E5",
  },
  dark: {
    primary: "#818CF8", // Indigo-400
    secondary: "#A78BFA", // Violet-400
    accent: "#F472B6", // Pink Accent
    primaryLight: "rgba(129, 140, 248, 0.12)", // Soft glowing tint
    background: "#0B0F19", // Deep midnight background
    card: "#151B2C", // Elegant slate-navy card
    text: "#F8FAFC", // Slate-50 for high-contrast white text
    textSecondary: "#CBD5E1", // Slate-300 for clean descriptions
    textMuted: "#94A3B8", // Slate-400 for secondary details
    border: "#223049", // Slate border for dark card outlines
    borderSoft: "#1C253B", // Softer border dividers
    icon: "#94A3B8",
    tabIconDefault: "#4E5770",
    tabIconSelected: "#818CF8",
    
    // Status colors
    success: "#34D399",
    successLight: "rgba(52, 211, 153, 0.15)",
    warning: "#FBBF24",
    warningLight: "rgba(251, 191, 36, 0.15)",
    danger: "#F87171",
    dangerLight: "rgba(248, 113, 113, 0.15)",
    
    // Overdue indicator
    overdue: "#F87171",
    overdueLight: "rgba(248, 113, 113, 0.15)",
    
    // Priorities
    priorityLow: "#34D399",
    priorityMedium: "#FBBF24",
    priorityHigh: "#F87171",
    
    shadow: "#000000",
    tint: "#818CF8",
  },
};

export const CardGradients = {
  light: ["#4F46E5", "#7C3AED"] as const,
  dark: ["#7C3AED", "#4F46E5"] as const,
};

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "Times New Roman",
    rounded: "System",
    mono: "Courier New",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
