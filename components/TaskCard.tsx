import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import type { Task } from "../types/task";

type Props = {
  task: Task;
  onPress: () => void;
  onToggleComplete?: () => void;
};

export default function TaskCard({ task, onPress, onToggleComplete }: Props) {
  const { colors, isDark } = useAppTheme();

  // Helper for priority color badge
  const getPriorityStyle = () => {
    switch (task.priority) {
      case "high":
        return {
          bg: colors.dangerLight,
          text: colors.priorityHigh,
          border: isDark ? "rgba(248, 113, 113, 0.2)" : "rgba(239, 68, 68, 0.15)",
        };
      case "low":
        return {
          bg: colors.successLight,
          text: colors.priorityLow,
          border: isDark ? "rgba(52, 211, 153, 0.2)" : "rgba(16, 185, 129, 0.15)",
        };
      case "medium":
      default:
        return {
          bg: colors.warningLight,
          text: colors.priorityMedium,
          border: isDark ? "rgba(251, 191, 36, 0.2)" : "rgba(217, 119, 6, 0.15)",
        };
    }
  };

  const priorityColors = getPriorityStyle();

  // Format date display
  const getFormattedDate = () => {
    if (!task.dueDate) return { text: "", isOverdue: false };

    // Check if task is overdue (if incomplete and due date is yesterday or earlier)
    const todayStr = new Date().toISOString().split("T")[0];
    const isOverdue = !task.completed && task.dueDate < todayStr;

    const dateObj = new Date(task.dueDate);
    const dateFormatted = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (task.dueDate === todayStr) {
      return { text: "Today", isOverdue: false };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (task.dueDate === yesterdayStr) {
      return { text: "Yesterday", isOverdue };
    }

    return { text: dateFormatted, isOverdue };
  };

  const dueInfo = getFormattedDate();

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {/* Checkbox section - Explicitly styled as a column to prevent wrapping */}
      {onToggleComplete && (
        <Pressable
          onPress={onToggleComplete}
          accessibilityLabel={
            task.completed ? "Mark task incomplete" : "Mark task complete"
          }
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          style={({ pressed }) => [
            styles.checkboxArea,
            pressed && styles.pressed,
          ]}
        >
          <View
            style={[
              styles.checkboxCircle,
              { borderColor: colors.textMuted }, // Darker border color so it is visible on white background
              task.completed && {
                backgroundColor: colors.success,
                borderColor: colors.success,
              },
            ]}
          >
            {task.completed && (
              <Feather name="check" size={12} color="#FFFFFF" />
            )}
          </View>
        </Pressable>
      )}

      {/* Main card info area - flex: 1 column */}
      <Pressable
        onPress={onPress}
        accessibilityLabel={`View details for task: ${task.title}`}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.contentArea,
          pressed && styles.pressed,
          task.completed && styles.completedCard,
        ]}
      >
        {/* Top Row: Title & Priority */}
        <View style={styles.topRow}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              task.completed && styles.completedTitle,
              task.completed && { color: colors.textMuted },
            ]}
            numberOfLines={1}
          >
            {task.title || "Untitled Task"}
          </Text>

          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityColors.bg, borderColor: priorityColors.border },
            ]}
          >
            <Text style={[styles.priorityText, { color: priorityColors.text }]}>
              {task.priority.toUpperCase()}
            </Text>
          </View>

          <Feather name="chevron-right" size={17} color={colors.textMuted} />
        </View>

        {/* Description (if exists) */}
        {task.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}

        {/* Bottom Row: Category & Date */}
        <View style={styles.bottomRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {task.category}
            </Text>
          </View>

          {task.dueDate ? (
            <View style={styles.dateContainer}>
              <Feather
                name="calendar"
                size={12}
                color={dueInfo.isOverdue ? colors.overdue : colors.textMuted}
                style={styles.calendarIcon}
              />
              <Text
                style={[
                  styles.dateText,
                  { color: colors.textMuted },
                  dueInfo.isOverdue && {
                    color: colors.overdue,
                    fontWeight: "600",
                  },
                ]}
              >
                {dueInfo.text}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
    overflow: "hidden",
  },
  checkboxArea: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  contentArea: {
    flex: 1,
    padding: 16,
    paddingLeft: 8,
    flexDirection: "column",
  },
  pressed: {
    opacity: 0.85,
  },
  completedCard: {
    opacity: 0.6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  completedTitle: {
    textDecorationLine: "line-through",
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    width: "100%",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    width: "100%",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  priorityText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
