import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#4F46E5", // Deep Premium Indigo
    secondary: "#7C3AED", // Amethyst Violet
    accent: "#EC4899", // Neon Pink
    primaryLight: "#F0F0FF", // Rich soft indigo overlay
    background: "#F9FAFB", // Extremely clean warm light gray
    card: "#FFFFFF",
    text: "#111827", // Bold slate 900
    textSecondary: "#374151", // Readable gray 700
    textMuted: "#6B7280", // Legible gray 500 for secondary details
    border: "#D1D5DB", // Slate 300 (solid and visible border)
    borderSoft: "#E5E7EB", // Clean gray 200
    icon: "#4B5563", // Gray 600
    tabIconDefault: "#9CA3AF", // Gray 400
    tabIconSelected: "#4F46E5",
    
    // Status colors
    success: "#10B981", // Emerald 500
    successLight: "#D1FAE5",
    warning: "#F59E0B", // Amber 500
    warningLight: "#FEF3C7",
    danger: "#EF4444", // Red 500
    dangerLight: "#FEE2E2",
    
    // Overdue indicator
    overdue: "#EF4444",
    overdueLight: "#FEE2E2",
    
    // Priorities
    priorityLow: "#10B981",
    priorityMedium: "#D97706", // Legible Amber
    priorityHigh: "#EF4444",
    
    shadow: "#111827",
    tint: "#4F46E5",
  },
  dark: {
    primary: "#818CF8", // Bright Neon Indigo
    secondary: "#A78BFA", // Lighter Amethyst
    accent: "#F472B6", // Rose Accent
    primaryLight: "rgba(129, 140, 248, 0.15)", // Glowing primary overlay
    background: "#090A1A", // Dark outer space
    card: "#12142B", // Deep navy-indigo card
    text: "#F9FAFB", // Pure warm white
    textSecondary: "#D1D5DB", // Soft gray 300
    textMuted: "#7C80B0", // High contrast muted violet
    border: "#2A2E5A", // Semi-transparent bright borders
    borderSoft: "#1B1E40",
    icon: "#9CA3AF",
    tabIconDefault: "#4E5380",
    tabIconSelected: "#818CF8",
    
    // Status colors
    success: "#10B981",
    successLight: "rgba(16, 185, 129, 0.15)",
    warning: "#FBBF24",
    warningLight: "rgba(245, 158, 11, 0.15)",
    danger: "#F87171",
    dangerLight: "rgba(239, 68, 68, 0.15)",
    
    // Overdue indicator
    overdue: "#F87171",
    overdueLight: "rgba(239, 68, 68, 0.15)",
    
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
