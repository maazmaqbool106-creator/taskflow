import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTasks } from "../hooks/useTasks";
import { useAppTheme } from "../hooks/useAppTheme";
import TaskCard from "../components/TaskCard";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MainTabs">;
};

const CATEGORIES = ["Work", "Study", "Personal", "Other"] as const;

export default function ExploreScreen({ navigation }: Props) {
  const { tasks, toggleTaskCompletion } = useTasks();
  const { colors, isDark, cardGradient } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Compute category stats
  const catStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catTasks = tasks.filter((t) => t.category === cat);
      const total = catTasks.length;
      const completed = catTasks.filter((t) => t.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        name: cat,
        total,
        completed,
        progress,
      };
    });
  }, [tasks]);

  // Overall calculations for Insights
  const overallStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const todayStr = new Date().toISOString().split("T")[0];
    
    const overdueTasks = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr);
    const highPriorityPending = tasks.filter((t) => !t.completed && t.priority === "high");

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdueCount: overdueTasks.length, overdueTasks, highPriorityPending, rate };
  }, [tasks]);

  const motivationalMessage = useMemo(() => {
    const { total, completed, overdueCount, rate } = overallStats;
    if (total === 0) return "Add some tasks to get started on your productivity journey!";
    if (completed === total) return "Phenomenal job! All tasks completed. Time for a coffee! ☕";
    if (overdueCount > 0) return `You have ${overdueCount} overdue task${overdueCount > 1 ? "s" : ""}. Let's get back on track! ⚠️`;
    if (rate >= 80) return "You are on fire! Almost there. 🔥";
    if (rate >= 50) return "Over halfway completed. Keep going! 🚀";
    return "Small steps lead to big progress. Let's tackle the next task! 📈";
  }, [overallStats]);

  const handleCategoryPress = (catName: string) => {
    setSelectedCategory((prev) => (prev === catName ? null : catName));
  };

  // Get tasks for selected category
  const filteredCategoryTasks = useMemo(() => {
    if (!selectedCategory) return [];
    return tasks.filter((t) => t.category === selectedCategory);
  }, [tasks, selectedCategory]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Categories & Insights</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Tackling tasks logically</Text>
        </View>

        {/* Productivity Message */}
        <LinearGradient
          colors={cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.insightsCard}
        >
          <Feather name="trending-up" size={24} color="#FFFFFF" style={styles.insightIcon} />
          <View style={styles.insightTextContent}>
            <Text style={[styles.insightTitle, { color: "#FFFFFF" }]}>Productivity Insight</Text>
            <Text style={[styles.insightMsg, { color: "rgba(255, 255, 255, 0.85)" }]}>{motivationalMessage}</Text>
          </View>
        </LinearGradient>

        {/* Categories Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {catStats.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            let iconName: "briefcase" | "book-open" | "user" | "check-square" = "check-square";
            
            if (cat.name === "Work") iconName = "briefcase";
            else if (cat.name === "Study") iconName = "book-open";
            else if (cat.name === "Personal") iconName = "user";

            return (
              <Pressable
                key={cat.name}
                onPress={() => handleCategoryPress(cat.name)}
                accessibilityRole="button"
                accessibilityLabel={`Category ${cat.name}. ${cat.total} total tasks, ${cat.progress} percent completed`}
                style={({ pressed }) => [
                  styles.catCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.catHeader}>
                  <View style={[styles.catIconContainer, { backgroundColor: colors.primaryLight }]}>
                    <Feather name={iconName} size={16} color={colors.primary} />
                  </View>
                  
                  {isSelected && (
                    <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </View>

                <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
                
                <View style={styles.catStatsRow}>
                  <Text style={[styles.catCount, { color: colors.textSecondary }]}>
                    {cat.completed}/{cat.total} Tasks
                  </Text>
                  <Text style={[styles.catPercent, { color: colors.primary }]}>
                    {cat.progress}%
                  </Text>
                </View>

                <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${cat.progress}%`, backgroundColor: colors.primary },
                    ]}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Selected Category Task List */}
        {selectedCategory && (
          <View style={styles.selectedTasksContainer}>
            <View style={styles.selectedTasksHeader}>
              <Text style={[styles.selectedTasksTitle, { color: colors.text }]}>
                {selectedCategory} Tasks
              </Text>
              <Pressable onPress={() => setSelectedCategory(null)} style={styles.clearCatBtn}>
                <Text style={[styles.clearCatText, { color: colors.primary }]}>Hide</Text>
              </Pressable>
            </View>

            {filteredCategoryTasks.length > 0 ? (
              filteredCategoryTasks.map((item) => (
                <TaskCard
                  key={item.id}
                  task={item}
                  onPress={() => navigation.navigate("Details", { taskId: item.id })}
                  onToggleComplete={() => toggleTaskCompletion(item.id)}
                />
              ))
            ) : (
              <View style={[styles.emptyCategoryCard, { borderColor: colors.border }]}>
                <Text style={[styles.emptyCategoryText, { color: colors.textMuted }]}>
                  No tasks in this category yet.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Insights Summary Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Metrics</Text>
        
        <View style={styles.metricsGrid}>
          {/* Completion Rate Box */}
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="activity" size={20} color={colors.primary} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: colors.text }]}>{overallStats.rate}%</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Completion Rate</Text>
          </View>

          {/* Pending Tasks Box */}
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="clock" size={20} color={colors.warning} style={styles.metricIcon} />
            <Text style={[styles.metricValue, { color: colors.text }]}>{overallStats.pending}</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Pending Tasks</Text>
          </View>
        </View>

        {/* Urgent Priorities Section */}
        {overallStats.highPriorityPending.length > 0 && (
          <View style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardSectionHeader}>
              <Feather name="alert-circle" size={18} color={colors.danger} style={styles.cardSectionIcon} />
              <Text style={[styles.cardSectionTitle, { color: colors.text }]}>Urgent Attention Required</Text>
            </View>
            <Text style={[styles.cardSectionDesc, { color: colors.textSecondary }]}>
              High priority tasks that are currently pending:
            </Text>
            {overallStats.highPriorityPending.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => navigation.navigate("Details", { taskId: t.id })}
                style={({ pressed }) => [
                  styles.urgentItem,
                  { borderBottomColor: colors.border },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.urgentTitle, { color: colors.text }]} numberOfLines={1}>
                  {t.title}
                </Text>
                <Feather name="chevron-right" size={14} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  insightsCard: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  insightIcon: {
    marginRight: 14,
  },
  insightTextContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  insightMsg: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  catCard: {
    width: "48%", // Grid split (accounting for 12px gap)
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    minHeight: 130,
    justifyContent: "space-between",
  },
  pressed: {
    opacity: 0.8,
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
  },
  catStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 8,
  },
  catCount: {
    fontSize: 11,
    fontWeight: "600",
  },
  catPercent: {
    fontSize: 12,
    fontWeight: "800",
  },
  progressBarBg: {
    height: 5,
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2.5,
  },
  selectedTasksContainer: {
    marginTop: 20,
    gap: 2,
  },
  selectedTasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedTasksTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  clearCatBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  clearCatText: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyCategoryCard: {
    paddingVertical: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCategoryText: {
    fontSize: 13,
    fontWeight: "500",
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.015,
    shadowRadius: 6,
    elevation: 1,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardSection: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.015,
    shadowRadius: 6,
    elevation: 1,
  },
  cardSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardSectionIcon: {
    marginRight: 8,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardSectionDesc: {
    fontSize: 12,
    marginBottom: 10,
  },
  urgentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  urgentTitle: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
});
