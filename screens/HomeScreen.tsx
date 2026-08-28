import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FilterSortModal from "../components/FilterSortModal";
import TaskCard from "../components/TaskCard";
import { useAppTheme } from "../hooks/useAppTheme";
import { useTasks } from "../hooks/useTasks";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "MainTabs">;
};

export default function HomeScreen({ navigation }: Props) {
  const { tasks, toggleTaskCompletion, refreshTasks, clearTasks } = useTasks();
  const { colors, isDark, themePreference, setThemePreference, cardGradient } =
    useAppTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Search, filter, sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "Work" | "Study" | "Personal" | "Other"
  >("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">(
    "dueDate",
  );

  // Dynamic values
  const greeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning ☀️";
    if (hr < 17) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    const todayStr = new Date().toISOString().split("T")[0];
    const overdue = tasks.filter(
      (t) => !t.completed && t.dueDate && t.dueDate < todayStr,
    ).length;

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, progress };
  }, [tasks]);

  // Filter & Sort Logic
  const processedTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      // Search query
      const matchSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      // Status filter
      if (filterStatus === "pending" && task.completed) return false;
      if (filterStatus === "completed" && !task.completed) return false;

      // Priority filter
      if (filterPriority !== "all" && task.priority !== filterPriority)
        return false;

      // Category filter
      if (filterCategory !== "all" && task.category !== filterCategory)
        return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === "priority") {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === "createdAt") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [
    tasks,
    searchQuery,
    filterStatus,
    filterPriority,
    filterCategory,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
    setFilterCategory("all");
    setSortBy("dueDate");
  };

  const hasActiveFilters =
    filterStatus !== "all" ||
    filterPriority !== "all" ||
    filterCategory !== "all" ||
    sortBy !== "dueDate";

  const toggleTheme = () => {
    if (themePreference === "system") {
      setThemePreference("light");
    } else if (themePreference === "light") {
      setThemePreference("dark");
    } else {
      setThemePreference("system");
    }
  };

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
      clearTasks();
      navigation.replace("Login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshTasks();
    } finally {
      setRefreshing(false);
    }
  };

  const getThemeIconName = () => {
    if (themePreference === "system") return "monitor";
    if (themePreference === "light") return "sun";
    return "moon";
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {greeting}
            </Text>
            <Text style={[styles.heading, { color: colors.text }]}>
              TaskFlow
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>
              {formattedDate}
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {/* Quick theme toggler */}
              <Pressable
                onPress={toggleTheme}
                accessibilityLabel={`Change theme. Current preference is ${themePreference}`}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.themeIconContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && styles.pressed,
                ]}
              >
                <Feather
                  name={getThemeIconName()}
                  size={18}
                  color={colors.primary}
                />
              </Pressable>

              {/* Change Password button */}
              <Pressable
                onPress={() => navigation.navigate("ChangePassword")}
                accessibilityLabel="Change password"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.themeIconContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && styles.pressed,
                ]}
              >
                <Feather
                  name="key"
                  size={18}
                  color={colors.primary}
                />
              </Pressable>

              {/* Logout button */}
              <Pressable
                onPress={handleLogout}
                accessibilityLabel="Log out"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.themeIconContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && styles.pressed,
                ]}
              >
                <Feather
                  name="log-out"
                  size={18}
                  color={colors.danger || "#EF4444"}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Dashboard Grid Stats */}
        <View style={styles.statsOverview}>
          <View
            style={[
              styles.statBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Pending
              </Text>
              <Feather name="clock" size={13} color={colors.warning} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {stats.pending}
            </Text>
          </View>

          <View
            style={[
              styles.statBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Done
              </Text>
              <Feather name="check-circle" size={13} color={colors.success} />
            </View>
            <Text style={[styles.statNumber, { color: colors.success }]}>
              {stats.completed}
            </Text>
          </View>

          <View
            style={[
              styles.statBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Overdue
              </Text>
              <Feather
                name="alert-circle"
                size={13}
                color={stats.overdue > 0 ? colors.danger : colors.textMuted}
              />
            </View>
            <Text
              style={[
                styles.statNumber,
                { color: stats.overdue > 0 ? colors.danger : colors.text },
              ]}
            >
              {stats.overdue}
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <LinearGradient
          colors={cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Completion</Text>
            <Text style={styles.progressValueText}>{stats.progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${stats.progress}%` }]}
            />
          </View>
        </LinearGradient>

        {/* Search Bar & Filter Action Row */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather
              name="search"
              size={18}
              color={colors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by title, category..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.text }]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => setFilterModalVisible(true)}
            style={({ pressed }) => [
              styles.filterBtn,
              {
                backgroundColor: hasActiveFilters
                  ? colors.primaryLight
                  : colors.card,
                borderColor: hasActiveFilters ? colors.primary : colors.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name="sliders"
              size={18}
              color={hasActiveFilters ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* Selected Filters indicators */}
        {hasActiveFilters && (
          <View style={styles.activeFiltersRow}>
            <Text style={[styles.filtersHint, { color: colors.textMuted }]}>
              Filters active
            </Text>
            <Pressable
              onPress={handleResetFilters}
              style={styles.clearFiltersBtn}
            >
              <Text
                style={[styles.clearFiltersText, { color: colors.primary }]}
              >
                Clear All
              </Text>
            </Pressable>
          </View>
        )}

        {/* Task List Section */}
        <View style={styles.taskListHeader}>
          <View style={styles.taskListHeaderLeft}>
            <View
              style={[
                styles.titleIndicator,
                { backgroundColor: colors.primary },
              ]}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {searchQuery ? "Search Results" : "My Tasks"}
            </Text>
          </View>
          <View
            style={[
              styles.taskCountBadge,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={[styles.taskCountText, { color: colors.primary }]}>
              {processedTasks.length}{" "}
              {processedTasks.length === 1 ? "task" : "tasks"}
            </Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={processedTasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() =>
                navigation.navigate("Details", { taskId: item.id })
              }
              onToggleComplete={() => toggleTaskCompletion(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="clipboard" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No tasks found
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery || hasActiveFilters
                  ? "Try adjusting your search query or active filters."
                  : "Get started by adding a task using the button below."}
              </Text>
            </View>
          }
        />

        {/* Add Task FAB */}
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
            pressed && styles.fabPressed,
          ]}
          onPress={() => navigation.navigate("AddTask")}
          accessibilityLabel="Create a new task"
          accessibilityRole="button"
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Filter and Sort bottom sheet modal */}
      <FilterSortModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerActions: {
    alignItems: "flex-end",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
  },
  themeIconContainer: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  statsOverview: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: "flex-start",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.9,
  },
  progressValueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0, // Reset default padding
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  activeFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  filtersHint: {
    fontSize: 12,
    fontWeight: "600",
  },
  clearFiltersBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: "700",
  },
  taskListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 22,
  },
  taskListHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleIndicator: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  taskCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  taskCountText: {
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    paddingBottom: 90,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
});
