import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTasks } from "../hooks/useTasks";
import { useAppTheme } from "../hooks/useAppTheme";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Details">;

export default function DetailsScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const { colors, isDark } = useAppTheme();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.notFoundContainer}>
          <Feather name="alert-triangle" size={48} color={colors.danger} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>Task not found</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getPriorityColors = () => {
    switch (task.priority) {
      case "high":
        return {
          bg: colors.dangerLight,
          text: colors.priorityHigh,
          iconColor: colors.priorityHigh,
          border: isDark ? "rgba(248, 113, 113, 0.2)" : "rgba(239, 68, 68, 0.15)",
        };
      case "low":
        return {
          bg: colors.successLight,
          text: colors.priorityLow,
          iconColor: colors.priorityLow,
          border: isDark ? "rgba(52, 211, 153, 0.2)" : "rgba(16, 185, 129, 0.15)",
        };
      case "medium":
      default:
        return {
          bg: colors.warningLight,
          text: colors.priorityMedium,
          iconColor: colors.priorityMedium,
          border: isDark ? "rgba(251, 191, 36, 0.2)" : "rgba(217, 119, 6, 0.15)",
        };
    }
  };

  const pColors = getPriorityColors();

  const formatDate = (dateStr: string, isDateOnly = false) => {
    if (!dateStr) return "None";
    const dateObj = new Date(dateStr);
    
    if (isDateOnly) {
      return dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = !task.completed && task.dueDate && task.dueDate < new Date().toISOString().split("T")[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Priority & Category Row */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: pColors.bg, borderColor: pColors.border, borderWidth: 1 }]}>
            <Feather name="flag" size={12} color={pColors.iconColor} style={styles.badgeIcon} />
            <Text style={[styles.badgeText, { color: pColors.text }]}>
              {task.priority.toUpperCase()} PRIORITY
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: colors.primaryLight, borderColor: colors.primary, borderWidth: 1 }]}>
            <Feather name="tag" size={12} color={colors.primary} style={styles.badgeIcon} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {task.category}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>

        {/* Description Card */}
        {task.description ? (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>DESCRIPTION</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{task.description}</Text>
          </View>
        ) : null}

        {/* Info Grid Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>DETAILS</Text>
          
          {/* Due date */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Feather name="calendar" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Due Date</Text>
            </View>
            <Text
              style={[
                styles.infoValue,
                { color: colors.text },
                isOverdue && { color: colors.overdue, fontWeight: "700" },
              ]}
            >
              {formatDate(task.dueDate, true)} {isOverdue && "(Overdue)"}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Feather
                name={task.completed ? "check-circle" : "clock"}
                size={16}
                color={task.completed ? colors.success : colors.warning}
                style={styles.infoIcon}
              />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status</Text>
            </View>
            <Text style={[styles.infoValue, { color: task.completed ? colors.success : colors.warning }]}>
              {task.completed ? "Completed" : "Pending"}
            </Text>
          </View>

          {/* Created date */}
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Feather name="plus-circle" size={16} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Created</Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
              {formatDate(task.createdAt)}
            </Text>
          </View>

          {/* Updated date */}
          {task.updatedAt && task.updatedAt !== task.createdAt ? (
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <View style={styles.infoLabelContainer}>
                <Feather name="edit-2" size={16} color={colors.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Last Updated</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                {formatDate(task.updatedAt)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={() => toggleTaskCompletion(task.id)}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: task.completed ? colors.border : colors.successLight,
                borderColor: task.completed ? colors.border : colors.success,
              },
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name={task.completed ? "rotate-ccw" : "check"}
              size={18}
              color={task.completed ? colors.textSecondary : colors.success}
              style={styles.actionBtnIcon}
            />
            <Text style={[styles.actionBtnText, { color: task.completed ? colors.textSecondary : colors.success }]}>
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </Text>
          </Pressable>

          <View style={styles.horizontalBtnRow}>
            <Pressable
              onPress={() => navigation.navigate("AddTask", { editTaskId: task.id })}
              style={({ pressed }) => [
                styles.halfBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <Feather name="edit" size={18} color={colors.primary} style={styles.actionBtnIcon} />
              <Text style={[styles.actionBtnText, { color: colors.primary }]}>Edit</Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.halfBtn,
                { backgroundColor: colors.dangerLight, borderColor: colors.danger },
                pressed && styles.pressed,
              ]}
            >
              <Feather name="trash-2" size={18} color={colors.danger} style={styles.actionBtnIcon} />
              <Text style={[styles.actionBtnText, { color: colors.danger }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 20,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  actionsContainer: {
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  horizontalBtnRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionBtnIcon: {
    marginRight: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
