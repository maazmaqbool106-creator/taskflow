import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";

type Props = {
  visible: boolean;
  onClose: () => void;
  
  filterStatus: "all" | "pending" | "completed";
  setFilterStatus: (val: "all" | "pending" | "completed") => void;
  
  filterPriority: "all" | "low" | "medium" | "high";
  setFilterPriority: (val: "all" | "low" | "medium" | "high") => void;
  
  filterCategory: "all" | "Work" | "Study" | "Personal" | "Other";
  setFilterCategory: (val: "all" | "Work" | "Study" | "Personal" | "Other") => void;
  
  sortBy: "dueDate" | "priority" | "createdAt";
  setSortBy: (val: "dueDate" | "priority" | "createdAt") => void;
  
  onReset: () => void;
};

export default function FilterSortModal({
  visible,
  onClose,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
  sortBy,
  setSortBy,
  onReset,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Filters & Sorting</Text>
            <View style={styles.headerActions}>
              <Pressable onPress={onReset} style={styles.resetBtn}>
                <Text style={[styles.resetText, { color: colors.primary }]}>Reset</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Feather name="x" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Status Filter */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Status</Text>
            <View style={styles.optionsGrid}>
              {([
                { label: "All Tasks", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Completed", value: "completed" },
              ] as const).map((opt) => {
                const isSelected = filterStatus === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setFilterStatus(opt.value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.borderSoft,
                        borderWidth: 1.5,
                        borderColor: isSelected ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Priority Filter */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Priority</Text>
            <View style={styles.optionsGrid}>
              {([
                { label: "All Priorities", value: "all" },
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ] as const).map((opt) => {
                const isSelected = filterPriority === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setFilterPriority(opt.value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.borderSoft,
                        borderWidth: 1.5,
                        borderColor: isSelected ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Category Filter */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Category</Text>
            <View style={styles.optionsGrid}>
              {([
                { label: "All Categories", value: "all" },
                { label: "Work", value: "Work" },
                { label: "Study", value: "Study" },
                { label: "Personal", value: "Personal" },
                { label: "Other", value: "Other" },
              ] as const).map((opt) => {
                const isSelected = filterCategory === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setFilterCategory(opt.value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.borderSoft,
                        borderWidth: 1.5,
                        borderColor: isSelected ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Sorting Section */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Sort By</Text>
            <View style={styles.optionsGrid}>
              {([
                { label: "Due Date", value: "dueDate" },
                { label: "Priority Level", value: "priority" },
                { label: "Recently Created", value: "createdAt" },
              ] as const).map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setSortBy(opt.value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.borderSoft,
                        borderWidth: 1.5,
                        borderColor: isSelected ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? colors.primary : colors.textSecondary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  resetBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 10,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 10,
  },
  applyBtn: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
